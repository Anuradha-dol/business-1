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
    hint: 'Touch to illuminate',
  },
  {
    id: 4,
    title: 'The Union',
    caption: 'An antique music box opens to a lifelong waltz.',
    art: `${base}ch4-union.jpg`,
    hint: 'Touch to waltz',
  },
  {
    id: 5,
    title: 'Forever Begins',
    caption: 'Two golden rings united in an endless embrace.',
    art: `${base}ch5-forever.jpg`,
    hint: 'Touch to unite',
  },
] as const;

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

  /* Smooth guiding light/petal cue after chapter completes */
  const guideToNext = contextSafe((currentId: number) => {
    const guide = `.journey-chapter[data-chapter="${currentId}"] .journey-guide-cue`;
    gsap.fromTo(
      guide,
      { autoAlpha: 0, y: -6 },
      { autoAlpha: 1, y: 4, duration: 1.2, ease: 'sine.inOut' }
    );
  });

  /* Pure Cinematic GSAP Choreography on High-Craft Painterly Art */
  const interactChapter = contextSafe((id: number) => {
    if (busy.current[id] || activated[id]) return;
    busy.current[id] = true;
    const t = `.journey-chapter[data-chapter="${id}"]`;

    if (id === 1) {
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 1: true })); busy.current[1] = false; guideToNext(1); },
      });
      tl.fromTo(`${t} .journey-art`, { scale: 1 }, { scale: 1.07, duration: 2.2, ease: 'sine.inOut' }, 0)
        .to(`${t} .journey-halo`, { opacity: 0.95, scale: 1.24, duration: 1.6, ease: 'sine.out' }, 0.3)
        .fromTo(`${t} .journey-light-sweep`, { x: '-110%', opacity: 0 }, { x: '120%', opacity: 0.75, duration: 2.0, ease: 'sine.inOut' }, 0.2);
    } else if (id === 2) {
      onTriggerPetalBurst?.();
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 2: true })); busy.current[2] = false; guideToNext(2); },
      });
      tl.to(`${t} .journey-art`, { scale: 1.08, duration: 2.0, ease: 'power2.out' }, 0)
        .to(`${t} .journey-halo`, { opacity: 0.95, scale: 1.25, duration: 1.6, ease: 'sine.out' }, 0.2);
    } else if (id === 3) {
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 3: true })); busy.current[3] = false; guideToNext(3); },
      });
      tl.to(`${t} .journey-art`, { scale: 1.08, y: -4, duration: 2.2, ease: 'power2.out' }, 0)
        .fromTo(`${t} .journey-light-sweep`, { x: '-110%', opacity: 0 }, { x: '120%', opacity: 0.9, duration: 1.9, ease: 'sine.inOut' }, 0.15)
        .to(`${t} .journey-glint-star`, { opacity: 1, scale: 1.35, rotation: 45, duration: 0.8, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 0.6)
        .to(`${t} .journey-halo`, { opacity: 0.9, scale: 1.2, duration: 1.4 }, 0.3);
    } else if (id === 4) {
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 4: true })); busy.current[4] = false; guideToNext(4); },
      });
      tl.to(`${t} .journey-art`, { scale: 1.07, duration: 1.8, ease: 'sine.out' }, 0)
        .to(`${t} .journey-art-wrap`, { rotation: 1.5, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0.2)
        .to(`${t} .journey-halo`, { opacity: 0.95, scale: 1.22, duration: 1.5 }, 0.2);
    } else if (id === 5) {
      onTriggerPetalBurst?.();
      const tl = gsap.timeline({
        onComplete: () => { setActivated(p => ({ ...p, 5: true })); busy.current[5] = false; },
      });
      tl.to(`${t} .journey-art`, { scale: 1.08, duration: 2.2, ease: 'power2.out' }, 0)
        .fromTo(`${t} .journey-light-sweep`, { x: '-110%', opacity: 0 }, { x: '120%', opacity: 0.85, duration: 2.0, ease: 'sine.inOut' }, 0.1)
        .to(`${t} .journey-halo`, { opacity: 1, scale: 1.3, duration: 1.6, ease: 'sine.out' }, 0.3)
        .fromTo(`${t} .journey-finale`, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.out' }, 0.9);
    }
  });

  const scrollToChapter = (nextId: number) => {
    const el = scrollRef.current?.querySelector(`.journey-chapter[data-chapter="${nextId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const replayJourney = () => {
    busy.current = {};
    setActivated({});
    gsap.set('.journey-art', { scale: 1, y: 0 });
    gsap.set('.journey-halo', { opacity: 0.45, scale: 1 });
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

      {/* 5 Pure Painterly Interactive Chapters */}
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

              <div className="journey-art-wrap">
                <img className="journey-art" src={ch.art} alt={ch.title} draggable={false} />
                <div className="journey-light-sweep" aria-hidden="true" />
                {ch.id === 3 && <span className="journey-glint-star" aria-hidden="true">✦</span>}
              </div>

              <span className="journey-touch-hint">{isDone ? '✦' : ch.hint}</span>
            </div>

            <p className="journey-chapter__caption">{ch.caption}</p>

            {/* Chapter 5 Finale */}
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

            {/* Guiding Cue to Next Chapter */}
            {idx < CHAPTERS.length - 1 && (
              <button
                type="button"
                className="journey-guide-cue"
                onClick={() => scrollToChapter(ch.id + 1)}
                aria-label={`Continue to ${CHAPTERS[idx + 1].title}`}
              >
                <span>Continue</span>
                <ChevronDown size={14} />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
