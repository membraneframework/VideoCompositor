import type * as Api from '../api.js';
import type { ComponentBaseProps } from '../component.js';
export type WebViewProps = ComponentBaseProps & {
    /**
     * Id of a web renderer instance. It identifies an instance registered using `LiveCompositor.registerWebRenderer`.
     *
     * You can only refer to specific instances in one Component at a time.
     */
    instanceId: Api.RendererId;
};
declare const WebView: (props: WebViewProps) => import("react").ReactNode;
export default WebView;
