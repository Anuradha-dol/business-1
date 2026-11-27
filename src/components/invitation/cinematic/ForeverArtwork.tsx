import './ForeverArtwork.css';

/** A pair of individually moving photographic wedding bands. */
export default function ForeverArtwork() {
  const band = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/wedding-band.webp`;
  return <>
    <ellipse cx="250" cy="361" rx="135" ry="17" fill="#8f6c43" opacity=".13" />
    <g className="photo-band photo-band--left">
      <image href={band} x="75" y="195" width="250" height="167" />
    </g>
    <g className="photo-band photo-band--right">
      <g transform="translate(500 0) scale(-1 1)">
        <image href={band} x="75" y="195" width="250" height="167" />
      </g>
    </g>
    <g className="photo-band-sparkle" fill="none" stroke="#fff8dd" strokeWidth="2" strokeLinecap="round">
      <path d="M148 191v18m-9-9h18" />
      <path d="M356 278v12m-6-6h12" opacity=".8" />
    </g>
  </>;
}
