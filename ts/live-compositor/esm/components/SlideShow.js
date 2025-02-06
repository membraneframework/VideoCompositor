import { Children, createElement, useEffect, useRef, useState, useCallback } from 'react';
import { useCurrentTimestamp } from '../hooks.js';
import View from './View.js';
import { ChildrenLifetimeContext, ChildrenLifetimeContextType, useCompletableComponent, useTimeLimitedComponent, } from '../context/childrenLifetimeContext.js';
export function SlideShow(props) {
    const prevChildrenRef = useRef();
    const [childIndex, setChildIndex] = useState(0);
    const childrenArray = Children.toArray(props.children);
    for (const slide of childrenArray) {
        if (slide.type !== Slide) {
            throw new Error('SlideShow component only accepts <Slide /> as children');
        }
    }
    useEffect(() => {
        // If "current" element was removed we should compare it to the next elements
        // in the old list.
        const prevChildrenOrder = Children.toArray(prevChildrenRef.current).slice(childIndex);
        const newChildren = Children.toArray(props.children);
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
    const [shouldCheckChildren, setShouldCheckChildren] = useState(false);
    const onChildrenChange = useCallback(() => {
        setShouldCheckChildren(true);
    }, []);
    const [slideContext, _setSlideCtx] = useState(() => new ChildrenLifetimeContext(onChildrenChange));
    useEffect(() => {
        if (shouldCheckChildren) {
            setShouldCheckChildren(false);
            if (slideContext.isDone()) {
                setChildIndex(childIndex + 1);
            }
        }
    }, [shouldCheckChildren]);
    // report this SlideShow lifetime to its parents (to support nested SlideShows)
    useCompletableComponent(childIndex >= childrenArray.length);
    return createElement(ChildrenLifetimeContextType.Provider, { value: slideContext }, childrenArray[childIndex] ?? createElement(View, {}));
}
export function Slide(props) {
    const [slideContext, _setSlideCtx] = useState(() => new ChildrenLifetimeContext(() => { }));
    const currentTimestamp = useCurrentTimestamp();
    const [initTimestamp, _setInitTimestamp] = useState(currentTimestamp);
    // defaults to 1 second
    const durationMs = props.durationMs !== undefined && props.durationMs !== null ? props.durationMs : 1000;
    useTimeLimitedComponent(initTimestamp + durationMs);
    if (props.durationMs) {
        // Add fake context if durationMs is specified to ignore child components
        return createElement(ChildrenLifetimeContextType.Provider, { value: slideContext }, props.children);
    }
    else {
        return props.children;
    }
}
