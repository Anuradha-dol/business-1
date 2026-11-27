import './BloomArtwork.css';

/** Two independently animated photographic flowers for the second chapter. */
export default function BloomArtwork() {
  return <>
    <g transform="translate(175 455)">
      <g className="photo-calla photo-calla--left">
        <image className="photo-calla-flower" href={`${import.meta.env.BASE_URL}assets/images/cinematic/journey/calla-left.webp`} x="-105" y="-315" width="210" height="315" />
      </g>
    </g>
    <g transform="translate(325 455)">
      <g className="photo-calla photo-calla--right">
        <g transform="scale(-1 1)">
          <image className="photo-calla-flower" href={`${import.meta.env.BASE_URL}assets/images/cinematic/journey/calla-right.webp`} x="-105" y="-315" width="210" height="315" />
        </g>
      </g>
    </g>
  </>;
}
