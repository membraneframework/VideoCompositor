import type * as Api from '../api.js';
import type { ComponentBaseProps, SceneComponent } from '../component.js';
import { createCompositorComponent, sceneComponentIntoApi } from '../component.js';

export type WebViewProps = ComponentBaseProps & {
  /**
   * Id of a web renderer instance. It identifies an instance registered using `LiveCompositor.registerWebRenderer`.
   *
   * You can only refer to specific instances in one Component at a time.
   */
  instanceId: Api.RendererId;
};

const WebView = createCompositorComponent<WebViewProps>(sceneBuilder);

function sceneBuilder(props: WebViewProps, children: SceneComponent[]): Api.Component {
  return {
    type: 'web_view',
    children: children.map(sceneComponentIntoApi),
    id: props.id,
    instance_id: props.instanceId,
  };
}

export default WebView;
