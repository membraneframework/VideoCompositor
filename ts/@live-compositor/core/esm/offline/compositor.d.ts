import type { Renderers } from 'live-compositor';
import type { CompositorManager } from '../compositorManager.js';
import type { RegisterOutput } from '../api/output.js';
import type { RegisterInput } from '../api/input.js';
import type { ReactElement } from 'react';
import type { Logger } from 'pino';
/**
 * Offline rendering only supports one output, so we can just pick any value to use
 * as an output ID.
 */
export declare const OFFLINE_OUTPUT_ID = "offline_output";
export declare class OfflineCompositor {
    private manager;
    private api;
    private store;
    private renderStarted;
    /**
     * Start and end timestamp of an inputs (if known).
     */
    private inputTimestamps;
    private logger;
    constructor(manager: CompositorManager, logger: Logger);
    init(): Promise<void>;
    render(root: ReactElement, request: RegisterOutput, durationMs?: number): Promise<void>;
    registerInput(inputId: string, request: RegisterInput): Promise<object>;
    registerShader(shaderId: string, request: Renderers.RegisterShader): Promise<object>;
    registerImage(imageId: string, request: Renderers.RegisterImage): Promise<object>;
    private checkNotStarted;
}
