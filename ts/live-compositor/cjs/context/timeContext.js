"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveTimeContext = exports.OfflineTimeContext = void 0;
class OfflineTimeContext {
    constructor(onChange, onTimeChange, logger) {
        this.currentTimestamp = 0;
        this.onChangeCallbacks = new Set();
        // callback for useSyncExternalStore
        this.getSnapshot = () => {
            return this.currentTimestamp;
        };
        // callback for useSyncExternalStore
        this.subscribe = (onStoreChange) => {
            this.onChangeCallbacks.add(onStoreChange);
            return () => {
                this.onChangeCallbacks.delete(onStoreChange);
            };
        };
        this.onChange = onChange;
        this.tasks = [];
        this.timestamps = [];
        this.onChangeCallbacks.add(() => {
            onTimeChange(this.currentTimestamp);
        });
        this.logger = logger;
    }
    timestampMs() {
        return this.currentTimestamp;
    }
    isBlocked() {
        return this.tasks.length !== 0;
    }
    newBlockingTask() {
        this.logger.trace('Start new blocking task');
        const task = {};
        task.done = () => {
            const originalLength = this.tasks.length;
            this.tasks = this.tasks.filter(t => t !== task);
            if (this.tasks.length < originalLength) {
                this.logger.trace('Blocking task finished');
            }
            if (this.tasks.length === 0) {
                this.onChange();
            }
        };
        this.tasks.push(task);
        return task;
    }
    addTimestamp(timestamp) {
        this.logger.trace({ timestampMs: timestamp.timestamp }, 'Add new timestamp to render.');
        this.timestamps.push(timestamp);
    }
    removeTimestamp(timestamp) {
        this.logger.trace({ timestampMs: timestamp.timestamp }, 'Remove timestamp to render.');
        this.timestamps = this.timestamps.filter(t => timestamp !== t);
    }
    setNextTimestamp() {
        const next = this.timestamps.reduce((acc, value) => value.timestamp < acc.timestamp && value.timestamp > this.currentTimestamp ? value : acc, { timestamp: Infinity });
        this.logger.debug({ timestampMs: next.timestamp }, 'Rendering new timestamp');
        this.currentTimestamp = next.timestamp;
        for (const cb of this.onChangeCallbacks) {
            cb();
        }
        this.logger.trace({ timestampMs: next.timestamp }, 'Callbacks for timestamp finished');
    }
}
exports.OfflineTimeContext = OfflineTimeContext;
class LiveTimeContext {
    constructor() {
        this.startTimestampMs = 0;
        this.onChangeCallbacks = new Set();
        // callback for useSyncExternalStore
        this.getSnapshot = () => {
            return this.timestampMs();
        };
        // callback for useSyncExternalStore
        this.subscribe = (onStoreChange) => {
            this.onChangeCallbacks.add(onStoreChange);
            return () => {
                this.onChangeCallbacks.delete(onStoreChange);
            };
        };
        this.timestamps = [];
    }
    timestampMs() {
        return this.startTimestampMs ? Date.now() - this.startTimestampMs : 0;
    }
    initClock(timestamp) {
        this.startTimestampMs = timestamp;
    }
    addTimestamp(timestamp) {
        this.timestamps.push({ timestamp, timeout: this.scheduleChangeNotification(timestamp) });
    }
    removeTimestamp(timestamp) {
        const removed = this.timestamps.filter(t => timestamp === t.timestamp);
        this.timestamps = this.timestamps.filter(t => timestamp !== t.timestamp);
        removed.forEach(ts => clearTimeout(ts.timeout));
    }
    scheduleChangeNotification(timestamp) {
        const timeLeft = timestamp.timestamp - this.timestampMs();
        if (timeLeft < 0) {
            return;
        }
        return setTimeout(() => {
            for (const cb of this.onChangeCallbacks) {
                cb();
            }
        }, timeLeft + 100);
    }
}
exports.LiveTimeContext = LiveTimeContext;
