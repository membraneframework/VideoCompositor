import type { Outputs } from 'live-compositor';
import { _liveCompositorInternals } from 'live-compositor';
import type { ApiClient, Api } from './api.js';
import Renderer from './renderer.js';
import type { RegisterOutput } from './api/output.js';
type OutputContext = _liveCompositorInternals.OutputContext;
type InstanceContextStore = _liveCompositorInternals.InstanceContextStore;
declare class Output {
    api: ApiClient;
    outputId: string;
    outputCtx: OutputContext;
    outputShutdownStateStore: OutputShutdownStateStore;
    shouldUpdateWhenReady: boolean;
    throttledUpdate: () => void;
    videoRenderer?: Renderer;
    initialAudioConfig?: Outputs.AudioInputsConfiguration;
    constructor(outputId: string, registerRequest: RegisterOutput, api: ApiClient, store: InstanceContextStore);
    scene(): {
        video?: Api.Video;
        audio?: Api.Audio;
    };
    close(): void;
    ready(): Promise<void>;
}
declare class OutputShutdownStateStore {
    private shutdown;
    private onChangeCallbacks;
    close(): void;
    getSnapshot: () => boolean;
    subscribe: (onStoreChange: () => void) => (() => void);
}
export default Output;
