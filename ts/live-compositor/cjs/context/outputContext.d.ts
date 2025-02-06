import type { AudioInputsConfiguration } from '../types/registerOutput.js';
export type ContextAudioOptions = {
    volume: number;
};
export type AudioConfig = AudioInputConfig[];
export type AudioInputConfig = {
    inputId: string;
    volumeComponents: ContextAudioOptions[];
};
export declare class OutputContext {
    private audioMixerConfig?;
    private onChange;
    constructor(onChange: () => void, supportsAudio: boolean);
    getAudioConfig(): AudioInputsConfiguration | undefined;
    addInputAudioComponent(inputId: string, options: ContextAudioOptions): void;
    removeInputAudioComponent(inputId: string, options: ContextAudioOptions): void;
}
