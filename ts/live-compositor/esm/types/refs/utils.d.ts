import type { ImageRef } from './imageRef.js';
import type { InputRef } from './inputRef.js';
type Ref = InputRef | ImageRef;
export declare function areRefsEqual(ref1: Ref, ref2: Ref): boolean;
export {};
