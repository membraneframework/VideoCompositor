let nextImageNumber = 1;
/*
 * Generates unique image id that can be used in Image component
 */
export function newInternalImageId() {
    const result = nextImageNumber;
    nextImageNumber += 1;
    return result;
}
