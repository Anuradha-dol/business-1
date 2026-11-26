import { useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Envelope.css';
import './WindStreaks.css';
import './PaperFlight.css';
import { wedding } from '../../data/wedding';

gsap.registerPlugin(useGSAP);
const base = `${import.meta.env.BASE_URL}assets/images/cinematic/layers/`;
const names = `${wedding.bride} & ${wedding.groom}`;
const date = wedding.dateLabel;

type EnvelopeProps = { onComplete?: () => void };

export default function Envelope({ onComplete }: EnvelopeProps) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const [state, setState] = useState<'closed' | 'opening' | 'opened'>('closed');
  const { contextSafe } = useGSAP(() => {
    gsap.set('.opening-back', { scaleY: 0 });
    // The lining belongs inside the pocket. Revealing it only as the flap
    // folds avoids painting a differently coloured strip over the closed lip.
    gsap.set('.opening-lining', { opacity: 0 });
    gsap.set('.card-viewport', { autoAlpha: 0 });
    // The envelope opening is slightly left of the artwork's centre.  Keeping
    // the card centred on that opening prevents its ornate right edge from
    // poking through the envelope as it rises behind the front rim.
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
    const tl = gsap.timeline({ onComplete: () => {
      busy.current = false;
      setState('opened');
      onComplete?.();
    } });
    timeline.current = tl;
    // Measure the actual viewport: the stage is wider than the screen on mobile.
    // A fixed percentage would leave part of the card visible on some screens.
    const card = root.current?.querySelector('.complete-card');
    const distance = (card?.getBoundingClientRect().right ?? window.innerWidth) + 100;
    tl.to(['.heading', '.mobile-heading', '.sky-love-ornament'], { autoAlpha: 0, y: -6, duration: 0.85, ease: 'sine.inOut' }, 0)
      .to('.sky-ornament-cleanup', { opacity: 1, duration: 0.85, ease: 'sine.inOut' }, 0)
      .set('.opening-assembly', { autoAlpha: 1 }, 0)
      .to('.opening-flap', { scaleY: 0, duration: 1.3, ease: 'sine.inOut' }, 0.35)
      .to('.opening-lining', { opacity: 1, duration: 0.65, ease: 'sine.inOut' }, 0.95)
      .to('.opening-flap', { autoAlpha: 0, duration: 0.35, ease: 'sine.inOut' }, 1.25)
      .to('.opening-back', { scaleY: 1, duration: 1.35, ease: 'sine.inOut' }, 1.65)
      .to('.card-viewport', { autoAlpha: 1, duration: 0.5, ease: 'sine.inOut' }, 2.15)
      .to('.floating-card', { yPercent: -15, scale: 0.8, rotation: -0.8, duration: 3, ease: 'sine.inOut' }, 2.45)
      .to('.card-viewport', { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,100% 100%,100% 100%,0% 100%,0% 100%,0% 100%)', duration: 0.55, ease: 'sine.inOut' }, 4.8)
      .set('.card-viewport', { zIndex: 5 }, 5.35)
      .add(() => root.current?.classList.add('gust'), 5.2)
      // No hold or fade in the flight: the card travels beyond the viewport.
      .to('.floating-card', { x: -distance, yPercent: -22, rotation: -8, duration: 3.8, ease: 'power1.in' }, 5.45)
      // The flight path stays continuous while the paper responds to uneven air.
      // A separate inner transform keeps its flutter from interrupting the travel.
      .to('.card-flutter', { rotationY: -16, rotationX: 6, rotation: 2, duration: 0.7, ease: 'sine.inOut' }, 5.45)
      .to('.card-flutter', { rotationY: 14, rotationX: -5, rotation: -2.5, duration: 0.85, ease: 'sine.inOut' }, 6.15)
      .to('.card-flutter', { rotationY: -13, rotationX: 4, rotation: 1.5, duration: 0.8, ease: 'sine.inOut' }, 7)
      .to('.card-flutter', { rotationY: 11, rotationX: -4, rotation: -2, duration: 0.8, ease: 'sine.inOut' }, 7.8)
      .to('.card-flutter', { rotationY: -7, rotationX: 3, rotation: 1, duration: 0.8, ease: 'sine.inOut' }, 8.6)
      // Bend the paper surface itself, rather than only rotating a flat card.
      // The image and live lettering share the same displacement so they stay together.
      .to('.paper-displacement', { attr: { scale: 34 }, duration: 0.75, ease: 'sine.inOut' }, 5.45)
      .to('.paper-displacement', { attr: { scale: -28 }, duration: 0.85, ease: 'sine.inOut' }, 6.2)
      .to('.paper-displacement', { attr: { scale: 30 }, duration: 0.85, ease: 'sine.inOut' }, 7.05)
      .to('.paper-displacement', { attr: { scale: -24 }, duration: 0.8, ease: 'sine.inOut' }, 7.9)
      .to('.paper-displacement', { attr: { scale: 18 }, duration: 0.8, ease: 'sine.inOut' }, 8.7)
      .to('.paper-curl-light', { opacity: 0.48, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: 4 }, 5.45)
      // Fade the stage as a single composition, including its sky and sand
      // extensions, so the bottom does not disappear before the scene.
      .to('.portrait-stage', { autoAlpha: 0, duration: 1.3, ease: 'sine.inOut' }, 9.3);
    if (reduced) tl.progress(1);
  });

  const layer = (name: string, cls = '') => <img className={`art ${cls}`} src={base + name} alt="" draggable={false} />;
  const lettering = <div className="card-lettering">
    <p>With joyful hearts, together with our families</p>
    <h2>{names}</h2>
    <svg className="card-flourish" viewBox="0 0 460 42" aria-hidden="true">
      <path d="M4 27 C52 4 99 38 158 26 C190 19 207 12 230 25 C253 12 270 19 302 26 C361 38 408 4 456 27 M186 28 C202 43 217 34 230 25 C243 34 258 43 274 28 M220 25 L230 15 L240 25 L230 35 Z" />
      <circle cx="5" cy="27" r="2" /><circle cx="455" cy="27" r="2" />
    </svg>
    <time dateTime={wedding.dateISO}>{date}</time>
  </div>;
  return <main className="invitation-opening" ref={root} aria-busy={state === 'opening'}>
    {/* Inline filters can animate in browsers; animations in an external SVG
        filter resource are treated as static by Chromium. */}
    <svg className="wind-filters" aria-hidden="true" focusable="false">
      <defs>
        <filter id="paper-flex" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="1" seed="9" result="paper-waves" />
          <feDisplacementMap className="paper-displacement" in="SourceGraphic" in2="paper-waves" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {[{ id: 'scene-breeze', scale: 8, duration: '7s' }, { id: 'scene-gust', scale: 13, duration: '3.2s' }].map(({ id, scale, duration }) =>
          <filter key={id} id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="2" seed="4" result="wind">
              <animate attributeName="baseFrequency" values="0.003 0.006;0.0045 0.004;0.003 0.006" dur={duration} repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="wind" scale={scale} xChannelSelector="R" yChannelSelector="G" result="moving" />
            <feImage href={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/wind-mask.png`} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="mask" />
            <feComposite in="moving" in2="mask" operator="in" result="moving-area" />
            <feComposite in="SourceGraphic" in2="mask" operator="out" result="still-area" />
            <feComposite in="moving-area" in2="still-area" operator="arithmetic" k2="1" k3="1" />
          </filter>
        )}
      </defs>
    </svg>
    <div className="portrait-stage" style={{ '--sky-art': `url("${base}sky.webp")`, '--sand-art': `url("${base}sand.webp")` } as CSSProperties}>
      <div className="opening-scene-content">
        <div className="scene">
          <div className="closed-view"><img className="art" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/closed-fixed.webp`} alt="" draggable={false} /><span className="monogram closed-monogram">{wedding.monogram}</span></div>
          <img className="art sky-love-cleanup" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/sky-ornament-cleanup.png`} alt="" />
          <img className="sky-love-ornament" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`} alt="" />
          <img className="art sky-ornament-cleanup" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/sky-ornament-cleanup.png`} alt="" />
          <div className="opening-assembly">
            <img className="art opening-clear" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/opening-clear.png`} alt="" />
            <div className="opening-lining"><img className="isolated-envelope" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/envelope-isolated.png`} alt="" /></div>
            <div className="opening-back"><div className="opening-back-image"><img className="isolated-envelope" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/envelope-isolated.png`} alt="" /></div></div>
            <div className="card-viewport">
              <div className="floating-card">
                <img className="wind-streak-overlay" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/wind-streaks.svg`} alt="" draggable={false} />
                <div className="card-flutter" style={{ position: 'absolute', inset: 0 }}>
                  <div className="paper-surface">
                    <img className="complete-card" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/scalloped-card.png`} alt="" draggable={false} />
                    <div className="card-motif" aria-hidden="true">
                      <img className="card-filigree" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/card-filigree.svg`} alt="" />
                      <div className="card-shell-cleanup"><img src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/scalloped-card.png`} alt="" /></div>
                      <img className="card-love-ornament" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`} alt="" />
                    </div>
                    {lettering}
                    <span className="paper-curl-light" style={{ maskImage: `url("${import.meta.env.BASE_URL}assets/images/cinematic/ambient/scalloped-card.png")` }} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            <div className="original-front"><img className="art" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/closed-fixed.webp`} alt="" /></div>
            <div className="opening-flap"><img className="art" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/flap-clean.png`} alt="" /></div>
            <div className="original-seal"><img className="art" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/closed-fixed.webp`} alt="" /><span className="monogram closed-monogram">{wedding.monogram}</span></div>
          </div>
          <div className="ambient ambient-palm-left">{layer('closed.webp')}</div>
          <div className="ambient ambient-palm-right">{layer('closed.webp')}</div>
          <div className="ambient ambient-waves">{layer('closed.webp')}</div>
          <div className="ambient ambient-cloth">{layer('closed.webp')}</div>
          <img className="art ambient-light" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/breeze-light.svg`} alt="" />
          <img className="art hotel-haze-art" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/hotel-haze.svg`} alt="" />
          <div className="ambient-wind" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/breeze-wisps.svg`} alt="" draggable={false} /></div>
          {state === 'closed' && <button className="envelope-hit" type="button" onClick={open} aria-label="Open wedding invitation" />}
          <header className="heading"><p>With joyful hearts, together with our families</p><h1>{names}</h1><time dateTime={wedding.dateISO}>{date}</time></header>
        </div>
        <header className="mobile-heading" aria-hidden={state !== 'closed'}><p>With joyful hearts, together with our families</p><h1>{names}</h1><time dateTime={wedding.dateISO}>{date}</time></header>
        <div className="action-area">{state === 'closed' && <button className="open-action" onClick={open} type="button">Tap to Open <span aria-hidden="true">&#10023;</span></button>}</div>
      </div>
      <span className="sr-only" role="status">{state === 'opened' ? 'Invitation opened' : state === 'opening' ? 'Opening invitation' : 'Invitation ready'}</span>
    </div>
  </main>;
}

