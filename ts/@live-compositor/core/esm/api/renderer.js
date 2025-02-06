export function intoRegisterImage(image) {
    const source = {
        url: image.url,
        path: image.serverPath,
    };
    if (image.assetType === 'svg') {
        return {
            asset_type: 'svg',
            resolution: image.resolution,
            ...source,
        };
    }
    else {
        return {
            asset_type: image.assetType,
            ...source,
        };
    }
}
export function intoRegisterWebRenderer(renderer) {
    return {
        url: renderer.url,
        resolution: renderer.resolution,
        embedding_method: renderer.embeddingMethod,
    };
}
