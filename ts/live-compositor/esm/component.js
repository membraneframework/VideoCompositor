import { createElement, useId } from 'react';
export const DEFAULT_FONT_SIZE = 50;
export function createCompositorComponent(sceneBuilder) {
    return (props) => {
        const { children, ...otherProps } = props;
        const autoId = useId();
        return createElement('compositor', {
            sceneBuilder,
            props: { ...otherProps, id: otherProps.id ?? autoId },
        }, ...(Array.isArray(children) ? children : [children]));
    };
}
export function sceneComponentIntoApi(component) {
    if (typeof component === 'string') {
        return {
            type: 'text',
            text: component,
            font_size: DEFAULT_FONT_SIZE,
        };
    }
    return component;
}
