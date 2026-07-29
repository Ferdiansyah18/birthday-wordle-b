import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { TARGET_WORD, evaluateGuess, isValidWord, HINT_MESSAGES, EASTER_EGGS, CLUE } from '../utils/words';
import { playKeySound, playFlipSound, playCorrectSound, playErrorSound, playVictorySound } from '../utils/audio';
import type { LetterStatus, WordleGuess, ToastMessage } from '../types';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

/* ===== Tile Component ===== */
function Tile({ letter, status, revealed, delay, isShaking, celebrating }: {
  letter: string;
  status: LetterStatus;
  revealed: boolean;
  delay: number;
  isShaking: boolean;
  celebrating?: boolean;
}) {
  const statusColors: Record<string, string> = {
    correct: 'bg-[#6AAA64] text-white border-[#6AAA64]',
    present: 'bg-[#C9B458] text-white border-[#C9B458]',
    absent: 'bg-[#787C7E] text-white border-[#787C7E]',
    empty: 'bg-transparent border-[#D3D6DA]',
    tbd: 'bg-transparent border-[#878A8C]',
  };

  const [flipped, setFlipped] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => setFlipped(true), delay);
      return () => clearTimeout(timer);
    }
  }, [revealed, delay]);

  // GSAP celebration bounce
  useEffect(() => {
    if (!celebrating || !tileRef.current) return;
    gsap.fromTo(
      tileRef.current,
      { scale: 1 },
      {
        scale: 1.15,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        delay: delay / 1000 + 0.5,
      }
    );
  }, [celebrating, delay]);

  return (
    <div ref={tileRef} className={`tile-flip w-[56px] h-[56px] sm:w-[62px] sm:h-[62px] ${isShaking ? 'animate-shake' : ''}`}>
      <div className={`tile-flip-inner ${flipped ? 'flipped' : ''}`}>
        <div className={`tile-front border-2 font-sans ${statusColors[status] ?? statusColors.tbd}`}>
          {letter}
        </div>
        <div className={`tile-back border-2 font-sans ${statusColors[status] ?? statusColors.absent}`}>
          {letter}
        </div>
      </div>
    </div>
  );
}

/* ===== Keyboard Component ===== */
function VirtualKeyboard({ keyStates, onKey }: {
  keyStates: Record<string, LetterStatus>;
  onKey: (key: string) => void;
}) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  const getKeyColor = (key: string): string => {
    if (key === 'ENTER' || key === '⌫') return 'bg-[#D3D6DA] text-[#1A1A1B] hover:bg-[#c0c3c6]';
    const status = keyStates[key];
    switch (status) {
      case 'correct': return 'bg-[#6AAA64] text-white hover:bg-[#5a9a54]';
      case 'present': return 'bg-[#C9B458] text-white hover:bg-[#b9a448]';
      case 'absent': return 'bg-[#787C7E] text-white hover:bg-[#686c6e]';
      default: return 'bg-[#D3D6DA] text-[#1A1A1B] hover:bg-[#c0c3c6]';
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1 sm:gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKey(key)}
              className={`
                ${getKeyColor(key)}
                rounded-md font-sans font-semibold text-xs sm:text-sm
                transition-all duration-150 active:scale-95
                ${key === 'ENTER' || key === '⌫' ? 'px-3 sm:px-4 py-2.5 sm:py-3' : 'w-[30px] sm:w-[38px] h-[42px] sm:h-[50px]'}
              `}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ===== Toast Component ===== */
function Toast({ message, onDone }: { message: ToastMessage; onDone: () => void }) {
  const bgColors: Record<string, string> = {
    info: 'bg-[#878A8C]',
    success: 'bg-[#6AAA64]',
    error: 'bg-[#E74C3C]',
    hint: 'bg-[#C9A96E]',
  };

  useEffect(() => {
    const timer = setTimeout(onDone, message.duration ?? 2500);
    return () => clearTimeout(timer);
  }, [onDone, message.duration]);

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`${bgColors[message.type] ?? bgColors.info} text-white px-5 py-3 rounded-xl shadow-lg font-sans text-sm sm:text-base text-center max-w-sm`}
    >
      {message.text}
    </motion.div>
  );
}

/* ===== Hint Modal ===== */
function HintModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">{CLUE.emoji}</div>
        <h3 className="font-serif text-xl font-bold text-[#2D2D2D] mb-3">{CLUE.title}</h3>
        <p className="font-sans text-[#555] text-sm sm:text-base leading-relaxed mb-5">{CLUE.text}</p>
        <button
          onClick={onClose}
          className="bg-[#C9A96E] text-white font-sans font-semibold px-6 py-2.5 rounded-xl hover:bg-[#A68B4B] transition-colors"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ===== Victory Overlay ===== */
function VictoryOverlay({ onContinue }: { onContinue: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation for victory
  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    // GSAP scale animation for the inner content
    const inner = overlayRef.current.querySelector('.victory-content');
    if (inner) {
      gsap.fromTo(
        inner,
        { scale: 0.5, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)', delay: 0.3 }
      );
    }
  }, []);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-2xl"
    >
      <div className="victory-content text-center p-6 sm:p-8">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D] mb-2">
          You got it!
        </h2>
        <p className="font-sans text-[#888] mb-6 text-sm sm:text-base">
          The word is <span className="font-bold text-[#C9A96E]">{TARGET_WORD}</span> — just like this day! ✨
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="inline-flex items-center gap-2 bg-[#C9A96E] text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-[#A68B4B] transition-colors shadow-lg"
        >
          <Sparkles size={18} />
          Continue to Your Surprise
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

/* ===== Main WordleGame Component ===== */
export default function WordleGame({ onComplete }: { onComplete: () => void }) {
  const [guesses, setGuesses] = useState<WordleGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [keyStates, setKeyStates] = useState<Record<string, LetterStatus>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [celebrating, setCelebrating] = useState(false);
  const toastIdRef = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);

  // GSAP entrance for header
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'info', duration?: number) => {
    const id = String(++toastIdRef.current);
    setToasts(prev => [...prev, { id, text, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleKey = useCallback((key: string) => {
    if (isWon || isLost) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        addToast('Not enough letters', 'error', 1500);
        setShakeRow(guesses.length);
        playErrorSound();
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      const upperGuess = currentGuess.toUpperCase();

      // Check for easter eggs
      if (EASTER_EGGS[upperGuess]) {
        addToast(EASTER_EGGS[upperGuess], 'hint', 3000);
      }

      // Validate word
      if (!isValidWord(upperGuess)) {
        addToast('Not in word list', 'error', 1500);
        setShakeRow(guesses.length);
        playErrorSound();
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      // Evaluate guess
      const statuses = evaluateGuess(upperGuess, TARGET_WORD);
      const newGuess: WordleGuess = {
        letters: upperGuess.split(''),
        statuses,
        revealed: false,
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      // Reveal with staggered animation
      const rowIndex = newGuesses.length - 1;
      setTimeout(() => {
        setRevealedRows(prev => new Set([...prev, rowIndex]));
        playFlipSound();
      }, 100);

      // Update keyboard states after reveal
      setTimeout(() => {
        const newKeyStates = { ...keyStates };
        newGuess.letters.forEach((letter, i) => {
          const current = newKeyStates[letter];
          const newStatus = statuses[i];
          if (current === 'correct') return;
          if (current === 'present' && newStatus !== 'correct') return;
          newKeyStates[letter] = newStatus;
        });
        setKeyStates(newKeyStates);
      }, WORD_LENGTH * 200 + 200);

      // Check win/lose
      const isCorrect = statuses.every(s => s === 'correct');
      if (isCorrect) {
        setTimeout(() => {
          setIsWon(true);
          setCelebrating(true);
          playCorrectSound();
          playVictorySound();
          addToast('🎉 Brilliant! You solved it!', 'success', 3000);
        }, WORD_LENGTH * 200 + 400);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setTimeout(() => {
          setIsLost(true);
          addToast(`The word was ${TARGET_WORD} 🎂`, 'info', 5000);
          setTimeout(() => onComplete(), 4000);
        }, WORD_LENGTH * 200 + 400);
      } else {
        const attemptNum = newGuesses.length;
        const hintMsgs = HINT_MESSAGES[attemptNum];
        if (hintMsgs) {
          setTimeout(() => addToast(hintMsgs[0], 'hint', 3000), WORD_LENGTH * 200 + 600);
        }
      }

      return;
    }

    if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/i.test(key) && currentGuess.length < WORD_LENGTH) {
      playKeySound();
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [currentGuess, guesses, isWon, isLost, keyStates, addToast, onComplete]);

  // Physical keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER') handleKey('ENTER');
      else if (key === 'BACKSPACE') handleKey('BACKSPACE');
      else if (/^[A-Z]$/.test(key)) handleKey(key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  // Build grid rows
  const rows = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    const guess = guesses[i];
    if (guess) {
      rows.push(
        <div key={i} className="flex gap-1.5 sm:gap-2">
          {guess.letters.map((letter, j) => (
            <Tile
              key={j}
              letter={letter}
              status={guess.statuses[j]}
              revealed={revealedRows.has(i)}
              delay={j * 200}
              isShaking={shakeRow === i}
              celebrating={celebrating && i === guesses.length - 1}
            />
          ))}
        </div>
      );
    } else if (i === guesses.length) {
      rows.push(
        <div key={i} className={`flex gap-1.5 sm:gap-2 ${shakeRow === i ? 'animate-shake' : ''}`}>
          {Array.from({ length: WORD_LENGTH }).map((_, j) => (
            <div
              key={j}
              className={`w-[56px] h-[56px] sm:w-[62px] sm:h-[62px] border-2 rounded-lg flex items-center justify-center font-sans font-bold text-xl sm:text-2xl uppercase transition-all duration-100 ${
                j < currentGuess.length
                  ? 'border-[#878A8C] scale-105'
                  : 'border-[#D3D6DA]'
              }`}
            >
              {currentGuess[j] || ''}
            </div>
          ))}
        </div>
      );
    } else {
      rows.push(
        <div key={i} className="flex gap-1.5 sm:gap-2">
          {Array.from({ length: WORD_LENGTH }).map((_, j) => (
            <div
              key={j}
              className="w-[56px] h-[56px] sm:w-[62px] sm:h-[62px] border-2 border-[#D3D6DA] rounded-lg"
            />
          ))}
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center px-4 py-6 sm:py-10 relative">
      {/* Header - GSAP animated */}
      <div ref={headerRef} className="text-center mb-6 sm:mb-8 opacity-0">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-2">
          🎂 Birthday Wordle
        </h1>
        <p className="font-sans text-[#888] text-sm sm:text-base">
          Solve the puzzle to unlock your surprise
        </p>
      </div>

      {/* Toasts */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} message={toast} onDone={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* Hint Button */}
      <AnimatePresence>
        {guesses.length >= 3 && !isWon && !isLost && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHint(true)}
            className="mb-4 flex items-center gap-2 bg-[#FFF8F0] border border-[#C9A96E] text-[#C9A96E] font-sans font-medium px-4 py-2 rounded-xl hover:bg-[#C9A96E] hover:text-white transition-colors text-sm"
          >
            <Lightbulb size={16} />
            Need a Clue?
          </motion.button>
        )}
      </AnimatePresence>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative flex flex-col gap-1.5 sm:gap-2 mb-4"
      >
        {rows}
        
        <AnimatePresence>
          {isWon && <VictoryOverlay onContinue={onComplete} />}
        </AnimatePresence>
      </motion.div>

      {/* Lost state */}
      <AnimatePresence>
        {isLost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="font-sans text-[#888] text-sm mb-3">
              No worries! Let's move on to the surprise 🎁
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="inline-flex items-center gap-2 bg-[#C9A96E] text-white font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-[#A68B4B] transition-colors"
            >
              Continue Anyway
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard */}
      <VirtualKeyboard keyStates={keyStates} onKey={handleKey} />

      {/* Hint Modal */}
      <AnimatePresence>
        {showHint && <HintModal onClose={() => setShowHint(false)} />}
      </AnimatePresence>
    </div>
  );
}
