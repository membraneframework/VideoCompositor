import type { Logger } from '../internal.js';
export interface BlockingTask {
    done(): void;
}
export interface TimeContext {
    timestampMs(): number;
    addTimestamp(timestamp: TimestampObject): void;
    removeTimestamp(timestamp: TimestampObject): void;
    getSnapshot: () => number;
    subscribe: (onStoreChange: () => void) => () => void;
}
type TimestampObject = {
    timestamp: number;
};
export declare class OfflineTimeContext {
    private timestamps;
    private tasks;
    private onChange;
    private currentTimestamp;
    private onChangeCallbacks;
    private logger;
    constructor(onChange: () => void, onTimeChange: (timestamp: number) => void, logger: Logger);
    timestampMs(): number;
    isBlocked(): boolean;
    newBlockingTask(): BlockingTask;
    addTimestamp(timestamp: TimestampObject): void;
    removeTimestamp(timestamp: TimestampObject): void;
    setNextTimestamp(): void;
    getSnapshot: () => number;
    subscribe: (onStoreChange: () => void) => (() => void);
}
export declare class LiveTimeContext {
    private startTimestampMs;
    private timestamps;
    private onChangeCallbacks;
    constructor();
    timestampMs(): number;
    initClock(timestamp: number): void;
    addTimestamp(timestamp: TimestampObject): void;
    removeTimestamp(timestamp: TimestampObject): void;
    private scheduleChangeNotification;
    getSnapshot: () => number;
    subscribe: (onStoreChange: () => void) => (() => void);
}
export {};
