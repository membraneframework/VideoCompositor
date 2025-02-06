"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputRootComponent = OutputRootComponent;
const live_compositor_1 = require("live-compositor");
const react_1 = require("react");
const globalDelayRef = Symbol();
function OutputRootComponent({ outputContext, outputRoot, childrenLifetimeContext, }) {
    useMinimalStreamDuration(childrenLifetimeContext);
    return (0, react_1.createElement)(live_compositor_1._liveCompositorInternals.LiveCompositorContext.Provider, { value: outputContext }, (0, react_1.createElement)(live_compositor_1._liveCompositorInternals.ChildrenLifetimeContextType.Provider, { value: childrenLifetimeContext }, outputRoot));
}
/**
 * Add minimal 1 second lifetime in case there are not live
 * components inside the scene.
 */
function useMinimalStreamDuration(childrenLifetimeContext) {
    (0, react_1.useEffect)(() => {
        childrenLifetimeContext.removeRef(globalDelayRef);
        return () => {
            childrenLifetimeContext.removeRef(globalDelayRef);
        };
    }, []);
    const afterTimestamp = (0, live_compositor_1.useAfterTimestamp)(1000);
    (0, react_1.useEffect)(() => {
        if (afterTimestamp) {
            childrenLifetimeContext.removeRef(globalDelayRef);
        }
    }, [afterTimestamp]);
}
