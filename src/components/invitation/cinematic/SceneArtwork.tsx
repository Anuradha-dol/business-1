import type { AnimationEvent } from 'react';
import BloomArtwork from './BloomArtwork';
import ForeverArtwork from './ForeverArtwork';
import './SceneArtwork.css';

type Props = {
  chapter: number;
  active: boolean;
  completed: boolean;
  reducedMotion: boolean;
  onInteractionComplete?: () => void;
};

/* Each illustration is transparent: the sea, light and scenery belong to the stage,
   while these separately animated groups remain independent of that background. */
function Butterfly({ side }: { side: 'left' | 'right' }) {
  const butterfly = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/butterfly.webp`;
  return <g className={`art-butterfly art-butterfly--${side}`}>
    <g className="art-wing art-wing--left">
      <svg x="-38" y="-26" width="38" height="52" viewBox="0 0 50 100" preserveAspectRatio="none" overflow="hidden"><image href={butterfly} width="100" height="100" preserveAspectRatio="none" /></svg>
    </g>
    <g className="art-wing art-wing--right">
      <svg x="0" y="-26" width="38" height="52" viewBox="50 0 50 100" preserveAspectRatio="none" overflow="hidden"><image href={butterfly} width="100" height="100" preserveAspectRatio="none" /></svg>
    </g>
  </g>;
}

function Encounter() {
  return <>
    <g className="art-bloom"><image className="art-encounter-rose" href={`${import.meta.env.BASE_URL}assets/images/cinematic/journey/encounter-rose.webp`} x="150" y="190" width="200" height="300" /></g>
    <g transform="translate(128 140)"><Butterfly side="left" /></g>
    <g transform="translate(374 130)"><Butterfly side="right" /></g>
  </>;
}
export default function SceneArtwork({ chapter, active, completed, reducedMotion, onInteractionComplete }: Props) {
  const interactionAnimations = ['art-rose-arrive', 'art-calla-together-left', 'art-dome-lift', 'art-groom-dance'];
  const handleAnimationEnd = (event: AnimationEvent<SVGSVGElement>) => {
    if (active && completed && event.animationName === interactionAnimations[chapter]) onInteractionComplete?.();
  };
  return <svg onAnimationEnd={handleAnimationEnd} className={`scene-artwork${active ? ' is-active' : ''}${completed ? ' is-completed' : ''}${reducedMotion ? ' is-reduced' : ''}`} viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="art-pearl" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffefa"/><stop offset=".55" stopColor="#f5eee3"/><stop offset="1" stopColor="#d7c9b5"/></linearGradient>
      <linearGradient id="art-petal" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#fffefa"/><stop offset=".48" stopColor="#faf7ee"/><stop offset="1" stopColor="#d9cbb8"/></linearGradient>
      <linearGradient id="art-gold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9f7138"/><stop offset=".2" stopColor="#efd69d"/><stop offset=".45" stopColor="#ae803e"/><stop offset=".7" stopColor="#fff3c8"/><stop offset="1" stopColor="#9e6e32"/></linearGradient>
      <linearGradient id="art-stem"><stop stopColor="#597055"/><stop offset=".45" stopColor="#9ba987"/><stop offset="1" stopColor="#50674e"/></linearGradient>
      <linearGradient id="art-leaf" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a7b398"/><stop offset="1" stopColor="#536c54"/></linearGradient>
      <linearGradient id="art-glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".38"/><stop offset=".35" stopColor="#eaf6f3" stopOpacity=".06"/><stop offset=".75" stopColor="#fff" stopOpacity=".19"/><stop offset="1" stopColor="#d4ecea" stopOpacity=".32"/></linearGradient>
      <linearGradient id="art-diamond" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".45" stopColor="#c4d9dd"/><stop offset=".7" stopColor="#fff"/><stop offset="1" stopColor="#a9c4ca"/></linearGradient>
      <linearGradient id="art-wood" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ead7b8"/><stop offset=".45" stopColor="#d1b58e"/><stop offset="1" stopColor="#a8845b"/></linearGradient>
    </defs>
    {chapter === 0 && <Encounter />}
    {chapter === 1 && <BloomArtwork />}
    {chapter === 4 && <><ForeverArtwork /><g transform="translate(115 163) scale(.55)"><Butterfly side="left" /></g><g transform="translate(389 158) scale(.45)"><Butterfly side="right" /></g></>}
  </svg>;
}



