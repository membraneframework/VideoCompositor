"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const hooks_js_1 = require("../hooks.js");
const index_js_1 = require("../context/index.js");
const internal_js_1 = require("../internal.js");
const InputStream_js_1 = require("./InputStream.js");
const internalStreamIdManager_js_1 = require("../context/internalStreamIdManager.js");
const childrenLifetimeContext_js_1 = require("../context/childrenLifetimeContext.js");
function Mp4(props) {
    const { muted, volume, ...otherProps } = props;
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const [inputId, setInputId] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const newInputId = (0, internalStreamIdManager_js_1.newInternalStreamId)();
        setInputId(newInputId);
        const task = (0, hooks_js_1.newBlockingTask)(ctx);
        const pathOrUrl = props.source.startsWith('http://') || props.source.startsWith('https://')
            ? { url: props.source }
            : { path: props.source };
        let registerPromise;
        void (async () => {
            try {
                registerPromise = ctx.registerMp4Input(newInputId, {
                    ...pathOrUrl,
                    required: ctx.timeContext instanceof internal_js_1.OfflineTimeContext,
                    // offsetMs will be overridden by registerMp4Input implementation
                });
                await registerPromise;
            }
            finally {
                task.done();
            }
        })();
        return () => {
            task.done();
            void (async () => {
                await registerPromise.catch(() => { });
                await ctx.unregisterMp4Input(newInputId);
            })();
        };
    }, [props.source]);
    useInternalAudioInput(inputId, muted ? 0 : (volume !== null && volume !== void 0 ? volume : 1));
    useTimeLimitedMp4(inputId);
    return (0, react_1.createElement)(InputStream_js_1.InnerInputStream, {
        ...otherProps,
        inputId: (0, internal_js_1.inputRefIntoRawId)({
            type: 'output-specific-input',
            id: inputId,
            outputId: ctx.outputId,
        }),
    });
}
function useInternalAudioInput(inputId, volume) {
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    (0, react_1.useEffect)(() => {
        if (inputId === 0) {
            return;
        }
        const options = { volume };
        ctx.audioContext.addInputAudioComponent({ type: 'output-specific-input', id: inputId, outputId: ctx.outputId }, options);
        return () => {
            ctx.audioContext.removeInputAudioComponent({ type: 'output-specific-input', id: inputId, outputId: ctx.outputId }, options);
        };
    }, [inputId, volume]);
}
function useTimeLimitedMp4(inputId) {
    var _a, _b, _c, _d;
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const [startTime, setStartTime] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        setStartTime(ctx.timeContext.timestampMs());
    }, [inputId]);
    const internalStreams = (0, react_1.useSyncExternalStore)(ctx.internalInputStreamStore.subscribe, ctx.internalInputStreamStore.getSnapshot);
    const input = internalStreams[String(inputId)];
    (0, childrenLifetimeContext_js_1.useTimeLimitedComponent)(((_a = input === null || input === void 0 ? void 0 : input.offsetMs) !== null && _a !== void 0 ? _a : startTime) + ((_b = input === null || input === void 0 ? void 0 : input.videoDurationMs) !== null && _b !== void 0 ? _b : 0));
    (0, childrenLifetimeContext_js_1.useTimeLimitedComponent)(((_c = input === null || input === void 0 ? void 0 : input.offsetMs) !== null && _c !== void 0 ? _c : startTime) + ((_d = input === null || input === void 0 ? void 0 : input.audioDurationMs) !== null && _d !== void 0 ? _d : 0));
}
exports.default = Mp4;
