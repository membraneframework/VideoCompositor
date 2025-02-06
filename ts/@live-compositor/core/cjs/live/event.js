"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEvent = handleEvent;
const event_js_1 = require("../event.js");
function handleEvent(store, outputs, event) {
    var _a, _b, _c, _d, _e, _f;
    if (event.type === event_js_1.CompositorEventType.VIDEO_INPUT_DELIVERED) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'ready' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            (_a = outputs[event.inputRef.outputId]) === null || _a === void 0 ? void 0 : _a.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'ready' },
            });
        }
    }
    else if (event.type === event_js_1.CompositorEventType.VIDEO_INPUT_PLAYING) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'playing' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            (_b = outputs[event.inputRef.outputId]) === null || _b === void 0 ? void 0 : _b.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'playing' },
            });
        }
    }
    else if (event.type === event_js_1.CompositorEventType.VIDEO_INPUT_EOS) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'finished' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            (_c = outputs[event.inputRef.outputId]) === null || _c === void 0 ? void 0 : _c.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'finished' },
            });
        }
    }
    else if (event.type === event_js_1.CompositorEventType.AUDIO_INPUT_DELIVERED) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'ready' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            (_d = outputs[event.inputRef.outputId]) === null || _d === void 0 ? void 0 : _d.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'ready' },
            });
        }
    }
    else if (event.type === event_js_1.CompositorEventType.AUDIO_INPUT_PLAYING) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'playing' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            (_e = outputs[event.inputRef.outputId]) === null || _e === void 0 ? void 0 : _e.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'playing' },
            });
        }
    }
    else if (event.type === event_js_1.CompositorEventType.AUDIO_INPUT_EOS) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'finished' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            (_f = outputs[event.inputRef.outputId]) === null || _f === void 0 ? void 0 : _f.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'finished' },
            });
        }
    }
}
