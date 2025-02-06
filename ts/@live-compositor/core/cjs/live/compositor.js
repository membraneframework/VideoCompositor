"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveCompositor = void 0;
const live_compositor_1 = require("live-compositor");
const api_js_1 = require("../api.js");
const output_js_1 = __importDefault(require("./output.js"));
const output_js_2 = require("../api/output.js");
const input_js_1 = require("../api/input.js");
const event_js_1 = require("../event.js");
const renderer_js_1 = require("../api/renderer.js");
const event_js_2 = require("./event.js");
class LiveCompositor {
    constructor(manager, logger) {
        this.outputs = {};
        this.manager = manager;
        this.api = new api_js_1.ApiClient(this.manager);
        this.store = new live_compositor_1._liveCompositorInternals.LiveInputStreamStore(logger);
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
        const output = new output_js_1.default(outputId, root, request, this.api, this.store, this.startTime, this.logger);
        const apiRequest = (0, output_js_2.intoRegisterOutput)(request, output.scene());
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
            const result = await this.api.registerInput(inputRef, (0, input_js_1.intoRegisterInput)(request));
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
        return this.api.registerImage(imageRef, (0, renderer_js_1.intoRegisterImage)(request));
    }
    async unregisterImage(imageId) {
        this.logger.info({ imageId }, 'Unregister image');
        const imageRef = { type: 'global', id: imageId };
        return this.api.unregisterImage(imageRef);
    }
    async registerWebRenderer(instanceId, request) {
        this.logger.info({ instanceId }, 'Register web renderer');
        return this.api.registerWebRenderer(instanceId, (0, renderer_js_1.intoRegisterWebRenderer)(request));
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
        const event = (0, event_js_1.parseEvent)(rawEvent, this.logger);
        if (!event) {
            return;
        }
        this.logger.debug({ event }, 'New event received');
        (0, event_js_2.handleEvent)(this.store, this.outputs, event);
    }
}
exports.LiveCompositor = LiveCompositor;
