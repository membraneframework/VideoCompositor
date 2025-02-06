import type * as Api from '../api.js';
export type StreamState = 'ready' | 'playing' | 'finished';
export type InputStreamInfo = {
    inputId: string;
    videoState?: StreamState;
    audioState?: StreamState;
};
type UpdateAction = {
    type: 'update_input';
    input: InputStreamInfo;
} | {
    type: 'add_input';
    input: InputStreamInfo;
} | {
    type: 'remove_input';
    inputId: string;
};
type InstanceContext = {
    inputs: Record<Api.InputId, InputStreamInfo>;
};
export declare class InstanceContextStore {
    private context;
    private onChangeCallbacks;
    private eventQueue?;
    /**
     * Apply update immediately if there are no `runBlocking` calls in progress.
     * Otherwise wait for `runBlocking call to finish`.
     */
    dispatchUpdate(update: UpdateAction): void;
    /**
     * No dispatch events will be processed while `fn` function executes.
     * Argument passed to the callback should be used instead of `this.dispatchUpdate`
     * to update the store from inside `fn`
     */
    runBlocking<T = void>(fn: (update: (action: UpdateAction) => void) => Promise<T>): Promise<T>;
    private applyUpdate;
    private addInput;
    private updateInput;
    private removeInput;
    private signalUpdate;
    getSnapshot: () => InstanceContext;
    subscribe: (onStoreChange: () => void) => (() => void);
}
export {};
