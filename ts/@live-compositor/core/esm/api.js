import { Api } from 'live-compositor';
import { inputRefIntoRawId } from './api/input.js';
import { imageRefIntoRawId } from './api/image.js';
export { Api };
export class ApiClient {
    serverManager;
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
            route: `/api/input/${encodeURIComponent(inputRefIntoRawId(inputId))}/register`,
            body: request,
        });
    }
    async unregisterInput(inputId, body) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/input/${encodeURIComponent(inputRefIntoRawId(inputId))}/unregister`,
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
            route: `/api/image/${encodeURIComponent(imageRefIntoRawId(imageRef))}/register`,
            body: request,
        });
    }
    async unregisterImage(imageRef) {
        return this.serverManager.sendRequest({
            method: 'POST',
            route: `/api/image/${encodeURIComponent(imageRefIntoRawId(imageRef))}/unregister`,
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
