use std::sync::Arc;

use crate::{
    registry::{RegistryType, RendererRegistry},
    transformations::{
        builtin::container::BuiltinsContainer, image_renderer::Image, shader::Shader,
        web_renderer::WebRenderer,
    },
};

use super::{WgpuCtx, WgpuError};

pub(crate) struct Renderers {
    pub(crate) shaders: RendererRegistry<Arc<Shader>>,
    pub(crate) web_renderers: RendererRegistry<Arc<WebRenderer>>,
    pub(crate) images: RendererRegistry<Image>,
    pub(crate) builtin: BuiltinsContainer,
}

impl Renderers {
    pub(crate) fn new(wgpu_ctx: Arc<WgpuCtx>) -> Result<Self, WgpuError> {
        Ok(Self {
            shaders: RendererRegistry::new(RegistryType::Shader),
            web_renderers: RendererRegistry::new(RegistryType::WebRenderer),
            images: RendererRegistry::new(RegistryType::Image),
            builtin: BuiltinsContainer::new(&wgpu_ctx)?,
        })
    }
}
