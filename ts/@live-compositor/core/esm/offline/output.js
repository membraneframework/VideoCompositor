import { _liveCompositorInternals } from 'live-compositor';
import { createElement } from 'react';
import Renderer from '../renderer.js';
import { intoAudioInputsConfiguration } from '../api/output.js';
import { sleep } from '../utils.js';
import { OFFLINE_OUTPUT_ID } from './compositor.js';
import { OutputRootComponent } from '../rootComponent.js';
class OfflineOutput {
    api;
    outputId;
    audioContext;
    timeContext;
    childrenLifetimeContext;
    internalInputStreamStore;
    logger;
    durationMs;
    updateTracker;
    supportsAudio;
    supportsVideo;
    renderer;
    constructor(root, registerRequest, api, store, logger, durationMs) {
        this.api = api;
        this.logger = logger;
        this.outputId = OFFLINE_OUTPUT_ID;
        this.durationMs = durationMs;
        this.supportsAudio = 'audio' in registerRequest && !!registerRequest.audio;
        this.supportsVideo = 'video' in registerRequest && !!registerRequest.video;
        const onUpdate = () => this.updateTracker?.onUpdate();
        this.audioContext = new _liveCompositorInternals.AudioContext(onUpdate);
        this.internalInputStreamStore = new _liveCompositorInternals.OfflineInputStreamStore();
        this.timeContext = new _liveCompositorInternals.OfflineTimeContext(onUpdate, (timestamp) => {
            store.setCurrentTimestamp(timestamp);
            this.internalInputStreamStore.setCurrentTimestamp(timestamp);
        }, this.logger);
        this.childrenLifetimeContext = new _liveCompositorInternals.ChildrenLifetimeContext(() => { });
        const rootElement = createElement(OutputRootComponent, {
            outputContext: new OutputContext(this, this.outputId, store),
            outputRoot: root,
            childrenLifetimeContext: this.childrenLifetimeContext,
        });
        this.renderer = new Renderer({
            rootElement,
            onUpdate,
            idPrefix: `${this.outputId}-`,
            logger: logger.child({ element: 'react-renderer' }),
        });
    }
    scene() {
        const audio = this.supportsAudio
            ? intoAudioInputsConfiguration(this.audioContext.getAudioConfig())
            : undefined;
        const video = this.supportsVideo ? { root: this.renderer.scene() } : undefined;
        return {
            video,
            audio,
            schedule_time_ms: this.timeContext.timestampMs(),
        };
    }
    async scheduleAllUpdates() {
        this.updateTracker = new UpdateTracker(this.logger);
        while (this.timeContext.timestampMs() <= (this.durationMs ?? Infinity)) {
            while (true) {
                await waitForBlockingTasks(this.timeContext);
                await this.updateTracker.waitForRenderEnd();
                if (!this.timeContext.isBlocked()) {
                    break;
                }
            }
            const scene = this.scene();
            await this.api.updateScene(this.outputId, scene);
            const timestampMs = this.timeContext.timestampMs();
            if (this.childrenLifetimeContext.isDone() && this.durationMs === undefined) {
                await this.api.unregisterOutput(OFFLINE_OUTPUT_ID, { schedule_time_ms: timestampMs });
                break;
            }
            this.timeContext.setNextTimestamp();
        }
        this.renderer.stop();
    }
}
class OutputContext {
    globalInputStreamStore;
    internalInputStreamStore;
    audioContext;
    timeContext;
    outputId;
    logger;
    output;
    constructor(output, outputId, store) {
        this.output = output;
        this.globalInputStreamStore = store;
        this.internalInputStreamStore = output.internalInputStreamStore;
        this.audioContext = output.audioContext;
        this.timeContext = output.timeContext;
        this.outputId = outputId;
        this.logger = output.logger;
    }
    async registerMp4Input(inputId, registerRequest) {
        const inputRef = {
            type: 'output-specific-input',
            outputId: this.outputId,
            id: inputId,
        };
        const offsetMs = this.timeContext.timestampMs();
        const { video_duration_ms: videoDurationMs, audio_duration_ms: audioDurationMs } = await this.output.api.registerInput(inputRef, {
            type: 'mp4',
            offset_ms: offsetMs,
            ...registerRequest,
        });
        this.output.internalInputStreamStore.addInput({
            inputId,
            offsetMs,
            videoDurationMs,
            audioDurationMs,
        });
        if (registerRequest.offsetMs) {
            this.timeContext.addTimestamp({ timestamp: offsetMs });
        }
        if (videoDurationMs) {
            this.timeContext.addTimestamp({
                timestamp: (registerRequest.offsetMs ?? 0) + videoDurationMs,
            });
        }
        if (audioDurationMs) {
            this.timeContext.addTimestamp({
                timestamp: (registerRequest.offsetMs ?? 0) + audioDurationMs,
            });
        }
        return {
            videoDurationMs,
            audioDurationMs,
        };
    }
    async unregisterMp4Input(inputId) {
        await this.output.api.unregisterInput({
            type: 'output-specific-input',
            outputId: this.outputId,
            id: inputId,
        }, { schedule_time_ms: this.timeContext.timestampMs() });
    }
    async registerImage(imageId, imageSpec) {
        const imageRef = {
            type: 'output-specific-image',
            outputId: this.outputId,
            id: imageId,
        };
        await this.output.api.registerImage(imageRef, {
            url: imageSpec.url,
            asset_type: imageSpec.assetType,
        });
    }
    async unregisterImage(imageId) {
        await this.output.api.unregisterImage({
            type: 'output-specific-image',
            outputId: this.outputId,
            id: imageId,
        });
    }
}
async function waitForBlockingTasks(offlineContext) {
    while (offlineContext.isBlocked()) {
        await sleep(100);
    }
}
const MAX_NO_UPDATE_TIMEOUT_MS = 200;
const MAX_RENDER_TIMEOUT_MS = 2000;
/**
 * Instance that tracks updates, this utils allows us to
 * to monitor when last update happened in the react tree.
 *
 * If there were no updates for MAX_NO_UPDATE_TIMEOUT_MS or
 * MAX_RENDER_TIMEOUT_MS already passed since we started rendering
 * specific PTS then assume it's ready to grab a snapshot of a tree
 */
class UpdateTracker {
    promise = new Promise(() => { });
    promiseRes = () => { };
    updateTimeout;
    renderTimeout;
    logger;
    constructor(logger) {
        this.promise = new Promise((res, _rej) => {
            this.promiseRes = res;
        });
        this.onUpdate();
        this.logger = logger;
    }
    onUpdate() {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.promiseRes();
        }, MAX_NO_UPDATE_TIMEOUT_MS);
    }
    async waitForRenderEnd() {
        this.promise = new Promise((res, _rej) => {
            this.promiseRes = res;
        });
        clearTimeout(this.renderTimeout);
        this.renderTimeout = setTimeout(() => {
            this.logger.warn("Render for a specific timestamp took too long, make sure you don't have infinite update loop.");
            this.promiseRes();
        }, MAX_RENDER_TIMEOUT_MS);
        await this.promise;
        clearTimeout(this.renderTimeout);
        clearTimeout(this.updateTimeout);
    }
}
export default OfflineOutput;
