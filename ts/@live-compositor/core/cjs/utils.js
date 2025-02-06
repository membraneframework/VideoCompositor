"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottledFunction = void 0;
exports.sleep = sleep;
class ThrottledFunction {
    constructor(fn, opts) {
        this.shouldCall = false;
        this.runningPromise = undefined;
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
exports.ThrottledFunction = ThrottledFunction;
async function sleep(timeoutMs) {
    await new Promise(res => {
        setTimeout(() => {
            res();
        }, timeoutMs);
    });
}
