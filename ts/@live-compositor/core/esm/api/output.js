import { inputRefIntoRawId } from './input.js';
export function intoRegisterOutput(output, initial) {
    if (output.type === 'rtp_stream') {
        return intoRegisterRtpOutput(output, initial);
    }
    else if (output.type === 'mp4') {
        return intoRegisterMp4Output(output, initial);
    }
    else if (output.type === 'canvas') {
        return intoRegisterCanvasOutput(output, initial);
    }
    else if (output.type === 'whip') {
        return intoRegisterWhipOutput(output, initial);
    }
    else {
        throw new Error(`Unknown output type ${output.type}`);
    }
}
function intoRegisterRtpOutput(output, initial) {
    return {
        type: 'rtp_stream',
        port: output.port,
        ip: output.ip,
        transport_protocol: output.transportProtocol,
        video: output.video && initial.video && intoOutputVideoOptions(output.video, initial.video),
        audio: output.audio && initial.audio && intoOutputRtpAudioOptions(output.audio, initial.audio),
    };
}
function intoRegisterMp4Output(output, initial) {
    return {
        type: 'mp4',
        path: output.serverPath,
        video: output.video && initial.video && intoOutputVideoOptions(output.video, initial.video),
        audio: output.audio && initial.audio && intoOutputMp4AudioOptions(output.audio, initial.audio),
    };
}
function intoRegisterCanvasOutput(output, initial) {
    return {
        type: 'canvas',
        video: {
            resolution: output.video.resolution,
            canvas: output.video.canvas,
            initial: initial.video,
        },
    };
}
function intoRegisterWhipOutput(output, initial) {
    return {
        type: 'whip',
        endpoint_url: output.endpointUrl,
        bearer_token: output.bearerToken,
        video: output.video && initial.video && intoOutputVideoOptions(output.video, initial.video),
        audio: output.audio && initial.audio && intoOutputWhipAudioOptions(output.audio, initial.audio),
    };
}
function intoOutputVideoOptions(video, initial) {
    return {
        resolution: video.resolution,
        send_eos_when: video.sendEosWhen && intoOutputEosCondition(video.sendEosWhen),
        encoder: intoVideoEncoderOptions(video.encoder),
        initial,
    };
}
function intoVideoEncoderOptions(encoder) {
    return {
        type: 'ffmpeg_h264',
        preset: encoder.preset,
        ffmpeg_options: encoder.ffmpegOptions,
    };
}
function intoOutputRtpAudioOptions(audio, initial) {
    return {
        send_eos_when: audio.sendEosWhen && intoOutputEosCondition(audio.sendEosWhen),
        encoder: intoRtpAudioEncoderOptions(audio.encoder),
        initial,
    };
}
function intoOutputMp4AudioOptions(audio, initial) {
    return {
        send_eos_when: audio.sendEosWhen && intoOutputEosCondition(audio.sendEosWhen),
        encoder: intoMp4AudioEncoderOptions(audio.encoder),
        initial,
    };
}
function intoOutputWhipAudioOptions(audio, initial) {
    return {
        send_eos_when: audio.sendEosWhen && intoOutputEosCondition(audio.sendEosWhen),
        encoder: intoWhipAudioEncoderOptions(audio.encoder),
        initial,
    };
}
function intoRtpAudioEncoderOptions(encoder) {
    return {
        type: 'opus',
        preset: encoder.preset,
        channels: encoder.channels,
    };
}
function intoMp4AudioEncoderOptions(encoder) {
    return {
        type: 'aac',
        channels: encoder.channels,
    };
}
function intoWhipAudioEncoderOptions(encoder) {
    return {
        type: 'opus',
        channels: encoder.channels,
    };
}
export function intoAudioInputsConfiguration(inputs) {
    return {
        inputs: inputs.map(input => ({
            input_id: inputRefIntoRawId(input.inputRef),
            volume: input.volume,
        })),
    };
}
function intoOutputEosCondition(condition) {
    if ('anyOf' in condition) {
        return { any_of: condition.anyOf };
    }
    else if ('allOf' in condition) {
        return { all_of: condition.allOf };
    }
    else if ('allInputs' in condition) {
        return { all_inputs: condition.allInputs };
    }
    else if ('anyInput' in condition) {
        return { any_input: condition.anyInput };
    }
    else {
        throw new Error('Invalid "send_eos_when" value.');
    }
}
