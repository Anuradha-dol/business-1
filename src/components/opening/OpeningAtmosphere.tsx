import './OpeningAtmosphere.css';

/** Existing coastal artwork, isolated so it can move independently. */
export default function OpeningAtmosphere() {
  const images = `${import.meta.env.BASE_URL}assets/images/cinematic/`;
  return (
    <div className="opening-atmosphere" aria-hidden="true">
      <div className="opening-atmosphere__palm">
        <img src={`${images}main-background.webp`} alt="" draggable={false} />
      </div>
      <img className="opening-atmosphere__fabric" src={`${images}journey/silk.webp`} alt="" draggable={false} />
    </div>
  );
}

/** A feathered piece of the existing sea, with a tiny independent wash. */
export function OpeningWater() {
  return <img className="opening-water" src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/closed-fixed-optimized.webp`} alt="" aria-hidden="true" draggable={false} />;
}
