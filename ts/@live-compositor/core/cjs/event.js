"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositorEventType = void 0;
exports.parseEvent = parseEvent;
const live_compositor_1 = require("live-compositor");
const input_js_1 = require("./api/input.js");
exports.CompositorEventType = live_compositor_1._liveCompositorInternals.CompositorEventType;
function parseEvent(event, logger) {
    if (!event.type) {
        logger.error(`Malformed event: ${event}`);
        return null;
    }
    else if ([
        exports.CompositorEventType.VIDEO_INPUT_DELIVERED,
        exports.CompositorEventType.AUDIO_INPUT_DELIVERED,
        exports.CompositorEventType.VIDEO_INPUT_PLAYING,
        exports.CompositorEventType.AUDIO_INPUT_PLAYING,
        exports.CompositorEventType.VIDEO_INPUT_EOS,
        exports.CompositorEventType.AUDIO_INPUT_EOS,
    ].includes(event.type)) {
        return { type: event.type, inputRef: (0, input_js_1.parseInputRef)(event.input_id) };
    }
    else if (exports.CompositorEventType.OUTPUT_DONE === event.type) {
        return { type: event.type, outputId: event.output_id };
    }
    else {
        logger.error(`Unknown event type: ${event.type}`);
        return null;
    }
}
