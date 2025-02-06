"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInputStreams = useInputStreams;
exports.useAudioInput = useAudioInput;
exports.useCurrentTimestamp = useCurrentTimestamp;
exports.useAfterTimestamp = useAfterTimestamp;
exports.newBlockingTask = newBlockingTask;
exports.useBlockingTask = useBlockingTask;
const react_1 = require("react");
const index_js_1 = require("./context/index.js");
const timeContext_js_1 = require("./context/timeContext.js");
function useInputStreams() {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const instanceCtx = (0, react_1.useSyncExternalStore)(ctx.globalInputStreamStore.subscribe, ctx.globalInputStreamStore.getSnapshot);
    return instanceCtx;
}
/**
 * Hook used to control audio configuration. If you already placing InputStream component
 * you can use `muted` and `volume` props instead.
 */
function useAudioInput(inputId, audioOptions) {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    (0, react_1.useEffect)(() => {
        const options = { ...audioOptions };
        ctx.audioContext.addInputAudioComponent({ type: 'global', id: inputId }, options);
        return () => {
            ctx.audioContext.removeInputAudioComponent({ type: 'global', id: inputId }, options);
        };
    }, [audioOptions]);
}
/**
 *  Returns current timestamp relative to `LiveCompositor.start()`.
 *
 *  Not recommended for live processing. It triggers re-renders only for specific timestamps
 *  that are registered with `useAfterTimestamp` hook(that includes components like Slide/Show).
 */
function useCurrentTimestamp() {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const timeContext = ctx.timeContext;
    (0, react_1.useSyncExternalStore)(timeContext.subscribe, timeContext.getSnapshot);
    // Value from useSyncExternalStore is the same as TimeContext.timestampMs for
    // offline processing, but for live `timestampMs` should be up to date.
    return timeContext.timestampMs();
}
/**
 * Hook that allows you to trigger updates after specific timestamp. Primary useful for
 * offline processing.
 */
function useAfterTimestamp(timestamp) {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const currentTimestamp = useCurrentTimestamp();
    (0, react_1.useEffect)(() => {
        if (timestamp === Infinity) {
            return;
        }
        const tsObject = { timestamp };
        ctx.timeContext.addTimestamp(tsObject);
        return () => {
            ctx.timeContext.removeTimestamp(tsObject);
        };
    }, [timestamp]);
    return currentTimestamp >= timestamp;
}
/**
 * Create task that will stop rendering when compositor runs in offline mode.
 *
 * `task.done()` needs to be called when async action is finished, otherwise rendering will block indefinitely.
 */
function newBlockingTask(ctx) {
    if (ctx.timeContext instanceof timeContext_js_1.OfflineTimeContext) {
        return ctx.timeContext.newBlockingTask();
    }
    else {
        return { done: () => null };
    }
}
/**
 *  Run async function and return its result after Promise resolves.
 *
 *  For offline processing it additionally ensures that rendering for that
 *  timestamp  will block until all blocking tasks are done.
 */
function useBlockingTask(fn) {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const [result, setResult] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        const task = newBlockingTask(ctx);
        void (async () => {
            try {
                setResult(await fn());
            }
            finally {
                task.done();
            }
        })();
        return () => {
            task.done();
        };
    }, []);
    return result;
}
