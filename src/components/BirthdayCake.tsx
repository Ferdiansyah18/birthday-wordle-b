import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useMicBlowDetector } from '../hooks/useMicBlowDetector';
import { playBlowOutSound, playBirthdayMelody } from '../utils/audio';
import type { CandleState } from '../types';

const NUM_CANDLES = 5;

/* ===== Candle Flame Component ===== */
function CandleFlame({ lit, extinguishing }: { lit: boolean; extinguishing: boolean }) {
  if (!lit && !extinguishing) return null;

  return (
    <div className="relative flex flex-col items-center">
      {(lit || extinguishing) && (
        <div className={`relative ${lit ? 'animate-flicker' : ''} ${extinguishing ? 'opacity-0 transition-opacity duration-500' : ''}`}>
          <div className="absolute -inset-3 bg-[#FF9F1C]/20 rounded-full blur-md animate-glow-pulse" />
          <div className="absolute -inset-1.5 bg-[#FF9F1C]/40 rounded-full blur-sm" />
          <div className="relative w-3 h-5 bg-gradient-to-t from-[#FF9F1C] via-[#FFD166] to-[#FFF3B0] rounded-full origin-bottom"
            style={{ clipPath: 'polygon(50% 0%, 100% 60%, 80% 100%, 20% 100%, 0% 60%)' }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-[#FFF3B0]/80 rounded-full"
            style={{ clipPath: 'polygon(50% 0%, 100% 60%, 0% 60%)' }}
          />
        </div>
      )}
      {extinguishing && (
        <div className="absolute -top-4">
          <div className="animate-smoke-rise w-2 h-2 bg-gray-400/40 rounded-full" />
          <div className="animate-smoke-rise w-1.5 h-1.5 bg-gray-300/30 rounded-full" style={{ animationDelay: '0.2s', marginLeft: '4px' }} />
        </div>
      )}
    </div>
  );
}

/* ===== Single Candle Component ===== */
function SingleCandle({ lit, extinguishing, delay }: { lit: boolean; extinguishing: boolean; delay: number }) {
  return (
    <div className="flex flex-col items-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-0.5">
        <CandleFlame lit={lit} extinguishing={extinguishing} />
      </div>
      <div className={`w-2.5 h-8 rounded-sm transition-all duration-500 ${
        lit ? 'bg-gradient-to-b from-[#FFE4D6] to-[#FFB6C1]' : 'bg-gradient-to-b from-gray-200 to-gray-300'
      }`}>
        <div className="w-0.5 h-2 bg-[#333] mx-auto rounded-full" />
      </div>
    </div>
  );
}

/* ===== Cake Visual Component ===== */
function CakeVisual({ candles }: { candles: CandleState[] }) {
  const allLit = candles.some(c => c.lit);
  const cakeRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation for the cake
  useEffect(() => {
    if (!cakeRef.current) return;
    gsap.fromTo(
      cakeRef.current,
      { y: 40, opacity: 0, scale: 0.85 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.6)', delay: 0.3 }
    );
  }, []);

  // GSAP subtle breathing animation for the cake
  useEffect(() => {
    if (!cakeRef.current) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(cakeRef.current, {
      y: -3,
      duration: 2.5,
      ease: 'sine.inOut',
    });
    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={cakeRef} className="relative flex flex-col items-center opacity-0">
      {allLit && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FF9F1C]/10 rounded-full blur-3xl animate-glow-pulse" />
      )}
      
      <div className="flex gap-4 sm:gap-5 mb-0 relative z-10">
        {candles.map((candle) => (
          <SingleCandle
            key={candle.id}
            lit={candle.lit}
            extinguishing={candle.extinguishing}
            delay={candle.id * 100}
          />
        ))}
      </div>

      <div className="relative w-48 sm:w-56 h-10 sm:h-12 bg-gradient-to-b from-[#F8BBD0] to-[#F48FB1] rounded-t-xl z-10 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 flex justify-around">
          {[8, 14, 10, 16, 9, 13, 11, 15].map((h, i) => (
            <div key={i} className="w-3 bg-[#FFF8F0] rounded-b-full" style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-3 rounded-full"
              style={{
                backgroundColor: ['#FF9F1C', '#6AAA64', '#E8A0BF', '#C9A96E', '#FF6B6B'][i % 5],
                transform: `rotate(${[30, 120, 210, 45, 160, 270, 80, 190, 300, 15, 140, 250][i]}deg) translate(${(Math.sin(i * 1.5) * 0.5) * 40}px, ${(Math.cos(i * 1.5) * 0.5) * 8}px)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-56 sm:w-64 h-10 sm:h-12 bg-gradient-to-b from-[#FFCC80] to-[#FFB74D] z-10" />

      <div className="w-64 sm:w-72 h-12 sm:h-14 bg-gradient-to-b from-[#FFAB91] to-[#FF8A65] rounded-b-2xl z-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#FF7043] rounded-b-2xl" />
        <div className="absolute inset-0 flex items-center justify-around px-4">
          {[0,1,2,3,4,5,6].map((i) => (
            <div key={i} className="w-2 h-2 bg-[#FFF8F0]/40 rounded-full" />
          ))}
        </div>
      </div>

      <div className="w-72 sm:w-80 h-3 bg-gradient-to-b from-gray-100 to-gray-200 rounded-b-xl mt-0.5 shadow-lg" />
    </div>
  );
}

/* ===== Blow Intensity Meter ===== */
function IntensityMeter({ intensity }: { intensity: number }) {
  return (
    <div className="w-48 sm:w-56 h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#C9A96E] to-[#FF9F1C] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, intensity)}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

/* ===== Main BirthdayCake Phase Component ===== */
export default function BirthdayCake({ onComplete }: { onComplete: () => void }) {
  const [candles, setCandles] = useState<CandleState[]>(
    Array.from({ length: NUM_CANDLES }, (_, i) => ({ id: i, lit: true, extinguishing: false }))
  );
  const [allOut, setAllOut] = useState(false);
  const [roomLit, setRoomLit] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0);
  const [micStarted, setMicStarted] = useState(false);
  const blowAccumulatorRef = useRef(0);
  const completedRef = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const {
    isBlowing,
    blowIntensity,
    error,
    startListening,
    stopListening,
  } = useMicBlowDetector({
    threshold: 30,
    debounceDuration: 150,
  });

  // GSAP entrance animation for title
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  // GSAP ambient glow animation
  useEffect(() => {
    if (!glowRef.current || allOut) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(glowRef.current, {
      opacity: 0.12,
      scale: 1.05,
      duration: 3,
      ease: 'sine.inOut',
    });
    return () => { tl.kill(); };
  }, [allOut]);

  // GSAP room brighten animation
  useEffect(() => {
    if (!roomLit) return;
    // Animate the background transition with GSAP for extra smoothness
    gsap.fromTo(
      '.room-brighten',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' }
    );
  }, [roomLit]);

  const handleStartMic = useCallback(async () => {
    await startListening();
    setMicStarted(true);
  }, [startListening]);

  // Handle blow detection
  useEffect(() => {
    if (allOut || completedRef.current) return;

    if (isBlowing && blowIntensity > 30) {
      blowAccumulatorRef.current += blowIntensity * 0.02;
      setBlowProgress(prev => Math.min(100, prev + blowIntensity * 0.02));

      const currentAccum = blowAccumulatorRef.current;
      setCandles(prev => {
        const newCandles = [...prev];
        const thresholdPerCandle = 100 / NUM_CANDLES;
        let changed = false;

        for (let i = 0; i < newCandles.length; i++) {
          if (newCandles[i].lit && currentAccum >= thresholdPerCandle * (i + 1)) {
            newCandles[i] = { ...newCandles[i], lit: false, extinguishing: true };
            changed = true;
            playBlowOutSound();
            setTimeout(() => {
              setCandles(p => p.map((c, idx) => idx === i ? { ...c, extinguishing: false } : c));
            }, 1500);
          }
        }
        return changed ? newCandles : prev;
      });
    } else {
      setBlowProgress(prev => Math.max(0, prev - 0.5));
    }
  }, [isBlowing, blowIntensity, allOut]);

  // Check if all candles are out
  useEffect(() => {
    const allExtinguished = candles.every(c => !c.lit && !c.extinguishing);
    if (allExtinguished && !allOut && !completedRef.current) {
      completedRef.current = true;
      setAllOut(true);
      stopListening();
    }
  }, [candles, allOut, stopListening]);

  // Handle all candles out - celebration
  useEffect(() => {
    if (!allOut) return;

    setTimeout(() => setRoomLit(true), 500);

    setTimeout(() => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#C9A96E', '#E8A0BF', '#FF9F1C', '#6AAA64', '#FFD166'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#C9A96E', '#E8A0BF', '#FF9F1C', '#6AAA64', '#FFD166'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#C9A96E', '#E8A0BF', '#FF9F1C', '#6AAA64', '#FFD166'],
      });
    }, 800);

    setTimeout(() => {
      playBirthdayMelody();
    }, 1000);

    setTimeout(() => setShowContinue(true), 2500);
  }, [allOut]);

  // Fallback: click to extinguish
  const handleFallbackClick = useCallback(() => {
    if (allOut) return;
    
    setCandles(prev => {
      const nextLit = prev.findIndex(c => c.lit);
      if (nextLit === -1) return prev;
      const newCandles = [...prev];
      newCandles[nextLit] = { ...newCandles[nextLit], lit: false, extinguishing: true };
      playBlowOutSound();
      setTimeout(() => {
        setCandles(p => p.map((c, idx) => idx === nextLit ? { ...c, extinguishing: false } : c));
      }, 1500);
      return newCandles;
    });
  }, [allOut]);

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center transition-all duration-1000 relative overflow-hidden ${
      roomLit
        ? 'bg-gradient-to-b from-[#FFF8F0] via-[#FFF0E8] to-[#FFE4D6]'
        : 'bg-gradient-to-b from-[#0F0E17] via-[#1A1930] to-[#0F0E17]'
    }`}>
      
      {/* Ambient warm glow when candles are lit - GSAP animated */}
      {!allOut && (
        <div ref={glowRef} className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF9F1C] rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF9F1C] rounded-full blur-2xl" />
        </div>
      )}

      {/* Stars in dark mode */}
      {!roomLit && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${[5,12,20,28,35,42,50,58,65,72,80,88,95,8,18,38,48,68,78,92,3,23,33,53,63,73,83,93,13,43][i]}%`,
                top: `${[10,15,20,25,8,30,12,22,18,28,5,35,15,40,25,10,20,30,8,22,38,12,28,18,5,35,15,25,32,20][i]}%`,
                opacity: [0.3, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.2, 0.4, 0.6][i],
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center z-10 px-4 py-8"
      >
        {/* Title - GSAP animated */}
        <h2
          ref={titleRef}
          className={`font-serif text-2xl sm:text-3xl font-bold mb-8 text-center opacity-0 ${
            roomLit ? 'text-[#2D2D2D]' : 'text-white/90'
          }`}
        >
          Make a Wish! 🌟
        </h2>

        {/* Cake */}
        <div className="mb-8">
          <CakeVisual candles={candles} />
        </div>

        {/* Instructions & Controls */}
        {!allOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            {!micStarted && !error && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartMic}
                className="flex items-center gap-2 bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] font-sans font-medium px-5 py-3 rounded-xl hover:bg-[#C9A96E]/30 transition-colors"
              >
                <Mic size={18} />
                Enable Microphone
              </motion.button>
            )}

            {micStarted && !error && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-white/60 font-sans text-sm">
                  <Mic size={14} className="text-[#C9A96E]" />
                  <span>Listening for your breath...</span>
                  {isBlowing && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[#FF9F1C] font-semibold"
                    >
                      💨 Blowing!
                    </motion.span>
                  )}
                </div>
                <IntensityMeter intensity={blowProgress} />
              </div>
            )}

            <p className={`font-sans text-center text-sm max-w-xs ${
              roomLit ? 'text-[#888]' : 'text-white/50'
            }`}>
              {micStarted && !error
                ? 'Blow into your microphone to blow out the candles!'
                : 'Click the button below to blow out the candles'}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFallbackClick}
              className={`flex items-center gap-2 font-sans font-medium px-4 py-2 rounded-lg text-sm transition-colors ${
                roomLit
                  ? 'bg-[#C9A96E]/10 text-[#C9A96E] hover:bg-[#C9A96E]/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              <MicOff size={14} />
              Click to Extinguish
            </motion.button>

            {error && (
              <p className="font-sans text-[#E8A0BF] text-xs text-center max-w-xs">
                {error}
              </p>
            )}
          </motion.div>
        )}

        {/* Celebration message */}
        <AnimatePresence>
          {allOut && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-4 mt-4"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#C9A96E] mb-2">
                  🎂 Happy Birthday! 🎂
                </p>
                <p className="font-sans text-[#888] text-sm">
                  Your wish has been made ✨
                </p>
              </motion.div>

              {showContinue && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="inline-flex items-center gap-2 bg-[#C9A96E] text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-[#A68B4B] transition-colors shadow-lg mt-4"
                >
                  <Sparkles size={18} />
                  Read Your Letter
                  <ArrowRight size={18} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
