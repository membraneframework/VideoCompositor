"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRefIntoRawId = imageRefIntoRawId;
exports.parseImageRef = parseImageRef;
function imageRefIntoRawId(imageRef) {
    if (imageRef.type == 'global') {
        return `global:${imageRef.id}`;
    }
    else {
        return `output-specific-image:${imageRef.id}:${imageRef.outputId}`;
    }
}
function parseImageRef(rawId) {
    const split = rawId.split(':');
    if (split.length < 2) {
        throw new Error(`Invalid image ID. (${rawId})`);
    }
    else if (split[0] === 'global') {
        return {
            type: 'global',
            id: split.slice(1).join(),
        };
    }
    else if (split[0] === 'output-specific-image') {
        return {
            type: 'output-specific-image',
            id: Number(split[1]),
            outputId: split.slice(2).join(),
        };
    }
    else {
        throw new Error(`Unknown image type (${split[0]}).`);
    }
}
