import './ForeverArtwork.css';

/** Two bands meet and settle into one woven composition on the sand. */
export default function ForeverArtwork() {
  const band = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/wedding-band.webp`;
  return <>
    <defs>
      <radialGradient id="forever-ring-shadow">
        <stop stopColor="#77583a" stopOpacity=".29" />
        <stop offset="1" stopColor="#77583a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="250" cy="347" rx="154" ry="24" fill="url(#forever-ring-shadow)" />
    <g className="photo-band photo-band--left">
      <image href={band} x="80" y="195" width="250" height="167" />
    </g>
    <g className="photo-band photo-band--right">
      <g transform="translate(500 0) scale(-1 1)">
        <image href={band} x="80" y="195" width="250" height="167" />
      </g>
    </g>
    <g className="photo-band-sparkle" fill="none" stroke="#fff8e5" strokeLinecap="round">
      <path d="M164 239v9m-4.5-4.5h9" strokeWidth="1.3" />
      <path d="M335 312v6m-3-3h6" strokeWidth="1" opacity=".65" />
    </g>
  </>;
}
