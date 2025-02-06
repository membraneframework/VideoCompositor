"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_js_1 = require("../component.js");
const WebView = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function sceneBuilder(props, children) {
    return {
        type: 'web_view',
        children: children.map(component_js_1.sceneComponentIntoApi),
        id: props.id,
        instance_id: props.instanceId,
    };
}
exports.default = WebView;
