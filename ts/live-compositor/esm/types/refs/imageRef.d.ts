/**
 * Represents ID of an image, it can mean either:
 * - Image registered with `registerImage` method.
 * - Image that was registered automatically by an <Image /> component.
 */
export type ImageRef = {
    type: 'global';
    id: string;
} | {
    type: 'output-specific-image';
    outputId: string;
    id: number;
};
export declare function imageRefIntoRawId(imageRef: ImageRef): string;
export declare function parseImageRef(rawId: string): ImageRef;
