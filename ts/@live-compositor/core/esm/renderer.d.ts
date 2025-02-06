import type { Api } from './api.js';
import type { _liveCompositorInternals } from 'live-compositor';
import type React from 'react';
import type { Logger } from 'pino';
type SceneBuilder<P> = _liveCompositorInternals.SceneBuilder<P>;
export declare class LiveCompositorHostComponent {
    props: object;
    sceneBuilder: SceneBuilder<object>;
    children: (Instance | TextInstance)[];
    constructor(props: object, sceneBuilder: SceneBuilder<object>);
    scene(): Api.Component;
}
type Instance = LiveCompositorHostComponent;
type TextInstance = string;
type RendererOptions = {
    rootElement: React.ReactElement;
    onUpdate: () => void;
    idPrefix: string;
    logger: Logger;
};
interface FiberRootNode {
    tag: number;
    containerInfo: Renderer;
    pendingChildren: LiveCompositorHostComponent[];
    current: any;
}
declare class Renderer {
    readonly root: FiberRootNode;
    readonly onUpdate: () => void;
    private logger;
    private lastScene?;
    constructor({ rootElement, onUpdate, idPrefix, logger }: RendererOptions);
    scene(): Api.Component;
    stop(): void;
}
export default Renderer;
