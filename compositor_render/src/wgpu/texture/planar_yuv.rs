use std::marker::PhantomData;

use bytes::Bytes;
use wgpu::Buffer;

use crate::{wgpu::WgpuCtx, FrameData, Resolution, YuvPlanes};

use super::{
    base::{copy_to_buffer, new_download_buffer, new_texture, DEFAULT_BINDING_TYPE},
    TextureExt,
};

pub struct YuvPendingDownload<'a, F, E>
where
    F: FnOnce() -> Result<Bytes, E> + 'a,
{
    y: F,
    u: F,
    v: F,
    _phantom: PhantomData<&'a F>,
}

impl<'a, F, E> YuvPendingDownload<'a, F, E>
where
    F: FnOnce() -> Result<Bytes, E>,
{
    pub(super) fn new(y: F, u: F, v: F) -> Self {
        Self {
            y,
            u,
            v,
            _phantom: PhantomData,
        }
    }

    /// `device.poll(wgpu::MaintainBase::Wait)` needs to be called after download
    /// is started, but before this method is called.
    pub fn wait(self) -> Result<FrameData, E> {
        let YuvPendingDownload { y, u, v, _phantom } = self;
        // output pixel format will always be YUV420P
        Ok(FrameData::PlanarYuv420(YuvPlanes {
            y_plane: y()?,
            u_plane: u()?,
            v_plane: v()?,
        }))
    }
}

#[derive(Debug, Clone, Copy)]
pub enum YuvVariant {
    YUV420,
    YUVJ420,
}

pub struct PlanarYuvTextures {
    pub(super) variant: YuvVariant,
    pub(super) planes: [wgpu::Texture; 3],
    pub(super) views: [wgpu::TextureView; 3],
    pub(super) resolution: Resolution,
}

impl PlanarYuvTextures {
    pub fn new(ctx: &WgpuCtx, resolution: Resolution) -> Self {
        let plane1 = Self::new_plane(ctx, resolution.width, resolution.height);
        let plane2 = Self::new_plane(ctx, resolution.width / 2, resolution.height / 2);
        let plane3 = Self::new_plane(ctx, resolution.width / 2, resolution.height / 2);
        let view1 = plane1.create_view(&Default::default());
        let view2 = plane2.create_view(&Default::default());
        let view3 = plane3.create_view(&Default::default());

        Self {
            variant: YuvVariant::YUV420,
            planes: [plane1, plane2, plane3],
            views: [view1, view2, view3],
            resolution,
        }
    }

    pub fn plane(&self, i: usize) -> &wgpu::Texture {
        &self.planes[i]
    }

    pub fn plane_view(&self, i: usize) -> &wgpu::TextureView {
        &self.views[i]
    }

    pub fn variant(&self) -> YuvVariant {
        self.variant
    }

    fn new_plane(ctx: &WgpuCtx, width: usize, height: usize) -> wgpu::Texture {
        new_texture(
            &ctx.device,
            None,
            wgpu::Extent3d {
                width: width as u32,
                height: height as u32,
                depth_or_array_layers: 1,
            },
            // TODO(noituri): [WASM] Format unsupported on firefox
            wgpu::TextureFormat::R8Unorm,
            wgpu::TextureUsages::RENDER_ATTACHMENT
                | wgpu::TextureUsages::COPY_DST
                | wgpu::TextureUsages::COPY_SRC
                | wgpu::TextureUsages::TEXTURE_BINDING,
            &[wgpu::TextureFormat::R8Unorm],
        )
    }

    pub fn new_bind_group_layout(device: &wgpu::Device) -> wgpu::BindGroupLayout {
        let create_entry = |binding: u32| wgpu::BindGroupLayoutEntry {
            binding,
            ty: DEFAULT_BINDING_TYPE,
            visibility: wgpu::ShaderStages::FRAGMENT,
            count: None,
        };
        device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("Planar YUV 4:2:0 all textures bind group layout"),
            entries: &[create_entry(0), create_entry(1), create_entry(2)],
        })
    }

    pub(super) fn new_bind_group(
        &self,
        ctx: &WgpuCtx,
        layout: &wgpu::BindGroupLayout,
    ) -> wgpu::BindGroup {
        ctx.device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("Planar YUV 4:2:0 all textures bind group"),
            layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: wgpu::BindingResource::TextureView(&self.views[0]),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: wgpu::BindingResource::TextureView(&self.views[1]),
                },
                wgpu::BindGroupEntry {
                    binding: 2,
                    resource: wgpu::BindingResource::TextureView(&self.views[2]),
                },
            ],
        })
    }

    pub(super) fn new_download_buffers(&self, ctx: &WgpuCtx) -> [Buffer; 3] {
        [
            new_download_buffer(&self.planes[0], ctx),
            new_download_buffer(&self.planes[1], ctx),
            new_download_buffer(&self.planes[2], ctx),
        ]
    }

    pub(super) fn copy_to_buffers(&self, ctx: &WgpuCtx, buffers: &[Buffer; 3]) {
        let mut encoder = ctx
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("transfer result yuv texture to buffers encoder"),
            });

        for plane in [0, 1, 2] {
            copy_to_buffer(&self.planes[plane], &mut encoder, &buffers[plane]);
        }

        ctx.queue.submit(Some(encoder.finish()));
    }

    pub fn upload(&mut self, ctx: &WgpuCtx, planes: &YuvPlanes, variant: YuvVariant) {
        self.variant = variant;
        self.planes[0].upload_data(&ctx.queue, &planes.y_plane, 1);
        self.planes[1].upload_data(&ctx.queue, &planes.u_plane, 1);
        self.planes[2].upload_data(&ctx.queue, &planes.v_plane, 1);
    }
}
