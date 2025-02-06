"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInternalImageId = newInternalImageId;
let nextImageNumber = 1;
/*
 * Generates unique image id that can be used in Image component
 */
function newInternalImageId() {
    const result = nextImageNumber;
    nextImageNumber += 1;
    return result;
}
