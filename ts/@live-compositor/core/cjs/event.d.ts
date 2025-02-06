import { _liveCompositorInternals } from 'live-compositor';
import type { Logger } from 'pino';
export type CompositorEvent = _liveCompositorInternals.CompositorEvent;
export declare const CompositorEventType: typeof _liveCompositorInternals.CompositorEventType;
export declare function parseEvent(event: any, logger: Logger): CompositorEvent | null;
