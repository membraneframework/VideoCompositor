export declare class ChildrenLifetimeContext {
    private childrenRefs;
    private onChange;
    constructor(onChange: () => void);
    addRef(ref: Symbol): void;
    removeRef(ref: Symbol): void;
    isDone(): boolean;
}
/**
 * Context that exposes API to children to register themself as playing/in-progress. Some components
 * will change their behavior based on the state of its in-direct children, e.g. Slides component will
 * not switch Slide until children are finished.
 */
export declare const ChildrenLifetimeContextType: import("react").Context<ChildrenLifetimeContext>;
/**
 * Internal helper hook that can be used inside other components to propagate
 * their duration/lifetime to the parents.
 */
export declare function useTimeLimitedComponent(timestamp: number): void;
export declare function useCompletableComponent(completed: boolean): void;
