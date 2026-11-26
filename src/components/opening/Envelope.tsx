import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Envelope.css';
import './WindStreaks.css';
import './PaperFlight.css';
import { wedding } from '../../data/wedding';

gsap.registerPlugin(useGSAP);
const base = `${import.meta.env.BASE_URL}assets/images/cinematic/layers/`;
const ambientBase = `${import.meta.env.BASE_URL}assets/images/cinematic/ambient/`;
const names = `${wedding.bride} & ${wedding.groom}`;
const date = wedding.dateLabel;

const PRELOAD_ASSETS = [
  `${ambientBase}closed-fixed.webp`,
  `${ambientBase}envelope-isolated.png`,
  `${ambientBase}flap-clean.png`,
  `${ambientBase}scalloped-card.png`,
  `${ambientBase}opening-clear.png`,
  `${base}sky.webp`,
  `${base}sand.webp`,
];

type EnvelopeProps = { onComplete?: () => void };

export default function Envelope({ onComplete }: EnvelopeProps) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const [state, setState] = useState<'closed' | 'opening' | 'opened'>('closed');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => { if (!cancelled) setReady(true); }, 1400);
    Promise.all(
      PRELOAD_ASSETS.map(
        src =>
          new Promise<void>(resolve => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          })
      )
    ).then(() => {
      if (!cancelled) {
        clearTimeout(timeout);
        setReady(true);
        // Warm-cache invitation assets in the background while user views the envelope
        const cinBase = `${import.meta.env.BASE_URL}assets/images/cinematic/`;
        [
          `${cinBase}main-background.webp`,
          `${cinBase}ambient/floral-corner.jpg`,
          `${cinBase}journey/ch1-encounter.jpg`,
          `${cinBase}journey/ch2-bloomed.jpg`,
          `${cinBase}journey/ch3-promise.jpg`,
          `${cinBase}journey/ch4-union.jpg`,
          `${cinBase}journey/ch5-forever.jpg`,
        ].forEach(src => {
          const i = new Image();
          i.src = src;
        });
      }
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const { contextSafe } = useGSAP(() => {
    gsap.set('.opening-back', { scaleY: 0 });
    gsap.set('.opening-lining', { opacity: 0 });
    gsap.set('.card-viewport', { autoAlpha: 0 });
    gsap.set('.floating-card', { xPercent: -2.1, yPercent: 29, scale: 0.94 });
    gsap.set('.card-flutter', { transformOrigin: '48.5% 41.6%', transformPerspective: 1200, force3D: true });
    gsap.set('.paper-displacement', { attr: { scale: 0 } });
    gsap.set('.paper-curl-light', { opacity: 0 });
    gsap.set('.card-viewport', { clipPath: 'polygon(0% 0%,100% 0%,100% 39%,67% 39%,77% 78%,33% 88%,25% 41%,0% 41%)' });
    return () => timeline.current?.kill();
  }, { scope: root });

  const open = contextSafe(() => {
    if (busy.current || state !== 'closed') return;
    busy.current = true;
    setState('opening');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
        setState('opened');
        onComplete?.();
      },
    });
    timeline.current = tl;
    const card = root.current?.querySelector('.complete-card');
    const distance = (card?.getBoundingClientRect().right ?? window.innerWidth) + 120;

    tl.to(['.heading', '.mobile-heading', '.sky-love-ornament'], { autoAlpha: 0, y: -6, duration: 0.8, ease: 'sine.inOut' }, 0)
      .to('.sky-ornament-cleanup', { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, 0)
      .set('.opening-assembly', { autoAlpha: 1 }, 0)
      // Reveal inner lining BEFORE flap folds so the sea never peeks through
      .to('.opening-lining', { opacity: 1, duration: 0.45, ease: 'sine.out' }, 0.1)
      .to('.opening-flap', { scaleY: 0, duration: 1.15, ease: 'sine.inOut' }, 0.3)
      // Start raising the open back flap before the front flap disappears
      .to('.opening-back', { scaleY: 1, duration: 1.25, ease: 'sine.inOut' }, 0.95)
      .to('.opening-flap', { autoAlpha: 0, duration: 0.3, ease: 'sine.inOut' }, 1.15)
      .to('.card-viewport', { autoAlpha: 1, duration: 0.5, ease: 'sine.inOut' }, 1.85)
      .to('.floating-card', { yPercent: -15, scale: 0.8, rotation: -0.8, duration: 2.8, ease: 'sine.inOut' }, 2.15)
      .to('.card-viewport', { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,100% 100%,100% 100%,0% 100%,0% 100%,0% 100%)', duration: 0.55, ease: 'sine.inOut' }, 4.45)
      .set('.card-viewport', { zIndex: 5 }, 5.0)
      .add(() => root.current?.classList.add('gust'), 4.85)
      .to('.floating-card', { x: -distance, yPercent: -22, rotation: -8, duration: 3.7, ease: 'power1.in' }, 5.1)
      .to('.card-flutter', { rotationY: -16, rotationX: 6, rotation: 2, duration: 0.7, ease: 'sine.inOut' }, 5.1)
      .to('.card-flutter', { rotationY: 14, rotationX: -5, rotation: -2.5, duration: 0.85, ease: 'sine.inOut' }, 5.8)
      .to('.card-flutter', { rotationY: -13, rotationX: 4, rotation: 1.5, duration: 0.8, ease: 'sine.inOut' }, 6.65)
      .to('.card-flutter', { rotationY: 11, rotationX: -4, rotation: -2, duration: 0.8, ease: 'sine.inOut' }, 7.45)
      .to('.card-flutter', { rotationY: -7, rotationX: 3, rotation: 1, duration: 0.8, ease: 'sine.inOut' }, 8.25)
      .to('.paper-displacement', { attr: { scale: 34 }, duration: 0.75, ease: 'sine.inOut' }, 5.1)
      .to('.paper-displacement', { attr: { scale: -28 }, duration: 0.85, ease: 'sine.inOut' }, 5.85)
      .to('.paper-displacement', { attr: { scale: 30 }, duration: 0.85, ease: 'sine.inOut' }, 6.7)
      .to('.paper-displacement', { attr: { scale: -24 }, duration: 0.8, ease: 'sine.inOut' }, 7.55)
      .to('.paper-displacement', { attr: { scale: 18 }, duration: 0.8, ease: 'sine.inOut' }, 8.35)
      .to('.paper-curl-light', { opacity: 0.48, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: 4 }, 5.1)
      .to('.portrait-stage', { autoAlpha: 0, duration: 1.25, ease: 'sine.inOut' }, 8.9);

    if (reduced) tl.progress(1);
  });

  const layer = (name: string, cls = '') => <img className={`art ${cls}`} src={base + name} alt="" draggable={false} />;
  const lettering = (
    <div className="card-lettering">
      <p>With joyful hearts, together with our families</p>
      <h2>{names}</h2>
      <svg className="card-flourish" viewBox="0 0 460 42" aria-hidden="true">
        <path d="M4 27 C52 4 99 38 158 26 C190 19 207 12 230 25 C253 12 270 19 302 26 C361 38 408 4 456 27 M186 28 C202 43 217 34 230 25 C243 34 258 43 274 28 M220 25 L230 15 L240 25 L230 35 Z" />
        <circle cx="5" cy="27" r="2" /><circle cx="455" cy="27" r="2" />
      </svg>
      <time dateTime={wedding.dateISO}>{date}</time>
    </div>
  );

  return (
    <main className={`invitation-opening${ready ? ' invitation-opening--ready' : ''}`} ref={root} aria-busy={state === 'opening' || !ready}>
      {!ready && (
        <div className="opening-loader" aria-hidden="true">
          <div className="opening-loader__crest">{wedding.monogram}</div>
          <div className="opening-loader__bar"><span /></div>
        </div>
      )}

      <svg className="wind-filters" aria-hidden="true" focusable="false">
        <defs>
          <filter id="paper-flex" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="1" seed="9" result="paper-waves" />
            <feDisplacementMap className="paper-displacement" in="SourceGraphic" in2="paper-waves" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {[{ id: 'scene-breeze', scale: 8, duration: '7s' }, { id: 'scene-gust', scale: 13, duration: '3.2s' }].map(({ id, scale, duration }) => (
            <filter key={id} id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="2" seed="4" result="wind">
                <animate attributeName="baseFrequency" values="0.003 0.006;0.0045 0.004;0.003 0.006" dur={duration} repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="wind" scale={scale} xChannelSelector="R" yChannelSelector="G" result="moving" />
              <feImage href={`${ambientBase}wind-mask.png`} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="mask" />
              <feComposite in="moving" in2="mask" operator="in" result="moving-area" />
              <feComposite in="SourceGraphic" in2="mask" operator="out" result="still-area" />
              <feComposite in="moving-area" in2="still-area" operator="arithmetic" k2="1" k3="1" />
            </filter>
          ))}
        </defs>
      </svg>

      <div className="portrait-stage" style={{ '--sky-art': `url("${base}sky.webp")`, '--sand-art': `url("${base}sand.webp")` } as CSSProperties}>
        <div className="opening-scene-content">
          <div className="scene">
            <div className="closed-view">
              <img className="art" src={`${ambientBase}closed-fixed.webp`} alt="" draggable={false} />
              <span className="monogram closed-monogram">{wedding.monogram}</span>
            </div>
            <img className="art sky-love-cleanup" src={`${ambientBase}sky-ornament-cleanup.png`} alt="" />
            <img className="sky-love-ornament" src={`${ambientBase}linked-hearts.svg`} alt="" />
            <img className="art sky-ornament-cleanup" src={`${ambientBase}sky-ornament-cleanup.png`} alt="" />

            <div className="opening-assembly">
              <img className="art opening-clear" src={`${ambientBase}opening-clear.png`} alt="" />
              {/* Solid warm-gold inner pocket backing prevents the sea from bleeding through */}
              <div className="envelope-inner-pocket" aria-hidden="true" />
              <div className="opening-lining">
                <img className="isolated-envelope" src={`${ambientBase}envelope-isolated.png`} alt="" />
              </div>
              <div className="opening-back">
                <div className="opening-back-image">
                  <img className="isolated-envelope" src={`${ambientBase}envelope-isolated.png`} alt="" />
                </div>
              </div>
              <div className="card-viewport">
                <div className="floating-card">
                  <img className="wind-streak-overlay" src={`${ambientBase}wind-streaks.svg`} alt="" draggable={false} />
                  <div className="card-flutter" style={{ position: 'absolute', inset: 0 }}>
                    <div className="paper-surface">
                      <img className="complete-card" src={`${ambientBase}scalloped-card.png`} alt="" draggable={false} />
                      <div className="card-motif" aria-hidden="true">
                        <img className="card-filigree" src={`${ambientBase}card-filigree.svg`} alt="" />
                        <div className="card-shell-cleanup"><img src={`${ambientBase}scalloped-card.png`} alt="" /></div>
                        <img className="card-love-ornament" src={`${ambientBase}linked-hearts.svg`} alt="" />
                      </div>
                      {lettering}
                      <span className="paper-curl-light" style={{ maskImage: `url("${ambientBase}scalloped-card.png")` }} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="original-front"><img className="art" src={`${ambientBase}closed-fixed.webp`} alt="" /></div>
              <div className="opening-flap"><img className="art" src={`${ambientBase}flap-clean.png`} alt="" /></div>
              <div className="original-seal">
                <img className="art" src={`${ambientBase}closed-fixed.webp`} alt="" />
                <span className="monogram closed-monogram">{wedding.monogram}</span>
              </div>
            </div>

            <div className="ambient ambient-palm-left">{layer('closed.webp')}</div>
            <div className="ambient ambient-palm-right">{layer('closed.webp')}</div>
            <div className="ambient ambient-waves">{layer('closed.webp')}</div>
            <div className="ambient ambient-cloth">{layer('closed.webp')}</div>
            <img className="art ambient-light" src={`${ambientBase}breeze-light.svg`} alt="" />
            <img className="art hotel-haze-art" src={`${ambientBase}hotel-haze.svg`} alt="" />

            {/* Multi-layered natural coastal wind passes before opening */}
            <div className="ambient-wind" aria-hidden="true">
              <img className="wind-pass wind-pass--1" src={`${ambientBase}breeze-wisps.svg`} alt="" draggable={false} />
              <img className="wind-pass wind-pass--2" src={`${ambientBase}breeze-wisps.svg`} alt="" draggable={false} />
              <img className="wind-pass wind-pass--3" src={`${ambientBase}wind-streaks.svg`} alt="" draggable={false} />
              <span className="wind-mote wind-mote--1" />
              <span className="wind-mote wind-mote--2" />
              <span className="wind-mote wind-mote--3" />
              <span className="wind-mote wind-mote--4" />
            </div>

            {state === 'closed' && <button className="envelope-hit" type="button" onClick={open} aria-label="Open wedding invitation" />}
            <header className="heading">
              <p>With joyful hearts, together with our families</p>
              <h1>{names}</h1>
              <time dateTime={wedding.dateISO}>{date}</time>
            </header>
          </div>

          <header className="mobile-heading" aria-hidden={state !== 'closed'}>
            <p>With joyful hearts, together with our families</p>
            <h1>{names}</h1>
            <time dateTime={wedding.dateISO}>{date}</time>
          </header>

          <div className="action-area">
            {state === 'closed' && (
              <button className="open-action" onClick={open} type="button">
                Tap to Open <span aria-hidden="true">&#10023;</span>
              </button>
            )}
          </div>
        </div>
        <span className="sr-only" role="status">
          {state === 'opened' ? 'Invitation opened' : state === 'opening' ? 'Opening invitation' : 'Invitation ready'}
        </span>
      </div>
    </main>
  );
}
