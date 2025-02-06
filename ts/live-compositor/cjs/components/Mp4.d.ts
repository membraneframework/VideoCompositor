import type { ComponentBaseProps } from '../component.js';
export type Mp4Props = Omit<ComponentBaseProps, 'children'> & {
    /**
     * Audio volume represented by a number between 0 and 1.
     */
    volume?: number;
    /**
     * Mute audio.
     */
    muted?: boolean;
    /**
     *  Url or path to the mp4 file. File path refers to the filesystem where LiveCompositor server is deployed.
     */
    source: string;
};
declare function Mp4(props: Mp4Props): import("react").FunctionComponentElement<Omit<import("./InputStream.js").InputStreamProps, "muted" | "volume">>;
export default Mp4;
