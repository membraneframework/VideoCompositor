import { useContext, useState } from 'react';
import { LiveCompositorContext } from './index.js';
let nextStreamNumber = 1;
/*
 * Generates unique input stream id that can be used in e.g. Mp4 component
 */
export function useInternalStreamId() {
    const ctx = useContext(LiveCompositorContext);
    const [streamNumber, _setStreamNumber] = useState(() => {
        const result = nextStreamNumber;
        nextStreamNumber += 1;
        return result;
    });
    return `output-specific-input:${streamNumber}:${ctx.outputId}`;
}
export class LiveInputStreamStore {
    context = {};
    onChangeCallbacks = new Set();
    eventQueue;
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Apply update immediately if there are no `runBlocking` calls in progress.
     * Otherwise wait for `runBlocking call to finish`.
     */
    dispatchUpdate(update) {
        if (this.eventQueue) {
            this.eventQueue.push(update);
        }
        else {
            this.applyUpdate(update);
        }
    }
    /**
     * No dispatch events will be processed while `fn` function executes.
     * Argument passed to the callback should be used instead of `this.dispatchUpdate`
     * to update the store from inside `fn`
     */
    async runBlocking(fn) {
        this.eventQueue = [];
        try {
            return await fn(a => this.applyUpdate(a));
        }
        finally {
            for (const event of this.eventQueue) {
                this.applyUpdate(event);
            }
            this.eventQueue = undefined;
        }
    }
    applyUpdate(update) {
        if (update.type === 'add_input') {
            this.addInput(update.input);
        }
        else if (update.type === 'update_input') {
            this.updateInput(update.input);
        }
        else if (update.type === 'remove_input') {
            this.removeInput(update.inputId);
        }
    }
    addInput(input) {
        if (this.context[String(input.inputId)]) {
            this.logger.warn(`Adding input ${input.inputId}. Input already exists.`);
        }
        this.context = { ...this.context, [String(input.inputId)]: input };
        this.signalUpdate();
    }
    updateInput(update) {
        const oldInput = this.context[String(update.inputId)];
        if (!oldInput) {
            this.logger.warn(`Updating input ${update.inputId}. Input does not exist.`);
            return;
        }
        this.context = {
            ...this.context,
            [String(update.inputId)]: { ...oldInput, ...update },
        };
        this.signalUpdate();
    }
    removeInput(inputId) {
        const context = { ...this.context };
        delete context[String(inputId)];
        this.context = context;
        this.signalUpdate();
    }
    signalUpdate() {
        for (const cb of this.onChangeCallbacks) {
            cb();
        }
    }
    // callback for useSyncExternalStore
    getSnapshot = () => {
        return this.context;
    };
    // callback for useSyncExternalStore
    subscribe = (onStoreChange) => {
        this.onChangeCallbacks.add(onStoreChange);
        return () => {
            this.onChangeCallbacks.delete(onStoreChange);
        };
    };
}
export class OfflineInputStreamStore {
    context = {};
    inputs = [];
    onChangeCallbacks = new Set();
    addInput(update) {
        this.inputs.push(update);
    }
    // TimeContext should call that function. It will always trigger re-render, but there
    // is no point to optimize it right now.
    setCurrentTimestamp(timestampMs) {
        this.context = Object.fromEntries(this.inputs
            .filter(input => timestampMs >= input.offsetMs)
            .map(input => {
            // TODO: We could add "unknown" state if Mp4 duration is not known
            const inputState = {
                inputId: input.inputId,
                videoState: input.offsetMs + (input.videoDurationMs ?? 0) <= timestampMs ? 'finished' : 'playing',
                audioState: input.offsetMs + (input.audioDurationMs ?? 0) <= timestampMs ? 'finished' : 'playing',
                videoDurationMs: input.videoDurationMs,
                audioDurationMs: input.audioDurationMs,
                offsetMs: input.offsetMs,
            };
            return [input.inputId, inputState];
        }));
        this.signalUpdate();
    }
    signalUpdate() {
        for (const cb of this.onChangeCallbacks) {
            cb();
        }
    }
    // callback for useSyncExternalStore
    getSnapshot = () => {
        return this.context;
    };
    // callback for useSyncExternalStore
    subscribe = (onStoreChange) => {
        this.onChangeCallbacks.add(onStoreChange);
        return () => {
            this.onChangeCallbacks.delete(onStoreChange);
        };
    };
}
