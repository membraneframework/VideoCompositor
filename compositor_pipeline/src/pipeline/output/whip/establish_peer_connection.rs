use super::{WhipCtx, WhipError};
use compositor_render::error::ErrorStack;
use reqwest::{
    header::{HeaderMap, HeaderValue},
    Client, Method, StatusCode,
};
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use tracing::{debug, error, info};
use url::{ParseError, Url};
use webrtc::{
    ice_transport::{ice_candidate::RTCIceCandidate, ice_connection_state::RTCIceConnectionState},
    peer_connection::{sdp::session_description::RTCSessionDescription, RTCPeerConnection},
    rtcp::payload_feedbacks::picture_loss_indication::PictureLossIndication,
};

pub async fn connect(
    peer_connection: Arc<RTCPeerConnection>,
    client: Arc<reqwest::Client>,
    whip_ctx: &WhipCtx,
) -> Result<Url, WhipError> {
    let whip_ctx = whip_ctx.clone();
    peer_connection.on_ice_connection_state_change(Box::new(
        move |connection_state: RTCIceConnectionState| {
            debug!("Connection State has changed {connection_state}.");
            if connection_state == RTCIceConnectionState::Connected {
                debug!("Ice connected.");
            } else if connection_state == RTCIceConnectionState::Failed {
                debug!("Ice connection failed.");
                whip_ctx
                    .should_close
                    .store(true, std::sync::atomic::Ordering::Relaxed);
            }
            Box::pin(async {})
        },
    ));

    if let Some(keyframe_sender) = whip_ctx.request_keyframe_sender {
        let senders = peer_connection.get_senders().await;
        for sender in senders {
            let keyframe_sender_clone = keyframe_sender.clone();
            whip_ctx.tokio_rt.spawn(async move {
                loop {
                    if let Ok((packets, _)) = &sender.read_rtcp().await {
                        for packet in packets {
                            if packet
                                .as_any()
                                .downcast_ref::<PictureLossIndication>()
                                .is_some()
                            {
                                if let Err(err) = keyframe_sender_clone.send(()) {
                                    debug!(%err, "Failed to send keyframe request to the encoder.");
                                };
                            }
                        }
                    } else {
                        debug!("Failed to read RTCP packets from the sender.");
                    }
                }
            });
        }
    }

    let offer = peer_connection
        .create_offer(None)
        .await
        .map_err(WhipError::OfferCreationError)?;
    error!("offer: {offer:?}");

    let endpoint_url = Url::parse(&whip_ctx.options.endpoint_url)
        .map_err(|e| WhipError::InvalidEndpointUrl(e, whip_ctx.options.endpoint_url.clone()))?;

    info!("Endpoint url: {}", endpoint_url);

    let mut header_map = HeaderMap::new();
    header_map.append("Content-Type", HeaderValue::from_static("application/sdp"));

    if let Some(token) = &whip_ctx.options.bearer_token {
        let header_value_str: HeaderValue = match format!("Bearer {token}").parse() {
            Ok(val) => val,
            Err(err) => {
                error!("Ivalid header token, couldn't parse: {}", err);
                HeaderValue::from_static("Bearer")
            }
        };
        header_map.append("Authorization", header_value_str);
    }

    let response = client
        .post(endpoint_url.clone())
        .headers(header_map)
        .body(offer.sdp.clone())
        .send()
        .await
        .map_err(|_| WhipError::RequestFailed(Method::POST, endpoint_url.clone()))?;

    if let Err(err) = &response.error_for_status_ref() {
        let status = err.status().unwrap();
        let answer = &response
            .text()
            .await
            .map_err(|e| WhipError::BodyParsingError("sdp offer", e))?;
        return Err(WhipError::BadStatus(status, answer.to_string()));
    };

    let location_url_str = response
        .headers()
        .get("location")
        .and_then(|url| url.to_str().ok())
        .ok_or_else(|| WhipError::MissingLocationHeader)?;

    let port = endpoint_url.port().ok_or_else(|| WhipError::MissingPort)?;
    let location_url = match Url::parse(location_url_str) {
        Ok(url) => Ok(url),
        Err(err) => match err {
            ParseError::RelativeUrlWithoutBase => {
                let scheme = endpoint_url.scheme();
                let host = endpoint_url
                    .host_str()
                    .ok_or_else(|| WhipError::MissingHost)?;
                let formatted_url = format!("{}://{}:{}{}", scheme, host, port, location_url_str);
                let location_url = Url::try_from(formatted_url.as_str())
                    .map_err(|e| WhipError::InvalidEndpointUrl(e, formatted_url))?;
                Ok(location_url)
            }
            _ => Err(WhipError::InvalidEndpointUrl(
                err,
                location_url_str.to_string(),
            )),
        },
    }?;

    peer_connection
        .set_local_description(offer)
        .await
        .map_err(WhipError::LocalDescriptionError)?;

    let answer = response
        .text()
        .await
        .map_err(|e| WhipError::BodyParsingError("sdp offer", e))?;

    let rtc_answer =
        RTCSessionDescription::answer(answer).map_err(WhipError::RTCSessionDescriptionError)?;

    peer_connection
        .set_remote_description(rtc_answer)
        .await
        .map_err(WhipError::RemoteDescriptionError)?;

    let should_stop = Arc::new(AtomicBool::new(false));
    let location_url_clone = location_url.clone();
    peer_connection.on_ice_candidate(Box::new(move |candidate| {
        let bearer_token = whip_ctx.options.bearer_token.clone();
        let client = client.clone();
        let location_url = location_url_clone.clone();
        let should_stop_clone = should_stop.clone();
        Box::pin(async move {
            if should_stop_clone.load(Ordering::Relaxed) {
                return;
            }
            if let Some(candidate) = candidate {
                if let Err(err) =
                    handle_candidate(candidate, bearer_token, client, location_url.clone()).await
                {
                    match err {
                        WhipError::TrickleIceNotSupported => {
                            info!("Trickle ICE not supported by WHIP server");
                            should_stop_clone.store(true, Ordering::Relaxed);
                        }
                        WhipError::EntityTagMissing | WhipError::EntityTagNonMatching => {
                            info!("Entity tags not supported by WHIP output");
                            should_stop_clone.store(true, Ordering::Relaxed);
                        }
                        _ => error!("{}", ErrorStack::new(&err).into_string()),
                    }
                }
            }
        })
    }));

    Ok(location_url)
}

async fn handle_candidate(
    candidate: RTCIceCandidate,
    bearer_token: Option<Arc<str>>,
    client: Arc<Client>,
    location: Url,
) -> Result<(), WhipError> {
    let ice_candidate = candidate
        .to_json()
        .map_err(WhipError::IceCandidateToJsonError)?;

    let mut header_map = HeaderMap::new();
    header_map.append(
        "Content-Type",
        HeaderValue::from_static("application/trickle-ice-sdpfrag"),
    );

    if let Some(token) = bearer_token {
        let header_value_str: HeaderValue = match format!("Bearer {token}").parse() {
            Ok(val) => val,
            Err(err) => {
                error!("Ivalid header token, couldn't parse: {}", err);
                HeaderValue::from_static("Bearer")
            }
        };
        header_map.append("Authorization", header_value_str);
    }

    let response = client
        .patch(location.clone())
        .headers(header_map)
        .body(serde_json::to_string(&ice_candidate)?)
        .send()
        .await
        .map_err(|_| WhipError::RequestFailed(Method::PATCH, location.clone()))?;

    if let Err(err) = &response.error_for_status_ref() {
        let status_code = err.status().unwrap();
        let trickle_ice_error = match status_code {
            StatusCode::UNPROCESSABLE_ENTITY | StatusCode::METHOD_NOT_ALLOWED => {
                WhipError::TrickleIceNotSupported
            }
            StatusCode::PRECONDITION_REQUIRED => WhipError::EntityTagMissing,
            StatusCode::PRECONDITION_FAILED => WhipError::EntityTagNonMatching,
            _ => {
                let answer = &response
                    .text()
                    .await
                    .map_err(|e| WhipError::BodyParsingError("ICE Candidate", e))?;
                WhipError::BadStatus(status_code, answer.to_string())
            }
        };
        return Err(trickle_ice_error);
    };

    Ok(())
}
