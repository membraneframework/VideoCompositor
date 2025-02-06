"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_js_1 = require("../component.js");
const Text = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function sceneBuilder(props, children) {
    var _a;
    const { id, style } = props;
    return {
        type: 'text',
        id: id,
        text: children.map(child => (typeof child === 'string' ? child : String(child))).join(''),
        width: style === null || style === void 0 ? void 0 : style.width,
        height: style === null || style === void 0 ? void 0 : style.height,
        max_width: style === null || style === void 0 ? void 0 : style.maxWidth,
        max_height: style === null || style === void 0 ? void 0 : style.maxHeight,
        font_size: (_a = style === null || style === void 0 ? void 0 : style.fontSize) !== null && _a !== void 0 ? _a : component_js_1.DEFAULT_FONT_SIZE,
        line_height: style === null || style === void 0 ? void 0 : style.lineHeight,
        color: style === null || style === void 0 ? void 0 : style.color,
        background_color: style === null || style === void 0 ? void 0 : style.backgroundColor,
        font_family: style === null || style === void 0 ? void 0 : style.fontFamily,
        style: style === null || style === void 0 ? void 0 : style.fontStyle,
        align: style === null || style === void 0 ? void 0 : style.align,
        wrap: style === null || style === void 0 ? void 0 : style.wrap,
        weight: style === null || style === void 0 ? void 0 : style.fontWeight,
    };
}
exports.default = Text;
