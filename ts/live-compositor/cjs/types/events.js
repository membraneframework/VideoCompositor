"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositorEventType = void 0;
var CompositorEventType;
(function (CompositorEventType) {
    CompositorEventType["AUDIO_INPUT_DELIVERED"] = "AUDIO_INPUT_DELIVERED";
    CompositorEventType["VIDEO_INPUT_DELIVERED"] = "VIDEO_INPUT_DELIVERED";
    CompositorEventType["AUDIO_INPUT_PLAYING"] = "AUDIO_INPUT_PLAYING";
    CompositorEventType["VIDEO_INPUT_PLAYING"] = "VIDEO_INPUT_PLAYING";
    CompositorEventType["AUDIO_INPUT_EOS"] = "AUDIO_INPUT_EOS";
    CompositorEventType["VIDEO_INPUT_EOS"] = "VIDEO_INPUT_EOS";
    CompositorEventType["OUTPUT_DONE"] = "OUTPUT_DONE";
})(CompositorEventType || (exports.CompositorEventType = CompositorEventType = {}));
