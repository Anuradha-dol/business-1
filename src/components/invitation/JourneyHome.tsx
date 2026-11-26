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
  {
    id: 1,
    title: 'The First Encounter',
    caption: 'Two white butterflies drawn to a single coastal bloom.',
    art: `${base}ch1-encounter.jpg`,
    hint: 'Touch to awaken',
  },
  {
    id: 2,
    title: 'When Love Bloomed',
    caption: 'Two buds unfurling together in a shower of white petals.',
    art: `${base}ch2-bloomed.jpg`,
    hint: 'Touch to bloom',
  },
  {
    id: 3,
    title: 'The Promise',
    caption: 'Beneath crystal glass, a timeless vow emerges in light.',
    art: `${base}ch3-promise.jpg`,
    hint: 'Touch the glass dome',
  },
  {
    id: 4,
    title: 'The Union',
    caption: 'An antique music box opens to a lifelong waltz.',
    art: `${base}ch4-union.jpg`,
    hint: 'Touch the music box',
  },
  {
    id: 5,
    title: 'Forever Begins',
    caption: 'Two golden rings united in an endless embrace.',
    art: `${base}ch5-forever.jpg`,
    hint: 'Touch the rings',
  },
] as const;

/* ── Live Fluttering White Butterfly ─────────────────────────────────────── */
function LiveButterfly({ className }: { className?: string }) {
  return (
    <svg className={`live-butterfly ${className ?? ''}`} viewBox="0 0 64 56" fill="none" aria-hidden="true">
      <g className="live-butterfly__wing live-butterfly__wing--l">
        <path d="M31 27 C24 10, 6 4, 4 17 C2 28, 16 32, 30 30 Z" fill="#fffdf9" stroke="#c7ad87" strokeWidth="0.6" />
        <path d="M30 30 C19 32, 9 40, 14 48 C19 54, 29 44, 31 33 Z" fill="#f6ecdd" stroke="#c7ad87" strokeWidth="0.5" />
      </g>
      <g className="live-butterfly__wing live-butterfly__wing--r">
        <path d="M33 27 C40 10, 58 4, 60 17 C62 28, 48 32, 34 30 Z" fill="#fffdf9" stroke="#c7ad87" strokeWidth="0.6" />
        <path d="M34 30 C45 32, 55 40, 50 48 C45 54, 35 44, 33 33 Z" fill="#f6ecdd" stroke="#c7ad87" strokeWidth="0.5" />
      </g>
      <ellipse cx="32" cy="30" rx="1.4" ry="8" fill="#9b7b53" />
    </svg>
  );
}

export default function JourneyHome({ onReplayOpening, onTriggerPetalBurst }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleChapters, setVisibleChapters] = useState<Record<number, boolean>>({ 1: true });
  const [activated, setActivated] = useState<Record<number, boolean>>({});
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

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
      { root, threshold: 0.28 }
    );
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  /* Interactive GSAP animation per chapter on touch/click */
  const interactChapter = contextSafe((id: number) => {
    setActivated(prev => ({ ...prev, [id]: true }));
    const target = `.journey-chapter[data-chapter="${id}"]`;

    if (id === 1) {
      gsap.fromTo(`${target} .j-b1`, { x: -45, y: -22, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.8, ease: 'sine.inOut' });
      gsap.fromTo(`${target} .j-b2`, { x: 45, y: -18, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.8, ease: 'sine.inOut' });
      gsap.fromTo(`${target} .journey-art-wrap`, { scale: 0.96 }, { scale: 1.04, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: 1 });
    } else if (id === 2) {
      onTriggerPetalBurst?.();
      gsap.fromTo(`${target} .journey-art-wrap`, { scale: 0.95 }, { scale: 1.06, duration: 1.5, ease: 'power2.out' });
      gsap.fromTo(`${target} .journey-halo`, { opacity: 0.2, scale: 0.8 }, { opacity: 0.9, scale: 1.2, duration: 1.6, ease: 'sine.out' });
    } else if (id === 3) {
      gsap.fromTo(`${target} .journey-glass-glint`, { x: '-100%', opacity: 0 }, { x: '120%', opacity: 0.85, duration: 1.8, ease: 'sine.inOut' });
      gsap.fromTo(`${target} .journey-art-wrap`, { y: 8, scale: 0.97 }, { y: -6, scale: 1.05, duration: 1.8, ease: 'power2.out' });
    } else if (id === 4) {
      gsap.to(`${target} .journey-art-wrap`, { rotationY: 8, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 2 });
      gsap.fromTo(`${target} .j-note`, { y: 14, opacity: 0 }, { y: -42, opacity: 0.9, duration: 1.9, stagger: 0.22, ease: 'sine.out' });
    } else if (id === 5) {
      onTriggerPetalBurst?.();
      gsap.fromTo(`${target} .journey-halo`, { opacity: 0.3, scale: 0.85 }, { opacity: 1, scale: 1.25, duration: 1.8, ease: 'sine.out' });
      gsap.fromTo(`${target} .journey-finale`, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.5, delay: 0.4, ease: 'power2.out' });
    }
  });

  const scrollToNext = (nextId: number) => {
    const el = scrollRef.current?.querySelector(`.journey-chapter[data-chapter="${nextId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      {/* Opening Title Banner */}
      <section className="journey-intro">
        <p className="journey-intro__eyebrow">Himeshi &amp; Madhawa</p>
        <h1 className="journey-intro__title">A Journey to Forever</h1>
        <p className="journey-intro__desc">Scroll gently through each chapter and touch the scene to awaken it.</p>
        <button
          type="button"
          className="journey-intro__cue"
          onClick={() => scrollToNext(1)}
          aria-label="Begin the journey"
        >
          <span>Begin</span>
          <ChevronDown size={15} />
        </button>
      </section>

      {/* 5 Scroll-Driven Interactive Chapters */}
      {CHAPTERS.map((ch, idx) => {
        const isVisible = !!visibleChapters[ch.id];
        const isActive = !!activated[ch.id];
        return (
          <article
            key={ch.id}
            data-chapter={ch.id}
            className={`journey-chapter${isVisible ? ' journey-chapter--visible' : ''}${isActive ? ' journey-chapter--active' : ''}`}
          >
            <p className="journey-chapter__num">Chapter 0{ch.id}</p>
            <h2 className="journey-chapter__title">{ch.title}</h2>

            {/* Organic Floating Art Object (Zero card boxes/borders) */}
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

              <div className="journey-art-wrap">
                <img className="journey-art" src={ch.art} alt={ch.title} draggable={false} />
                {ch.id === 3 && <div className="journey-glass-glint" aria-hidden="true" />}
              </div>

              {ch.id === 1 && (
                <>
                  <div className="j-b1" aria-hidden="true"><LiveButterfly /></div>
                  <div className="j-b2" aria-hidden="true"><LiveButterfly /></div>
                </>
              )}

              {ch.id === 4 && (
                <div className="j-notes" aria-hidden="true">
                  <span className="j-note">♪</span>
                  <span className="j-note">✦</span>
                  <span className="j-note">♫</span>
                </div>
              )}

              <span className="journey-touch-hint">{isActive ? '✦' : ch.hint}</span>
            </div>

            <p className="journey-chapter__caption">{ch.caption}</p>

            {/* Chapter 5 Finale */}
            {ch.id === 5 && (
              <div className="journey-finale">
                <h3>{wedding.bride} &amp; {wedding.groom}</h3>
                <p>Forever Begins Here</p>
                {onReplayOpening && (
                  <button type="button" className="journey-replay" onClick={onReplayOpening}>
                    <RotateCcw size={12} /> Replay Opening Envelope
                  </button>
                )}
              </div>
            )}

            {/* Guiding Butterfly to next chapter */}
            {idx < CHAPTERS.length - 1 && (
              <button
                type="button"
                className="journey-next-guide"
                onClick={() => scrollToNext(ch.id + 1)}
                aria-label={`Continue to ${CHAPTERS[idx + 1].title}`}
              >
                <LiveButterfly className="journey-next-guide__butterfly" />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
