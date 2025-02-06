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
const compositor_js_1 = require("./compositor.js");
const rootComponent_js_1 = require("../rootComponent.js");
class OfflineOutput {
    constructor(root, registerRequest, api, store, logger, durationMs) {
        this.api = api;
        this.logger = logger;
        this.outputId = compositor_js_1.OFFLINE_OUTPUT_ID;
        this.durationMs = durationMs;
        this.supportsAudio = 'audio' in registerRequest && !!registerRequest.audio;
        this.supportsVideo = 'video' in registerRequest && !!registerRequest.video;
        const onUpdate = () => { var _a; return (_a = this.updateTracker) === null || _a === void 0 ? void 0 : _a.onUpdate(); };
        this.audioContext = new live_compositor_1._liveCompositorInternals.AudioContext(onUpdate);
        this.internalInputStreamStore = new live_compositor_1._liveCompositorInternals.OfflineInputStreamStore();
        this.timeContext = new live_compositor_1._liveCompositorInternals.OfflineTimeContext(onUpdate, (timestamp) => {
            store.setCurrentTimestamp(timestamp);
            this.internalInputStreamStore.setCurrentTimestamp(timestamp);
        }, this.logger);
        this.childrenLifetimeContext = new live_compositor_1._liveCompositorInternals.ChildrenLifetimeContext(() => { });
        const rootElement = (0, react_1.createElement)(rootComponent_js_1.OutputRootComponent, {
            outputContext: new OutputContext(this, this.outputId, store),
            outputRoot: root,
            childrenLifetimeContext: this.childrenLifetimeContext,
        });
        this.renderer = new renderer_js_1.default({
            rootElement,
            onUpdate,
            idPrefix: `${this.outputId}-`,
            logger: logger.child({ element: 'react-renderer' }),
        });
    }
    scene() {
        const audio = this.supportsAudio
            ? (0, output_js_1.intoAudioInputsConfiguration)(this.audioContext.getAudioConfig())
            : undefined;
        const video = this.supportsVideo ? { root: this.renderer.scene() } : undefined;
        return {
            video,
            audio,
            schedule_time_ms: this.timeContext.timestampMs(),
        };
    }
    async scheduleAllUpdates() {
        var _a;
        this.updateTracker = new UpdateTracker(this.logger);
        while (this.timeContext.timestampMs() <= ((_a = this.durationMs) !== null && _a !== void 0 ? _a : Infinity)) {
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
                await this.api.unregisterOutput(compositor_js_1.OFFLINE_OUTPUT_ID, { schedule_time_ms: timestampMs });
                break;
            }
            this.timeContext.setNextTimestamp();
        }
        this.renderer.stop();
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
        var _a, _b;
        const inputRef = {
            type: 'output-specific-input',
            outputId: this.outputId,
            id: inputId,
        };
        const offsetMs = this.timeContext.timestampMs();
        const { video_duration_ms: videoDurationMs, audio_duration_ms: audioDurationMs } = await this.output.api.registerInput(inputRef, Object.assign({ type: 'mp4', offset_ms: offsetMs }, registerRequest));
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
                timestamp: ((_a = registerRequest.offsetMs) !== null && _a !== void 0 ? _a : 0) + videoDurationMs,
            });
        }
        if (audioDurationMs) {
            this.timeContext.addTimestamp({
                timestamp: ((_b = registerRequest.offsetMs) !== null && _b !== void 0 ? _b : 0) + audioDurationMs,
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
        await (0, utils_js_1.sleep)(100);
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
    constructor(logger) {
        this.promise = new Promise(() => { });
        this.promiseRes = () => { };
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
exports.default = OfflineOutput;
