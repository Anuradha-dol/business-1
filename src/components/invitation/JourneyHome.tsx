import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RotateCcw } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './JourneyHome.css';

gsap.registerPlugin(useGSAP);

type ChapterId = 1 | 2 | 3 | 4 | 5;
type Props = {
  onReplayOpening?: () => void;
  onTriggerPetalBurst?: () => void;
};

const base = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/`;

const CHAPTERS: { id: ChapterId; title: string; caption: string; art: string; hint: string }[] = [
  {
    id: 1,
    title: 'The First Encounter',
    caption: 'Two white butterflies drawn to a single coastal bloom.',
    art: `${base}ch1-encounter.jpg`,
    hint: 'Touch the flower',
  },
  {
    id: 2,
    title: 'When Love Bloomed',
    caption: 'Two buds unfurling together in a shower of white petals.',
    art: `${base}ch2-bloomed.jpg`,
    hint: 'Touch the rosebuds',
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
    hint: 'Touch the music box',
  },
  {
    id: 5,
    title: 'Forever Begins',
    caption: 'Two golden rings united in an endless embrace.',
    art: `${base}ch5-forever.jpg`,
    hint: 'Touch the rings',
  },
];

export default function JourneyHome({ onReplayOpening, onTriggerPetalBurst }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<ChapterId>(1);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const busy = useRef(false);

  const { contextSafe } = useGSAP({ scope: stageRef });

  /* Seamless cross-dissolve merge from current chapter into next chapter */
  const mergeToChapter = contextSafe((next: ChapterId) => {
    const tl = gsap.timeline({
      onComplete: () => {
        setChapter(next);
        gsap.fromTo(
          '.journey-stage-body',
          { autoAlpha: 0, scale: 0.96, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: 'power2.out',
            onComplete: () => { busy.current = false; },
          }
        );
      },
    });
    tl.to('.journey-stage-body', {
      autoAlpha: 0,
      scale: 1.04,
      filter: 'blur(6px)',
      duration: 0.9,
      ease: 'sine.inOut',
    });
  });

  const interact = contextSafe(() => {
    if (busy.current) return;
    if (chapter === 5 && done[5]) return;
    busy.current = true;

    const finish = (next?: ChapterId) => {
      setDone(prev => ({ ...prev, [chapter]: true }));
      if (next) {
        setTimeout(() => mergeToChapter(next), 650);
      } else {
        busy.current = false;
      }
    };

    if (chapter === 1) {
      gsap.timeline({ onComplete: () => finish(2) })
        .to('.journey-art', { scale: 1.08, duration: 1.9, ease: 'sine.inOut' }, 0)
        .to('.journey-halo', { opacity: 0.95, scale: 1.24, duration: 1.4, ease: 'sine.out' }, 0.2)
        .fromTo('.journey-light-sweep', { x: '-110%', opacity: 0 }, { x: '120%', opacity: 0.78, duration: 1.8, ease: 'sine.inOut' }, 0.15);
    } else if (chapter === 2) {
      onTriggerPetalBurst?.();
      gsap.timeline({ onComplete: () => finish(3) })
        .to('.journey-art', { scale: 1.09, duration: 1.9, ease: 'power2.out' }, 0)
        .to('.journey-halo', { opacity: 0.95, scale: 1.25, duration: 1.4, ease: 'sine.out' }, 0.2);
    } else if (chapter === 3) {
      gsap.timeline({ onComplete: () => finish(4) })
        .to('.journey-art', { scale: 1.09, y: -4, duration: 2.0, ease: 'power2.out' }, 0)
        .fromTo('.journey-light-sweep', { x: '-110%', opacity: 0 }, { x: '120%', opacity: 0.9, duration: 1.8, ease: 'sine.inOut' }, 0.1)
        .to('.journey-glint-star', { opacity: 1, scale: 1.35, rotation: 45, duration: 0.7, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 0.5)
        .to('.journey-halo', { opacity: 0.9, scale: 1.2, duration: 1.4 }, 0.2);
    } else if (chapter === 4) {
      gsap.timeline({ onComplete: () => finish(5) })
        .to('.journey-art', { scale: 1.07, duration: 1.6, ease: 'sine.out' }, 0)
        .to('.journey-art-wrap', { rotation: 1.6, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 0.2)
        .to('.journey-halo', { opacity: 0.95, scale: 1.22, duration: 1.4 }, 0.2);
    } else if (chapter === 5) {
      onTriggerPetalBurst?.();
      gsap.timeline({ onComplete: () => finish() })
        .to('.journey-art', { scale: 1.08, duration: 2.0, ease: 'power2.out' }, 0)
        .fromTo('.journey-light-sweep', { x: '-110%', opacity: 0 }, { x: '120%', opacity: 0.85, duration: 1.9, ease: 'sine.inOut' }, 0.1)
        .to('.journey-halo', { opacity: 1, scale: 1.28, duration: 1.5, ease: 'sine.out' }, 0.2)
        .fromTo('.journey-finale', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0.8);
    }
  });

  const jumpTo = (targetId: ChapterId) => {
    if (busy.current || targetId === chapter) return;
    busy.current = true;
    mergeToChapter(targetId);
  };

  const replayJourney = () => {
    if (busy.current) return;
    busy.current = true;
    setDone({});
    mergeToChapter(1);
  };

  const current = CHAPTERS[chapter - 1];

  return (
    <div
      ref={stageRef}
      className="journey-stage"
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

      {/* Top Title & Chapter Dots */}
      <header className="journey-header">
        <p className="journey-eyebrow">A Journey to Forever</p>
        <div className="journey-dots" role="tablist" aria-label="Story chapters">
          {CHAPTERS.map(ch => (
            <button
              key={ch.id}
              type="button"
              role="tab"
              aria-selected={chapter === ch.id}
              aria-label={`Chapter ${ch.id}: ${ch.title}`}
              className={`journey-dot${chapter === ch.id ? ' active' : ''}${done[ch.id] ? ' done' : ''}`}
              onClick={() => jumpTo(ch.id)}
            />
          ))}
        </div>
      </header>

      {/* Single 100svh Merging Chapter Stage */}
      <div className="journey-stage-body">
        <p className="journey-chapter__num">Chapter 0{current.id}</p>
        <h1 className="journey-chapter__title">{current.title}</h1>

        <div
          className="journey-object"
          role="button"
          tabIndex={0}
          onClick={interact}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') interact(); }}
          aria-label={`${current.title} — ${current.hint}`}
          style={{ transform: `perspective(1000px) rotateY(${parallax.x * 3}deg) rotateX(${parallax.y * -2.5}deg)` }}
        >
          <div className="journey-halo" aria-hidden="true" />
          <div className="journey-art-wrap">
            <img className="journey-art" src={current.art} alt={current.title} draggable={false} />
            <div className="journey-light-sweep" aria-hidden="true" />
            {chapter === 3 && <span className="journey-glint-star" aria-hidden="true">✦</span>}
          </div>
          <span className="journey-touch-hint">{done[chapter] ? '✦' : current.hint}</span>
        </div>

        <p className="journey-chapter__caption">{current.caption}</p>

        {chapter === 5 && (
          <div className={`journey-finale${done[5] ? ' journey-finale--show' : ''}`}>
            <h2>{wedding.bride} &amp; {wedding.groom}</h2>
            <p>Forever Begins Here</p>
            <div className="journey-finale-actions">
              <button type="button" className="journey-replay" onClick={replayJourney}>
                <RotateCcw size={12} /> Replay Journey
              </button>
              {onReplayOpening && (
                <button type="button" className="journey-replay" onClick={onReplayOpening}>
                  <RotateCcw size={12} /> Replay Envelope
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
