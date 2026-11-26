import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './JourneyHome.css';

gsap.registerPlugin(useGSAP);

type Props = {
  onReplayOpening?: () => void;
  onTriggerPetalBurst?: () => void;
};

const base = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/`;

const CHAPTERS = [
  { id: 1, title: 'The First Encounter', caption: 'Two white butterflies drawn to a single coastal bloom.', hint: 'Touch the flower' },
  { id: 2, title: 'When Love Bloomed',   caption: 'Two buds unfurling together in a shower of white petals.', hint: 'Touch the rosebuds' },
  { id: 3, title: 'The Promise',         caption: 'Beneath crystal glass, a timeless vow emerges in light.', hint: 'Touch the glass dome' },
  { id: 4, title: 'The Union',           caption: 'An antique music box opens to a lifelong waltz.', hint: 'Touch the music box' },
  { id: 5, title: 'Forever Begins',      caption: 'Two golden rings united in an endless embrace.', hint: 'Touch the golden rings' },
] as const;

/* ── Live Fluttering White Butterfly ─────────────────────────────────────── */
function LiveButterfly({ className }: { className?: string }) {
  return (
    <svg className={`live-butterfly ${className ?? ''}`} viewBox="0 0 64 56" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="bf-wing" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#faf1e3" />
          <stop offset="100%" stopColor="#e4cfb1" />
        </radialGradient>
      </defs>
      <g className="live-butterfly__wing live-butterfly__wing--l">
        <path d="M31 27 C24 10, 6 4, 4 17 C2 28, 16 32, 30 30 Z" fill="url(#bf-wing)" stroke="#c7ad87" strokeWidth="0.7" />
        <path d="M30 30 C19 32, 9 40, 14 48 C19 54, 29 44, 31 33 Z" fill="url(#bf-wing)" stroke="#c7ad87" strokeWidth="0.6" />
      </g>
      <g className="live-butterfly__wing live-butterfly__wing--r">
        <path d="M33 27 C40 10, 58 4, 60 17 C62 28, 48 32, 34 30 Z" fill="url(#bf-wing)" stroke="#c7ad87" strokeWidth="0.7" />
        <path d="M34 30 C45 32, 55 40, 50 48 C45 54, 35 44, 33 33 Z" fill="url(#bf-wing)" stroke="#c7ad87" strokeWidth="0.6" />
      </g>
      <ellipse cx="32" cy="30" rx="1.4" ry="8" fill="#8f6c42" />
    </svg>
  );
}

export default function JourneyHome({ onReplayOpening, onTriggerPetalBurst }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleChapters, setVisibleChapters] = useState<Record<number, boolean>>({ 1: true });
  const [activated, setActivated] = useState<Record<number, boolean>>({});
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const busy = useRef<Record<number, boolean>>({});

  const { contextSafe } = useGSAP({ scope: scrollRef });

  /* Scroll-triggered reveal for each chapter */
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>('.journey-chapter');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-chapter'));
            setVisibleChapters(prev => (prev[id] ? prev : { ...prev, [id]: true }));
          }
        });
      },
      { root, threshold: 0.25 }
    );
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  /* Guiding butterfly animation after a chapter completes */
  const guideToNext = contextSafe((currentId: number) => {
    const guide = `.journey-chapter[data-chapter="${currentId}"] .journey-guide-flyer`;
    gsap.fromTo(
      guide,
      { autoAlpha: 0, y: -12, scale: 0.7 },
      {
        autoAlpha: 1, y: 36, scale: 1, duration: 1.5, ease: 'sine.inOut',
        onComplete: () => {
          gsap.to(guide, { y: 44, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        },
      }
    );
  });

  /* True Multi-Layer Interactive GSAP Animations */
  const interactChapter = contextSafe((id: number) => {
    if (busy.current[id] || activated[id]) return;
    busy.current[id] = true;
    const t = `.journey-chapter[data-chapter="${id}"]`;

    if (id === 1) {
      // Two separate white butterflies fly from opposite edges and land on the bloom
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 1: true })); busy.current[1] = false; guideToNext(1); },
      });
      tl.fromTo(`${t} .j-b1`, { x: -125, y: -65, rotation: -22, scale: 0.75, autoAlpha: 0.4 },
        { x: -16, y: -6, rotation: 10, scale: 0.95, autoAlpha: 1, duration: 2.3, ease: 'sine.inOut' }, 0)
        .fromTo(`${t} .j-b2`, { x: 125, y: -55, rotation: 22, scale: 0.75, autoAlpha: 0.4 },
          { x: 18, y: -4, rotation: -10, scale: 0.95, autoAlpha: 1, duration: 2.3, ease: 'sine.inOut' }, 0)
        .to(`${t} .journey-halo`, { opacity: 0.95, scale: 1.22, duration: 1.4, ease: 'sine.out' }, 1.4)
        .to(`${t} .ch1-bloom`, { scale: 1.06, duration: 1.0, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 1.6);
    } else if (id === 2) {
      // Twin rosebuds bloom open, entwine with golden vine, and trigger white petal rain
      onTriggerPetalBurst?.();
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 2: true })); busy.current[2] = false; guideToNext(2); },
      });
      tl.to(`${t} .ch2-bud-l`, { x: 14, rotation: 8, duration: 1.5, ease: 'sine.inOut' }, 0)
        .to(`${t} .ch2-bud-r`, { x: -14, rotation: -8, duration: 1.5, ease: 'sine.inOut' }, 0)
        .to(`${t} .ch2-petal-open`, { scale: 1.32, opacity: 1, duration: 1.6, stagger: 0.08, ease: 'power2.out' }, 0.3)
        .to(`${t} .ch2-vine`, { strokeDashoffset: 0, opacity: 1, duration: 1.4, ease: 'sine.inOut' }, 0.6)
        .to(`${t} .journey-halo`, { opacity: 0.9, scale: 1.2, duration: 1.5 }, 0.8);
    } else if (id === 3) {
      // Glass dome physically lifts upward, flower blooms, diamond ring rises & rotates
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 3: true })); busy.current[3] = false; guideToNext(3); },
      });
      tl.to(`${t} .ch3-dome`, { y: -88, opacity: 0.25, scale: 0.95, duration: 1.7, ease: 'power2.inOut' }, 0)
        .to(`${t} .ch3-flower`, { scale: 1.2, duration: 1.3, ease: 'sine.out' }, 0.4)
        .fromTo(`${t} .ch3-ring`, { y: 36, autoAlpha: 0, scale: 0.45 },
          { y: -22, autoAlpha: 1, scale: 1.05, duration: 1.5, ease: 'power2.out' }, 0.8)
        .to(`${t} .ch3-ring`, { rotationY: 360, duration: 3.2, ease: 'none', repeat: -1 }, 1.8)
        .to(`${t} .ch3-glint`, { opacity: 1, scale: 1.45, duration: 0.6, yoyo: true, repeat: 3 }, 1.5);
    } else if (id === 4) {
      // Antique gold music box lid opens, miniature bride & groom rise and waltz
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 4: true })); busy.current[4] = false; guideToNext(4); },
      });
      tl.to(`${t} .ch4-lid`, { scaleY: -0.78, y: -12, duration: 1.3, ease: 'power2.inOut' }, 0)
        .fromTo(`${t} .ch4-dancers`, { y: 34, autoAlpha: 0, scale: 0.7 },
          { y: -16, autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.65)
        .to(`${t} .ch4-dancers`, { rotationY: 26, x: 7, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.4)
        .to(`${t} .j-note`, { y: -52, opacity: 0, duration: 2.0, stagger: 0.2, ease: 'sine.out' }, 0.9);
    } else if (id === 5) {
      // Two separate gold wedding rings glide together into an infinity symbol + finale reveal
      onTriggerPetalBurst?.();
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 5: true })); busy.current[5] = false; },
      });
      tl.to(`${t} .ch5-ring-l`, { x: 25, rotation: -10, duration: 1.7, ease: 'power2.inOut' }, 0)
        .to(`${t} .ch5-ring-r`, { x: -25, rotation: 10, duration: 1.7, ease: 'power2.inOut' }, 0)
        .to(`${t} .journey-halo`, { opacity: 1, scale: 1.28, duration: 1.6, ease: 'sine.out' }, 0.9)
        .fromTo(`${t} .journey-finale`, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.out' }, 1.2);
    }
  });

  const scrollToChapter = (nextId: number) => {
    const el = scrollRef.current?.querySelector(`.journey-chapter[data-chapter="${nextId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const replayJourney = () => {
    busy.current = {};
    setActivated({});
    scrollToChapter(1);
  };

  return (
    <div
      ref={scrollRef}
      className="journey-scroll"
      onPointerMove={e => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        setParallax({ x: nx, y: ny });
      }}
      onPointerLeave={() => setParallax({ x: 0, y: 0 })}
    >
      {/* Wind-driven Silk & Ocean Sunset Reflection */}
      <div className="journey-silk-layer" style={{ transform: `translate3d(${parallax.x * 8}px, ${parallax.y * 4}px, 0)` }} aria-hidden="true" />
      <div className="journey-ocean-glint" aria-hidden="true" />

      {/* Opening Title */}
      <section className="journey-intro">
        <p className="journey-intro__eyebrow">Himeshi &amp; Madhawa</p>
        <h1 className="journey-intro__title">A Journey to Forever</h1>
        <p className="journey-intro__desc">Scroll gently through each chapter and touch the scene to awaken it.</p>
        <button type="button" className="journey-intro__cue" onClick={() => scrollToChapter(1)} aria-label="Begin the journey">
          <span>Begin</span>
          <ChevronDown size={15} />
        </button>
      </section>

      {/* 5 Scroll-Driven Interactive Chapters */}
      {CHAPTERS.map((ch, idx) => {
        const isVisible = !!visibleChapters[ch.id];
        const isDone = !!activated[ch.id];
        return (
          <article
            key={ch.id}
            data-chapter={ch.id}
            className={`journey-chapter${isVisible ? ' journey-chapter--visible' : ''}${isDone ? ' journey-chapter--done' : ''}`}
          >
            <p className="journey-chapter__num">Chapter 0{ch.id}</p>
            <h2 className="journey-chapter__title">{ch.title}</h2>

            <div
              className="journey-object"
              role="button"
              tabIndex={0}
              onClick={() => interactChapter(ch.id)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') interactChapter(ch.id); }}
              aria-label={`${ch.title} — ${ch.hint}`}
              style={{ transform: `perspective(1000px) rotateY(${parallax.x * 3}deg) rotateX(${parallax.y * -2.5}deg)` }}
            >
              <div className="journey-halo" aria-hidden="true" />

              {/* CHAPTER 1: Two separate butterflies fly in & land on the coastal bloom */}
              {ch.id === 1 && (
                <div className="ch1-stage">
                  <div className="journey-art-wrap ch1-bloom">
                    <img className="journey-art" src={`${base}ch1-encounter.jpg`} alt={ch.title} draggable={false} />
                  </div>
                  <div className="j-b1" aria-hidden="true"><LiveButterfly /></div>
                  <div className="j-b2" aria-hidden="true"><LiveButterfly /></div>
                </div>
              )}

              {/* CHAPTER 2: Two rosebuds bloom open & entwine + white petal rain */}
              {ch.id === 2 && (
                <div className="ch2-stage">
                  <div className="journey-art-wrap ch2-backdrop">
                    <img className="journey-art" src={`${base}ch2-bloomed.jpg`} alt={ch.title} draggable={false} />
                  </div>
                  <svg className="ch2-overlay" viewBox="0 0 240 190" fill="none" aria-hidden="true">
                    <path className="ch2-vine" d="M84 146 C112 128, 128 112, 152 96" stroke="#c89438" strokeWidth="2" strokeDasharray="130" strokeDashoffset="130" opacity="0" />
                    <g className="ch2-bud-l">
                      <ellipse className="ch2-petal-open" cx="84" cy="76" rx="16" ry="24" fill="#fffaf3" stroke="#cfa89b" strokeWidth="0.7" opacity="0" />
                    </g>
                    <g className="ch2-bud-r">
                      <ellipse className="ch2-petal-open" cx="156" cy="76" rx="16" ry="24" fill="#fffaf3" stroke="#cfa89b" strokeWidth="0.7" opacity="0" />
                    </g>
                  </svg>
                </div>
              )}

              {/* CHAPTER 3: Glass dome lifts -> flower blooms -> 3D diamond ring rises & rotates */}
              {ch.id === 3 && (
                <div className="ch3-stage">
                  <div className="journey-art-wrap ch3-backdrop">
                    <img className="journey-art" src={`${base}ch3-promise.jpg`} alt="" draggable={false} />
                  </div>
                  <div className="ch3-ring" aria-hidden="true">
                    <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
                      <defs>
                        <linearGradient id="ch3-band" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="50%" stopColor="#d9dde3" />
                          <stop offset="100%" stopColor="#9aa3b0" />
                        </linearGradient>
                        <linearGradient id="ch3-gem" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="50%" stopColor="#e8f3ff" />
                          <stop offset="100%" stopColor="#b8cfe8" />
                        </linearGradient>
                      </defs>
                      <circle cx="32" cy="44" r="17" stroke="url(#ch3-band)" strokeWidth="4.5" fill="none" />
                      <polygon points="32,8 43,19 32,27 21,19" fill="url(#ch3-gem)" stroke="#9ab4cf" strokeWidth="0.9" />
                      <path className="ch3-glint" d="M32 1v6M21 13l4 2M43 13l-4 2" stroke="#fff7d6" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
                    </svg>
                  </div>
                  <svg className="ch3-flower" viewBox="0 0 120 90" fill="none" aria-hidden="true">
                    {[0, 60, 120, 180, 240, 300].map(deg => (
                      <ellipse key={deg} cx="60" cy="36" rx="11" ry="20" fill="#fffaf3" stroke="#d5be9a" strokeWidth="0.7" transform={`rotate(${deg} 60 54)`} />
                    ))}
                    <circle cx="60" cy="54" r="9" fill="#d9a648" />
                  </svg>
                  <svg className="ch3-dome" viewBox="0 0 170 210" fill="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="ch3-glass" x1="0" y1="0" x2="1" y2="0.6">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.52" />
                        <stop offset="35%" stopColor="#ffffff" stopOpacity="0.14" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
                      </linearGradient>
                    </defs>
                    <circle cx="85" cy="18" r="7" fill="url(#ch3-glass)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
                    <path d="M22 178 V88 C22 44, 50 24, 85 24 C120 24, 148 44, 148 88 V178 Z" fill="url(#ch3-glass)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" />
                    <path d="M38 164 V92 C38 58, 56 40, 74 36" stroke="rgba(255,255,255,0.72)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {/* CHAPTER 4: Antique music box opens -> miniature bride & groom dance */}
              {ch.id === 4 && (
                <div className="ch4-stage">
                  <div className="journey-art-wrap ch4-backdrop">
                    <img className="journey-art" src={`${base}ch4-union.jpg`} alt="" draggable={false} />
                  </div>
                  <div className="ch4-dancers" aria-hidden="true">
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                      <circle cx="38" cy="24" r="5.5" fill="#9c6a2b" />
                      <path d="M32 32 C32 30, 44 30, 44 32 L46 56 L42 56 L40 76 L35 76 L34 56 L30 56 Z" fill="#8b5e24" />
                      <circle cx="56" cy="26" r="5.2" fill="#b8843c" />
                      <path d="M51 33 C51 31, 61 31, 61 33 L70 76 L43 76 Z" fill="#fffaf1" stroke="#d5b37c" strokeWidth="1" />
                      <path d="M43 40 Q48 43 52 40" stroke="#c59246" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="j-notes" aria-hidden="true">
                    <span className="j-note">♪</span>
                    <span className="j-note">✦</span>
                    <span className="j-note">♫</span>
                  </div>
                  <svg className="ch4-box" viewBox="0 0 210 130" fill="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="ch4-gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f7dfa4" />
                        <stop offset="50%" stopColor="#c7923a" />
                        <stop offset="100%" stopColor="#8c5a18" />
                      </linearGradient>
                    </defs>
                    <g className="ch4-lid">
                      <path d="M30 58 L55 34 H155 L180 58 Z" fill="url(#ch4-gold)" stroke="#7a4c14" strokeWidth="1.2" />
                    </g>
                    <rect x="28" y="58" width="154" height="46" rx="8" fill="url(#ch4-gold)" stroke="#7a4c14" strokeWidth="1.2" />
                    <circle cx="105" cy="64" r="4" fill="#fff3cf" />
                  </svg>
                </div>
              )}

              {/* CHAPTER 5: Two gold rings unite into infinity + cinematic text reveal */}
              {ch.id === 5 && (
                <div className="ch5-stage">
                  <div className="journey-art-wrap ch5-backdrop">
                    <img className="journey-art" src={`${base}ch5-forever.jpg`} alt="" draggable={false} />
                  </div>
                  <svg className="ch5-rings" viewBox="0 0 220 120" fill="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="ch5-gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fff4c9" />
                        <stop offset="45%" stopColor="#e1b152" />
                        <stop offset="100%" stopColor="#b17822" />
                      </linearGradient>
                    </defs>
                    <g className="ch5-ring-l">
                      <circle cx="74" cy="60" r="30" stroke="url(#ch5-gold)" strokeWidth="6.5" fill="none" />
                    </g>
                    <g className="ch5-ring-r">
                      <circle cx="146" cy="60" r="30" stroke="url(#ch5-gold)" strokeWidth="6.5" fill="none" />
                    </g>
                  </svg>
                </div>
              )}

              <span className="journey-touch-hint">{isDone ? '✦' : ch.hint}</span>
            </div>

            <p className="journey-chapter__caption">{ch.caption}</p>

            {/* Chapter 5 Finale Text */}
            {ch.id === 5 && (
              <div className={`journey-finale${isDone ? ' journey-finale--show' : ''}`}>
                <h3>{wedding.bride} &amp; {wedding.groom}</h3>
                <p>Forever Begins Here</p>
                <div className="journey-finale-actions">
                  <button type="button" className="journey-replay" onClick={replayJourney}>
                    <RotateCcw size={12} /> Replay Journey
                  </button>
                  {onReplayOpening && (
                    <button type="button" className="journey-replay" onClick={onReplayOpening}>
                      <RotateCcw size={12} /> Replay Opening Envelope
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Guiding Butterfly flying toward next chapter */}
            {idx < CHAPTERS.length - 1 && (
              <button
                type="button"
                className="journey-guide-flyer"
                onClick={() => scrollToChapter(ch.id + 1)}
                aria-label={`Continue to ${CHAPTERS[idx + 1].title}`}
              >
                <LiveButterfly />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
