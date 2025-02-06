/**
 * Represents ID of an input, it can mean either:
 * - Input registered with `registerInput` method.
 * - Input that was registered internally by components like <Mp4 />.
 */
export type InputRef = {
    type: 'global';
    id: string;
} | {
    type: 'output-specific-input';
    outputId: string;
    id: number;
};
export declare function inputRefIntoRawId(inputRef: InputRef): string;
export declare function parseInputRef(rawId: string): InputRef;
