import { intoApiTransition } from './common.js';
import { createCompositorComponent, sceneComponentIntoApi } from '../component.js';
const Rescaler = createCompositorComponent(sceneBuilder);
function sceneBuilder({ id, style, transition }, children) {
    if (children?.length !== 1) {
        throw new Error('Exactly one child is required for Rescaler component');
    }
    return {
        type: 'rescaler',
        id: id,
        child: sceneComponentIntoApi(children[0]),
        mode: style?.rescaleMode,
        horizontal_align: style?.horizontalAlign,
        vertical_align: style?.verticalAlign,
        width: style?.width,
        height: style?.height,
        top: style?.top,
        bottom: style?.bottom,
        left: style?.left,
        right: style?.right,
        rotation: style?.rotation,
        transition: transition && intoApiTransition(transition),
        border_radius: style?.borderRadius,
        border_width: style?.borderWidth,
        border_color: style?.borderColor,
        box_shadow: style?.boxShadow,
    };
}
export default Rescaler;
