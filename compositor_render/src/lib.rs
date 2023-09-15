pub mod error;
pub mod event_loop;
pub mod frame_set;
pub mod registry;
pub mod renderer;

pub(crate) mod render_loop;
pub(crate) mod shader_executor;
pub(crate) mod transformations;
pub(crate) mod utils;

mod sync_renderer;
mod validation;

pub use transformations::web_renderer::{
    WebRendererOptions, EMBED_SOURCE_FRAMES_MESSAGE, UNEMBED_SOURCE_FRAMES_MESSAGE,
};

pub type Renderer = sync_renderer::SyncRenderer;
