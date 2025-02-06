import { imageAssetTypes } from './registerRenderer.js';
export function isValidImageType(type) {
    return imageAssetTypes.includes(type);
}
