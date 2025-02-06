import { _liveCompositorInternals } from 'live-compositor';
import { ApiClient } from './api.js';
import Output from './output.js';
import { intoRegisterOutput } from './api/output.js';
import { intoRegisterInput } from './api/input.js';
import { onCompositorEvent } from './event.js';
import { intoRegisterImage, intoRegisterWebRenderer } from './api/renderer.js';
export class LiveCompositor {
    manager;
    api;
    store;
    outputs = {};
    constructor(manager) {
        this.manager = manager;
        this.api = new ApiClient(this.manager);
        this.store = new _liveCompositorInternals.InstanceContextStore();
    }
    async init() {
        this.manager.registerEventListener((event) => onCompositorEvent(this.store, event));
        await this.manager.setupInstance();
    }
    async registerOutput(outputId, request) {
        const output = new Output(outputId, request, this.api, this.store);
        const apiRequest = intoRegisterOutput(request, output.scene());
        const result = await this.api.registerOutput(outputId, apiRequest);
        this.outputs[outputId] = output;
        await output.ready();
        return result;
    }
    async unregisterOutput(outputId) {
        this.outputs[outputId].close();
        delete this.outputs[outputId];
        return this.api.unregisterOutput(outputId);
    }
    async registerInput(inputId, request) {
        return this.store.runBlocking(async (updateStore) => {
            const result = await this.api.registerInput(inputId, intoRegisterInput(request));
            updateStore({ type: 'add_input', input: { inputId } });
            return result;
        });
    }
    async unregisterInput(inputId) {
        return this.store.runBlocking(async (updateStore) => {
            const result = this.api.unregisterInput(inputId);
            updateStore({ type: 'remove_input', inputId });
            return result;
        });
    }
    async registerShader(shaderId, request) {
        return this.api.registerShader(shaderId, request);
    }
    async unregisterShader(shaderId) {
        return this.api.unregisterShader(shaderId);
    }
    async registerImage(imageId, request) {
        return this.api.registerImage(imageId, intoRegisterImage(request));
    }
    async unregisterImage(imageId) {
        return this.api.unregisterImage(imageId);
    }
    async registerWebRenderer(instanceId, request) {
        return this.api.registerWebRenderer(instanceId, intoRegisterWebRenderer(request));
    }
    async unregisterWebRenderer(instanceId) {
        return this.api.unregisterWebRenderer(instanceId);
    }
    async start() {
        return this.api.start();
    }
}
