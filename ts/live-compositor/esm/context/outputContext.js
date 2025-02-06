export class OutputContext {
    audioMixerConfig;
    onChange;
    constructor(onChange, supportsAudio) {
        this.audioMixerConfig = supportsAudio ? [] : undefined;
        this.onChange = onChange;
    }
    getAudioConfig() {
        if (!this.audioMixerConfig) {
            return undefined;
        }
        return {
            inputs: this.audioMixerConfig.map(input => ({
                inputId: input.inputId,
                volume: Math.min(input.volumeComponents.reduce((acc, opt) => acc + opt.volume, 0), 1.0),
            })),
        };
    }
    addInputAudioComponent(inputId, options) {
        if (!this.audioMixerConfig) {
            return;
        }
        const inputConfig = this.audioMixerConfig.find(input => input.inputId === inputId);
        if (inputConfig) {
            inputConfig.volumeComponents = [...inputConfig.volumeComponents, options];
        }
        else {
            this.audioMixerConfig = [
                ...this.audioMixerConfig,
                {
                    inputId,
                    volumeComponents: [options],
                },
            ];
        }
        this.onChange();
    }
    removeInputAudioComponent(inputId, options) {
        if (!this.audioMixerConfig) {
            return;
        }
        const inputConfig = this.audioMixerConfig.find(input => input.inputId === inputId);
        if (inputConfig) {
            // opt !== options compares objects by reference
            inputConfig.volumeComponents = inputConfig.volumeComponents.filter(opt => opt !== options);
            this.onChange();
        }
    }
}
