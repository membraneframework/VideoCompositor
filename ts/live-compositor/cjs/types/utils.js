"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidImageType = isValidImageType;
const registerRenderer_js_1 = require("./registerRenderer.js");
function isValidImageType(type) {
    return registerRenderer_js_1.imageAssetTypes.includes(type);
}
