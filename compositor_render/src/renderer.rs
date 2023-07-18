use std::{collections::HashMap, sync::Arc};

use compositor_common::{
    scene::{InputId, OutputId, SceneSpec},
    transformation::{TransformationRegistryKey, TransformationSpec},
    Frame,
};
use log::error;

use crate::{frameset::FrameSet, registry::TransformationRegistry};
use crate::{
    registry::{self, RegistryType},
    render_loop::render_scene,
    transformations::{
        shader::Shader,
        web_renderer::{electron::ElectronNewError, Electron, WebRenderer, WebRendererNewError},
    },
};

use self::scene::{Scene, SceneUpdateError};

pub mod scene;
pub mod texture;

pub struct Renderer {
    pub wgpu_ctx: Arc<WgpuCtx>,
    pub electron_instance: Arc<Electron>,
    pub scene: Scene,
    pub shader_transforms: TransformationRegistry<Arc<Shader>>,
    pub web_renderers: TransformationRegistry<Arc<WebRenderer>>,
}

pub struct RenderCtx<'a> {
    pub wgpu_ctx: &'a Arc<WgpuCtx>,
    pub electron: &'a Arc<Electron>,
    pub shader_transforms: &'a TransformationRegistry<Arc<Shader>>,
    pub web_renderers: &'a TransformationRegistry<Arc<WebRenderer>>,
}

#[derive(Debug, thiserror::Error)]
pub enum RendererNewError {
    #[error("failed to initialize a wgpu context")]
    FailedToInitWgpuCtx(#[from] WgpuCtxNewError),

    #[error("failed to start an electron instance")]
    FailedToStartElectron(#[from] ElectronNewError),
}

#[derive(Debug, thiserror::Error)]
pub enum RendererRegisterTransformationError {
    #[error("failed to register a transformation in the transformation registry")]
    TransformationRegistryError(#[from] registry::RegisterError),

    #[error("failed to create web renderer transformation")]
    WebRendererTransformationError(#[from] WebRendererNewError),
}

#[derive(Debug, thiserror::Error)]
pub enum RendererRenderError {
    #[error("no scene was set in the compositor")]
    NoScene,

    #[error("a frame was not provided for input with id {0}")]
    NoInput(u32),
}

impl Renderer {
    pub fn new() -> Result<Self, RendererNewError> {
        Ok(Self {
            wgpu_ctx: Arc::new(WgpuCtx::new()?),
            electron_instance: Arc::new(Electron::new(9000)?), // TODO: make it configurable
            scene: Scene::empty(),
            web_renderers: TransformationRegistry::new(RegistryType::WebRenderer),
            shader_transforms: TransformationRegistry::new(RegistryType::Shader),
        })
    }

    fn ctx(&self) -> RenderCtx {
        RenderCtx {
            wgpu_ctx: &self.wgpu_ctx,
            electron: &self.electron_instance,
            shader_transforms: &self.shader_transforms,
            web_renderers: &self.web_renderers,
        }
    }

    pub fn register_transformation(
        &mut self,
        key: TransformationRegistryKey,
        spec: TransformationSpec,
    ) -> Result<(), RendererRegisterTransformationError> {
        match spec {
            TransformationSpec::Shader { source } => self
                .shader_transforms
                .register(&key, Arc::new(Shader::new(&self.ctx(), source)))?,
            TransformationSpec::WebRenderer(params) => self
                .web_renderers
                .register(&key, Arc::new(WebRenderer::new(&self.ctx(), params)?))?,
        };
        Ok(())
    }

    /// This is very much a work in progress.
    /// For now it just takes a random frame from the input and returns it
    pub fn render(
        &self,
        inputs: FrameSet<InputId>,
    ) -> Result<FrameSet<OutputId>, RendererRenderError> {
        let pts = inputs.frames.iter().next().unwrap().1.pts;
        render_scene(&self.ctx(), &self.scene, inputs.frames);
        let mut result = HashMap::new();
        for (node_id, output) in &self.scene.outputs {
            // TODO: very temporary implementation
            // convert rgba to yuv
            let yuv_data = output.1.download(&self.wgpu_ctx);
            result.insert(
                OutputId(node_id.clone()),
                Arc::new(Frame {
                    data: yuv_data,
                    resolution: output.1.resolution,
                    pts: pts.clone(),
                }),
            );
        }
        error!("TODO: convert rgba back to yuv and read into memory");
        Ok(FrameSet {
            frames: result,
            pts: inputs.pts,
        })
    }

    pub fn update_scene(&mut self, scene_specs: SceneSpec) -> Result<(), SceneUpdateError> {
        self.scene.update(
            &RenderCtx {
                wgpu_ctx: &self.wgpu_ctx,
                electron: &self.electron_instance,
                shader_transforms: &self.shader_transforms,
                web_renderers: &self.web_renderers,
            },
            scene_specs,
        )
    }
}

pub struct WgpuCtx {
    #[allow(dead_code)]
    pub device: wgpu::Device,

    #[allow(dead_code)]
    pub queue: wgpu::Queue,
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
                limits: Default::default(),
                features: wgpu::Features::empty(),
            },
            None,
        ))?;

        Ok(Self { device, queue })
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn initialize() -> Result<(), RendererNewError> {
        Renderer::new()?;
        Ok(())
    }
}
