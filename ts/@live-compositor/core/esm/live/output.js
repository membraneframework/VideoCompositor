import { _liveCompositorInternals } from 'live-compositor';
import { createElement } from 'react';
import Renderer from '../renderer.js';
import { intoAudioInputsConfiguration } from '../api/output.js';
import { ThrottledFunction } from '../utils.js';
import { OutputRootComponent } from '../rootComponent.js';
class Output {
    api;
    outputId;
    audioContext;
    timeContext;
    internalInputStreamStore;
    logger;
    shouldUpdateWhenReady = false;
    throttledUpdate;
    supportsAudio;
    supportsVideo;
    renderer;
    constructor(outputId, root, registerRequest, api, store, startTimestamp, logger) {
        this.api = api;
        this.logger = logger;
        this.outputId = outputId;
        this.shouldUpdateWhenReady = false;
        this.throttledUpdate = new ThrottledFunction(async () => {
            this.shouldUpdateWhenReady = true;
        }, {
            timeoutMs: 30,
            logger: this.logger,
        });
        this.supportsAudio = 'audio' in registerRequest && !!registerRequest.audio;
        this.supportsVideo = 'video' in registerRequest && !!registerRequest.video;
        const onUpdate = () => this.throttledUpdate.scheduleCall();
        this.audioContext = new _liveCompositorInternals.AudioContext(onUpdate);
        this.timeContext = new _liveCompositorInternals.LiveTimeContext();
        this.internalInputStreamStore = new _liveCompositorInternals.LiveInputStreamStore(this.logger);
        if (startTimestamp !== undefined) {
            this.timeContext.initClock(startTimestamp);
        }
        const rootElement = createElement(OutputRootComponent, {
            outputContext: new OutputContext(this, this.outputId, store),
            outputRoot: root,
            childrenLifetimeContext: new _liveCompositorInternals.ChildrenLifetimeContext(() => { }),
        });
        this.renderer = new Renderer({
            rootElement,
            onUpdate,
            idPrefix: `${outputId}-`,
            logger: logger.child({ element: 'react-renderer' }),
        });
    }
    scene() {
        const audio = this.supportsAudio
            ? intoAudioInputsConfiguration(this.audioContext.getAudioConfig())
            : undefined;
        const video = this.supportsVideo ? { root: this.renderer.scene() } : undefined;
        return {
            audio,
            video,
        };
    }
    async close() {
        this.throttledUpdate.setFn(async () => { });
        this.renderer.stop();
        await this.throttledUpdate.waitForPendingCalls();
    }
    async ready() {
        this.throttledUpdate.setFn(async () => {
            await this.api.updateScene(this.outputId, this.scene());
        });
        if (this.shouldUpdateWhenReady) {
            this.throttledUpdate.scheduleCall();
        }
    }
    initClock(timestamp) {
        this.timeContext.initClock(timestamp);
    }
    inputStreamStore() {
        return this.internalInputStreamStore;
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
        return await this.output.internalInputStreamStore.runBlocking(async (updateStore) => {
            const inputRef = {
                type: 'output-specific-input',
                outputId: this.outputId,
                id: inputId,
            };
            const { video_duration_ms: videoDurationMs, audio_duration_ms: audioDurationMs } = await this.output.api.registerInput(inputRef, {
                type: 'mp4',
                ...registerRequest,
            });
            updateStore({
                type: 'add_input',
                input: {
                    inputId: inputId,
                    offsetMs: registerRequest.offsetMs,
                    audioDurationMs,
                    videoDurationMs,
                },
            });
            return {
                audioDurationMs,
                videoDurationMs,
            };
        });
    }
    async unregisterMp4Input(inputId) {
        await this.output.api.unregisterInput({
            type: 'output-specific-input',
            outputId: this.outputId,
            id: inputId,
        }, {});
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
export default Output;
