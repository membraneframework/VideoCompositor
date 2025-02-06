import type React from 'react';
import type * as Api from './api.js';
export declare const DEFAULT_FONT_SIZE = 50;
export type ComponentBaseProps = {
    /**
     * Component children.
     */
    children?: React.ReactNode;
    /**
     * Id of a component.
     */
    id?: Api.ComponentId;
};
export type SceneComponent = Api.Component | string;
export type SceneBuilder<P> = (props: P, children: SceneComponent[]) => Api.Component;
export declare function createCompositorComponent<P extends ComponentBaseProps>(sceneBuilder: SceneBuilder<P>): (props: P) => React.ReactNode;
export declare function sceneComponentIntoApi(component: SceneComponent): Api.Component;
