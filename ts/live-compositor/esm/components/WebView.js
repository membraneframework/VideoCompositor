import { createCompositorComponent, sceneComponentIntoApi } from '../component.js';
const WebView = createCompositorComponent(sceneBuilder);
function sceneBuilder(props, children) {
    return {
        type: 'web_view',
        children: children.map(sceneComponentIntoApi),
        id: props.id,
        instance_id: props.instanceId,
    };
}
export default WebView;
