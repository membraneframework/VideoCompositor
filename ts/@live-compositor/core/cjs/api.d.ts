import { Api } from 'live-compositor';
import type { CompositorManager } from './compositorManager.js';
import type { RegisterOutputRequest } from './api/output.js';
import { type InputRef, type RegisterInputRequest } from './api/input.js';
import { type ImageRef } from './api/image.js';
export { Api };
export type ApiRequest = {
    method: 'GET' | 'POST';
    route: string;
    body?: object;
};
export type RegisterInputResponse = {
    video_duration_ms?: number;
    audio_duration_ms?: number;
};
export declare class ApiClient {
    private serverManager;
    constructor(serverManager: CompositorManager);
    updateScene(outputId: string, request: Api.UpdateOutputRequest): Promise<object>;
    registerOutput(outputId: string, request: RegisterOutputRequest): Promise<object>;
    unregisterOutput(outputId: string, body: {
        schedule_time_ms?: number;
    }): Promise<object>;
    registerInput(inputId: InputRef, request: RegisterInputRequest): Promise<RegisterInputResponse>;
    unregisterInput(inputId: InputRef, body: {
        schedule_time_ms?: number;
    }): Promise<object>;
    registerShader(shaderId: string, request: Api.ShaderSpec): Promise<object>;
    unregisterShader(shaderId: string): Promise<object>;
    registerImage(imageRef: ImageRef, request: Api.ImageSpec): Promise<object>;
    unregisterImage(imageRef: ImageRef): Promise<object>;
    registerWebRenderer(instanceId: string, request: Api.WebRendererSpec): Promise<object>;
    unregisterWebRenderer(instanceId: string): Promise<object>;
    start(): Promise<void>;
}
