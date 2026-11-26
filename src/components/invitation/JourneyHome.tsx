import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RotateCcw } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './JourneyHome.css';

gsap.registerPlugin(useGSAP);

type Chapter = 1 | 2 | 3 | 4 | 5;
type Props = {
  onReplayOpening?: () => void;
  onTriggerPetalBurst?: () => void;
};

const CHAPTERS: { id: Chapter; label: string; prompt: string }[] = [
  { id: 1, label: 'The First Encounter', prompt: 'Touch the coastal bloom' },
  { id: 2, label: 'When Love Bloomed',   prompt: 'Touch the twin rosebuds' },
  { id: 3, label: 'The Promise',         prompt: 'Touch the glass dome' },
  { id: 4, label: 'The Union',           prompt: 'Touch the antique music box' },
  { id: 5, label: 'Forever Begins',      prompt: 'Touch the golden rings' },
];

/* ── Delicate White Butterfly SVG ────────────────────────────────────────── */
function WhiteButterfly({ className }: { className?: string }) {
  return (
    <svg className={`butterfly-svg ${className ?? ''}`} viewBox="0 0 64 56" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="wing-ivory" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#fbf2e4" />
          <stop offset="100%" stopColor="#e8d6bc" />
        </radialGradient>
        <linearGradient id="wing-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#d9c6a8" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Left Wings */}
      <g className="butterfly-wing butterfly-wing--left">
        <path d="M31 27 C24 10, 6 4, 4 17 C2 28, 16 32, 30 30 Z" fill="url(#wing-ivory)" stroke="#c7ad87" strokeWidth="0.7" />
        <path d="M30 30 C19 32, 9 40, 14 48 C19 54, 29 44, 31 33 Z" fill="url(#wing-silver)" stroke="#c7ad87" strokeWidth="0.6" />
        <path d="M27 24 C19 17, 12 16, 8 19" stroke="#d4ba94" strokeWidth="0.5" opacity="0.7" />
      </g>
      {/* Right Wings */}
      <g className="butterfly-wing butterfly-wing--right">
        <path d="M33 27 C40 10, 58 4, 60 17 C62 28, 48 32, 34 30 Z" fill="url(#wing-ivory)" stroke="#c7ad87" strokeWidth="0.7" />
        <path d="M34 30 C45 32, 55 40, 50 48 C45 54, 35 44, 33 33 Z" fill="url(#wing-silver)" stroke="#c7ad87" strokeWidth="0.6" />
        <path d="M37 24 C45 17, 52 16, 56 19" stroke="#d4ba94" strokeWidth="0.5" opacity="0.7" />
      </g>
      {/* Body & Antennae */}
      <ellipse cx="32" cy="30" rx="1.6" ry="8.5" fill="#9b7b53" />
      <path d="M31.5 22 C29 17, 26 15, 24 15.5 M32.5 22 C35 17, 38 15, 40 15.5" stroke="#9b7b53" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

export default function JourneyHome({ onReplayOpening, onTriggerPetalBurst }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<Chapter>(1);
  const [completed, setCompleted] = useState<Record<Chapter, boolean>>({
    1: false, 2: false, 3: false, 4: false, 5: false,
  });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const busy = useRef(false);

  /* 3D Parallax from pointer or gentle drift on mobile */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: nx, y: ny });
  }, []);

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  /* Transition to next chapter with guiding butterfly/petal */
  const advanceTo = useCallback((next: Chapter) => {
    const guide = stageRef.current?.querySelector('.journey-guide');
    if (guide) {
      gsap.fromTo(
        guide,
        { autoAlpha: 0, x: -40, y: 12, scale: 0.7 },
        {
          autoAlpha: 1, x: 55, y: -22, scale: 1, duration: 1.2, ease: 'sine.inOut',
          onComplete: () => {
            gsap.to(guide, {
              autoAlpha: 0, duration: 0.45,
              onComplete: () => { setChapter(next); busy.current = false; },
            });
          },
        }
      );
    } else {
      setChapter(next);
      busy.current = false;
    }
  }, []);

  /* GSAP Interactive Sequences */
  const { contextSafe } = useGSAP({ scope: stageRef });

  const playChapter1 = contextSafe(() => {
    if (busy.current || completed[1]) return;
    busy.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        setCompleted(c => ({ ...c, 1: true }));
        setTimeout(() => advanceTo(2), 900);
      },
    });
    tl.to('.ch1-b1', { x: 78, y: 24, rotation: 8, scale: 0.92, duration: 2.1, ease: 'sine.inOut' }, 0)
      .to('.ch1-b2', { x: -78, y: 22, rotation: -8, scale: 0.92, duration: 2.1, ease: 'sine.inOut' }, 0)
      .to('.ch1-bloom-glow', { opacity: 1, scale: 1.25, duration: 1.2, ease: 'sine.out' }, 1.4)
      .to('.ch1-flower', { scale: 1.07, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 1.5);
  });

  const playChapter2 = contextSafe(() => {
    if (busy.current || completed[2]) return;
    busy.current = true;
    onTriggerPetalBurst?.();
    const tl = gsap.timeline({
      onComplete: () => {
        setCompleted(c => ({ ...c, 2: true }));
        setTimeout(() => advanceTo(3), 1000);
      },
    });
    tl.to('.ch2-bud-left', { x: 16, rotation: 6, duration: 1.4, ease: 'sine.inOut' }, 0)
      .to('.ch2-bud-right', { x: -16, rotation: -6, duration: 1.4, ease: 'sine.inOut' }, 0)
      .to('.ch2-petal-outer', { scale: 1.28, opacity: 1, duration: 1.5, stagger: 0.08, ease: 'power2.out' }, 0.35)
      .to('.ch2-vine-bind', { strokeDashoffset: 0, opacity: 1, duration: 1.3, ease: 'sine.inOut' }, 0.6)
      .to('.ch2-burst-petal', {
        y: 120, x: 'random(-90, 90)', rotation: 'random(-120, 120)',
        opacity: 0, duration: 2.2, stagger: 0.06, ease: 'power1.out',
      }, 0.8);
  });

  const playChapter3 = contextSafe(() => {
    if (busy.current || completed[3]) return;
    busy.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        setCompleted(c => ({ ...c, 3: true }));
        setTimeout(() => advanceTo(4), 1050);
      },
    });
    tl.to('.ch3-dome', { y: -74, opacity: 0.25, scale: 0.96, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to('.ch3-flower', { scale: 1.18, duration: 1.2, ease: 'sine.out' }, 0.5)
      .fromTo('.ch3-ring', { y: 24, autoAlpha: 0, scale: 0.6 }, { y: -26, autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.9)
      .to('.ch3-ring', { rotationY: 360, duration: 2.4, ease: 'sine.inOut' }, 1.5)
      .to('.ch3-diamond-glint', { opacity: 1, scale: 1.4, duration: 0.5, yoyo: true, repeat: 3 }, 1.6);
  });

  const playChapter4 = contextSafe(() => {
    if (busy.current || completed[4]) return;
    busy.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        setCompleted(c => ({ ...c, 4: true }));
        setTimeout(() => advanceTo(5), 1100);
      },
    });
    tl.to('.ch4-lid', { scaleY: -0.75, y: -14, duration: 1.2, ease: 'power2.inOut' }, 0)
      .fromTo('.ch4-dancers', { y: 30, autoAlpha: 0, scale: 0.75 }, { y: -18, autoAlpha: 1, scale: 1, duration: 1.3, ease: 'power2.out' }, 0.6)
      .to('.ch4-dancers', { rotationY: 22, x: 8, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 1.3)
      .to('.ch4-spark', { y: -55, opacity: 0, duration: 1.8, stagger: 0.15, ease: 'sine.out' }, 0.9);
  });

  const playChapter5 = contextSafe(() => {
    if (busy.current || completed[5]) return;
    busy.current = true;
    onTriggerPetalBurst?.();
    const tl = gsap.timeline({
      onComplete: () => {
        setCompleted(c => ({ ...c, 5: true }));
        busy.current = false;
      },
    });
    tl.to('.ch5-ring-left', { x: 26, rotation: -12, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to('.ch5-ring-right', { x: -26, rotation: 12, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to('.ch5-infinity-glow', { opacity: 1, scale: 1.12, duration: 1.4, ease: 'sine.out' }, 1.0)
      .fromTo('.ch5-finale-text', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 1.3);
  });

  const replayJourney = () => {
    busy.current = false;
    setCompleted({ 1: false, 2: false, 3: false, 4: false, 5: false });
    setChapter(1);
  };

  /* Auto-gentle idle breathing when chapter enters */
  useEffect(() => {
    const el = stageRef.current?.querySelector('.chapter-stage');
    if (el) {
      gsap.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' });
    }
  }, [chapter]);

  const currentMeta = CHAPTERS[chapter - 1];

  return (
    <div
      ref={stageRef}
      className="journey-world"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
    >
      {/* 3D Parallax Coastal Depth Layer */}
      <div
        className="journey-parallax-sun"
        style={{ transform: `translate3d(${parallax.x * -12}px, ${parallax.y * -8}px, 0)` }}
        aria-hidden="true"
      />
      <div
        className="journey-silk-breeze"
        style={{ transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 5}px, 0)` }}
        aria-hidden="true"
      />

      {/* Editorial Title */}
      <header className="journey-header">
        <p className="journey-subtitle">A Journey to Forever</p>
        <div className="journey-progress" role="tablist" aria-label="Story chapters">
          {CHAPTERS.map(item => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={chapter === item.id}
              aria-label={`Chapter ${item.id}: ${item.label}`}
              className={`journey-dot${chapter === item.id ? ' active' : ''}${completed[item.id] ? ' done' : ''}`}
              onClick={() => { if (!busy.current) setChapter(item.id); }}
            />
          ))}
        </div>
        <h2 className="journey-chapter-title">{currentMeta.label}</h2>
      </header>

      {/* Interactive Environment Stage */}
      <div
        className="journey-canvas"
        style={{ transform: `perspective(1000px) rotateY(${parallax.x * 2.5}deg) rotateX(${parallax.y * -2}deg)` }}
      >
        {/* Guiding Butterfly between chapters */}
        <div className="journey-guide" aria-hidden="true">
          <WhiteButterfly />
        </div>

        {/* ── CHAPTER 1: THE FIRST ENCOUNTER ── */}
        {chapter === 1 && (
          <div className="chapter-stage chapter-1" onClick={playChapter1} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') playChapter1(); }}
            aria-label="Chapter 1: The First Encounter. Activate to bring the butterflies together."
          >
            <div className="ch1-b1"><WhiteButterfly /></div>
            <div className="ch1-b2"><WhiteButterfly /></div>
            <div className="ch1-bloom-glow" aria-hidden="true" />
            <svg className="ch1-flower" viewBox="0 0 180 160" fill="none" aria-hidden="true">
              <defs>
                <radialGradient id="pearl-petal" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#faf0e1" />
                  <stop offset="100%" stopColor="#e6cfb0" />
                </radialGradient>
                <radialGradient id="gold-core" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ffe79e" />
                  <stop offset="100%" stopColor="#b88026" />
                </radialGradient>
              </defs>
              {/* Coastal bloom petals */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <ellipse key={deg} cx="90" cy="48" rx="18" ry="36" fill="url(#pearl-petal)" stroke="#d2b68e" strokeWidth="0.8"
                  transform={`rotate(${deg} 90 84)`} />
              ))}
              <circle cx="90" cy="84" r="16" fill="url(#gold-core)" />
              <circle cx="90" cy="84" r="10" fill="none" stroke="#fff5d6" strokeWidth="0.9" strokeDasharray="2 3" />
            </svg>
          </div>
        )}

        {/* ── CHAPTER 2: WHEN LOVE BLOOMED ── */}
        {chapter === 2 && (
          <div className="chapter-stage chapter-2" onClick={playChapter2} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') playChapter2(); }}
            aria-label="Chapter 2: When Love Bloomed. Activate to bloom the twin buds."
          >
            <svg className="ch2-svg" viewBox="0 0 240 190" fill="none" aria-hidden="true">
              <defs>
                <radialGradient id="bud-pearl" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#fbece5" />
                  <stop offset="100%" stopColor="#dfbfb4" />
                </radialGradient>
              </defs>
              {/* Stems */}
              <path d="M84 172 C84 135, 95 110, 96 86" stroke="#7d8f69" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M156 172 C156 135, 145 110, 144 86" stroke="#7d8f69" strokeWidth="2.5" strokeLinecap="round" />
              {/* Golden binding vine */}
              <path className="ch2-vine-bind" d="M88 145 C115 130, 125 115, 148 100" stroke="#c89438" strokeWidth="1.6" strokeDasharray="120" strokeDashoffset="120" opacity="0" />
              {/* Left Bud */}
              <g className="ch2-bud-left">
                <ellipse className="ch2-petal-outer" cx="84" cy="74" rx="18" ry="26" fill="url(#bud-pearl)" stroke="#cfa89b" strokeWidth="0.8" transform="rotate(-22 92 82)" opacity="0.7" />
                <ellipse className="ch2-petal-outer" cx="102" cy="74" rx="18" ry="26" fill="url(#bud-pearl)" stroke="#cfa89b" strokeWidth="0.8" transform="rotate(20 92 82)" opacity="0.7" />
                <path d="M93 52 C80 65, 82 88, 93 94 C104 88, 106 65, 93 52 Z" fill="url(#bud-pearl)" stroke="#c7a08f" strokeWidth="0.9" />
              </g>
              {/* Right Bud */}
              <g className="ch2-bud-right">
                <ellipse className="ch2-petal-outer" cx="138" cy="74" rx="18" ry="26" fill="url(#bud-pearl)" stroke="#cfa89b" strokeWidth="0.8" transform="rotate(-20 148 82)" opacity="0.7" />
                <ellipse className="ch2-petal-outer" cx="156" cy="74" rx="18" ry="26" fill="url(#bud-pearl)" stroke="#cfa89b" strokeWidth="0.8" transform="rotate(22 148 82)" opacity="0.7" />
                <path d="M147 52 C134 65, 136 88, 147 94 C158 88, 160 65, 147 52 Z" fill="url(#bud-pearl)" stroke="#c7a08f" strokeWidth="0.9" />
              </g>
            </svg>
            {[...Array(8)].map((_, i) => (
              <span key={i} className="ch2-burst-petal" style={{ left: `${38 + (i % 4) * 8}%`, top: '34%' }} aria-hidden="true" />
            ))}
          </div>
        )}

        {/* ── CHAPTER 3: THE PROMISE ── */}
        {chapter === 3 && (
          <div className="chapter-stage chapter-3" onClick={playChapter3} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') playChapter3(); }}
            aria-label="Chapter 3: The Promise. Activate to lift the glass dome and reveal the diamond ring."
          >
            {/* Diamond Ring rising from bloom */}
            <div className="ch3-ring" aria-hidden="true">
              <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
                <defs>
                  <linearGradient id="silver-band" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor="#d9dde3" />
                    <stop offset="100%" stopColor="#9aa3b0" />
                  </linearGradient>
                  <linearGradient id="diamond-facet" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#e8f3ff" />
                    <stop offset="100%" stopColor="#bfd4ea" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="44" r="18" stroke="url(#silver-band)" strokeWidth="4.5" fill="none" />
                <polygon points="32,8 43,19 32,27 21,19" fill="url(#diamond-facet)" stroke="#a9bfd6" strokeWidth="0.9" />
                <path className="ch3-diamond-glint" d="M32 2v6M22 14l4 2M42 14l-4 2" stroke="#fff7d6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              </svg>
            </div>

            {/* White Flower inside dome */}
            <svg className="ch3-flower" viewBox="0 0 120 90" fill="none" aria-hidden="true">
              {[0, 60, 120, 180, 240, 300].map(deg => (
                <ellipse key={deg} cx="60" cy="36" rx="11" ry="20" fill="#fffaf3" stroke="#d5be9a" strokeWidth="0.7" transform={`rotate(${deg} 60 54)`} />
              ))}
              <circle cx="60" cy="54" r="9" fill="#d9a648" />
            </svg>

            {/* Glass Cloche Dome */}
            <svg className="ch3-dome" viewBox="0 0 170 210" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="glass-body" x1="0" y1="0" x2="1" y2="0.6">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="80%" stopColor="#fff8e8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.52" />
                </linearGradient>
              </defs>
              <circle cx="85" cy="18" r="7" fill="url(#glass-body)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
              <path d="M22 178 V88 C22 44, 50 24, 85 24 C120 24, 148 44, 148 88 V178 Z" fill="url(#glass-body)" stroke="rgba(255,255,255,0.72)" strokeWidth="1.4" />
              <path d="M38 164 V92 C38 58, 56 40, 74 36" stroke="rgba(255,255,255,0.68)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="ch3-pedestal" aria-hidden="true" />
          </div>
        )}

        {/* ── CHAPTER 4: THE UNION ── */}
        {chapter === 4 && (
          <div className="chapter-stage chapter-4" onClick={playChapter4} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') playChapter4(); }}
            aria-label="Chapter 4: The Union. Activate to open the music box."
          >
            {/* Miniature Bride & Groom Silhouettes */}
            <div className="ch4-dancers" aria-hidden="true">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                {/* Groom */}
                <circle cx="38" cy="24" r="5.5" fill="#9c6a2b" />
                <path d="M32 32 C32 30, 44 30, 44 32 L46 56 L42 56 L40 76 L35 76 L34 56 L30 56 Z" fill="#8b5e24" />
                {/* Bride */}
                <circle cx="56" cy="26" r="5.2" fill="#b8843c" />
                <path d="M51 33 C51 31, 61 31, 61 33 L70 76 L43 76 Z" fill="#fffaf1" stroke="#d5b37c" strokeWidth="1" />
                {/* Joined hands */}
                <path d="M43 40 Q48 43 52 40" stroke="#c59246" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>

            {/* Golden Music Sparkles */}
            {[0, 1, 2, 3].map(i => (
              <span key={i} className="ch4-spark" style={{ left: `${40 + i * 7}%` }} aria-hidden="true">✦</span>
            ))}

            {/* Luxury Antique Gold Music Box */}
            <svg className="ch4-box" viewBox="0 0 210 130" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="antique-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f7dfa4" />
                  <stop offset="50%" stopColor="#c7923a" />
                  <stop offset="100%" stopColor="#8c5a18" />
                </linearGradient>
              </defs>
              {/* Lid */}
              <g className="ch4-lid">
                <path d="M30 58 L55 34 H155 L180 58 Z" fill="url(#antique-gold)" stroke="#7a4c14" strokeWidth="1.2" />
                <ellipse cx="105" cy="46" rx="22" ry="5" fill="none" stroke="#fff3cf" strokeWidth="0.9" opacity="0.8" />
              </g>
              {/* Base */}
              <rect x="28" y="58" width="154" height="46" rx="8" fill="url(#antique-gold)" stroke="#7a4c14" strokeWidth="1.2" />
              <rect x="38" y="66" width="134" height="30" rx="4" fill="none" stroke="#fff0c6" strokeWidth="0.8" opacity="0.65" />
              <circle cx="105" cy="64" r="4" fill="#fff3cf" />
            </svg>
          </div>
        )}

        {/* ── CHAPTER 5: FOREVER BEGINS ── */}
        {chapter === 5 && (
          <div className="chapter-stage chapter-5" onClick={playChapter5} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') playChapter5(); }}
            aria-label="Chapter 5: Forever Begins. Activate to unite the two gold rings."
          >
            <div className="ch5-infinity-glow" aria-hidden="true" />
            <svg className="ch5-rings" viewBox="0 0 220 120" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="gold-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff4c9" />
                  <stop offset="40%" stopColor="#e1b152" />
                  <stop offset="80%" stopColor="#b17822" />
                  <stop offset="100%" stopColor="#f5d587" />
                </linearGradient>
              </defs>
              <g className="ch5-ring-left">
                <circle cx="74" cy="60" r="32" stroke="url(#gold-ring)" strokeWidth="7" fill="none" />
                <circle cx="74" cy="60" r="32" stroke="#fff9e2" strokeWidth="1" fill="none" opacity="0.6" />
              </g>
              <g className="ch5-ring-right">
                <circle cx="146" cy="60" r="32" stroke="url(#gold-ring)" strokeWidth="7" fill="none" />
                <circle cx="146" cy="60" r="32" stroke="#fff9e2" strokeWidth="1" fill="none" opacity="0.6" />
              </g>
            </svg>

            <div className="ch5-finale-text">
              <h2>{wedding.bride} &amp; {wedding.groom}</h2>
              <p>Forever Begins Here</p>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Interaction Prompt & Replay Controls */}
      <footer className="journey-footer">
        {!completed[chapter] ? (
          <p className="journey-prompt">{currentMeta.prompt}</p>
        ) : chapter === 5 ? (
          <div className="journey-actions">
            <button type="button" className="journey-link" onClick={replayJourney}>
              <RotateCcw size={12} /> Replay Journey
            </button>
            {onReplayOpening && (
              <button type="button" className="journey-link" onClick={onReplayOpening}>
                <RotateCcw size={12} /> Replay Envelope
              </button>
            )}
          </div>
        ) : (
          <p className="journey-prompt">Follow the breeze…</p>
        )}
      </footer>
    </div>
  );
}
