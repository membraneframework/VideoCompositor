"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const live_compositor_1 = require("live-compositor");
const react_1 = require("react");
const renderer_js_1 = __importDefault(require("./renderer.js"));
const output_js_1 = require("./api/output.js");
const utils_js_1 = require("./utils.js");
class Output {
    constructor(outputId, registerRequest, api, store) {
        var _a;
        this.shouldUpdateWhenReady = false;
        this.api = api;
        this.outputId = outputId;
        this.outputShutdownStateStore = new OutputShutdownStateStore();
        this.shouldUpdateWhenReady = false;
        this.throttledUpdate = () => {
            this.shouldUpdateWhenReady = true;
        };
        const hasAudio = 'audio' in registerRequest && !!registerRequest.audio;
        if (hasAudio) {
            this.initialAudioConfig = (_a = registerRequest.audio.initial) !== null && _a !== void 0 ? _a : { inputs: [] };
        }
        const onUpdate = () => this.throttledUpdate();
        this.outputCtx = new live_compositor_1._liveCompositorInternals.OutputContext(onUpdate, hasAudio);
        if (registerRequest.video) {
            const rootElement = (0, react_1.createElement)(OutputRootComponent, {
                instanceStore: store,
                outputCtx: this.outputCtx,
                outputRoot: registerRequest.video.root,
                outputShutdownStateStore: this.outputShutdownStateStore,
            });
            this.videoRenderer = new renderer_js_1.default({
                rootElement,
                onUpdate,
                idPrefix: `${outputId}-`,
            });
        }
    }
    scene() {
        var _a;
        const audio = (_a = this.outputCtx.getAudioConfig()) !== null && _a !== void 0 ? _a : this.initialAudioConfig;
        return {
            video: this.videoRenderer && { root: this.videoRenderer.scene() },
            audio: audio && (0, output_js_1.intoAudioInputsConfiguration)(audio),
        };
    }
    close() {
        this.throttledUpdate = () => { };
        // close will switch a scene to just a <View />, so we need replace `throttledUpdate`
        // callback before it is called
        this.outputShutdownStateStore.close();
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            this.throttledUpdate = (0, utils_js_1.throttle)(() => __awaiter(this, void 0, void 0, function* () {
                yield this.api.updateScene(this.outputId, this.scene());
            }), 30);
            if (this.shouldUpdateWhenReady) {
                this.throttledUpdate();
            }
        });
    }
}
// External store to share shutdown information between React tree
// and external code that is managing it.
class OutputShutdownStateStore {
    constructor() {
        this.shutdown = false;
        this.onChangeCallbacks = new Set();
        // callback for useSyncExternalStore
        this.getSnapshot = () => {
            return this.shutdown;
        };
        // callback for useSyncExternalStore
        this.subscribe = (onStoreChange) => {
            this.onChangeCallbacks.add(onStoreChange);
            return () => {
                this.onChangeCallbacks.delete(onStoreChange);
            };
        };
    }
    close() {
        this.shutdown = true;
        this.onChangeCallbacks.forEach(cb => cb());
    }
}
function OutputRootComponent({ outputRoot, instanceStore, outputCtx, outputShutdownStateStore, }) {
    const shouldShutdown = (0, react_1.useSyncExternalStore)(outputShutdownStateStore.subscribe, outputShutdownStateStore.getSnapshot);
    if (shouldShutdown) {
        // replace root with view to stop all the dynamic code
        return (0, react_1.createElement)(live_compositor_1.View, {});
    }
    const reactCtx = {
        instanceStore,
        outputCtx,
    };
    return (0, react_1.createElement)(live_compositor_1._liveCompositorInternals.LiveCompositorContext.Provider, { value: reactCtx }, outputRoot);
}
exports.default = Output;
