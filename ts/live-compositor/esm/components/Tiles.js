import { intoApiTransition } from './common.js';
import { createCompositorComponent, sceneComponentIntoApi } from '../component.js';
const Tiles = createCompositorComponent(sceneBuilder);
function sceneBuilder({ id, style, transition }, children) {
    return {
        type: 'tiles',
        id: id,
        children: children.map(sceneComponentIntoApi),
        width: style?.width,
        height: style?.height,
        background_color: style?.backgroundColor,
        tile_aspect_ratio: style?.tileAspectRatio,
        margin: style?.margin,
        padding: style?.padding,
        horizontal_align: style?.horizontalAlign,
        vertical_align: style?.verticalAlign,
        transition: transition && intoApiTransition(transition),
    };
}
export default Tiles;
