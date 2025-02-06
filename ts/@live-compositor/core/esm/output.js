import { _liveCompositorInternals, View } from 'live-compositor';
import { createElement, useSyncExternalStore } from 'react';
import Renderer from './renderer.js';
import { intoAudioInputsConfiguration } from './api/output.js';
import { throttle } from './utils.js';
class Output {
    api;
    outputId;
    outputCtx;
    outputShutdownStateStore;
    shouldUpdateWhenReady = false;
    throttledUpdate;
    videoRenderer;
    initialAudioConfig;
    constructor(outputId, registerRequest, api, store) {
        this.api = api;
        this.outputId = outputId;
        this.outputShutdownStateStore = new OutputShutdownStateStore();
        this.shouldUpdateWhenReady = false;
        this.throttledUpdate = () => {
            this.shouldUpdateWhenReady = true;
        };
        const hasAudio = 'audio' in registerRequest && !!registerRequest.audio;
        if (hasAudio) {
            this.initialAudioConfig = registerRequest.audio.initial ?? { inputs: [] };
        }
        const onUpdate = () => this.throttledUpdate();
        this.outputCtx = new _liveCompositorInternals.OutputContext(onUpdate, hasAudio);
        if (registerRequest.video) {
            const rootElement = createElement(OutputRootComponent, {
                instanceStore: store,
                outputCtx: this.outputCtx,
                outputRoot: registerRequest.video.root,
                outputShutdownStateStore: this.outputShutdownStateStore,
            });
            this.videoRenderer = new Renderer({
                rootElement,
                onUpdate,
                idPrefix: `${outputId}-`,
            });
        }
    }
    scene() {
        const audio = this.outputCtx.getAudioConfig() ?? this.initialAudioConfig;
        return {
            video: this.videoRenderer && { root: this.videoRenderer.scene() },
            audio: audio && intoAudioInputsConfiguration(audio),
        };
    }
    close() {
        this.throttledUpdate = () => { };
        // close will switch a scene to just a <View />, so we need replace `throttledUpdate`
        // callback before it is called
        this.outputShutdownStateStore.close();
    }
    async ready() {
        this.throttledUpdate = throttle(async () => {
            await this.api.updateScene(this.outputId, this.scene());
        }, 30);
        if (this.shouldUpdateWhenReady) {
            this.throttledUpdate();
        }
    }
}
// External store to share shutdown information between React tree
// and external code that is managing it.
class OutputShutdownStateStore {
    shutdown = false;
    onChangeCallbacks = new Set();
    close() {
        this.shutdown = true;
        this.onChangeCallbacks.forEach(cb => cb());
    }
    // callback for useSyncExternalStore
    getSnapshot = () => {
        return this.shutdown;
    };
    // callback for useSyncExternalStore
    subscribe = (onStoreChange) => {
        this.onChangeCallbacks.add(onStoreChange);
        return () => {
            this.onChangeCallbacks.delete(onStoreChange);
        };
    };
}
function OutputRootComponent({ outputRoot, instanceStore, outputCtx, outputShutdownStateStore, }) {
    const shouldShutdown = useSyncExternalStore(outputShutdownStateStore.subscribe, outputShutdownStateStore.getSnapshot);
    if (shouldShutdown) {
        // replace root with view to stop all the dynamic code
        return createElement(View, {});
    }
    const reactCtx = {
        instanceStore,
        outputCtx,
    };
    return createElement(_liveCompositorInternals.LiveCompositorContext.Provider, { value: reactCtx }, outputRoot);
}
export default Output;
