import { _liveCompositorInternals } from 'live-compositor';
export const inputRefIntoRawId = _liveCompositorInternals.inputRefIntoRawId;
export const parseInputRef = _liveCompositorInternals.parseInputRef;
export function intoRegisterInput(input) {
    if (input.type === 'mp4') {
        return intoMp4RegisterInput(input);
    }
    else if (input.type === 'rtp_stream') {
        return intoRtpRegisterInput(input);
    }
    else {
        throw new Error(`Unknown input type ${input.type}`);
    }
}
function intoMp4RegisterInput(input) {
    return {
        type: 'mp4',
        url: input.url,
        path: input.serverPath,
        loop: input.loop,
        required: input.required,
        offset_ms: input.offsetMs,
        video_decoder: input.videoDecoder,
    };
}
function intoRtpRegisterInput(input) {
    return {
        type: 'rtp_stream',
        port: input.port,
        transport_protocol: input.transportProtocol,
        video: input.video,
        audio: input.audio && intoInputAudio(input.audio),
        required: input.required,
        offset_ms: input.offsetMs,
    };
}
function intoInputAudio(audio) {
    if (audio.decoder === 'opus') {
        return {
            decoder: 'opus',
            forward_error_correction: audio.forwardErrorCorrection,
        };
    }
    else if (audio.decoder === 'aac') {
        return {
            decoder: 'aac',
            audio_specific_config: audio.audioSpecificConfig,
            rtp_mode: audio.rtpMode,
        };
    }
    else {
        throw new Error(`Unknown audio decoder type: ${audio.decoder}`);
    }
}
