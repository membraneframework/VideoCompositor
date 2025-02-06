import { areRefsEqual } from '../types/refs/utils.js';
export class AudioContext {
    audioMixerConfig;
    onChange;
    constructor(onChange) {
        this.audioMixerConfig = [];
        this.onChange = onChange;
    }
    getAudioConfig() {
        return this.audioMixerConfig.map(input => ({
            inputRef: input.inputRef,
            volume: Math.min(input.volumeComponents.reduce((acc, opt) => acc + opt.volume, 0), 1.0),
        }));
    }
    addInputAudioComponent(inputRef, options) {
        const inputConfig = this.audioMixerConfig.find(input => areRefsEqual(input.inputRef, inputRef));
        if (inputConfig) {
            inputConfig.volumeComponents = [...inputConfig.volumeComponents, options];
        }
        else {
            this.audioMixerConfig = [
                ...this.audioMixerConfig,
                {
                    inputRef,
                    volumeComponents: [options],
                },
            ];
        }
        this.onChange();
    }
    removeInputAudioComponent(inputRef, options) {
        const inputConfig = this.audioMixerConfig.find(input => areRefsEqual(input.inputRef, inputRef));
        if (inputConfig) {
            // opt !== options compares objects by reference
            inputConfig.volumeComponents = inputConfig.volumeComponents.filter(opt => opt !== options);
            this.onChange();
        }
    }
}
