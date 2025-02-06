"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineCompositor = exports.OFFLINE_OUTPUT_ID = void 0;
const live_compositor_1 = require("live-compositor");
const api_js_1 = require("../api.js");
const output_js_1 = require("../api/output.js");
const input_js_1 = require("../api/input.js");
const renderer_js_1 = require("../api/renderer.js");
const output_js_2 = __importDefault(require("./output.js"));
const event_js_1 = require("../event.js");
/**
 * Offline rendering only supports one output, so we can just pick any value to use
 * as an output ID.
 */
exports.OFFLINE_OUTPUT_ID = 'offline_output';
class OfflineCompositor {
    constructor(manager, logger) {
        this.renderStarted = false;
        /**
         * Start and end timestamp of an inputs (if known).
         */
        this.inputTimestamps = [];
        this.manager = manager;
        this.api = new api_js_1.ApiClient(this.manager);
        this.store = new live_compositor_1._liveCompositorInternals.OfflineInputStreamStore();
        this.logger = logger;
    }
    async init() {
        this.checkNotStarted();
        await this.manager.setupInstance({
            aheadOfTimeProcessing: true,
            logger: this.logger.child({ element: 'connection-manager' }),
        });
    }
    async render(root, request, durationMs) {
        this.checkNotStarted();
        this.renderStarted = true;
        const output = new output_js_2.default(root, request, this.api, this.store, this.logger, durationMs);
        for (const inputTimestamp of this.inputTimestamps) {
            output.timeContext.addTimestamp({ timestamp: inputTimestamp });
        }
        const apiRequest = (0, output_js_1.intoRegisterOutput)(request, output.scene());
        await this.api.registerOutput(exports.OFFLINE_OUTPUT_ID, apiRequest);
        await output.scheduleAllUpdates();
        // at this point all scene update requests should already be delivered
        if (durationMs) {
            await this.api.unregisterOutput(exports.OFFLINE_OUTPUT_ID, { schedule_time_ms: durationMs });
        }
        const renderPromise = new Promise((res, _rej) => {
            this.manager.registerEventListener(rawEvent => {
                const event = (0, event_js_1.parseEvent)(rawEvent, this.logger);
                if (event &&
                    event.type === event_js_1.CompositorEventType.OUTPUT_DONE &&
                    event.outputId === exports.OFFLINE_OUTPUT_ID) {
                    res();
                }
            });
        });
        await this.api.start();
        await renderPromise;
        await this.manager.terminate();
    }
    async registerInput(inputId, request) {
        var _a, _b, _c, _d;
        this.checkNotStarted();
        this.logger.info({ inputId, type: request.type }, 'Register new input');
        const inputRef = { type: 'global', id: inputId };
        const result = await this.api.registerInput(inputRef, (0, input_js_1.intoRegisterInput)(request));
        if (request.type === 'mp4' && request.loop) {
            this.store.addInput({
                inputId,
                offsetMs: (_a = request.offsetMs) !== null && _a !== void 0 ? _a : 0,
                videoDurationMs: Infinity,
                audioDurationMs: Infinity,
            });
        }
        else {
            this.store.addInput({
                inputId,
                offsetMs: (_b = request.offsetMs) !== null && _b !== void 0 ? _b : 0,
                videoDurationMs: result.video_duration_ms,
                audioDurationMs: result.audio_duration_ms,
            });
            if (request.offsetMs) {
                this.inputTimestamps.push(request.offsetMs);
            }
            if (result.video_duration_ms) {
                this.inputTimestamps.push(((_c = request.offsetMs) !== null && _c !== void 0 ? _c : 0) + result.video_duration_ms);
            }
            if (result.audio_duration_ms) {
                this.inputTimestamps.push(((_d = request.offsetMs) !== null && _d !== void 0 ? _d : 0) + result.audio_duration_ms);
            }
        }
        return result;
    }
    async registerShader(shaderId, request) {
        this.checkNotStarted();
        this.logger.info({ shaderId }, 'Register shader');
        return this.api.registerShader(shaderId, request);
    }
    async registerImage(imageId, request) {
        this.checkNotStarted();
        this.logger.info({ imageId }, 'Register image');
        const imageRef = { type: 'global', id: imageId };
        return this.api.registerImage(imageRef, (0, renderer_js_1.intoRegisterImage)(request));
    }
    checkNotStarted() {
        if (this.renderStarted) {
            throw new Error('Render was already started.');
        }
    }
}
exports.OfflineCompositor = OfflineCompositor;
