import type { InputRef } from '../types/refs/inputRef.js';
export type ContextAudioOptions = {
    volume: number;
};
export type AudioMixerState = AudioInputConfig[];
export type AudioInputConfig = {
    inputRef: InputRef;
    volumeComponents: ContextAudioOptions[];
};
export type AudioConfig = Array<{
    inputRef: InputRef;
    volume: number;
}>;
export declare class AudioContext {
    private audioMixerConfig;
    private onChange;
    constructor(onChange: () => void);
    getAudioConfig(): AudioConfig;
    addInputAudioComponent(inputRef: InputRef, options: ContextAudioOptions): void;
    removeInputAudioComponent(inputRef: InputRef, options: ContextAudioOptions): void;
}
