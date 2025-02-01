import type { InputRef } from './refs/inputRef.js';

export enum SmelterEventType {
  AUDIO_INPUT_DELIVERED = 'AUDIO_INPUT_DELIVERED',
  VIDEO_INPUT_DELIVERED = 'VIDEO_INPUT_DELIVERED',
  AUDIO_INPUT_PLAYING = 'AUDIO_INPUT_PLAYING',
  VIDEO_INPUT_PLAYING = 'VIDEO_INPUT_PLAYING',
  AUDIO_INPUT_EOS = 'AUDIO_INPUT_EOS',
  VIDEO_INPUT_EOS = 'VIDEO_INPUT_EOS',
  OUTPUT_DONE = 'OUTPUT_DONE',
}

export type SmelterEvent =
  | { type: SmelterEventType.AUDIO_INPUT_DELIVERED; inputRef: InputRef }
  | { type: SmelterEventType.VIDEO_INPUT_DELIVERED; inputRef: InputRef }
  | { type: SmelterEventType.AUDIO_INPUT_PLAYING; inputRef: InputRef }
  | { type: SmelterEventType.VIDEO_INPUT_PLAYING; inputRef: InputRef }
  | { type: SmelterEventType.AUDIO_INPUT_EOS; inputRef: InputRef }
  | { type: SmelterEventType.VIDEO_INPUT_EOS; inputRef: InputRef }
  | { type: SmelterEventType.OUTPUT_DONE; outputId: string };
