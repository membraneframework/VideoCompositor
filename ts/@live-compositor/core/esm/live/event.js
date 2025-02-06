import { CompositorEventType } from '../event.js';
export function handleEvent(store, outputs, event) {
    if (event.type === CompositorEventType.VIDEO_INPUT_DELIVERED) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'ready' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            outputs[event.inputRef.outputId]?.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'ready' },
            });
        }
    }
    else if (event.type === CompositorEventType.VIDEO_INPUT_PLAYING) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'playing' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            outputs[event.inputRef.outputId]?.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'playing' },
            });
        }
    }
    else if (event.type === CompositorEventType.VIDEO_INPUT_EOS) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'finished' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            outputs[event.inputRef.outputId]?.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, videoState: 'finished' },
            });
        }
    }
    else if (event.type === CompositorEventType.AUDIO_INPUT_DELIVERED) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'ready' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            outputs[event.inputRef.outputId]?.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'ready' },
            });
        }
    }
    else if (event.type === CompositorEventType.AUDIO_INPUT_PLAYING) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'playing' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            outputs[event.inputRef.outputId]?.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'playing' },
            });
        }
    }
    else if (event.type === CompositorEventType.AUDIO_INPUT_EOS) {
        if (event.inputRef.type === 'global') {
            store.dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'finished' },
            });
        }
        else if (event.inputRef.type === 'output-specific-input') {
            outputs[event.inputRef.outputId]?.inputStreamStore().dispatchUpdate({
                type: 'update_input',
                input: { inputId: event.inputRef.id, audioState: 'finished' },
            });
        }
    }
}
