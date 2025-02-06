import type { Logger } from '../types/logger.js';
export declare function useInternalStreamId(): string;
export type StreamState = 'ready' | 'playing' | 'finished';
export type InputStreamInfo<Id> = {
    inputId: Id;
    videoState?: StreamState;
    audioState?: StreamState;
    offsetMs?: number | null;
    videoDurationMs?: number;
    audioDurationMs?: number;
};
type InstanceContext<Id = string> = Record<string, InputStreamInfo<Id>>;
export interface InputStreamStore<Id> {
    getSnapshot: () => InstanceContext<Id>;
    subscribe: (onStoreChange: () => void) => () => void;
}
type UpdateAction<Id> = {
    type: 'update_input';
    input: InputStreamInfo<Id>;
} | {
    type: 'add_input';
    input: InputStreamInfo<Id>;
} | {
    type: 'remove_input';
    inputId: Id;
};
export declare class LiveInputStreamStore<Id> {
    private context;
    private onChangeCallbacks;
    private eventQueue?;
    private logger;
    constructor(logger: Logger);
    /**
     * Apply update immediately if there are no `runBlocking` calls in progress.
     * Otherwise wait for `runBlocking call to finish`.
     */
    dispatchUpdate(update: UpdateAction<Id>): void;
    /**
     * No dispatch events will be processed while `fn` function executes.
     * Argument passed to the callback should be used instead of `this.dispatchUpdate`
     * to update the store from inside `fn`
     */
    runBlocking<T = void>(fn: (update: (action: UpdateAction<Id>) => void) => Promise<T>): Promise<T>;
    private applyUpdate;
    private addInput;
    private updateInput;
    private removeInput;
    private signalUpdate;
    getSnapshot: () => InstanceContext<Id>;
    subscribe: (onStoreChange: () => void) => (() => void);
}
type OfflineAddInput<Id> = {
    inputId: Id;
    offsetMs: number;
    videoDurationMs?: number;
    audioDurationMs?: number;
};
export declare class OfflineInputStreamStore<Id> {
    private context;
    private inputs;
    private onChangeCallbacks;
    addInput(update: OfflineAddInput<Id>): void;
    setCurrentTimestamp(timestampMs: number): void;
    private signalUpdate;
    getSnapshot: () => InstanceContext<Id>;
    subscribe: (onStoreChange: () => void) => (() => void);
}
export {};
