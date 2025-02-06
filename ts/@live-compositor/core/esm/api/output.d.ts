import type { Api, RegisterRtpOutput, RegisterMp4Output, RegisterCanvasOutput, RegisterWhipOutput, _liveCompositorInternals } from 'live-compositor';
export type RegisterOutputRequest = Api.RegisterOutput | RegisterCanvasOutputRequest;
export type RegisterCanvasOutputRequest = {
    type: 'canvas';
    video: OutputCanvasVideoOptions;
};
export type OutputCanvasVideoOptions = {
    resolution: Api.Resolution;
    /**
     * HTMLCanvasElement
     */
    canvas: any;
    initial: Api.Video;
};
export type RegisterOutput = ({
    type: 'rtp_stream';
} & RegisterRtpOutput) | ({
    type: 'mp4';
} & RegisterMp4Output) | ({
    type: 'canvas';
} & RegisterCanvasOutput) | ({
    type: 'whip';
} & RegisterWhipOutput);
export declare function intoRegisterOutput(output: RegisterOutput, initial: {
    video?: Api.Video;
    audio?: Api.Audio;
}): RegisterOutputRequest;
export declare function intoAudioInputsConfiguration(inputs: _liveCompositorInternals.AudioConfig): Api.Audio;
