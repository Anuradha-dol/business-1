import type { AnimationEvent } from 'react';
import './PromiseArtwork.css';

type Props = {
  active: boolean;
  completed: boolean;
  reducedMotion: boolean;
  onInteractionComplete?: () => void;
};

export default function PromiseArtwork({ active, completed, reducedMotion, onInteractionComplete }: Props) {
  const asset = (name: string) => `${import.meta.env.BASE_URL}assets/images/cinematic/journey/${name}`;
  const handleAnimationEnd = (event: AnimationEvent<SVGSVGElement>) => {
    if (active && completed && event.animationName === 'promise-cloche-lift') onInteractionComplete?.();
  };
  return <svg className={`promise-artwork${completed ? ' is-completed' : ''}${reducedMotion ? ' is-reduced' : ''}`} viewBox="70 85 360 380" aria-hidden="true" focusable="false" onAnimationEnd={handleAnimationEnd}>
    <defs><linearGradient id="promise-plinth-gold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#99703c"/><stop offset=".25" stopColor="#f8e5b8"/><stop offset=".55" stopColor="#bb9059"/><stop offset=".8" stopColor="#fff3d1"/><stop offset="1" stopColor="#a77942"/></linearGradient></defs>
    <ellipse cx="250" cy="423" rx="119" ry="15" fill="#765b3a" opacity=".14" />
    <ellipse cx="250" cy="404" rx="107" ry="20" fill="url(#promise-plinth-gold)" />
    <ellipse cx="250" cy="399" rx="101" ry="15" fill="#f1e4cc" stroke="#c8ab79" strokeWidth="2" />
    <image href={asset('promise-rose-v2.webp')} x="164" y="312" width="172" height="115" />
    <image className="promise-artwork__ring" href={asset('promise-ring-v2.webp')} x="207" y="238" width="86" height="79" />
    <image className="promise-artwork__cloche" href={asset('promise-cloche-v2.webp')} x="151" y="143" width="198" height="257" />
  </svg>;
}
