import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playEnvelopeSound } from '../utils/audio';
import type { PhotoItem } from '../types';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/* ===== Photo Data ===== */
const PHOTOS: PhotoItem[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop', caption: 'Birthday celebrations 🎉' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop', caption: 'Making memories together ✨' },
  { id: 3, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop', caption: 'Adventures await 🌍' },
  { id: 4, url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', caption: 'Ocean vibes 🌊' },
  { id: 5, url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=300&fit=crop', caption: 'Golden moments 🌅' },
  { id: 6, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', caption: 'Reaching new heights 🏔️' },
];

/* ===== Envelope Component ===== */
function Envelope({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation
  useEffect(() => {
    if (!envelopeRef.current) return;
    gsap.fromTo(
      envelopeRef.current,
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: 0.3 }
    );
  }, []);

  // GSAP floating animation
  useEffect(() => {
    if (!envelopeRef.current) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(envelopeRef.current, {
      y: -8,
      duration: 2,
      ease: 'sine.inOut',
    });
    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={envelopeRef} className="flex flex-col items-center opacity-0">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="font-handwritten text-xl sm:text-2xl text-[#C9A96E] mb-8 text-center"
      >
        You have a special letter...
      </motion.p>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onOpen}
        className="relative cursor-pointer group"
      >
        {/* Envelope body */}
        <div className="w-72 sm:w-80 h-48 sm:h-52 bg-gradient-to-b from-[#F5E6D3] to-[#EDD9C4] rounded-lg shadow-xl relative overflow-hidden">
          {/* Envelope flap (triangle top) */}
          <div className="absolute top-0 left-0 right-0 h-0 
            border-l-[144px] sm:border-l-[160px] border-r-[144px] sm:border-r-[160px] 
            border-t-[70px] sm:border-t-[80px] 
            border-l-transparent border-r-transparent border-t-[#E8D0B8]
            transition-colors duration-300 group-hover:border-t-[#DFC5A8]"
          />
          
          {/* Wax seal */}
          <motion.div
            animate={{ rotate: hovered ? [0, -8, 8, -8, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C9A96E] to-[#A68B4B] rounded-full flex items-center justify-center shadow-lg gold-glow">
              <Heart size={20} className="text-white fill-white" />
            </div>
          </motion.div>

          {/* Decorative lines */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-2">
            <div className="h-px bg-[#C9A96E]/20" />
            <div className="h-px bg-[#C9A96E]/15" />
            <div className="h-px bg-[#C9A96E]/10" />
          </div>
        </div>

        {/* Hover hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-sans text-sm text-[#C9A96E] whitespace-nowrap"
        >
          Click to open ✉️
        </motion.div>
      </div>
    </div>
  );
}

/* ===== Photo Carousel ===== */
function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // GSAP scroll-triggered entrance
  useEffect(() => {
    if (!carouselRef.current) return;
    gsap.fromTo(
      carouselRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  const next = useCallback(() => setCurrent(prev => (prev + 1) % PHOTOS.length), []);
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + PHOTOS.length) % PHOTOS.length), []);

  return (
    <div ref={carouselRef} className="w-full max-w-md mx-auto opacity-0">
      <h3 className="font-serif text-lg font-bold text-[#2D2D2D] mb-4 text-center flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-[#C9A96E]" />
        Memories Together
        <Sparkles size={16} className="text-[#C9A96E]" />
      </h3>
      
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={PHOTOS[current].url}
              alt={PHOTOS[current].caption}
              className="w-full h-56 sm:h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="font-handwritten text-lg text-white">{PHOTOS[current].caption}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft size={16} className="text-[#2D2D2D]" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight size={16} className="text-[#2D2D2D]" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-[#C9A96E] w-6' : 'bg-[#C9A96E]/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Voucher Card (Scratch/Flip) ===== */
function VoucherCard() {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP scroll-triggered entrance
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0, rotateY: -10 },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <div ref={cardRef} className="w-full max-w-sm mx-auto opacity-0">
      <h3 className="font-serif text-lg font-bold text-[#2D2D2D] mb-4 text-center flex items-center justify-center gap-2">
        <Gift size={16} className="text-[#E8A0BF]" />
        A Little Surprise
        <Gift size={16} className="text-[#E8A0BF]" />
      </h3>

      <motion.div
        onClick={() => !flipped && setFlipped(true)}
        whileHover={!flipped ? { scale: 1.02, y: -2 } : {}}
        whileTap={!flipped ? { scale: 0.98 } : {}}
        className="relative cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-48"
        >
          {/* Front - Hidden side */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A96E] to-[#A68B4B] p-6 flex flex-col items-center justify-center shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Gift size={32} className="text-white" />
            </div>
            <p className="font-serif text-white text-lg font-bold">Tap to Reveal</p>
            <p className="font-sans text-white/70 text-xs mt-1">Your special gift awaits</p>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10 overflow-hidden rounded-2xl">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 border border-white rounded-full"
                  style={{
                    left: `${[10,25,40,55,70,85,15,35,50,65,80,5,20,45,60,75,90,30,55,70][i]}%`,
                    top: `${[10,20,30,15,25,35,45,50,10,40,55,60,70,80,75,65,85,90,95,50][i]}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Back - Revealed side */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE4D6] p-6 flex flex-col items-center justify-center shadow-xl border-2 border-[#C9A96E]/20"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-4xl mb-2">🧋</div>
            <p className="font-serif text-2xl font-bold text-[#C9A96E] mb-1">Free Boba Date</p>
            <p className="font-sans text-[#888] text-sm text-center">Redeemable anytime, anywhere — because you deserve the sweetest things!</p>
            <div className="mt-3 px-4 py-1.5 bg-[#C9A96E]/10 rounded-full">
              <p className="font-sans text-[#C9A96E] text-xs font-medium">VALID: Forever 💛</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ===== Birthday Letter Content ===== */
function LetterContent() {
  const letterRef = useRef<HTMLDivElement>(null);

  // GSAP staggered letter reveal
  useEffect(() => {
    if (!letterRef.current) return;

    const paragraphs = letterRef.current.querySelectorAll('.letter-paragraph');
    gsap.fromTo(
      paragraphs,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: letterRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <div ref={letterRef} className="letter-paper rounded-2xl p-6 sm:p-8 md:p-10 max-w-2xl mx-auto shadow-xl">
      {/* Decorative header */}
      <div className="text-center mb-6">
        <div className="inline-block">
          <div className="text-3xl mb-2">🎂</div>
          <div className="w-16 h-0.5 bg-[#C9A96E]/30 mx-auto mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
            Happy Birthday
          </h2>
          <div className="w-16 h-0.5 bg-[#C9A96E]/30 mx-auto mt-3" />
        </div>
      </div>

      {/* Letter body */}
      <div className="space-y-4 text-[#444] leading-relaxed">
        <p className="font-handwritten text-xl sm:text-2xl text-[#C9A96E] letter-paragraph">
          Dearest Birthday Star,
        </p>
        
        <p className="font-sans text-sm sm:text-base letter-paragraph">
          Today is your day — a day the world became a little brighter, a little warmer, 
          and a whole lot more wonderful because you walked into it. 
        </p>

        <p className="font-sans text-sm sm:text-base letter-paragraph">
          I hope this little surprise brought a smile to your face. You deserve all the 
          joy, laughter, and cake this world has to offer (and maybe a few extra candles 
          too, just for the fun of it 🕯️✨).
        </p>

        <p className="font-sans text-sm sm:text-base letter-paragraph">
          Thank you for being the incredible person you are — for your kindness that 
          lights up every room, your laughter that's absolutely contagious, and your 
          ability to make even the ordinary moments feel extraordinary.
        </p>

        <p className="font-sans text-sm sm:text-base letter-paragraph">
          May this new year of your life be filled with adventure, love, and all the 
          sweet things — both literal and figurative. Just like the word you guessed 
          earlier — <span className="font-handwritten text-lg text-[#C9A96E]">SWEET</span> — 
          may every moment be exactly that.
        </p>

        <p className="font-sans text-sm sm:text-base letter-paragraph">
          Here's to another year of making memories, taking chances, and eating 
          way too much cake. Because birthday calories don't count, right? 🍰
        </p>

        <div className="pt-4 text-right letter-paragraph">
          <p className="font-handwritten text-xl sm:text-2xl text-[#C9A96E]">
            With all my love,
          </p>
          <p className="font-handwritten text-2xl sm:text-3xl text-[#C9A96E] mt-1">
            🌹 Your Secret Admirer
          </p>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="mt-8 flex justify-center gap-2">
        {['✨', '💛', '🎂', '💛', '✨'].map((emoji, i) => (
          <span key={i} className="text-lg">{emoji}</span>
        ))}
      </div>
    </div>
  );
}

/* ===== Main BirthdayLetter Phase Component ===== */
export default function BirthdayLetter() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpenEnvelope = useCallback(() => {
    playEnvelopeSound();
    setEnvelopeOpened(true);
    // Show content after envelope animation
    setTimeout(() => setShowContent(true), 600);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-gradient-to-b from-[#FFF8F0] via-[#FFF0E8] to-[#FFE4D6] relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#C9A96E]/5 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-10 w-40 h-40 bg-[#E8A0BF]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-[#FF9F1C]/5 rounded-full blur-2xl" />
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#C9A96E]/20 rounded-full animate-float"
            style={{
              left: `${[8,15,25,35,45,55,65,75,85,92,12,32,52,72,88][i]}%`,
              top: `${[10,25,40,15,35,55,20,45,65,30,70,50,80,60,85][i]}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-12 sm:py-16">
        {/* Envelope or Content */}
        <AnimatePresence mode="wait">
          {!envelopeOpened ? (
            <Envelope key="envelope" onOpen={handleOpenEnvelope} />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl space-y-12 sm:space-y-16"
            >
              {/* Letter */}
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <LetterContent />
                </motion.div>
              )}

              {/* Photo Carousel */}
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <PhotoCarousel />
                </motion.div>
              )}

              {/* Voucher Card */}
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <VoucherCard />
                </motion.div>
              )}

              {/* Footer */}
              {showContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-center pb-8"
                >
                  <div className="w-12 h-px bg-[#C9A96E]/30 mx-auto mb-4" />
                  <p className="font-handwritten text-lg text-[#C9A96E]">
                    Made with 💛 just for you
                  </p>
                  <p className="font-sans text-xs text-[#C9A96E]/50 mt-2">
                    🎂 Happy Birthday 🎂
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
