use std::{io, sync::Arc};

use compositor_chromium::cef;
use compositor_common::scene::{NodeId, Resolution};
use crossbeam_channel::{bounded, Receiver, Sender};
use log::error;
use shared_memory::ShmemError;

use crate::renderer::{texture::NodeTexture, RenderCtx};

use super::{chromium::ChromiumContext, non_sync_send_handler::NonSyncSendHandler};

pub(super) struct BrowserController {
    painted_frames_receiver: Receiver<Vec<u8>>,
    handler: NonSyncSendHandler,
    frame_data: Option<Vec<u8>>,
}

impl BrowserController {
    pub fn new(
        ctx: Arc<ChromiumContext>,
        url: String,
        resolution: Resolution,
    ) -> Result<Self, BrowserControllerNewError> {
        let (painted_frames_sender, painted_frames_receiver) = crossbeam_channel::unbounded();
        let client = BrowserClient::new(painted_frames_sender, resolution);
        let handler = NonSyncSendHandler::new(ctx, url, client);

        Ok(Self {
            painted_frames_receiver,
            handler,
            frame_data: None,
        })
    }

    pub fn retrieve_frame(&mut self) -> Option<&[u8]> {
        if let Some(frame) = self.painted_frames_receiver.try_iter().last() {
            self.frame_data.replace(frame);
        }

        self.frame_data.as_deref()
    }

    pub fn send_sources(
        &mut self,
        ctx: &RenderCtx,
        sources: &[(&NodeId, &NodeTexture)],
    ) -> Result<(), EmbedFrameError> {
        self.copy_sources_to_buffers(ctx, sources)?;

        let mut pending_downloads = Vec::new();
        for (id, texture) in sources.iter() {
            let size = texture.rgba_texture().size();
            let buffer = texture
                .rgba_texture()
                .download_buffer()
                .ok_or(EmbedFrameError::ExpectDownloadBuffer)?;
            pending_downloads.push(self.download_buffer((*id).clone(), size, buffer));
        }

        ctx.wgpu_ctx.device.poll(wgpu::Maintain::Wait);

        for pending in pending_downloads {
            pending()?;
        }

        self.handler.embed_sources(sources);
        Ok(())
    }

    fn copy_sources_to_buffers(
        &self,
        ctx: &RenderCtx,
        sources: &[(&NodeId, &NodeTexture)],
    ) -> Result<(), EmbedFrameError> {
        let mut encoder = ctx
            .wgpu_ctx
            .device
            .create_command_encoder(&Default::default());

        for (_id, texture) in sources.iter() {
            let buffer = texture
                .rgba_texture()
                .download_buffer()
                .ok_or(EmbedFrameError::ExpectDownloadBuffer)?;
            texture.rgba_texture().copy_to_buffer(&mut encoder, &buffer);
        }
        ctx.wgpu_ctx.queue.submit(Some(encoder.finish()));

        Ok(())
    }

    fn download_buffer(
        &self,
        id: NodeId,
        size: wgpu::Extent3d,
        source: Arc<wgpu::Buffer>,
    ) -> impl FnOnce() -> Result<(), EmbedFrameError> + '_ {
        let (s, r) = bounded(1);
        source
            .slice(..)
            .map_async(wgpu::MapMode::Read, move |result| {
                if let Err(err) = s.send(result) {
                    error!("channel send error: {err}")
                }
            });

        move || {
            r.recv().unwrap()?;

            self.handler.update_shared_memory(id, source.clone(), size);
            source.unmap();

            Ok(())
        }
    }
}

pub(super) struct BrowserClient {
    painted_frames_sender: Sender<Vec<u8>>,
    resolution: Resolution,
}

impl cef::Client for BrowserClient {
    type RenderHandlerType = RenderHandler;

    fn render_handler(&self) -> Option<Self::RenderHandlerType> {
        Some(RenderHandler::new(
            self.painted_frames_sender.clone(),
            self.resolution,
        ))
    }
}

impl BrowserClient {
    pub fn new(painted_frames_sender: Sender<Vec<u8>>, resolution: Resolution) -> Self {
        Self {
            painted_frames_sender,
            resolution,
        }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum BrowserControllerNewError {
    #[error("Failed to create shared memory directory")]
    SharedMemoryDirCreate(#[from] io::Error),
}

#[derive(Debug, thiserror::Error)]
pub enum EmbedFrameError {
    #[error("Failed to create shared memory")]
    SharedMemoryCreate(#[from] ShmemError),

    #[error("Failed to download source frame")]
    DownloadFrame(#[from] wgpu::BufferAsyncError),

    #[error("Browser is no longer alive")]
    BrowserNotAlive(#[from] cef::BrowserError),

    #[error("Could not send IPC message")]
    MessageNotSent(#[from] cef::FrameError),

    #[error("Download buffer does not exist")]
    ExpectDownloadBuffer,
}

pub(super) struct RenderHandler {
    painted_frames_sender: Sender<Vec<u8>>,
    resolution: Resolution,
}

impl cef::RenderHandler for RenderHandler {
    fn resolution(&self, _browser: &cef::Browser) -> Resolution {
        self.resolution
    }

    fn on_paint(&self, _browser: &cef::Browser, buffer: &[u8], _resolution: Resolution) {
        self.painted_frames_sender
            .send(buffer.to_vec())
            .expect("send frame");
    }
}

impl RenderHandler {
    pub fn new(painted_frames_sender: Sender<Vec<u8>>, resolution: Resolution) -> Self {
        Self {
            painted_frames_sender,
            resolution,
        }
    }
}
