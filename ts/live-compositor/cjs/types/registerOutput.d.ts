import type * as Api from '../api.js';
export type RegisterRtpOutput = {
    /**
     * Depends on the value of the `transport_protocol` field:
     * - `udp` - An UDP port number that RTP packets will be sent to.
     * - `tcp_server` - A local TCP port number or a port range that LiveCompositor will listen for incoming connections.
     */
    port: Api.PortOrPortRange;
    /**
     * Only valid if `transport_protocol="udp"`. IP address where RTP packets should be sent to.
     */
    ip?: string | null;
    /**
     * (**default=`"udp"`**) Transport layer protocol that will be used to send RTP packets.
     */
    transportProtocol?: Api.TransportProtocol;
    video?: RtpVideoOptions;
    audio?: RtpAudioOptions;
};
export type RegisterMp4Output = {
    /**
     * Path to output MP4 file (location on the server where LiveCompositor server is deployed).
     */
    serverPath: string;
    /**
     * Video track configuration.
     */
    video?: Mp4VideoOptions;
    /**
     * Audio track configuration.
     */
    audio?: Mp4AudioOptions;
};
export type RegisterCanvasOutput = {
    video: OutputCanvasVideoOptions;
};
export type RegisterWhipOutput = {
    /**
     * WHIP server endpoint.
     */
    endpointUrl: string;
    /**
     * Token for authenticating comunication with the WHIP server.
     */
    bearerToken?: string | null;
    /**
     * Video track configuration.
     */
    video?: WhipVideoOptions | null;
    /**
     * Audio track configuration.
     */
    audio?: WhipAudioOptions | null;
};
export type RtpVideoOptions = {
    /**
     * Output resolution in pixels.
     */
    resolution: Api.Resolution;
    /**
     * Defines when output stream should end if some of the input streams are finished. If output includes both audio and video streams, then EOS needs to be sent on both.
     */
    sendEosWhen?: OutputEndCondition;
    /**
     * Video encoder options.
     */
    encoder: RtpVideoEncoderOptions;
};
export type Mp4VideoOptions = {
    /**
     * Output resolution in pixels.
     */
    resolution: Api.Resolution;
    /**
     * Defines when output stream should end if some of the input streams are finished. If output includes both audio and video streams, then EOS needs to be sent on both.
     */
    sendEosWhen?: OutputEndCondition;
    /**
     * Video encoder options.
     */
    encoder: Mp4VideoEncoderOptions;
};
export type WhipVideoOptions = {
    /**
     * Output resolution in pixels.
     */
    resolution: Api.Resolution;
    /**
     * Defines when output stream should end if some of the input streams are finished. If output includes both audio and video streams, then EOS needs to be sent on both.
     */
    sendEosWhen?: OutputEndCondition | null;
    /**
     * Video encoder options.
     */
    encoder: WhipVideoEncoderOptions;
};
export type OutputCanvasVideoOptions = {
    /**
     * Output resolution in pixels.
     */
    resolution: Api.Resolution;
    /**
     * HTMLCanvasElement
     */
    canvas: any;
};
export type RtpVideoEncoderOptions = {
    type: 'ffmpeg_h264';
    /**
     * (**default=`"fast"`**) Preset for an encoder. See `FFmpeg` [docs](https://trac.ffmpeg.org/wiki/Encode/H.264#Preset) to learn more.
     */
    preset: Api.H264EncoderPreset;
    /**
     * Raw FFmpeg encoder options. See [docs](https://ffmpeg.org/ffmpeg-codecs.html) for more.
     */
    ffmpegOptions?: Api.VideoEncoderOptions['ffmpeg_options'];
};
export type Mp4VideoEncoderOptions = {
    type: 'ffmpeg_h264';
    /**
     * (**default=`"fast"`**) Preset for an encoder. See `FFmpeg` [docs](https://trac.ffmpeg.org/wiki/Encode/H.264#Preset) to learn more.
     */
    preset: Api.H264EncoderPreset;
    /**
     * Raw FFmpeg encoder options. See [docs](https://ffmpeg.org/ffmpeg-codecs.html) for more.
     */
    ffmpegOptions?: Api.VideoEncoderOptions['ffmpeg_options'];
};
export type WhipVideoEncoderOptions = {
    type: 'ffmpeg_h264';
    /**
     * (**default=`"fast"`**) Preset for an encoder. See `FFmpeg` [docs](https://trac.ffmpeg.org/wiki/Encode/H.264#Preset) to learn more.
     */
    preset: Api.H264EncoderPreset;
    /**
     * Raw FFmpeg encoder options. See [docs](https://ffmpeg.org/ffmpeg-codecs.html) for more.
     */
    ffmpegOptions?: Api.VideoEncoderOptions['ffmpeg_options'];
};
export type RtpAudioOptions = {
    /**
     * (**default="sum_clip"**) Specifies how audio should be mixed.
     */
    mixingStrategy?: Api.MixingStrategy | null;
    /**
     * Condition for termination of output stream based on the input streams states.
     */
    sendEosWhen?: OutputEndCondition | null;
    /**
     * Audio encoder options.
     */
    encoder: RtpAudioEncoderOptions;
};
export type Mp4AudioOptions = {
    /**
     * (**default="sum_clip"**) Specifies how audio should be mixed.
     */
    mixingStrategy?: Api.MixingStrategy | null;
    /**
     * Condition for termination of output stream based on the input streams states.
     */
    sendEosWhen?: OutputEndCondition | null;
    /**
     * Audio encoder options.
     */
    encoder: Mp4AudioEncoderOptions;
};
export type WhipAudioOptions = {
    /**
     * (**default="sum_clip"**) Specifies how audio should be mixed.
     */
    mixingStrategy?: Api.MixingStrategy | null;
    /**
     * Condition for termination of output stream based on the input streams states.
     */
    sendEosWhen?: OutputEndCondition | null;
    /**
     * Audio encoder options.
     */
    encoder: WhipAudioEncoderOptions;
};
export type RtpAudioEncoderOptions = {
    type: 'opus';
    channels: Api.AudioChannels;
    /**
     * (**default="voip"**) Specifies preset for audio output encoder.
     */
    preset?: Api.OpusEncoderPreset;
};
export type Mp4AudioEncoderOptions = {
    type: 'aac';
    channels: Api.AudioChannels;
};
export type WhipAudioEncoderOptions = {
    type: 'opus';
    channels: Api.AudioChannels;
    /**
     * (**default="voip"**) Specifies preset for audio output encoder.
     */
    preset?: Api.OpusEncoderPreset;
};
export type OutputEndCondition = {
    /**
     * Terminate output stream if any of the input streams from the list are finished.
     */
    anyOf: Api.InputId[];
} | {
    /**
     * Terminate output stream if all the input streams from the list are finished.
     */
    allOf: Api.InputId[];
} | {
    /**
     * Terminate output stream if any of the input streams ends. This includes streams added after the output was registered. In particular, output stream will **not be** terminated if no inputs were ever connected.
     */
    anyInput: boolean;
} | {
    /**
     * Terminate output stream if all the input streams finish. In particular, output stream will **be** terminated if no inputs were ever connected.
     */
    allInputs: boolean;
};
