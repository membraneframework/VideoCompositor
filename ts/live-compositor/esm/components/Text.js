import { createCompositorComponent, DEFAULT_FONT_SIZE } from '../component.js';
const Text = createCompositorComponent(sceneBuilder);
function sceneBuilder(props, children) {
    const { id, style } = props;
    return {
        type: 'text',
        id: id,
        text: children.map(child => (typeof child === 'string' ? child : String(child))).join(''),
        width: style?.width,
        height: style?.height,
        max_width: style?.maxWidth,
        max_height: style?.maxHeight,
        font_size: style?.fontSize ?? DEFAULT_FONT_SIZE,
        line_height: style?.lineHeight,
        color: style?.color,
        background_color: style?.backgroundColor,
        font_family: style?.fontFamily,
        style: style?.fontStyle,
        align: style?.align,
        wrap: style?.wrap,
        weight: style?.fontWeight,
    };
}
export default Text;
