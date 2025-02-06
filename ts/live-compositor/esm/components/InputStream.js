import { createElement, useContext, useEffect, useState } from 'react';
import { createCompositorComponent } from '../component.js';
import { useAudioInput, useInputStreams } from '../hooks.js';
import { useTimeLimitedComponent } from '../context/childrenLifetimeContext.js';
import { LiveCompositorContext } from '../context/index.js';
import { inputRefIntoRawId } from '../internal.js';
export const InnerInputStream = createCompositorComponent(sceneBuilder);
function InputStream(props) {
    const { muted, volume, inputId, ...otherProps } = props;
    useAudioInput(inputId, {
        volume: muted ? 0 : (volume ?? 1),
    });
    useTimeLimitedInputStream(inputId);
    return createElement(InnerInputStream, {
        ...otherProps,
        inputId: inputRefIntoRawId({ type: 'global', id: inputId }),
    });
}
function useTimeLimitedInputStream(inputId) {
    const ctx = useContext(LiveCompositorContext);
    // startTime is only needed for live case. In offline
    // mode offset is always set.
    const [startTime, setStartTime] = useState(0);
    useEffect(() => {
        setStartTime(ctx.timeContext.timestampMs());
    }, [inputId]);
    const inputs = useInputStreams();
    const input = inputs[inputId];
    useTimeLimitedComponent((input?.offsetMs ?? startTime) + (input?.videoDurationMs ?? 0));
    useTimeLimitedComponent((input?.offsetMs ?? startTime) + (input?.audioDurationMs ?? 0));
}
function sceneBuilder(props, _children) {
    return {
        type: 'input_stream',
        id: props.id,
        input_id: props.inputId,
    };
}
export default InputStream;
