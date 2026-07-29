/* ===== Phase Types ===== */
export type Phase = 'wordle' | 'cake' | 'letter';

/* ===== Wordle Types ===== */
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export interface WordleGuess {
  letters: string[];
  statuses: LetterStatus[];
  revealed: boolean;
}

export interface KeyboardState {
  [key: string]: LetterStatus;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'hint';
  duration?: number;
}

/* ===== Mic Blow Types ===== */
export interface MicBlowDetectorOptions {
  threshold?: number;
  debounceDuration?: number;
  autoStart?: boolean;
  onBlowStart?: () => void;
  onBlowEnd?: () => void;
}

export interface MicBlowDetectorReturn {
  isBlowing: boolean;
  blowIntensity: number;
  hasPermission: boolean | null;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

/* ===== Candle Types ===== */
export interface CandleState {
  id: number;
  lit: boolean;
  extinguishing: boolean;
}

/* ===== Photo Types ===== */
export interface PhotoItem {
  id: number;
  url: string;
  caption: string;
}
