import type { AnimationEvent } from 'react';
import './UnionArtwork.css';

type Props = {
  active: boolean;
  completed: boolean;
  reducedMotion: boolean;
  onInteractionComplete?: () => void;
};

/** The box's lid, front and couple are independently layered for the reveal. */
export default function UnionArtwork({ active, completed, reducedMotion, onInteractionComplete }: Props) {
  const box = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/union-box-v2.webp`;
  const closedBox = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/union-box-closed.webp`;
  const couple = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/union-couple-v2.webp`;
  const handleAnimationEnd = (event: AnimationEvent<SVGSVGElement>) => {
    if (active && completed && event.animationName === 'union-couple-dance') onInteractionComplete?.();
  };

  return <svg className={`union-artwork${completed ? ' is-completed' : ''}${reducedMotion ? ' is-reduced' : ''}`} viewBox="60 95 380 390" aria-hidden="true" focusable="false" onAnimationEnd={handleAnimationEnd}>
    <defs>
      <clipPath id="union-lid-clip" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width="500" height="306" /></clipPath>
      <clipPath id="union-base-clip" clipPathUnits="userSpaceOnUse"><rect x="0" y="306" width="500" height="194" /></clipPath>
      <clipPath id="union-front-clip" clipPathUnits="userSpaceOnUse"><rect x="0" y="369" width="500" height="131" /></clipPath>
    </defs>
    <ellipse cx="250" cy="467" rx="155" ry="15" fill="#765b3a" opacity=".15" />
    <g className="union-artwork__opened">
      <g className="union-artwork__lid"><image href={box} x="75" y="150" width="350" height="320" clipPath="url(#union-lid-clip)" /></g>
      <image href={box} x="75" y="150" width="350" height="320" clipPath="url(#union-base-clip)" />
      <g className="union-artwork__couple-rise"><image className="union-artwork__couple" href={couple} x="177" y="220" width="146" height="160" /></g>
      <image href={box} x="75" y="150" width="350" height="320" clipPath="url(#union-front-clip)" />
    </g>
    <image className="union-artwork__closed" href={closedBox} x="75" y="150" width="350" height="320" />
  </svg>;
}

