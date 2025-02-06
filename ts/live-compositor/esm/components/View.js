import { createCompositorComponent, sceneComponentIntoApi } from '../component.js';
import { intoApiTransition } from './common.js';
const View = createCompositorComponent(sceneBuilder);
function sceneBuilder({ id, style = {}, transition }, children) {
    return {
        type: 'view',
        id,
        children: children.map(sceneComponentIntoApi),
        width: style.width,
        height: style.height,
        direction: style.direction,
        top: style.top,
        right: style.right,
        bottom: style.bottom,
        left: style.left,
        rotation: style.rotation,
        overflow: style.overflow,
        background_color: style.backgroundColor,
        transition: transition && intoApiTransition(transition),
        border_radius: style.borderRadius,
        border_width: style.borderWidth,
        border_color: style.borderColor,
        box_shadow: style.boxShadow,
    };
}
export default View;
