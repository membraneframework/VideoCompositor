import { _liveCompositorInternals } from 'live-compositor';
import { ApiClient } from '../api.js';
import { intoRegisterOutput } from '../api/output.js';
import { intoRegisterInput } from '../api/input.js';
import { intoRegisterImage } from '../api/renderer.js';
import OfflineOutput from './output.js';
import { CompositorEventType, parseEvent } from '../event.js';
/**
 * Offline rendering only supports one output, so we can just pick any value to use
 * as an output ID.
 */
export const OFFLINE_OUTPUT_ID = 'offline_output';
export class OfflineCompositor {
    manager;
    api;
    store;
    renderStarted = false;
    /**
     * Start and end timestamp of an inputs (if known).
     */
    inputTimestamps = [];
    logger;
    constructor(manager, logger) {
        this.manager = manager;
        this.api = new ApiClient(this.manager);
        this.store = new _liveCompositorInternals.OfflineInputStreamStore();
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
        const output = new OfflineOutput(root, request, this.api, this.store, this.logger, durationMs);
        for (const inputTimestamp of this.inputTimestamps) {
            output.timeContext.addTimestamp({ timestamp: inputTimestamp });
        }
        const apiRequest = intoRegisterOutput(request, output.scene());
        await this.api.registerOutput(OFFLINE_OUTPUT_ID, apiRequest);
        await output.scheduleAllUpdates();
        // at this point all scene update requests should already be delivered
        if (durationMs) {
            await this.api.unregisterOutput(OFFLINE_OUTPUT_ID, { schedule_time_ms: durationMs });
        }
        const renderPromise = new Promise((res, _rej) => {
            this.manager.registerEventListener(rawEvent => {
                const event = parseEvent(rawEvent, this.logger);
                if (event &&
                    event.type === CompositorEventType.OUTPUT_DONE &&
                    event.outputId === OFFLINE_OUTPUT_ID) {
                    res();
                }
            });
        });
        await this.api.start();
        await renderPromise;
        await this.manager.terminate();
    }
    async registerInput(inputId, request) {
        this.checkNotStarted();
        this.logger.info({ inputId, type: request.type }, 'Register new input');
        const inputRef = { type: 'global', id: inputId };
        const result = await this.api.registerInput(inputRef, intoRegisterInput(request));
        if (request.type === 'mp4' && request.loop) {
            this.store.addInput({
                inputId,
                offsetMs: request.offsetMs ?? 0,
                videoDurationMs: Infinity,
                audioDurationMs: Infinity,
            });
        }
        else {
            this.store.addInput({
                inputId,
                offsetMs: request.offsetMs ?? 0,
                videoDurationMs: result.video_duration_ms,
                audioDurationMs: result.audio_duration_ms,
            });
            if (request.offsetMs) {
                this.inputTimestamps.push(request.offsetMs);
            }
            if (result.video_duration_ms) {
                this.inputTimestamps.push((request.offsetMs ?? 0) + result.video_duration_ms);
            }
            if (result.audio_duration_ms) {
                this.inputTimestamps.push((request.offsetMs ?? 0) + result.audio_duration_ms);
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
        return this.api.registerImage(imageRef, intoRegisterImage(request));
    }
    checkNotStarted() {
        if (this.renderStarted) {
            throw new Error('Render was already started.');
        }
    }
}
