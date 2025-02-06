import type { Renderers } from 'live-compositor';
import type { CompositorManager } from '../compositorManager.js';
import type { RegisterOutput } from '../api/output.js';
import type { RegisterInput } from '../api/input.js';
import type { ReactElement } from 'react';
import type { Logger } from 'pino';
export declare class LiveCompositor {
    private manager;
    private api;
    private store;
    private outputs;
    private startTime?;
    private logger;
    constructor(manager: CompositorManager, logger: Logger);
    init(): Promise<void>;
    registerOutput(outputId: string, root: ReactElement, request: RegisterOutput): Promise<object>;
    unregisterOutput(outputId: string): Promise<object>;
    registerInput(inputId: string, request: RegisterInput): Promise<object>;
    unregisterInput(inputId: string): Promise<object>;
    registerShader(shaderId: string, request: Renderers.RegisterShader): Promise<object>;
    unregisterShader(shaderId: string): Promise<object>;
    registerImage(imageId: string, request: Renderers.RegisterImage): Promise<object>;
    unregisterImage(imageId: string): Promise<object>;
    registerWebRenderer(instanceId: string, request: Renderers.RegisterWebRenderer): Promise<object>;
    unregisterWebRenderer(instanceId: string): Promise<object>;
    start(): Promise<void>;
    terminate(): Promise<void>;
    private handleEvent;
}
