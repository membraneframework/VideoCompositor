import { _liveCompositorInternals } from 'live-compositor';
import { type ReactElement } from 'react';
type CompositorOutputContext = _liveCompositorInternals.CompositorOutputContext;
type ChildrenLifetimeContext = _liveCompositorInternals.ChildrenLifetimeContext;
export declare function OutputRootComponent({ outputContext, outputRoot, childrenLifetimeContext, }: {
    outputContext: CompositorOutputContext;
    outputRoot: ReactElement;
    childrenLifetimeContext: ChildrenLifetimeContext;
}): import("react").FunctionComponentElement<import("react").ProviderProps<_liveCompositorInternals.CompositorOutputContext>>;
export {};
