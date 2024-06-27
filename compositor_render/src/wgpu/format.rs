use interleaved_yuv_to_rgba::InterleavedYuv422ToRgbaConverter;

use self::{planar_yuv_to_rgba::PlanarYuvToRgbaConverter, rgba_to_yuv::RgbaToYuvConverter};

use super::{
    texture::{InterleavedYuv422Texture, PlanarYuvTextures, RGBATexture},
    WgpuCtx,
};

mod interleaved_yuv_to_rgba;
mod planar_yuv_to_rgba;
mod rgba_to_yuv;

#[derive(Debug)]
pub struct TextureFormat {
    planar_yuv_to_rgba: PlanarYuvToRgbaConverter,
    interleaved_yuv_to_rgba: InterleavedYuv422ToRgbaConverter,
    rgba_to_yuv: RgbaToYuvConverter,

    planar_yuv_layout: wgpu::BindGroupLayout,
    interleaved_yuv_layout: wgpu::BindGroupLayout,
    rgba_layout: wgpu::BindGroupLayout,
}

impl TextureFormat {
    pub fn new(device: &wgpu::Device) -> Self {
        let planar_yuv_layout = PlanarYuvTextures::new_bind_group_layout(device);
        let interleaved_yuv_layout = InterleavedYuv422Texture::new_bind_group_layout(device);
        let rgba_layout = RGBATexture::new_bind_group_layout(device);
        let planar_yuv_to_rgba = PlanarYuvToRgbaConverter::new(device, &planar_yuv_layout);
        let rgba_to_yuv = RgbaToYuvConverter::new(device, &rgba_layout);
        let interleaved_yuv_to_rgba =
            InterleavedYuv422ToRgbaConverter::new(device, &interleaved_yuv_layout);
        Self {
            planar_yuv_to_rgba,
            rgba_to_yuv,
            interleaved_yuv_to_rgba,

            planar_yuv_layout,
            rgba_layout,
            interleaved_yuv_layout,
        }
    }

    pub fn planar_yuv_layout(&self) -> &wgpu::BindGroupLayout {
        &self.planar_yuv_layout
    }

    pub fn interleaved_yuv_layout(&self) -> &wgpu::BindGroupLayout {
        &self.interleaved_yuv_layout
    }

    pub fn rgba_layout(&self) -> &wgpu::BindGroupLayout {
        &self.rgba_layout
    }

    pub fn convert_rgba_to_yuv(
        &self,
        ctx: &WgpuCtx,
        src: (&RGBATexture, &wgpu::BindGroup),
        dst: &PlanarYuvTextures,
    ) {
        self.rgba_to_yuv.convert(ctx, src, dst);
    }

    pub fn convert_planar_yuv_to_rgba(
        &self,
        ctx: &WgpuCtx,
        src: (&PlanarYuvTextures, &wgpu::BindGroup),
        dst: &RGBATexture,
    ) {
        self.planar_yuv_to_rgba.convert(ctx, src, dst)
    }

    pub fn convert_interleaved_yuv_to_rgba(
        &self,
        ctx: &WgpuCtx,
        src: (&InterleavedYuv422Texture, &wgpu::BindGroup),
        dst: &RGBATexture,
    ) {
        self.interleaved_yuv_to_rgba.convert(ctx, src, dst)
    }
}
