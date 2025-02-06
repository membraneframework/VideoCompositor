import type { Logger } from 'pino';
type ThrottleOptions = {
    logger: Logger;
    timeoutMs: number;
};
export declare class ThrottledFunction {
    private fn;
    private shouldCall;
    private runningPromise?;
    private opts;
    constructor(fn: () => Promise<void>, opts: ThrottleOptions);
    scheduleCall(): void;
    waitForPendingCalls(): Promise<void>;
    setFn(fn: () => Promise<void>): void;
    private doCall;
}
export declare function sleep(timeoutMs: number): Promise<void>;
export {};
