"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveCompositorContext = void 0;
const react_1 = require("react");
const audioOutputContext_js_1 = require("./audioOutputContext.js");
const timeContext_js_1 = require("./timeContext.js");
const inputStreamStore_js_1 = require("./inputStreamStore.js");
const noopLogger = {
    error: () => null,
    warn: () => null,
    info: () => null,
    debug: () => null,
    trace: () => null,
};
exports.LiveCompositorContext = (0, react_1.createContext)({
    globalInputStreamStore: new inputStreamStore_js_1.LiveInputStreamStore(noopLogger),
    internalInputStreamStore: new inputStreamStore_js_1.LiveInputStreamStore(noopLogger),
    audioContext: new audioOutputContext_js_1.AudioContext(() => { }),
    timeContext: new timeContext_js_1.LiveTimeContext(),
    outputId: '',
    registerMp4Input: async () => ({}),
    unregisterMp4Input: async () => { },
    registerImage: async () => { },
    unregisterImage: async () => { },
    logger: noopLogger,
});
