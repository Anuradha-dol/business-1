import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { RotateCcw } from 'lucide-react';
import SceneArtwork from './SceneArtwork';
import UnionArtwork from './UnionArtwork';
import PromiseArtwork from './PromiseArtwork';
import './CinematicJourney.css';

const chapters = [
  { title: 'The First Encounter', line: 'Two strangers, one beautiful beginning.', hint: 'Touch the flower', action: 'Bring the butterflies to the flower' },
  { title: 'When Love Bloomed', line: 'And slowly, love began to bloom.', hint: 'Touch the buds', action: 'Watch the flowers bloom' },
  { title: 'The Promise', line: 'One question. One answer. A lifetime together.', hint: 'Touch the glass dome', action: 'Lift the glass dome' },
  { title: 'The Union', line: 'Two hearts, one rhythm.', hint: 'Open the music box', action: 'Open the music box' },
  { title: 'Forever Begins', line: 'Forever Begins Here.', hint: '', action: '' },
] as const;

type Phase = 'entering' | 'ready' | 'playing' | 'leaving' | 'finale';

/** One mounted chapter at a time; each transition completes before the next mounts. */
export default function CinematicJourney({ onReplayOpening }: { onReplayOpening?: () => void }) {
  const [chapter, setChapter] = useState(0);
  const [phase, setPhase] = useState<Phase>('entering');
  const [completed, setCompleted] = useState(false);
  const [run, setRun] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const sceneRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lockedRef = useRef(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const art = artRef.current;
    const copy = copyRef.current;
    if (!scene || !art || !copy) return;

    lockedRef.current = true;
    setPhase('entering');
    setCompleted(chapter === 4);
    if (lightRef.current) gsap.set(lightRef.current, { opacity: 0, clearProps: 'transform' });
    const duration = reducedMotion ? 0.01 : 1.55;
    // Each chapter arrives on a different camera path, while the shore remains continuous.
    const entries = [
      { x: -35, y: 28, scale: 1.12, rotation: -2 },
      { x: 45, y: 20, scale: .9, rotation: 3 },
      { x: 0, y: 30, scale: .83, rotation: 0 },
      { x: -35, y: 10, scale: 1.1, rotation: -2 },
      { x: 0, y: 22, scale: .9, rotation: 0 },
    ];
    const tl = gsap.timeline({
      onComplete: () => {
        lockedRef.current = false;
        setPhase(chapter === 4 ? 'finale' : 'ready');
      },
    });
    timelineRef.current = tl;
    tl.set(scene, { visibility: 'visible' })
      .fromTo(art, { ...entries[chapter], autoAlpha: 0, filter: 'blur(8px)' },
        { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, filter: 'blur(0px)', duration, ease: 'power2.out' }, 0)
      .fromTo(copy, { y: reducedMotion ? 0 : 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reducedMotion ? .01 : 1.05, ease: 'power2.out' }, reducedMotion ? 0 : .45);
    return () => { tl.kill(); timelineRef.current?.kill(); };
  }, [chapter, run, reducedMotion]);

  const advance = () => {
    if (lockedRef.current || chapter === 4) return;
    lockedRef.current = true;
    setPhase('playing');
    setCompleted(true);
    const light = lightRef.current;
    if (!light || reducedMotion) return;
    // Ambient light follows the artwork until its own terminal animation ends.
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    timelineRef.current = tl;
    tl.fromTo(light, { opacity: 0, scale: .65, xPercent: -15 },
      { opacity: .65, scale: 1.15, xPercent: 15, duration: 2, ease: 'sine.inOut' });
  };

  const finishInteraction = () => {
    if (phase !== 'playing') return;
    const art = artRef.current;
    const copy = copyRef.current;
    const light = lightRef.current;
    if (!art || !copy || !light) return;
    timelineRef.current?.kill();
    setPhase('leaving');
    const duration = reducedMotion ? .01 : 1.15;
    const tl = gsap.timeline({ onComplete: () => {
      setCompleted(false);
      setChapter(value => Math.min(value + 1, 4));
    } });
    timelineRef.current = tl;
    tl.to(copy, { y: reducedMotion ? 0 : -14, autoAlpha: 0, duration: reducedMotion ? .01 : .65, ease: 'power1.in' }, 0)
      .to(art, { x: reducedMotion ? 0 : chapter % 2 ? -50 : 50, y: reducedMotion ? 0 : -18, scale: reducedMotion ? 1 : 1.09, autoAlpha: 0, filter: reducedMotion ? 'blur(0px)' : 'blur(5px)', duration, ease: 'power2.inOut' }, 0)
      .to(light, { opacity: 0, scale: reducedMotion ? 1 : 1.5, duration, ease: 'sine.inOut' }, 0);
  };

  const skip = () => {
    timelineRef.current?.kill();
    lockedRef.current = true;
    setPhase('leaving');
    const tl = gsap.timeline({ onComplete: () => {
      setCompleted(false);
      setChapter(4);
    } });
    timelineRef.current = tl;
    if (artRef.current && copyRef.current) {
      tl.to([artRef.current, copyRef.current], { autoAlpha: 0, y: reducedMotion ? 0 : -12, duration: reducedMotion ? .01 : .35, ease: 'power1.in' });
    }
  };

  const replay = () => {
    timelineRef.current?.kill();
    lockedRef.current = true;
    setCompleted(false);
    setChapter(0);
    setRun(value => value + 1);
  };

  const current = chapters[chapter];
  return (
    <div className="cinematic-journey" ref={sceneRef}>
      <div className="cinematic-journey__world" aria-hidden="true" style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/images/cinematic/journey/beach-plate.webp")` }}>
        <div className="cinematic-journey__sun" />
        <div className="cinematic-journey__sea" />
        <div className="cinematic-journey__shore" />
        <div className="cinematic-journey__light" ref={lightRef} />
      </div>
      <img className="cinematic-journey__silk" src={`${import.meta.env.BASE_URL}assets/images/cinematic/journey/silk.webp`} alt="" aria-hidden="true" />
      <div className="cinematic-journey__scene">
        <div className="cinematic-journey__copy" ref={copyRef} aria-live="polite">
          <p className="cinematic-journey__eyebrow">{chapter === 4 ? 'A journey to forever' : `Chapter ${String(chapter + 1).padStart(2, '0')}  ·  ${current.title}`}</p>
          {chapter === 4 ? <h1>Himeshi <span>&amp;</span> Madhawa</h1> : <h1>{current.line}</h1>}
          {chapter === 4 && <><p className="cinematic-journey__final-line">{current.line}</p><p className="cinematic-journey__date">15 January 2027</p></>}
          <div className="cinematic-journey__progress" aria-hidden="true">
            {chapters.map((item, index) => <span key={item.title} className={index <= chapter ? 'is-reached' : ''} />)}
          </div>
        </div>
        <div className="cinematic-journey__art" ref={artRef}>
          {chapter === 2 ? <PromiseArtwork active={phase !== 'leaving'} completed={completed} reducedMotion={reducedMotion} onInteractionComplete={finishInteraction} /> : chapter === 3 ? <UnionArtwork active={phase !== 'leaving'} completed={completed} reducedMotion={reducedMotion} onInteractionComplete={finishInteraction} /> : <SceneArtwork chapter={chapter} active={phase !== 'leaving'} completed={completed} reducedMotion={reducedMotion} onInteractionComplete={finishInteraction} />}
          {chapter < 4 && <button type="button" className="cinematic-journey__object-button" aria-label={current.action} disabled={phase !== 'ready'} onClick={advance} />}
        </div>
        <div className="cinematic-journey__bottom">
          {chapter < 4 && <><button type="button" className="cinematic-journey__hint" disabled={phase !== 'ready'} onClick={advance}><span aria-hidden="true">✧</span> {current.hint} <span aria-hidden="true">→</span></button><button type="button" className="cinematic-journey__skip" onClick={skip}>Skip to forever <span aria-hidden="true">→</span></button></>}
          {chapter === 4 && <div className="cinematic-journey__replay-actions"><button type="button" className="cinematic-journey__replay" onClick={replay}><RotateCcw size={13} /> Replay experience</button>{onReplayOpening && <button type="button" className="cinematic-journey__replay cinematic-journey__replay--opening" onClick={onReplayOpening}>Replay opening</button>}</div>}
        </div>
      </div>
    </div>
  );
}
