import { AudioContext } from './audioOutputContext.js';
import type { TimeContext } from './timeContext.js';
import { type InputStreamStore } from './inputStreamStore.js';
import type { RegisterMp4Input } from '../types/registerInput.js';
import type { RegisterImage } from '../types/registerRenderer.js';
import type { Logger } from '../types/logger.js';
export type CompositorOutputContext = {
    globalInputStreamStore: InputStreamStore<string>;
    internalInputStreamStore: InputStreamStore<number>;
    audioContext: AudioContext;
    timeContext: TimeContext;
    outputId: string;
    logger: Logger;
    registerMp4Input: (inputId: number, registerRequest: RegisterMp4Input) => Promise<{
        videoDurationMs?: number;
        audioDurationMs?: number;
    }>;
    unregisterMp4Input: (inputId: number) => Promise<void>;
    registerImage: (imageId: number, registerRequest: RegisterImage) => Promise<void>;
    unregisterImage: (imageId: number) => Promise<void>;
};
export declare const LiveCompositorContext: import("react").Context<CompositorOutputContext>;
