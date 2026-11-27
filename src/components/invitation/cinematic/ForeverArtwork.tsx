import './ForeverArtwork.css';

/** Independently moving bands meet above a soft golden reflection. */
export default function ForeverArtwork() {
  const band = `${import.meta.env.BASE_URL}assets/images/cinematic/journey/wedding-band-ivory.webp`;
  return <>
    <defs>
      <radialGradient id="forever-ring-shadow">
        <stop stopColor="#79552d" stopOpacity=".28" />
        <stop offset="1" stopColor="#79552d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="forever-ring-light">
        <stop stopColor="#fff1bd" stopOpacity=".65" />
        <stop offset="1" stopColor="#fff1bd" stopOpacity="0" />
      </radialGradient>
      <clipPath id="forever-top-crossing" clipPathUnits="userSpaceOnUse">
        <rect x="195" y="185" width="60" height="80" />
      </clipPath>
    </defs>
    <ellipse cx="250" cy="365" rx="150" ry="23" fill="url(#forever-ring-shadow)" />
    <circle cx="250" cy="265" r="125" fill="url(#forever-ring-light)" opacity=".45" />
    <g transform="translate(-75 0)">
      <g className="photo-band photo-band--left">
        <g transform="rotate(-10 200 275)"><image href={band} x="75" y="150" width="250" height="250" /></g>
      </g>
      <g className="photo-band photo-band--right">
        <g transform="rotate(10 300 275) translate(500 0) scale(-1 1)"><image href={band} x="75" y="150" width="250" height="250" /></g>
      </g>
      <g className="photo-band photo-band--left">
        <g clipPath="url(#forever-top-crossing)"><g transform="rotate(-10 200 275)"><image href={band} x="75" y="150" width="250" height="250" /></g></g>
      </g>
    </g>
    <g className="photo-band-sparkle" fill="none" stroke="#fff8e5" strokeLinecap="round">
      <path d="M182 203v12m-6-6h12" strokeWidth="1.4" />
      <path d="M319 300v9m-4.5-4.5h9" strokeWidth="1.2" opacity=".8" />
    </g>
  </>;
}
