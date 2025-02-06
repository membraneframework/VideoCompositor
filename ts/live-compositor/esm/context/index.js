import { createContext } from 'react';
import { AudioContext } from './audioOutputContext.js';
import { LiveTimeContext } from './timeContext.js';
import { LiveInputStreamStore } from './inputStreamStore.js';
const noopLogger = {
    error: () => null,
    warn: () => null,
    info: () => null,
    debug: () => null,
    trace: () => null,
};
export const LiveCompositorContext = createContext({
    globalInputStreamStore: new LiveInputStreamStore(noopLogger),
    internalInputStreamStore: new LiveInputStreamStore(noopLogger),
    audioContext: new AudioContext(() => { }),
    timeContext: new LiveTimeContext(),
    outputId: '',
    registerMp4Input: async () => ({}),
    unregisterMp4Input: async () => { },
    registerImage: async () => { },
    unregisterImage: async () => { },
    logger: noopLogger,
});
