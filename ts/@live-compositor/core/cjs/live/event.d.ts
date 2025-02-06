import type { _liveCompositorInternals } from 'live-compositor';
import type { CompositorEvent } from '../event.js';
import type Output from './output.js';
type LiveInputStreamStore<Id> = _liveCompositorInternals.LiveInputStreamStore<Id>;
export declare function handleEvent(store: LiveInputStreamStore<string>, outputs: Record<string, Output>, event: CompositorEvent): void;
export {};
