export function intoApiTransition(transition) {
    return {
        duration_ms: transition.durationMs,
        easing_function: transition.easingFunction
            ? intoApiEasingFunction(transition.easingFunction)
            : undefined,
    };
}
export function intoApiEasingFunction(easing) {
    if (easing === 'linear' || easing === 'bounce') {
        return { function_name: easing };
    }
    else if (typeof easing === 'object' &&
        (easing.functionName === 'linear' || easing.functionName == 'bounce')) {
        return { function_name: easing.functionName };
    }
    else if (typeof easing === 'object' && easing.functionName === 'cubic_bezier') {
        return {
            function_name: 'cubic_bezier',
            points: easing.points,
        };
    }
    else {
        throw new Error(`Invalid LiveCompositor.EasingFunction ${easing}`);
    }
}
