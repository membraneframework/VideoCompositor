import { createContext, useContext, useEffect, useState } from 'react';
import { useAfterTimestamp } from '../hooks.js';
export class ChildrenLifetimeContext {
    childrenRefs = new Set();
    onChange;
    constructor(onChange) {
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
/**
 * Context that exposes API to children to register themself as playing/in-progress. Some components
 * will change their behavior based on the state of its in-direct children, e.g. Slides component will
 * not switch Slide until children are finished.
 */
export const ChildrenLifetimeContextType = createContext(new ChildrenLifetimeContext(() => { }));
/**
 * Internal helper hook that can be used inside other components to propagate
 * their duration/lifetime to the parents.
 */
export function useTimeLimitedComponent(timestamp) {
    const childrenLifetimeContext = useContext(ChildrenLifetimeContextType);
    const afterTimestamp = useAfterTimestamp(timestamp);
    const [ref, setComponentRef] = useState();
    useEffect(() => {
        let ref = Symbol();
        setComponentRef(ref);
        childrenLifetimeContext.addRef(ref);
        return () => {
            childrenLifetimeContext.removeRef(ref);
        };
    }, [timestamp]);
    useEffect(() => {
        if (ref && afterTimestamp) {
            childrenLifetimeContext.removeRef(ref);
        }
    }, [afterTimestamp, ref]);
}
export function useCompletableComponent(completed) {
    const childrenLifetimeContext = useContext(ChildrenLifetimeContextType);
    const [ref, setComponentRef] = useState();
    useEffect(() => {
        let ref = Symbol();
        setComponentRef(ref);
        childrenLifetimeContext.addRef(ref);
        return () => {
            childrenLifetimeContext.removeRef(ref);
        };
    }, []);
    useEffect(() => {
        if (ref && completed) {
            childrenLifetimeContext.removeRef(ref);
        }
    }, [completed, ref]);
}
