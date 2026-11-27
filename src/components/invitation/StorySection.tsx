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
      <div className="card-sheen" aria-hidden="true" />
      <div className="story-card__inner">
        <div className="story-card__heading">
          <img
            className="luxury-card__hearts"
            width={24}
            height={24}
            src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`}
            alt=""
            aria-hidden="true"
          />
          <p className="luxury-card__eyebrow">Himeshi &amp; Madhawa</p>
          <h2 id="story-title" className="luxury-card__title">Our Story</h2>
          <svg className="floral-divider" viewBox="0 0 320 24" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <path d="M160 12 C160 8 155 5 151 8 C148 11 151 15 160 20 C169 15 172 11 169 8 C165 5 160 8 160 12Z" fill="rgba(185,135,55,.55)" />
            <path d="M158 12 C140 12 120 7 100 10 C80 14 60 8 40 11 C20 14 10 11 2 12" stroke="rgba(185,135,55,.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M162 12 C180 12 200 7 220 10 C240 14 260 8 280 11 C300 14 310 11 318 12" stroke="rgba(185,135,55,.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            {[70, 110, 140].map((x, i) => (
              <ellipse key={i} cx={x} cy={10 + (i % 2 === 0 ? -2.5 : 2.5)} rx="4.5" ry="2.2" fill="rgba(185,135,55,.3)" transform={`rotate(${-20 + i * 15} ${x} 10)`} />
            ))}
            {[180, 210, 250].map((x, i) => (
              <ellipse key={i} cx={x} cy={10 + (i % 2 === 0 ? 2.5 : -2.5)} rx="4.5" ry="2.2" fill="rgba(185,135,55,.3)" transform={`rotate(${20 - i * 15} ${x} 10)`} />
            ))}
          </svg>
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
