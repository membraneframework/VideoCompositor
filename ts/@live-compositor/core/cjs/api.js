"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = exports.Api = void 0;
const live_compositor_1 = require("live-compositor");
Object.defineProperty(exports, "Api", { enumerable: true, get: function () { return live_compositor_1.Api; } });
const input_js_1 = require("./api/input.js");
const image_js_1 = require("./api/image.js");
class ApiClient {
    constructor(serverManager) {
        this.serverManager = serverManager;
    }
    async updateScene(outputId, request) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/output/${encodeURIComponent(outputId)}/update`,
            body: request,
        });
    }
    async registerOutput(outputId, request) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/output/${encodeURIComponent(outputId)}/register`,
            body: request,
        });
    }
    async unregisterOutput(outputId, body) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/output/${encodeURIComponent(outputId)}/unregister`,
            body,
        });
    }
    async registerInput(inputId, request) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/input/${encodeURIComponent((0, input_js_1.inputRefIntoRawId)(inputId))}/register`,
            body: request,
        });
    }
    async unregisterInput(inputId, body) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/input/${encodeURIComponent((0, input_js_1.inputRefIntoRawId)(inputId))}/unregister`,
            body,
        });
    }
    async registerShader(shaderId, request) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/shader/${encodeURIComponent(shaderId)}/register`,
            body: request,
        });
    }
    async unregisterShader(shaderId) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/shader/${encodeURIComponent(shaderId)}/unregister`,
            body: {},
        });
    }
    async registerImage(imageRef, request) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/image/${encodeURIComponent((0, image_js_1.imageRefIntoRawId)(imageRef))}/register`,
            body: request,
        });
    }
    async unregisterImage(imageRef) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/image/${encodeURIComponent((0, image_js_1.imageRefIntoRawId)(imageRef))}/unregister`,
            body: {},
        });
    }
    async registerWebRenderer(instanceId, request) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/web-renderer/${encodeURIComponent(instanceId)}/register`,
            body: request,
        });
    }
    async unregisterWebRenderer(instanceId) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/web-renderer/${encodeURIComponent(instanceId)}/unregister`,
            body: {},
        });
    }
    async start() {
        await this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/start`,
            body: {},
        });
    }
}
exports.ApiClient = ApiClient;
