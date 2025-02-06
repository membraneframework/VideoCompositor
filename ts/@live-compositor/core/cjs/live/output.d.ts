import { _liveCompositorInternals } from 'live-compositor';
import type { ReactElement } from 'react';
import type { ApiClient, Api } from '../api.js';
import Renderer from '../renderer.js';
import type { RegisterOutput } from '../api/output.js';
import { ThrottledFunction } from '../utils.js';
import type { Logger } from 'pino';
type AudioContext = _liveCompositorInternals.AudioContext;
type LiveTimeContext = _liveCompositorInternals.LiveTimeContext;
type LiveInputStreamStore<Id> = _liveCompositorInternals.LiveInputStreamStore<Id>;
declare class Output {
    api: ApiClient;
    outputId: string;
    audioContext: AudioContext;
    timeContext: LiveTimeContext;
    internalInputStreamStore: LiveInputStreamStore<number>;
    logger: Logger;
    shouldUpdateWhenReady: boolean;
    throttledUpdate: ThrottledFunction;
    supportsAudio: boolean;
    supportsVideo: boolean;
    renderer: Renderer;
    constructor(outputId: string, root: ReactElement, registerRequest: RegisterOutput, api: ApiClient, store: LiveInputStreamStore<string>, startTimestamp: number | undefined, logger: Logger);
    scene(): {
        video?: Api.Video;
        audio?: Api.Audio;
    };
    close(): Promise<void>;
    ready(): Promise<void>;
    initClock(timestamp: number): void;
    inputStreamStore(): LiveInputStreamStore<number>;
}
export default Output;
