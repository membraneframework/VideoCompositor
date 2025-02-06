import { _liveCompositorInternals } from 'live-compositor';
import { ApiClient } from '../api.js';
import Output from './output.js';
import { intoRegisterOutput } from '../api/output.js';
import { intoRegisterInput } from '../api/input.js';
import { parseEvent } from '../event.js';
import { intoRegisterImage, intoRegisterWebRenderer } from '../api/renderer.js';
import { handleEvent } from './event.js';
export class LiveCompositor {
    manager;
    api;
    store;
    outputs = {};
    startTime;
    logger;
    constructor(manager, logger) {
        this.manager = manager;
        this.api = new ApiClient(this.manager);
        this.store = new _liveCompositorInternals.LiveInputStreamStore(logger);
        this.logger = logger;
    }
    async init() {
        this.manager.registerEventListener((event) => this.handleEvent(event));
        await this.manager.setupInstance({
            aheadOfTimeProcessing: false,
            logger: this.logger.child({ element: 'connection-manager' }),
        });
    }
    async registerOutput(outputId, root, request) {
        this.logger.info({ outputId, type: request.type }, 'Register new output');
        const output = new Output(outputId, root, request, this.api, this.store, this.startTime, this.logger);
        const apiRequest = intoRegisterOutput(request, output.scene());
        const result = await this.api.registerOutput(outputId, apiRequest);
        this.outputs[outputId] = output;
        await output.ready();
        return result;
    }
    async unregisterOutput(outputId) {
        this.logger.info({ outputId }, 'Unregister output');
        await this.outputs[outputId].close();
        delete this.outputs[outputId];
        // TODO: wait for event
        return this.api.unregisterOutput(outputId, {});
    }
    async registerInput(inputId, request) {
        this.logger.info({ inputId, type: request.type }, 'Register new input');
        return this.store.runBlocking(async (updateStore) => {
            const inputRef = { type: 'global', id: inputId };
            const result = await this.api.registerInput(inputRef, intoRegisterInput(request));
            updateStore({
                type: 'add_input',
                input: {
                    inputId,
                    videoDurationMs: result.video_duration_ms,
                    audioDurationMs: result.audio_duration_ms,
                },
            });
            return result;
        });
    }
    async unregisterInput(inputId) {
        this.logger.info({ inputId }, 'Unregister input');
        return this.store.runBlocking(async (updateStore) => {
            const inputRef = { type: 'global', id: inputId };
            const result = this.api.unregisterInput(inputRef, {});
            updateStore({ type: 'remove_input', inputId });
            return result;
        });
    }
    async registerShader(shaderId, request) {
        this.logger.info({ shaderId }, 'Register shader');
        return this.api.registerShader(shaderId, request);
    }
    async unregisterShader(shaderId) {
        this.logger.info({ shaderId }, 'Unregister shader');
        return this.api.unregisterShader(shaderId);
    }
    async registerImage(imageId, request) {
        this.logger.info({ imageId }, 'Register image');
        const imageRef = { type: 'global', id: imageId };
        return this.api.registerImage(imageRef, intoRegisterImage(request));
    }
    async unregisterImage(imageId) {
        this.logger.info({ imageId }, 'Unregister image');
        const imageRef = { type: 'global', id: imageId };
        return this.api.unregisterImage(imageRef);
    }
    async registerWebRenderer(instanceId, request) {
        this.logger.info({ instanceId }, 'Register web renderer');
        return this.api.registerWebRenderer(instanceId, intoRegisterWebRenderer(request));
    }
    async unregisterWebRenderer(instanceId) {
        this.logger.info({ instanceId }, 'Unregister web renderer');
        return this.api.unregisterWebRenderer(instanceId);
    }
    async start() {
        this.logger.info('Start compositor instance.');
        const startTime = Date.now();
        await this.api.start();
        Object.values(this.outputs).forEach(output => {
            output.initClock(startTime);
        });
        this.startTime = startTime;
    }
    async terminate() {
        for (const output of Object.values(this.outputs)) {
            await output.close();
        }
        await this.manager.terminate();
    }
    handleEvent(rawEvent) {
        const event = parseEvent(rawEvent, this.logger);
        if (!event) {
            return;
        }
        this.logger.debug({ event }, 'New event received');
        handleEvent(this.store, this.outputs, event);
    }
}
