import { _liveCompositorInternals, useAfterTimestamp } from 'live-compositor';
import { createElement, useEffect } from 'react';
const globalDelayRef = Symbol();
export function OutputRootComponent({ outputContext, outputRoot, childrenLifetimeContext, }) {
    useMinimalStreamDuration(childrenLifetimeContext);
    return createElement(_liveCompositorInternals.LiveCompositorContext.Provider, { value: outputContext }, createElement(_liveCompositorInternals.ChildrenLifetimeContextType.Provider, { value: childrenLifetimeContext }, outputRoot));
}
/**
 * Add minimal 1 second lifetime in case there are not live
 * components inside the scene.
 */
function useMinimalStreamDuration(childrenLifetimeContext) {
    useEffect(() => {
        childrenLifetimeContext.removeRef(globalDelayRef);
        return () => {
            childrenLifetimeContext.removeRef(globalDelayRef);
        };
    }, []);
    const afterTimestamp = useAfterTimestamp(1000);
    useEffect(() => {
        if (afterTimestamp) {
            childrenLifetimeContext.removeRef(globalDelayRef);
        }
    }, [afterTimestamp]);
}
