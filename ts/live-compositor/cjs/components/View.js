"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_js_1 = require("../component.js");
const common_js_1 = require("./common.js");
const View = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function sceneBuilder({ id, style = {}, transition }, children) {
    return {
        type: 'view',
        id,
        children: children.map(component_js_1.sceneComponentIntoApi),
        width: style.width,
        height: style.height,
        direction: style.direction,
        top: style.top,
        right: style.right,
        bottom: style.bottom,
        left: style.left,
        rotation: style.rotation,
        overflow: style.overflow,
        background_color: style.backgroundColor,
        transition: transition && (0, common_js_1.intoApiTransition)(transition),
        border_radius: style.borderRadius,
        border_width: style.borderWidth,
        border_color: style.borderColor,
        box_shadow: style.boxShadow,
    };
}
exports.default = View;
