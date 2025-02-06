import type * as Api from '../api.js';
import type { ComponentBaseProps } from '../component.js';
export type InputStreamProps = Omit<ComponentBaseProps, 'children'> & {
    /**
     * Id of an input. It identifies a stream registered using a `LiveCompositor.registerInput`.
     */
    inputId: Api.InputId;
    /**
     * Audio volume represented by a number between 0 and 1.
     */
    volume?: number;
    /**
     * Mute audio.
     */
    muted?: boolean;
};
type AudioPropNames = 'muted' | 'volume';
export declare const InnerInputStream: (props: Omit<InputStreamProps, AudioPropNames>) => import("react").ReactNode;
declare function InputStream(props: InputStreamProps): import("react").FunctionComponentElement<Omit<InputStreamProps, AudioPropNames>>;
export default InputStream;
