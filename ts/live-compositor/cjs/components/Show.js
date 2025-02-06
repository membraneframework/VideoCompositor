"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_js_1 = require("../hooks.js");
const index_js_1 = require("../context/index.js");
const react_1 = require("react");
function Show(props) {
    var _a, _b, _c, _d, _e;
    if ('delayMs' in props && props.timeRangeMs) {
        throw new Error('"delayMs" and "timestamp" props can\'t be specified at the same time.');
    }
    if (props.timeRangeMs && !props.timeRangeMs.start && !props.timeRangeMs.end) {
        throw new Error('"timestampMs" prop needs to define at least one value "start" or "end".');
    }
    const ctx = (0, react_1.useContext)(index_js_1.LiveCompositorContext);
    const [mountTimestampMs, setStart] = (0, react_1.useState)(() => ctx.timeContext.timestampMs());
    const afterStart = (0, hooks_js_1.useAfterTimestamp)((_b = (_a = props.timeRangeMs) === null || _a === void 0 ? void 0 : _a.start) !== null && _b !== void 0 ? _b : 0);
    const afterEnd = (0, hooks_js_1.useAfterTimestamp)((_d = (_c = props.timeRangeMs) === null || _c === void 0 ? void 0 : _c.end) !== null && _d !== void 0 ? _d : Infinity);
    const isAfterDelay = (0, hooks_js_1.useAfterTimestamp)(mountTimestampMs + ((_e = props.delayMs) !== null && _e !== void 0 ? _e : 0));
    (0, react_1.useEffect)(() => {
        setStart(ctx.timeContext.timestampMs());
    }, []);
    if (props.delayMs !== undefined && isAfterDelay) {
        return props.children;
    }
    else if (props.timeRangeMs && afterStart && !afterEnd) {
        return props.children;
    }
    else {
        return null;
    }
}
exports.default = Show;
