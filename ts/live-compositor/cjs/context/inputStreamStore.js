"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineInputStreamStore = exports.LiveInputStreamStore = void 0;
exports.useInternalStreamId = useInternalStreamId;
const react_1 = require("react");
const index_js_1 = require("./index.js");
let nextStreamNumber = 1;
/*
 * Generates unique input stream id that can be used in e.g. Mp4 component
 */
function useInternalStreamId() {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const [streamNumber, _setStreamNumber] = (0, react_1.useState)(() => {
        const result = nextStreamNumber;
        nextStreamNumber += 1;
        return result;
    });
    return `output-specific-input:${streamNumber}:${ctx.outputId}`;
}
class LiveInputStreamStore {
    constructor(logger) {
        this.context = {};
        this.onChangeCallbacks = new Set();
        // callback for useSyncExternalStore
        this.getSnapshot = () => {
            return this.context;
        };
        // callback for useSyncExternalStore
        this.subscribe = (onStoreChange) => {
            this.onChangeCallbacks.add(onStoreChange);
            return () => {
                this.onChangeCallbacks.delete(onStoreChange);
            };
        };
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
}
exports.LiveInputStreamStore = LiveInputStreamStore;
class OfflineInputStreamStore {
    constructor() {
        this.context = {};
        this.inputs = [];
        this.onChangeCallbacks = new Set();
        // callback for useSyncExternalStore
        this.getSnapshot = () => {
            return this.context;
        };
        // callback for useSyncExternalStore
        this.subscribe = (onStoreChange) => {
            this.onChangeCallbacks.add(onStoreChange);
            return () => {
                this.onChangeCallbacks.delete(onStoreChange);
            };
        };
    }
    addInput(update) {
        this.inputs.push(update);
    }
    // TimeContext should call that function. It will always trigger re-render, but there
    // is no point to optimize it right now.
    setCurrentTimestamp(timestampMs) {
        this.context = Object.fromEntries(this.inputs
            .filter(input => timestampMs >= input.offsetMs)
            .map(input => {
            var _a, _b;
            // TODO: We could add "unknown" state if Mp4 duration is not known
            const inputState = {
                inputId: input.inputId,
                videoState: input.offsetMs + ((_a = input.videoDurationMs) !== null && _a !== void 0 ? _a : 0) <= timestampMs ? 'finished' : 'playing',
                audioState: input.offsetMs + ((_b = input.audioDurationMs) !== null && _b !== void 0 ? _b : 0) <= timestampMs ? 'finished' : 'playing',
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
}
exports.OfflineInputStreamStore = OfflineInputStreamStore;
