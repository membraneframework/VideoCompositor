"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInternalStreamId = newInternalStreamId;
let nextStreamNumber = 1;
/*
 * Generates unique input stream id that can be used in e.g. Mp4 component
 */
function newInternalStreamId() {
    const result = nextStreamNumber;
    nextStreamNumber += 1;
    return result;
}
