"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_js_1 = require("./common.js");
const component_js_1 = require("../component.js");
const Tiles = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function sceneBuilder({ id, style, transition }, children) {
    return {
        type: 'tiles',
        id: id,
        children: children.map(component_js_1.sceneComponentIntoApi),
        width: style === null || style === void 0 ? void 0 : style.width,
        height: style === null || style === void 0 ? void 0 : style.height,
        background_color: style === null || style === void 0 ? void 0 : style.backgroundColor,
        tile_aspect_ratio: style === null || style === void 0 ? void 0 : style.tileAspectRatio,
        margin: style === null || style === void 0 ? void 0 : style.margin,
        padding: style === null || style === void 0 ? void 0 : style.padding,
        horizontal_align: style === null || style === void 0 ? void 0 : style.horizontalAlign,
        vertical_align: style === null || style === void 0 ? void 0 : style.verticalAlign,
        transition: transition && (0, common_js_1.intoApiTransition)(transition),
    };
}
exports.default = Tiles;
