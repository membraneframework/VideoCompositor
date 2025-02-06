import type { ComponentBaseProps } from '../component.js';
import { type Api } from '../index.js';
export type ImageProps = Omit<ComponentBaseProps, 'children'> & ({
    imageId: Api.RendererId;
    source?: never;
} | {
    source: string;
    imageId?: never;
});
type ImageSceneBuliderProps = Omit<ImageProps, 'imageId'> & {
    imageId: string;
};
export declare const InnerImage: (props: ImageSceneBuliderProps) => import("react").ReactNode;
declare function Image(props: ImageProps): import("react").FunctionComponentElement<import("./View.js").ViewProps> | import("react").FunctionComponentElement<ImageSceneBuliderProps>;
export default Image;
