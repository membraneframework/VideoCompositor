import type * as Api from '../api.js';
import type { Transition } from './common.js';
import type { ComponentBaseProps } from '../component.js';
export type TilesStyleProps = {
    /**
     * Width of a component in pixels. Exact behavior might be different based on the parent
     * component:
     * - If the parent component is a layout, check sections "Absolute positioning" and "Static
     * positioning" of that component.
     * - If the parent component is not a layout, then this field is required.
     */
    width?: number;
    /**
     * Height of a component in pixels. Exact behavior might be different based on the parent
     * component:
     * - If the parent component is a layout, check sections "Absolute positioning" and "Static
     * positioning" of that component.
     * - If the parent component is not a layout, then this field is required.
     */
    height?: number;
    /**
     * (**default=`"#00000000"`**) Background color in `RGB` or `RGBA` format.
     */
    backgroundColor?: string;
    /**
     * (**default=`"16:9"`**) Aspect ratio of a tile in `"W:H"` format, where W and H are integers.
     */
    tileAspectRatio?: Api.AspectRatio | null;
    /**
     * (**default=`0`**) Margin of each tile in pixels.
     */
    margin?: number;
    /**
     * (**default=`0`**) Padding on each tile in pixels.
     */
    padding?: number;
    /**
     * (**default=`"center"`**) Horizontal alignment of tiles.
     */
    horizontalAlign?: Api.HorizontalAlign;
    /**
     * (**default=`"center"`**) Vertical alignment of tiles.
     */
    verticalAlign?: Api.VerticalAlign;
};
export type TilesProps = ComponentBaseProps & {
    /**
     * Tiles styling properties
     */
    style?: TilesStyleProps;
    /**
     * Defines how this component will behave during a scene update. This will only have an
     * effect if the previous scene already contained a `Tiles` component with the same id.
     */
    transition?: Transition;
};
declare const Tiles: (props: TilesProps) => import("react").ReactNode;
export default Tiles;
