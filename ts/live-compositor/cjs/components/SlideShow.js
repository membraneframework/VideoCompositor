"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideShow = SlideShow;
exports.Slide = Slide;
const react_1 = require("react");
const hooks_js_1 = require("../hooks.js");
const View_js_1 = __importDefault(require("./View.js"));
const childrenLifetimeContext_js_1 = require("../context/childrenLifetimeContext.js");
function SlideShow(props) {
    var _a;
    const prevChildrenRef = (0, react_1.useRef)();
    const [childIndex, setChildIndex] = (0, react_1.useState)(0);
    const childrenArray = react_1.Children.toArray(props.children);
    for (const slide of childrenArray) {
        if (slide.type !== Slide) {
            throw new Error('SlideShow component only accepts <Slide /> as children');
        }
    }
    (0, react_1.useEffect)(() => {
        // If "current" element was removed we should compare it to the next elements
        // in the old list.
        const prevChildrenOrder = react_1.Children.toArray(prevChildrenRef.current).slice(childIndex);
        const newChildren = react_1.Children.toArray(props.children);
        for (const prev of prevChildrenOrder) {
            for (const [index, newChild] of newChildren.entries()) {
                if (newChild.key === prev.key) {
                    if (childIndex !== index) {
                        setChildIndex(index);
                    }
                    prevChildrenRef.current = props.children;
                    return;
                }
            }
        }
        // If nothing from old list is left then just use the same child index
        prevChildrenRef.current = props.children;
    }, [props.children]);
    const [shouldCheckChildren, setShouldCheckChildren] = (0, react_1.useState)(false);
    const onChildrenChange = (0, react_1.useCallback)(() => {
        setShouldCheckChildren(true);
    }, []);
    const [slideContext, _setSlideCtx] = (0, react_1.useState)(() => new childrenLifetimeContext_js_1.ChildrenLifetimeContext(onChildrenChange));
    (0, react_1.useEffect)(() => {
        if (shouldCheckChildren) {
            setShouldCheckChildren(false);
            if (slideContext.isDone()) {
                setChildIndex(childIndex + 1);
            }
        }
    }, [shouldCheckChildren]);
    // report this SlideShow lifetime to its parents (to support nested SlideShows)
    (0, childrenLifetimeContext_js_1.useCompletableComponent)(childIndex >= childrenArray.length);
    return (0, react_1.createElement)(childrenLifetimeContext_js_1.ChildrenLifetimeContextType.Provider, { value: slideContext }, (_a = childrenArray[childIndex]) !== null && _a !== void 0 ? _a : (0, react_1.createElement)(View_js_1.default, {}));
}
function Slide(props) {
    const [slideContext, _setSlideCtx] = (0, react_1.useState)(() => new childrenLifetimeContext_js_1.ChildrenLifetimeContext(() => { }));
    const currentTimestamp = (0, hooks_js_1.useCurrentTimestamp)();
    const [initTimestamp, _setInitTimestamp] = (0, react_1.useState)(currentTimestamp);
    // defaults to 1 second
    const durationMs = props.durationMs !== undefined && props.durationMs !== null ? props.durationMs : 1000;
    (0, childrenLifetimeContext_js_1.useTimeLimitedComponent)(initTimestamp + durationMs);
    if (props.durationMs) {
        // Add fake context if durationMs is specified to ignore child components
        return (0, react_1.createElement)(childrenLifetimeContext_js_1.ChildrenLifetimeContextType.Provider, { value: slideContext }, props.children);
    }
    else {
        return props.children;
    }
}
