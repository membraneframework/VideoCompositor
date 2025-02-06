"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FONT_SIZE = void 0;
exports.createCompositorComponent = createCompositorComponent;
exports.sceneComponentIntoApi = sceneComponentIntoApi;
const react_1 = require("react");
exports.DEFAULT_FONT_SIZE = 50;
function createCompositorComponent(sceneBuilder) {
    return (props) => {
        var _a;
        const { children, ...otherProps } = props;
        const autoId = (0, react_1.useId)();
        return (0, react_1.createElement)('compositor', {
            sceneBuilder,
            props: { ...otherProps, id: (_a = otherProps.id) !== null && _a !== void 0 ? _a : autoId },
        }, ...(Array.isArray(children) ? children : [children]));
    };
}
function sceneComponentIntoApi(component) {
    if (typeof component === 'string') {
        return {
            type: 'text',
            text: component,
            font_size: exports.DEFAULT_FONT_SIZE,
        };
    }
    return component;
}
