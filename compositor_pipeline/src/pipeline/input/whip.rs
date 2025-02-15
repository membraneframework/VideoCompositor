use std::{
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};
use tokio::sync::mpsc;
use webrtc::track::track_remote::TrackRemote;

use depayloader::Depayloader;
use tracing::{error, warn, Span};

use crate::{
    pipeline::{
        decoder,
        types::EncodedChunk,
        whip_whep::{bearer_token::generate_token, WhipInputConnectionOptions, WhipWhepState},
        PipelineCtx,
    },
    queue::PipelineEvent,
};
use compositor_render::InputId;
use crossbeam_channel::Sender;
use tracing::{debug, span, Level};

use super::{AudioInputReceiver, Input, InputInitInfo, InputInitResult, VideoInputReceiver};

pub mod depayloader;

#[derive(Debug, thiserror::Error)]
pub enum WhipReceiverError {
    #[error("WHIP WHEP server is not running, cannot start WHIP input")]
    WhipWhepServerNotRunning,
}

#[derive(Debug, Clone)]
pub struct WhipReceiverOptions {
    pub video: Option<InputVideoStream>,
    pub audio: Option<InputAudioStream>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InputVideoStream {
    pub options: decoder::VideoDecoderOptions,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InputAudioStream {
    pub options: decoder::OpusDecoderOptions,
}

pub struct WhipReceiver {
    whip_whep_state: Arc<WhipWhepState>,
    input_id: InputId,
}

impl WhipReceiver {
    pub(super) fn start_new_input(
        input_id: &InputId,
        opts: WhipReceiverOptions,
        pipeline_ctx: &PipelineCtx,
    ) -> Result<InputInitResult, WhipReceiverError> {
        if !pipeline_ctx.start_whip_whep {
            return Err(WhipReceiverError::WhipWhepServerNotRunning);
        }
        let bearer_token = generate_token();
        let whip_whep_state = pipeline_ctx.whip_whep_state.clone();
        let depayloader = Arc::from(Mutex::new(Depayloader::new(&opts)));

        let (video_sender_async, video) = match opts.video {
            Some(stream) => {
                let (async_sender, async_receiver) = mpsc::channel(100);
                let (sync_sender, sync_receiver) = crossbeam_channel::bounded(100);
                let span = span!(
                    Level::INFO,
                    "WHIP server video async-to-sync bridge",
                    input_id = input_id.to_string()
                );
                Self::start_forwarding_thread(async_receiver, sync_sender, span);
                (
                    Some(async_sender),
                    Some(VideoInputReceiver::Encoded {
                        chunk_receiver: sync_receiver,
                        decoder_options: stream.options,
                    }),
                )
            }
            None => (None, None),
        };

        let (audio_sender_async, audio) = match opts.audio {
            Some(stream) => {
                let (async_sender, async_receiver) = mpsc::channel(100);
                let (sync_sender, sync_receiver) = crossbeam_channel::bounded(100);
                let span = span!(
                    Level::INFO,
                    "WHIP server audio async-to-sync bridge",
                    input_id = input_id.to_string(),
                );
                Self::start_forwarding_thread(async_receiver, sync_sender, span);
                (
                    Some(async_sender),
                    Some(AudioInputReceiver::Encoded {
                        chunk_receiver: sync_receiver,
                        decoder_options: decoder::AudioDecoderOptions::Opus(stream.options),
                    }),
                )
            }
            None => (None, None),
        };

        let mut input_connections = whip_whep_state.input_connections.lock().unwrap();
        input_connections.insert(
            input_id.clone(),
            WhipInputConnectionOptions {
                audio_sender: audio_sender_async.clone(),
                video_sender: video_sender_async.clone(),
                bearer_token: Some(bearer_token.clone()),
                peer_connection: None,
                start_time_vid: None,
                start_time_aud: None,
                depayloader,
            },
        );

        Ok(InputInitResult {
            input: Input::Whip(Self {
                whip_whep_state: whip_whep_state.clone(),
                input_id: input_id.clone(),
            }),
            video,
            audio,
            init_info: InputInitInfo::Whip { bearer_token },
        })
    }

    fn start_forwarding_thread(
        mut async_receiver: mpsc::Receiver<PipelineEvent<EncodedChunk>>,
        sync_sender: Sender<PipelineEvent<EncodedChunk>>,
        span: Span,
    ) {
        thread::spawn(move || {
            let _span = span.entered();
            loop {
                let Some(chunk) = async_receiver.blocking_recv() else {
                    debug!("Closing WHIP async-to-sync bridge.");
                    break;
                };

                if let Err(err) = sync_sender.send(chunk) {
                    debug!("Failed to send Encoded Chunk. Channel closed: {:?}", err);
                    break;
                }
            }
        });
    }
}

impl Drop for WhipReceiver {
    fn drop(&mut self) {
        let mut connections = self.whip_whep_state.input_connections.lock().unwrap();
        if let Some(connection) = connections.get_mut(&self.input_id) {
            if let Some(peer_connection) = connection.peer_connection.clone() {
                let input_id = self.input_id.clone();
                tokio::spawn(async move {
                    if let Err(err) = peer_connection.close().await {
                        error!("Cannot close peer_connection for {:?}: {:?}", input_id, err);
                    };
                });
            }
        }
        connections.remove(&self.input_id);
    }
}

pub async fn process_track_stream(
    track: Arc<TrackRemote>,
    state: Arc<WhipWhepState>,
    input_id: InputId,
    depayloader: Arc<Mutex<Depayloader>>,
    sender: mpsc::Sender<PipelineEvent<EncodedChunk>>,
) {
    let track_kind = track.kind();
    let time_elapsed_from_input_start =
        state.get_time_elapsed_from_input_start(input_id, track_kind);

    //TODO send PipelineEvent::NewPeerConnection to reset queue and decoder(drop remaining frames from previous stream)

    let mut first_pts_current_stream = None;

    while let Ok((rtp_packet, _)) = track.read_rtp().await {
        let chunks = match depayloader
            .lock()
            .unwrap()
            .depayload(rtp_packet, track_kind)
        {
            Ok(chunks) => chunks,
            Err(err) => {
                warn!("RTP depayloading error: {err:?}");
                continue;
            }
        };

        if let Some(first_chunk) = chunks.first() {
            first_pts_current_stream.get_or_insert(first_chunk.pts);
        }

        for mut chunk in chunks {
            chunk.pts = chunk.pts + time_elapsed_from_input_start.unwrap_or(Duration::ZERO)
                - first_pts_current_stream.unwrap_or(Duration::ZERO);
            if let Err(e) = sender.send(PipelineEvent::Data(chunk)).await {
                debug!("Failed to send audio RTP packet: {e}");
            }
        }
    }
}
