"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_js_1 = require("./common.js");
const component_js_1 = require("../component.js");
const Rescaler = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function sceneBuilder({ id, style, transition }, children) {
    if ((children === null || children === void 0 ? void 0 : children.length) !== 1) {
        throw new Error('Exactly one child is required for Rescaler component');
    }
    return {
        type: 'rescaler',
        id: id,
        child: (0, component_js_1.sceneComponentIntoApi)(children[0]),
        mode: style === null || style === void 0 ? void 0 : style.rescaleMode,
        horizontal_align: style === null || style === void 0 ? void 0 : style.horizontalAlign,
        vertical_align: style === null || style === void 0 ? void 0 : style.verticalAlign,
        width: style === null || style === void 0 ? void 0 : style.width,
        height: style === null || style === void 0 ? void 0 : style.height,
        top: style === null || style === void 0 ? void 0 : style.top,
        bottom: style === null || style === void 0 ? void 0 : style.bottom,
        left: style === null || style === void 0 ? void 0 : style.left,
        right: style === null || style === void 0 ? void 0 : style.right,
        rotation: style === null || style === void 0 ? void 0 : style.rotation,
        transition: transition && (0, common_js_1.intoApiTransition)(transition),
        border_radius: style === null || style === void 0 ? void 0 : style.borderRadius,
        border_width: style === null || style === void 0 ? void 0 : style.borderWidth,
        border_color: style === null || style === void 0 ? void 0 : style.borderColor,
        box_shadow: style === null || style === void 0 ? void 0 : style.boxShadow,
    };
}
exports.default = Rescaler;
