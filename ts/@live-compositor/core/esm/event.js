import { _liveCompositorInternals } from 'live-compositor';
import { parseInputRef } from './api/input.js';
export const CompositorEventType = _liveCompositorInternals.CompositorEventType;
export function parseEvent(event, logger) {
    if (!event.type) {
        logger.error(`Malformed event: ${event}`);
        return null;
    }
    else if ([
        CompositorEventType.VIDEO_INPUT_DELIVERED,
        CompositorEventType.AUDIO_INPUT_DELIVERED,
        CompositorEventType.VIDEO_INPUT_PLAYING,
        CompositorEventType.AUDIO_INPUT_PLAYING,
        CompositorEventType.VIDEO_INPUT_EOS,
        CompositorEventType.AUDIO_INPUT_EOS,
    ].includes(event.type)) {
        return { type: event.type, inputRef: parseInputRef(event.input_id) };
    }
    else if (CompositorEventType.OUTPUT_DONE === event.type) {
        return { type: event.type, outputId: event.output_id };
    }
    else {
        logger.error(`Unknown event type: ${event.type}`);
        return null;
    }
}
