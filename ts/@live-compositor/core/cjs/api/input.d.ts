import type { Api } from '../api.js';
import type { RegisterMp4Input, RegisterRtpInput } from 'live-compositor';
import { _liveCompositorInternals } from 'live-compositor';
export type RegisterInputRequest = Api.RegisterInput;
export type InputRef = _liveCompositorInternals.InputRef;
export declare const inputRefIntoRawId: typeof _liveCompositorInternals.inputRefIntoRawId;
export declare const parseInputRef: typeof _liveCompositorInternals.parseInputRef;
export type RegisterInput = ({
    type: 'rtp_stream';
} & RegisterRtpInput) | ({
    type: 'mp4';
} & RegisterMp4Input);
export declare function intoRegisterInput(input: RegisterInput): RegisterInputRequest;
