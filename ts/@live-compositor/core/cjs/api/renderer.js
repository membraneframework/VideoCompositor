"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intoRegisterImage = intoRegisterImage;
exports.intoRegisterWebRenderer = intoRegisterWebRenderer;
function intoRegisterImage(image) {
    const source = {
        url: image.url,
        path: image.serverPath,
    };
    if (image.assetType === 'svg') {
        return Object.assign({ asset_type: 'svg', resolution: image.resolution }, source);
    }
    else {
        return Object.assign({ asset_type: image.assetType }, source);
    }
}
function intoRegisterWebRenderer(renderer) {
    return {
        url: renderer.url,
        resolution: renderer.resolution,
        embedding_method: renderer.embeddingMethod,
    };
}
