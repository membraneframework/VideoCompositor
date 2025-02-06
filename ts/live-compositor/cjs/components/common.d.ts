import type * as Api from '../api.js';
export interface Transition {
    /**
     * Duration of a transition in milliseconds.
     */
    durationMs: number;
    /**
     * (**default=`"linear"`**) Easing function to be used for the transition.
     */
    easingFunction?: EasingFunction | null;
}
export declare function intoApiTransition(transition: Transition): Api.Transition;
export type EasingFunction = 'linear' | 'bounce' | {
    functionName: 'linear';
} | {
    functionName: 'bounce';
} | {
    functionName: 'cubic_bezier';
    points: [number, number, number, number];
};
export declare function intoApiEasingFunction(easing: EasingFunction): Api.EasingFunction;
