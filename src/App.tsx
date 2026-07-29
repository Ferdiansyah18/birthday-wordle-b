import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import type { Phase } from './types';
import WordleGame from './components/WordleGame';
import BirthdayCake from './components/BirthdayCake';
import BirthdayLetter from './components/BirthdayLetter';

/* ===== Phase Transition Wrapper with GSAP ===== */
function PhaseTransition({ children, phaseKey }: { children: React.ReactNode; phaseKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // GSAP phase entrance animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.97, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, [phaseKey]);

  return (
    <div ref={containerRef} className="w-full min-h-screen opacity-0" key={phaseKey}>
      {children}
    </div>
  );
}

/* ===== Main App ===== */
export default function App() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('wordle');
  const appRef = useRef<HTMLDivElement>(null);

  const goToCake = useCallback(() => {
    // GSAP exit animation before phase change
    if (appRef.current) {
      gsap.to(appRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentPhase('cake');
          // Reset opacity for the new phase
          gsap.set(appRef.current, { opacity: 1, scale: 1 });
        },
      });
    } else {
      setCurrentPhase('cake');
    }
  }, []);

  const goToLetter = useCallback(() => {
    if (appRef.current) {
      gsap.to(appRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentPhase('letter');
          gsap.set(appRef.current, { opacity: 1, scale: 1 });
        },
      });
    } else {
      setCurrentPhase('letter');
    }
  }, []);

  return (
    <div ref={appRef} className="min-h-screen bg-[#FFF8F0] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentPhase === 'wordle' && (
          <PhaseTransition key="wordle" phaseKey="wordle">
            <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] via-[#FFF0E8] to-[#FFE4D6] flex items-center justify-center py-4 sm:py-8">
              {/* Decorative background elements */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E8A0BF]/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF9F1C]/3 rounded-full blur-3xl" />
              </div>
              
              {/* Subtle dot grid pattern */}
              <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)`,
                  backgroundSize: '40px 40px',
                }}
              />

              <WordleGame onComplete={goToCake} />
            </div>
          </PhaseTransition>
        )}

        {currentPhase === 'cake' && (
          <PhaseTransition key="cake" phaseKey="cake">
            <BirthdayCake onComplete={goToLetter} />
          </PhaseTransition>
        )}

        {currentPhase === 'letter' && (
          <PhaseTransition key="letter" phaseKey="letter">
            <BirthdayLetter />
          </PhaseTransition>
        )}
      </AnimatePresence>
    </div>
  );
}
