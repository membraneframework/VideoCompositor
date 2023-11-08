use std::sync::Arc;

use compositor_pipeline::{
    error::{InputInitError, RegisterInputError},
    pipeline::{self},
};
use compositor_render::{EventLoop, RegistryType};
use crossbeam_channel::{bounded, Receiver};

use log::trace;
use serde::{Deserialize, Serialize};
use tiny_http::StatusCode;

use crate::{
    error::{ApiError, PORT_ALREADY_IN_USE_ERROR_CODE},
    rtp_receiver::{self, RtpReceiver},
    rtp_sender::{self, RtpSender},
    types::{
        self, InitOptions, InputId, OutputId, RegisterInputRequest, RegisterOutputRequest,
        RegisterRequest, RendererId,
    },
};

pub type Pipeline = compositor_pipeline::Pipeline<RtpReceiver, RtpSender>;

#[derive(Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Request {
    Init(InitOptions),
    Register(RegisterRequest),
    Unregister(UnregisterRequest),
    UpdateScene(UpdateScene),
    Query(QueryRequest),
    Start,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateScene {
    pub scenes: Vec<types::Scene>,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "entity_type", rename_all = "snake_case")]
pub enum UnregisterRequest {
    InputStream { input_id: InputId },
    OutputStream { output_id: OutputId },
    Shader { shader_id: RendererId },
    WebRenderer { instance_id: RendererId },
    Image { image_id: RendererId },
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "query", rename_all = "snake_case")]
pub enum QueryRequest {
    WaitForNextFrame { input_id: InputId },
    Inputs,
    Outputs,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged, deny_unknown_fields)]
pub enum Response {
    Ok {},
    Inputs { inputs: Vec<InputInfo> },
    Outputs { outputs: Vec<OutputInfo> },
    RegisteredPort(u16),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Port {
    Range((u16, u16)),
    Exact(u16),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InputInfo {
    pub id: InputId,
    pub port: u16,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OutputInfo {
    pub id: OutputId,
    pub port: u16,
    pub ip: Arc<str>,
}

pub enum ResponseHandler {
    Response(Response),
    Ok,
    DeferredResponse(Receiver<Result<Response, ApiError>>),
}

pub struct Api {
    pipeline: Pipeline,
}

impl Api {
    pub fn new(opts: pipeline::Options) -> Result<(Api, EventLoop), ApiError> {
        let (pipeline, event_loop) = Pipeline::new(opts)?;
        Ok((Api { pipeline }, event_loop))
    }

    pub fn handle_request(&mut self, request: Request) -> Result<ResponseHandler, ApiError> {
        match request {
            Request::Init(_) => Err(ApiError::new(
                "COMPOSITOR_ALREADY_INITIALIZED",
                "Compositor was already initialized.".to_string(),
                StatusCode(400),
            )),
            Request::Register(register_request) => {
                match self.handle_register_request(register_request)? {
                    Some(response) => Ok(response),
                    None => Ok(ResponseHandler::Ok),
                }
            }
            Request::Unregister(unregister_request) => {
                self.handle_unregister_request(unregister_request)?;
                Ok(ResponseHandler::Ok)
            }
            Request::Start => {
                self.pipeline.start();
                Ok(ResponseHandler::Ok)
            }
            Request::UpdateScene(scene_spec) => {
                self.pipeline
                    .update_scene(Arc::new(scene_spec.try_into()?))?;
                Ok(ResponseHandler::Ok)
            }
            Request::Query(query) => self.handle_query(query),
        }
    }

    fn handle_query(&self, query: QueryRequest) -> Result<ResponseHandler, ApiError> {
        match query {
            QueryRequest::WaitForNextFrame { input_id } => {
                let (sender, receiver) = bounded(1);
                self.pipeline.queue().subscribe_input_listener(
                    input_id.into(),
                    Box::new(move || {
                        sender.send(Ok(Response::Ok {})).unwrap();
                    }),
                );
                Ok(ResponseHandler::DeferredResponse(receiver))
            }
            QueryRequest::Inputs => {
                let inputs = self
                    .pipeline
                    .inputs()
                    .map(|(id, node)| InputInfo {
                        id: id.clone().into(),
                        port: node.port,
                    })
                    .collect();
                Ok(ResponseHandler::Response(Response::Inputs { inputs }))
            }
            QueryRequest::Outputs => {
                let outputs = self.pipeline.with_outputs(|iter| {
                    iter.map(|(id, output)| OutputInfo {
                        id: id.clone().into(),
                        port: output.port,
                        ip: output.ip.clone(),
                    })
                    .collect()
                });
                Ok(ResponseHandler::Response(Response::Outputs { outputs }))
            }
        }
    }

    fn handle_register_request(
        &mut self,
        request: RegisterRequest,
    ) -> Result<Option<ResponseHandler>, ApiError> {
        match request {
            RegisterRequest::InputStream(input_stream) => {
                self.register_input(input_stream).map(Some)
            }
            RegisterRequest::OutputStream(output_stream) => {
                self.register_output(output_stream).map(|_| None)
            }
            RegisterRequest::Shader(spec) => {
                let spec = spec.try_into()?;
                self.pipeline.register_renderer(spec)?;
                Ok(None)
            }
            RegisterRequest::WebRenderer(spec) => {
                let spec = spec.try_into()?;
                self.pipeline.register_renderer(spec)?;
                Ok(None)
            }
            RegisterRequest::Image(spec) => {
                let spec = spec.try_into()?;
                self.pipeline.register_renderer(spec)?;
                Ok(None)
            }
        }
    }

    fn handle_unregister_request(&mut self, request: UnregisterRequest) -> Result<(), ApiError> {
        match request {
            UnregisterRequest::InputStream { input_id } => {
                Ok(self.pipeline.unregister_input(&input_id.into())?)
            }
            UnregisterRequest::OutputStream { output_id } => {
                Ok(self.pipeline.unregister_output(&output_id.into())?)
            }
            UnregisterRequest::Shader { shader_id } => Ok(self
                .pipeline
                .unregister_renderer(&shader_id.into(), RegistryType::Shader)?),
            UnregisterRequest::WebRenderer { instance_id } => Ok(self
                .pipeline
                .unregister_renderer(&instance_id.into(), RegistryType::WebRenderer)?),
            UnregisterRequest::Image { image_id } => Ok(self
                .pipeline
                .unregister_renderer(&image_id.into(), RegistryType::Image)?),
        }
    }

    fn register_output(&mut self, request: RegisterOutputRequest) -> Result<(), ApiError> {
        let RegisterOutputRequest {
            output_id,
            port,
            resolution,
            encoder_settings,
            ip,
        } = request;

        self.pipeline.with_outputs(|mut iter| {
            if let Some((node_id, _)) = iter.find(|(_, output)| output.port == port && output.ip == ip) {
                return Err(ApiError::new(
                    "PORT_AND_IP_ALREADY_IN_USE",
                    format!("Failed to register output stream \"{output_id}\". Combination of port {port} and IP {ip} is already used by node \"{node_id}\""),
                    tiny_http::StatusCode(400)
                ));
            };
            Ok(())
        })?;

        self.pipeline.register_output(
            output_id.into(),
            pipeline::OutputOptions {
                resolution: resolution.into(),
                encoder_settings: encoder_settings.into(),
                receiver_options: rtp_sender::Options { port, ip },
            },
        )?;

        Ok(())
    }

    fn register_input(
        &mut self,
        request: RegisterInputRequest,
    ) -> Result<ResponseHandler, ApiError> {
        let RegisterInputRequest { input_id: id, port } = request;
        let port: Port = port.try_into()?;

        match port {
            Port::Range((start, end)) => {
                for port in start..end {
                    trace!("[input {}] checking port {}", id, port);

                    if self
                        .pipeline
                        .inputs()
                        .any(|(_, input)| input.port == port || input.port + 1 == port)
                    {
                        trace!(
                            "[input {}] port {} is already used by another input",
                            id,
                            port
                        );
                        continue;
                    }

                    let result = self.pipeline.register_input(
                        id.clone().into(),
                        rtp_receiver::Options {
                            port,
                            input_id: id.clone().into(),
                        },
                    );

                    if Self::check_port_not_available(&result, port).is_err() {
                        trace!(
                            "[input {}] FFmpeg reported port registration failure for port {}",
                            id,
                            port
                        );
                        continue;
                    }

                    result?;

                    trace!(
                        "[input {}] port registration succeeded for port {}",
                        id,
                        port
                    );

                    return Ok(ResponseHandler::Response(Response::RegisteredPort(port)));
                }

                Err(ApiError::new(
                    PORT_ALREADY_IN_USE_ERROR_CODE,
                    format!("Failed to register input stream \"{id}\". Ports {start}..{end} are already used or not available."),
                    tiny_http::StatusCode(400)
                ))
            }

            Port::Exact(port) => {
                if let Some((node_id, _)) =
                    self.pipeline.inputs().find(|(_, input)| input.port == port)
                {
                    return Err(ApiError::new(
                        PORT_ALREADY_IN_USE_ERROR_CODE,
                        format!("Failed to register input stream \"{id}\". Port {port} is already used by node \"{node_id}\""),
                        tiny_http::StatusCode(400)
                    ));
                }

                let result = self.pipeline.register_input(
                    id.clone().into(),
                    rtp_receiver::Options {
                        port,
                        input_id: id.into(),
                    },
                );

                Self::check_port_not_available(&result, port)?;

                result?;

                Ok(ResponseHandler::Response(Response::RegisteredPort(port)))
            }
        }
    }

    /// Returns Ok(()) if there isn't an error or the error is not a port already in use error.
    /// Returns Err(ApiError) if the error is a port already in use error.
    fn check_port_not_available<T>(
        register_input_error: &Result<T, RegisterInputError>,
        port: u16,
    ) -> Result<(), ApiError> {
        if let Err(RegisterInputError::DecoderError(ref id, InputInitError::InputError(ref err))) =
            register_input_error
        {
            if let Some(err) = err.0.downcast_ref::<rtp_receiver::InitError>() {
                match err {
                    rtp_receiver::InitError::FfmpegError(ffmpeg_next::Error::Other { errno: ffmpeg_next::error::EADDRINUSE })
                    | rtp_receiver::InitError::FfmpegError(ffmpeg_next::Error::Other { errno: ffmpeg_next::error::EADDRNOTAVAIL })
                    | rtp_receiver::InitError::FfmpegError(ffmpeg_next::Error::InvalidData) =>
                        Err(ApiError::new(
                        PORT_ALREADY_IN_USE_ERROR_CODE,
                        format!("Failed to register input stream \"{id}\". Port {port} is already in use or not available."),
                        tiny_http::StatusCode(400)
                    )),
                    _ => Ok(())
                }
            } else {
                Ok(())
            }
        } else {
            Ok(())
        }
    }
}
