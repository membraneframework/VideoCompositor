import { _liveCompositorInternals } from 'live-compositor';
import type { ReactElement } from 'react';
import type { ApiClient, Api } from '../api.js';
import Renderer from '../renderer.js';
import type { RegisterOutput } from '../api/output.js';
import type { Logger } from 'pino';
type AudioContext = _liveCompositorInternals.AudioContext;
type OfflineTimeContext = _liveCompositorInternals.OfflineTimeContext;
type OfflineInputStreamStore<Id> = _liveCompositorInternals.OfflineInputStreamStore<Id>;
type ChildrenLifetimeContext = _liveCompositorInternals.ChildrenLifetimeContext;
declare class OfflineOutput {
    api: ApiClient;
    outputId: string;
    audioContext: AudioContext;
    timeContext: OfflineTimeContext;
    childrenLifetimeContext: ChildrenLifetimeContext;
    internalInputStreamStore: OfflineInputStreamStore<number>;
    logger: Logger;
    durationMs?: number;
    updateTracker?: UpdateTracker;
    supportsAudio: boolean;
    supportsVideo: boolean;
    renderer: Renderer;
    constructor(root: ReactElement, registerRequest: RegisterOutput, api: ApiClient, store: OfflineInputStreamStore<string>, logger: Logger, durationMs?: number);
    scene(): {
        video?: Api.Video;
        audio?: Api.Audio;
        schedule_time_ms: number;
    };
    scheduleAllUpdates(): Promise<void>;
}
/**
 * Instance that tracks updates, this utils allows us to
 * to monitor when last update happened in the react tree.
 *
 * If there were no updates for MAX_NO_UPDATE_TIMEOUT_MS or
 * MAX_RENDER_TIMEOUT_MS already passed since we started rendering
 * specific PTS then assume it's ready to grab a snapshot of a tree
 */
declare class UpdateTracker {
    private promise;
    private promiseRes;
    private updateTimeout?;
    private renderTimeout?;
    private logger;
    constructor(logger: Logger);
    onUpdate(): void;
    waitForRenderEnd(): Promise<void>;
}
export default OfflineOutput;
