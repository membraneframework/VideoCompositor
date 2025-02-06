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
exports.LiveCompositor = void 0;
const live_compositor_1 = require("live-compositor");
const api_js_1 = require("./api.js");
const output_js_1 = __importDefault(require("./output.js"));
const output_js_2 = require("./api/output.js");
const input_js_1 = require("./api/input.js");
const event_js_1 = require("./event.js");
const renderer_js_1 = require("./api/renderer.js");
class LiveCompositor {
    constructor(manager) {
        this.outputs = {};
        this.manager = manager;
        this.api = new api_js_1.ApiClient(this.manager);
        this.store = new live_compositor_1._liveCompositorInternals.InstanceContextStore();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.manager.registerEventListener((event) => (0, event_js_1.onCompositorEvent)(this.store, event));
            yield this.manager.setupInstance();
        });
    }
    registerOutput(outputId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = new output_js_1.default(outputId, request, this.api, this.store);
            const apiRequest = (0, output_js_2.intoRegisterOutput)(request, output.scene());
            const result = yield this.api.registerOutput(outputId, apiRequest);
            this.outputs[outputId] = output;
            yield output.ready();
            return result;
        });
    }
    unregisterOutput(outputId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.outputs[outputId].close();
            delete this.outputs[outputId];
            return this.api.unregisterOutput(outputId);
        });
    }
    registerInput(inputId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.runBlocking((updateStore) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.api.registerInput(inputId, (0, input_js_1.intoRegisterInput)(request));
                updateStore({ type: 'add_input', input: { inputId } });
                return result;
            }));
        });
    }
    unregisterInput(inputId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.runBlocking((updateStore) => __awaiter(this, void 0, void 0, function* () {
                const result = this.api.unregisterInput(inputId);
                updateStore({ type: 'remove_input', inputId });
                return result;
            }));
        });
    }
    registerShader(shaderId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.registerShader(shaderId, request);
        });
    }
    unregisterShader(shaderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.unregisterShader(shaderId);
        });
    }
    registerImage(imageId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.registerImage(imageId, (0, renderer_js_1.intoRegisterImage)(request));
        });
    }
    unregisterImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.unregisterImage(imageId);
        });
    }
    registerWebRenderer(instanceId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.registerWebRenderer(instanceId, (0, renderer_js_1.intoRegisterWebRenderer)(request));
        });
    }
    unregisterWebRenderer(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.unregisterWebRenderer(instanceId);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.start();
        });
    }
}
exports.LiveCompositor = LiveCompositor;
