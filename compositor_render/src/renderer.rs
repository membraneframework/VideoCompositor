use std::sync::Arc;
use std::time::Duration;

use compositor_common::{
    scene::{InputId, OutputId, SceneSpec},
    Framerate,
};
use log::error;

use crate::{
    frame_set::FrameSet,
    registry::TransformationRegistry,
    render_loop::{populate_inputs, read_outputs},
    transformations::{
        image_renderer::{Image, ImageError},
        text_renderer::TextRendererCtx,
        web_renderer::chromium::{ChromiumContext, ChromiumContextError},
    },
    WebRendererOptions,
};
use crate::{
    registry::{self, RegistryType},
    render_loop::run_transforms,
    transformations::{
        shader::Shader,
        web_renderer::{WebRenderer, WebRendererNewError},
    },
};

use self::{
    color_converter_pipeline::{R8FillWithValuePipeline, RGBAToYUVConverter, YUVToRGBAConverter},
    scene::{Scene, SceneUpdateError},
    texture::{RGBATexture, YUVTextures},
};

mod color_converter_pipeline;
pub mod common_pipeline;
pub mod scene;
pub mod texture;

pub(crate) use color_converter_pipeline::BGRAToRGBAConverter;

pub struct Renderer {
    pub wgpu_ctx: Arc<WgpuCtx>,
    pub text_renderer_ctx: TextRendererCtx,
    pub chromium_context: Arc<ChromiumContext>,
    pub scene: Scene,
    pub scene_spec: Arc<SceneSpec>,
    pub(crate) shader_transforms: TransformationRegistry<Arc<Shader>>,
    pub(crate) web_renderers: TransformationRegistry<Arc<WebRenderer>>,
    pub(crate) image_registry: TransformationRegistry<Arc<Image>>,
}

pub struct RenderCtx<'a> {
    pub wgpu_ctx: &'a Arc<WgpuCtx>,
    pub text_renderer_ctx: &'a TextRendererCtx,
    pub chromium: &'a Arc<ChromiumContext>,
    pub(crate) shader_transforms: &'a TransformationRegistry<Arc<Shader>>,
    pub(crate) web_renderers: &'a TransformationRegistry<Arc<WebRenderer>>,
    pub(crate) image_registry: &'a TransformationRegistry<Arc<Image>>,
}

pub struct RegisterTransformationCtx {
    pub wgpu_ctx: Arc<WgpuCtx>,
    pub chromium: Arc<ChromiumContext>,
}

#[derive(Debug, thiserror::Error)]
pub enum RendererNewError {
    #[error("failed to initialize a wgpu context")]
    FailedToInitWgpuCtx(#[from] WgpuCtxNewError),

    #[error("failed to init chromium context")]
    FailedToInitChromiumCtx(#[from] ChromiumContextError),
}

#[derive(Debug, thiserror::Error)]
pub enum RendererRegisterTransformationError {
    #[error("failed to register a transformation in the transformation registry")]
    TransformationRegistry(#[from] registry::RegisterError),

    #[error("failed to create web renderer transformation")]
    WebRendererTransformation(#[from] WebRendererNewError),

    #[error("failed to prepare image")]
    ImageTransformation(#[from] ImageError),
}

impl Renderer {
    pub fn new(
        web_renderer_opts: WebRendererOptions,
        framerate: Framerate,
    ) -> Result<Self, RendererNewError> {
        Ok(Self {
            wgpu_ctx: Arc::new(WgpuCtx::new()?),
            text_renderer_ctx: TextRendererCtx::new(),
            chromium_context: Arc::new(ChromiumContext::new(web_renderer_opts, framerate)?),
            scene: Scene::empty(),
            web_renderers: TransformationRegistry::new(RegistryType::WebRenderer),
            shader_transforms: TransformationRegistry::new(RegistryType::Shader),
            image_registry: TransformationRegistry::new(RegistryType::Image),
            scene_spec: Arc::new(SceneSpec {
                inputs: vec![],
                transforms: vec![],
                outputs: vec![],
            }),
        })
    }

    pub(super) fn register_transformation_ctx(&self) -> RegisterTransformationCtx {
        RegisterTransformationCtx {
            wgpu_ctx: self.wgpu_ctx.clone(),
            chromium: self.chromium_context.clone(),
        }
    }

    pub fn render(&mut self, mut inputs: FrameSet<InputId>) -> FrameSet<OutputId> {
        let ctx = &mut RenderCtx {
            wgpu_ctx: &self.wgpu_ctx,
            chromium: &self.chromium_context,
            shader_transforms: &self.shader_transforms,
            web_renderers: &self.web_renderers,
            text_renderer_ctx: &self.text_renderer_ctx,
            image_registry: &self.image_registry,
        };

        populate_inputs(ctx, &mut self.scene, &mut inputs.frames);
        run_transforms(ctx, &self.scene, inputs.pts);
        let frames = read_outputs(ctx, &self.scene, inputs.pts);

        FrameSet {
            frames,
            pts: inputs.pts,
        }
    }

    pub fn update_scene(&mut self, scene_specs: Arc<SceneSpec>) -> Result<(), SceneUpdateError> {
        self.scene.update(
            &RenderCtx {
                wgpu_ctx: &self.wgpu_ctx,
                text_renderer_ctx: &self.text_renderer_ctx,
                chromium: &self.chromium_context,
                shader_transforms: &self.shader_transforms,
                web_renderers: &self.web_renderers,
                image_registry: &self.image_registry,
            },
            &scene_specs,
        )?;
        self.scene_spec = scene_specs;
        Ok(())
    }
}

pub struct WgpuCtx {
    #[allow(dead_code)]
    pub device: wgpu::Device,

    #[allow(dead_code)]
    pub queue: wgpu::Queue,

    pub yuv_bind_group_layout: wgpu::BindGroupLayout,
    pub rgba_bind_group_layout: wgpu::BindGroupLayout,
    pub yuv_to_rgba_converter: YUVToRGBAConverter,
    pub rgba_to_yuv_converter: RGBAToYUVConverter,
    pub r8_fill_with_color_pipeline: R8FillWithValuePipeline,

    pub shader_parameters_bind_group_layout: wgpu::BindGroupLayout,

    pub compositor_provided_parameters_buffer: wgpu::Buffer,
}

#[derive(Debug, thiserror::Error)]
pub enum WgpuCtxNewError {
    #[error("failed to get a wgpu adapter")]
    NoAdapter,

    #[error("failed to get a wgpu device")]
    NoDevice(#[from] wgpu::RequestDeviceError),
}

impl WgpuCtx {
    fn new() -> Result<Self, WgpuCtxNewError> {
        let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
            backends: wgpu::Backends::all(),
            ..Default::default()
        });

        let adapter =
            pollster::block_on(instance.request_adapter(&wgpu::RequestAdapterOptionsBase {
                power_preference: wgpu::PowerPreference::HighPerformance,
                force_fallback_adapter: false,
                compatible_surface: None,
            }))
            .ok_or(WgpuCtxNewError::NoAdapter)?;

        let (device, queue) = pollster::block_on(adapter.request_device(
            &wgpu::DeviceDescriptor {
                label: Some("Video Compositor's GPU :^)"),
                limits: wgpu::Limits {
                    max_push_constant_size: 128,
                    ..Default::default()
                },
                features: wgpu::Features::TEXTURE_BINDING_ARRAY | wgpu::Features::PUSH_CONSTANTS,
            },
            None,
        ))?;

        let yuv_bind_group_layout = YUVTextures::new_bind_group_layout(&device);
        let rgba_bind_group_layout = RGBATexture::new_bind_group_layout(&device);
        let yuv_to_rgba_converter = YUVToRGBAConverter::new(&device, &yuv_bind_group_layout);
        let rgba_to_yuv_converter = RGBAToYUVConverter::new(&device, &rgba_bind_group_layout);
        let r8_fill_with_color_pipeline = R8FillWithValuePipeline::new(&device);

        let shader_parameters_bind_group_layout = Shader::new_parameters_bind_group_layout(&device);

        let compositor_provided_parameters_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("global shader parameters buffer"),
            mapped_at_creation: false,
            size: std::mem::size_of::<CommonShaderParameters>() as u64,
            usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::UNIFORM,
        });

        // this is temporary until we implement proper error handling in the wgpu renderer
        // it's important to overwrite this though, because the default uncaptured error
        // handler panics
        device.on_uncaptured_error(Box::new(|e| {
            error!("wgpu error: {:?}", e);
        }));

        Ok(Self {
            device,
            queue,
            yuv_bind_group_layout,
            rgba_bind_group_layout,
            yuv_to_rgba_converter,
            rgba_to_yuv_converter,
            r8_fill_with_color_pipeline,
            shader_parameters_bind_group_layout,
            compositor_provided_parameters_buffer,
        })
    }
}

#[repr(C)]
#[derive(Debug, bytemuck::Pod, bytemuck::Zeroable, Clone, Copy)]
pub struct CommonShaderParameters {
    time: f32,
    textures_count: u32,
}

impl CommonShaderParameters {
    pub fn new(time: Duration, textures_count: u32) -> Self {
        Self {
            time: time.as_secs_f32(),
            textures_count,
        }
    }

    pub fn push_constant_size() -> u32 {
        let size = std::mem::size_of::<CommonShaderParameters>() as u32;
        match size % 4 {
            0 => size,
            rest => size + (4 - rest),
        }
    }

    pub fn push_constant(&self) -> &[u8] {
        bytemuck::bytes_of(self)
    }
}
