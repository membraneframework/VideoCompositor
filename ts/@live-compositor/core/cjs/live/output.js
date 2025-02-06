"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const live_compositor_1 = require("live-compositor");
const react_1 = require("react");
const renderer_js_1 = __importDefault(require("../renderer.js"));
const output_js_1 = require("../api/output.js");
const utils_js_1 = require("../utils.js");
const rootComponent_js_1 = require("../rootComponent.js");
class Output {
    constructor(outputId, root, registerRequest, api, store, startTimestamp, logger) {
        this.shouldUpdateWhenReady = false;
        this.api = api;
        this.logger = logger;
        this.outputId = outputId;
        this.shouldUpdateWhenReady = false;
        this.throttledUpdate = new utils_js_1.ThrottledFunction(async () => {
            this.shouldUpdateWhenReady = true;
        }, {
            timeoutMs: 30,
            logger: this.logger,
        });
        this.supportsAudio = 'audio' in registerRequest && !!registerRequest.audio;
        this.supportsVideo = 'video' in registerRequest && !!registerRequest.video;
        const onUpdate = () => this.throttledUpdate.scheduleCall();
        this.audioContext = new live_compositor_1._liveCompositorInternals.AudioContext(onUpdate);
        this.timeContext = new live_compositor_1._liveCompositorInternals.LiveTimeContext();
        this.internalInputStreamStore = new live_compositor_1._liveCompositorInternals.LiveInputStreamStore(this.logger);
        if (startTimestamp !== undefined) {
            this.timeContext.initClock(startTimestamp);
        }
        const rootElement = (0, react_1.createElement)(rootComponent_js_1.OutputRootComponent, {
            outputContext: new OutputContext(this, this.outputId, store),
            outputRoot: root,
            childrenLifetimeContext: new live_compositor_1._liveCompositorInternals.ChildrenLifetimeContext(() => { }),
        });
        this.renderer = new renderer_js_1.default({
            rootElement,
            onUpdate,
            idPrefix: `${outputId}-`,
            logger: logger.child({ element: 'react-renderer' }),
        });
    }
    scene() {
        const audio = this.supportsAudio
            ? (0, output_js_1.intoAudioInputsConfiguration)(this.audioContext.getAudioConfig())
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
            const { video_duration_ms: videoDurationMs, audio_duration_ms: audioDurationMs } = await this.output.api.registerInput(inputRef, Object.assign({ type: 'mp4' }, registerRequest));
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
exports.default = Output;
