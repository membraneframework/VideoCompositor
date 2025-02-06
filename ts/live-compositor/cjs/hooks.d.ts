import type * as Api from './api.js';
import type { CompositorOutputContext } from './context/index.js';
import type { BlockingTask } from './context/timeContext.js';
import type { InputStreamInfo } from './context/inputStreamStore.js';
export declare function useInputStreams(): Record<Api.InputId, InputStreamInfo<string>>;
export type AudioOptions = {
    volume: number;
};
/**
 * Hook used to control audio configuration. If you already placing InputStream component
 * you can use `muted` and `volume` props instead.
 */
export declare function useAudioInput(inputId: Api.InputId, audioOptions: AudioOptions): void;
/**
 *  Returns current timestamp relative to `LiveCompositor.start()`.
 *
 *  Not recommended for live processing. It triggers re-renders only for specific timestamps
 *  that are registered with `useAfterTimestamp` hook(that includes components like Slide/Show).
 */
export declare function useCurrentTimestamp(): number;
/**
 * Hook that allows you to trigger updates after specific timestamp. Primary useful for
 * offline processing.
 */
export declare function useAfterTimestamp(timestamp: number): boolean;
/**
 * Create task that will stop rendering when compositor runs in offline mode.
 *
 * `task.done()` needs to be called when async action is finished, otherwise rendering will block indefinitely.
 */
export declare function newBlockingTask(ctx: CompositorOutputContext): BlockingTask;
/**
 *  Run async function and return its result after Promise resolves.
 *
 *  For offline processing it additionally ensures that rendering for that
 *  timestamp  will block until all blocking tasks are done.
 */
export declare function useBlockingTask<T>(fn: () => Promise<T>): T | undefined;
