import './StorySection.css';

/** The two families are revealed in turn, followed by their invitation together. */
export default function StorySection({ active }: { active: boolean }) {
  return (
    <div className={`luxury-card luxury-card--story story-card${active ? ' story-card--active' : ''}`}>
      <img
        className="card-floral-art"
        src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/floral-corner.jpg`}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <div className="story-card__inner">
        <div className="story-card__heading">
          <p className="luxury-card__eyebrow">Himeshi &amp; Madhawa</p>
          <h2 id="story-title" className="luxury-card__title">Our Story</h2>
          <p className="story-card__blessing">With the love and blessings of our beloved parents</p>
        </div>

        <div className="story-card__families">
          <div className="story-card__family story-card__family--groom">
            <p className="story-card__label">The Groom</p>
            <p className="story-card__name">Madhawa Nimalarathna</p>
            <p className="story-card__relation">Beloved son of</p>
            <p className="story-card__parents">Mr. W. G. Nimalarathna<br />&amp; Mrs. W. Pushpa Kumudini</p>
          </div>
          <span className="story-card__joining">&amp;</span>
          <div className="story-card__family story-card__family--bride">
            <p className="story-card__label">The Bride</p>
            <p className="story-card__name">Himeshi Thenuwara</p>
            <p className="story-card__relation">Beloved daughter of</p>
            <p className="story-card__parents">Mr. Cyril Premanath<br />&amp; Mrs. Ramyalatha Kuruwage</p>
          </div>
        </div>

        <p className="story-card__invitation">Together with our families, we warmly invite you to celebrate our wedding.</p>
      </div>
    </div>
  );
}
