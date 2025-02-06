"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentTimestamp = exports.useAfterTimestamp = exports.useBlockingTask = exports.useAudioInput = exports.useInputStreams = exports.Mp4 = exports.SlideShow = exports.Slide = exports.Show = exports.Tiles = exports.Shader = exports.WebView = exports.Rescaler = exports.InputStream = exports.Text = exports.Image = exports.View = exports._liveCompositorInternals = exports.Api = exports.Renderers = exports.Outputs = exports.Inputs = void 0;
const View_js_1 = __importDefault(require("./components/View.js"));
exports.View = View_js_1.default;
const Image_js_1 = __importDefault(require("./components/Image.js"));
exports.Image = Image_js_1.default;
const Text_js_1 = __importDefault(require("./components/Text.js"));
exports.Text = Text_js_1.default;
const InputStream_js_1 = __importDefault(require("./components/InputStream.js"));
exports.InputStream = InputStream_js_1.default;
const Rescaler_js_1 = __importDefault(require("./components/Rescaler.js"));
exports.Rescaler = Rescaler_js_1.default;
const WebView_js_1 = __importDefault(require("./components/WebView.js"));
exports.WebView = WebView_js_1.default;
const Shader_js_1 = __importDefault(require("./components/Shader.js"));
exports.Shader = Shader_js_1.default;
const Tiles_js_1 = __importDefault(require("./components/Tiles.js"));
exports.Tiles = Tiles_js_1.default;
const hooks_js_1 = require("./hooks.js");
Object.defineProperty(exports, "useAudioInput", { enumerable: true, get: function () { return hooks_js_1.useAudioInput; } });
Object.defineProperty(exports, "useInputStreams", { enumerable: true, get: function () { return hooks_js_1.useInputStreams; } });
Object.defineProperty(exports, "useAfterTimestamp", { enumerable: true, get: function () { return hooks_js_1.useAfterTimestamp; } });
Object.defineProperty(exports, "useBlockingTask", { enumerable: true, get: function () { return hooks_js_1.useBlockingTask; } });
Object.defineProperty(exports, "useCurrentTimestamp", { enumerable: true, get: function () { return hooks_js_1.useCurrentTimestamp; } });
const Show_js_1 = __importDefault(require("./components/Show.js"));
exports.Show = Show_js_1.default;
const SlideShow_js_1 = require("./components/SlideShow.js");
Object.defineProperty(exports, "SlideShow", { enumerable: true, get: function () { return SlideShow_js_1.SlideShow; } });
Object.defineProperty(exports, "Slide", { enumerable: true, get: function () { return SlideShow_js_1.Slide; } });
const Mp4_js_1 = __importDefault(require("./components/Mp4.js"));
exports.Mp4 = Mp4_js_1.default;
exports.Inputs = __importStar(require("./types/registerInput.js"));
exports.Outputs = __importStar(require("./types/registerOutput.js"));
exports.Renderers = __importStar(require("./types/registerRenderer.js"));
exports.Api = __importStar(require("./api.js"));
exports._liveCompositorInternals = __importStar(require("./internal.js"));
