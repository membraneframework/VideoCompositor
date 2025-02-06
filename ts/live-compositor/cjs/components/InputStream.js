"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InnerInputStream = void 0;
const react_1 = require("react");
const component_js_1 = require("../component.js");
const hooks_js_1 = require("../hooks.js");
const childrenLifetimeContext_js_1 = require("../context/childrenLifetimeContext.js");
const index_js_1 = require("../context/index.js");
const internal_js_1 = require("../internal.js");
exports.InnerInputStream = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function InputStream(props) {
    const { muted, volume, inputId, ...otherProps } = props;
    (0, hooks_js_1.useAudioInput)(inputId, {
        volume: muted ? 0 : (volume !== null && volume !== void 0 ? volume : 1),
    });
    useTimeLimitedInputStream(inputId);
    return (0, react_1.createElement)(exports.InnerInputStream, {
        ...otherProps,
        inputId: (0, internal_js_1.inputRefIntoRawId)({ type: 'global', id: inputId }),
    });
}
function useTimeLimitedInputStream(inputId) {
    var _a, _b, _c, _d;
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    // startTime is only needed for live case. In offline
    // mode offset is always set.
    const [startTime, setStartTime] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        setStartTime(ctx.timeContext.timestampMs());
    }, [inputId]);
    const inputs = (0, hooks_js_1.useInputStreams)();
    const input = inputs[inputId];
    (0, childrenLifetimeContext_js_1.useTimeLimitedComponent)(((_a = input === null || input === void 0 ? void 0 : input.offsetMs) !== null && _a !== void 0 ? _a : startTime) + ((_b = input === null || input === void 0 ? void 0 : input.videoDurationMs) !== null && _b !== void 0 ? _b : 0));
    (0, childrenLifetimeContext_js_1.useTimeLimitedComponent)(((_c = input === null || input === void 0 ? void 0 : input.offsetMs) !== null && _c !== void 0 ? _c : startTime) + ((_d = input === null || input === void 0 ? void 0 : input.audioDurationMs) !== null && _d !== void 0 ? _d : 0));
}
function sceneBuilder(props, _children) {
    return {
        type: 'input_stream',
        id: props.id,
        input_id: props.inputId,
    };
}
exports.default = InputStream;
