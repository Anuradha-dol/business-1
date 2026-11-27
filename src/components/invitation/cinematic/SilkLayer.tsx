import { useId } from 'react';
import './SilkLayer.css';

/** A separate silk foreground, gently rippled by the coastal breeze. */
export default function SilkLayer({ reducedMotion }: { reducedMotion: boolean }) {
  const filterId = useId().replace(/:/g, '');
  return (
    <svg className="journey-silk" viewBox="0 0 1600 535" aria-hidden="true" focusable="false">
      <defs>
        <filter id={filterId} x="-8%" y="-20%" width="116%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.011" numOctaves="1" seed="7" result="breeze">
            {!reducedMotion && <animate attributeName="baseFrequency" values="0.0025 0.011;0.004 0.008;0.0025 0.011" dur="9s" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="breeze" scale={reducedMotion ? 0 : 12} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <image href={`${import.meta.env.BASE_URL}assets/images/cinematic/journey/silk.webp`} width="1600" height="535" filter={`url(#${filterId})`} />
    </svg>
  );
}
