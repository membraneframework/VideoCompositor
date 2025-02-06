"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildrenLifetimeContextType = exports.ChildrenLifetimeContext = void 0;
exports.useTimeLimitedComponent = useTimeLimitedComponent;
exports.useCompletableComponent = useCompletableComponent;
const react_1 = require("react");
const hooks_js_1 = require("../hooks.js");
class ChildrenLifetimeContext {
    constructor(onChange) {
        this.childrenRefs = new Set();
        this.onChange = onChange;
    }
    addRef(ref) {
        this.childrenRefs.add(ref);
        this.onChange();
    }
    removeRef(ref) {
        this.childrenRefs.delete(ref);
        this.onChange();
    }
    isDone() {
        return this.childrenRefs.size === 0;
    }
}
exports.ChildrenLifetimeContext = ChildrenLifetimeContext;
/**
 * Context that exposes API to children to register themself as playing/in-progress. Some components
 * will change their behavior based on the state of its in-direct children, e.g. Slides component will
 * not switch Slide until children are finished.
 */
exports.ChildrenLifetimeContextType = (0, react_1.createContext)(new ChildrenLifetimeContext(() => { }));
/**
 * Internal helper hook that can be used inside other components to propagate
 * their duration/lifetime to the parents.
 */
function useTimeLimitedComponent(timestamp) {
    const childrenLifetimeContext = (0, react_1.useContext)(exports.ChildrenLifetimeContextType);
    const afterTimestamp = (0, hooks_js_1.useAfterTimestamp)(timestamp);
    const [ref, setComponentRef] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        let ref = Symbol();
        setComponentRef(ref);
        childrenLifetimeContext.addRef(ref);
        return () => {
            childrenLifetimeContext.removeRef(ref);
        };
    }, [timestamp]);
    (0, react_1.useEffect)(() => {
        if (ref && afterTimestamp) {
            childrenLifetimeContext.removeRef(ref);
        }
    }, [afterTimestamp, ref]);
}
function useCompletableComponent(completed) {
    const childrenLifetimeContext = (0, react_1.useContext)(exports.ChildrenLifetimeContextType);
    const [ref, setComponentRef] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        let ref = Symbol();
        setComponentRef(ref);
        childrenLifetimeContext.addRef(ref);
        return () => {
            childrenLifetimeContext.removeRef(ref);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (ref && completed) {
            childrenLifetimeContext.removeRef(ref);
        }
    }, [completed, ref]);
}
