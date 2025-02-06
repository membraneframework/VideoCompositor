export class ThrottledFunction {
    fn;
    shouldCall = false;
    runningPromise = undefined;
    opts;
    constructor(fn, opts) {
        this.opts = opts;
        this.fn = fn;
    }
    scheduleCall() {
        this.shouldCall = true;
        if (this.runningPromise) {
            return;
        }
        this.runningPromise = this.doCall();
    }
    async waitForPendingCalls() {
        while (this.runningPromise) {
            await this.runningPromise;
        }
    }
    setFn(fn) {
        this.fn = fn;
    }
    async doCall() {
        while (this.shouldCall) {
            const start = Date.now();
            this.shouldCall = false;
            try {
                await this.fn();
            }
            catch (error) {
                this.opts.logger.error(error);
            }
            const timeoutLeft = start + this.opts.timeoutMs - Date.now();
            if (timeoutLeft > 0) {
                await sleep(timeoutLeft);
            }
            this.runningPromise = undefined;
        }
    }
}
export async function sleep(timeoutMs) {
    await new Promise(res => {
        setTimeout(() => {
            res();
        }, timeoutMs);
    });
}
