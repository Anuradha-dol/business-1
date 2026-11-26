import { useEffect, useRef, useState, useCallback, type FormEvent } from 'react';
import { CalendarDays, Heart, Mail, MapPin, Music2, Pause, Play, RotateCcw } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './Invitation.css';

type Page = 'home' | 'story' | 'day' | 'venue' | 'rsvp';
type RsvpDraft = { name: string; attendance: string; guests: string; message: string };
type Props = { onReplay?: () => void; music: { playing: boolean; needsGesture: boolean; toggle: () => void } };

function LinkedHearts({ size = 42, className }: { size?: number; className?: string }) {
  return <img className={className} width={size} height={size} src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`} alt="" aria-hidden="true" />;
}

/* ── Golden particle canvas ─────────────────────────────────────────────── */
function GoldenParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; maxLife: number; hue: number };
    const particles: Particle[] = [];
    const MAX = 55;

    const spawn = () => {
      if (particles.length >= MAX) return;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.9 + 0.3),
        size: Math.random() * 3 + 1.2,
        alpha: 0,
        life: 0,
        maxLife: 220 + Math.random() * 140,
        hue: Math.random() * 20 - 10, // ±10° around gold
      });
    };

    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 6 === 0) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.life * 0.04) * 0.3;
        p.y += p.vy;
        p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.alpha * 0.75;
        ctx.fillStyle = `hsl(${42 + p.hue},85%,62%)`;
        ctx.shadowColor = `hsl(${42 + p.hue},100%,72%)`;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };
    draw();

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={`cinematic-particles${active ? ' cinematic-particles--active' : ''}`} aria-hidden="true" />;
}

/* ── Petal rain canvas ───────────────────────────────────────────────────── */
function PetalRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Petal = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; w: number; h: number; alpha: number; life: number; maxLife: number };
    const petals: Petal[] = [];
    const MAX = 28;

    const spawn = () => {
      if (petals.length >= MAX) return;
      const w = 8 + Math.random() * 10;
      petals.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 0.6 + Math.random() * 0.5,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.03,
        w, h: w * 0.55,
        alpha: 0,
        life: 0,
        maxLife: 320 + Math.random() * 160,
      });
    };

    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 18 === 0) spawn();
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx + Math.sin(p.life * 0.03) * 0.5;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
        if (p.life > p.maxLife || p.y > canvas.height + 20) { petals.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha * 0.7;
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w);
        grad.addColorStop(0, '#fdf0e8');
        grad.addColorStop(0.5, '#f7cfc1');
        grad.addColorStop(1, 'rgba(220,120,100,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };
    draw();

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={`cinematic-petals${active ? ' cinematic-petals--active' : ''}`} aria-hidden="true" />;
}

/* ── Sea shimmer canvas ──────────────────────────────────────────────────── */
function SeaShimmer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height;
      const w = canvas.width;
      // Multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        const amp = 4 - layer * 1.2;
        const freq = 0.012 + layer * 0.006;
        const speed = t * (0.8 + layer * 0.3);
        const yBase = h * (0.55 + layer * 0.14);
        ctx.beginPath();
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 4) {
          const y = yBase + Math.sin(x * freq + speed) * amp + Math.cos(x * 0.009 + speed * 0.6) * amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const alpha = 0.07 - layer * 0.018;
        ctx.fillStyle = `rgba(180,140,80,${alpha})`;
        ctx.fill();
      }
      // Shimmer glints
      for (let g = 0; g < 8; g++) {
        const gx = (w * (g / 7)) + Math.sin(t * 1.1 + g) * 25;
        const gy = h * 0.6 + Math.cos(t * 0.9 + g * 1.5) * 12;
        const size = 2 + Math.sin(t * 2 + g) * 1.5;
        const alpha2 = Math.max(0, Math.sin(t * 1.8 + g * 0.7)) * 0.35;
        ctx.beginPath();
        ctx.arc(gx, gy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,130,${alpha2})`;
        ctx.fill();
      }
    };
    draw();

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="cinematic-sea" aria-hidden="true" />;
}

/* ── Palm sway SVG ───────────────────────────────────────────────────────── */
function PalmSway({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`cinematic-palm cinematic-palm--${side}`} aria-hidden="true">
      <svg viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Trunk */}
        <path d={side === 'left'
          ? 'M60 220 C55 180 52 140 56 100 C58 80 60 60 54 30'
          : 'M60 220 C65 180 68 140 64 100 C62 80 60 60 66 30'}
          stroke="#8B6914" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6"/>
        {/* Fronds */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 5) * 180 - 60;
          const rad = (angle * Math.PI) / 180;
          const ex = 54 + Math.cos(rad) * 45;
          const ey = 30 + Math.sin(rad) * 35;
          return (
            <path key={i}
              d={`M54 30 Q${54 + Math.cos(rad) * 22} ${30 + Math.sin(rad) * 15} ${ex} ${ey}`}
              stroke="#5A7A14" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Cloth wave SVG ──────────────────────────────────────────────────────── */
function ClothWave() {
  return (
    <div className="cinematic-cloth" aria-hidden="true">
      <svg viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cloth-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9e4c8" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#f0d0a0" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        <path className="cloth-wave-path" d="M0,20 C30,8 60,32 90,20 S150,8 180,20 S240,32 270,20 S300,8 300,20 L300,60 L0,60 Z" fill="url(#cloth-grad)"/>
      </svg>
    </div>
  );
}

/* ── Animated section timeline ────────────────────────────────────────────── */
function TimelineItem({ icon, title, detail, delay }: { icon: string; title: string; detail: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`timeline-item${vis ? ' timeline-item--visible' : ''}`}>
      <div className="timeline-icon">{icon}</div>
      <div className="timeline-content">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

/* ── Floating panel ──────────────────────────────────────────────────────── */
function FloatingPanel({ page, onClose, onNavigate }: {
  page: Exclude<Page, 'home'>;
  onClose: () => void;
  onNavigate: (p: Page) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onClose(), 450);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  const panelClass = [
    'floating-panel',
    visible ? 'floating-panel--in' : '',
    leaving ? 'floating-panel--out' : '',
    `floating-panel--${page}`,
  ].join(' ');

  return (
    <div className="floating-panel-backdrop" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={ref} className={panelClass} role="dialog" aria-modal="true" aria-label={pageTitles[page]}>
        {/* Panel header */}
        <div className="fp-header">
          <LinkedHearts size={24} className="fp-hearts" />
          <p className="fp-eyebrow">Himeshi &amp; Madhawa</p>
          <h2 className="fp-title">{pageTitles[page]}</h2>
          <div className="fp-ornament" aria-hidden="true">❧ ♡ ❧</div>
          <button className="fp-close" onClick={close} aria-label="Close panel">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Panel body */}
        <div className="fp-body">
          {page === 'story' && <StoryScene />}
          {page === 'day' && <DayScene />}
          {page === 'venue' && <VenueScene />}
          {page === 'rsvp' && <RSVPScene />}
        </div>

        {/* Panel navigation */}
        <nav className="fp-nav" aria-label="Section navigation">
          {pageList.map(({ id, label, icon: Icon }) => (
            <button key={id} className={page === id ? 'fp-nav__btn fp-nav__btn--active' : 'fp-nav__btn'}
              onClick={() => onNavigate(id)}>
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ── Story scene ─────────────────────────────────────────────────────────── */
function StoryScene() {
  return (
    <div className="scene-story">
      <PetalRain active={true} />
      <div className="scene-story__content">
        <p className="scene-intro">Two hearts, one beautiful journey.</p>
        <div className="story-timeline">
          <TimelineItem icon="🌊" title="Where It Began" detail="A quiet beach evening that changed everything." delay={0}/>
          <TimelineItem icon="💫" title="The Spark" detail="Laughter, shared silences, and endless stories." delay={120}/>
          <TimelineItem icon="🌸" title="Growing Together" detail="Every season brought us closer than the last." delay={240}/>
          <TimelineItem icon="💍" title="The Promise" detail="A moment we'll carry forever in our hearts." delay={360}/>
          <TimelineItem icon="✨" title="Our Next Chapter" detail="We look forward to sharing this joy with you." delay={480}/>
        </div>
      </div>
    </div>
  );
}

/* ── Day scene ───────────────────────────────────────────────────────────── */
function DayScene() {
  return (
    <div className="scene-day">
      <div className="day-countdown">
        <Countdown targetISO={wedding.dateISO} />
      </div>
      <div className="scene-day__content">
        <time className="day-date-display" dateTime={wedding.dateISO}>
          <span className="day-date-display__day">{wedding.day}</span>
          <span className="day-date-display__month">{wedding.month}</span>
          <span className="day-date-display__year">{wedding.year}</span>
        </time>
        <div className="day-timeline">
          <TimelineItem icon="🌅" title="Ceremony" detail="Time to be announced" delay={0}/>
          <TimelineItem icon="🥂" title="Cocktail Hour" detail="Time to be announced" delay={150}/>
          <TimelineItem icon="🎶" title="Reception & Dinner" detail="Time to be announced" delay={300}/>
          <TimelineItem icon="🌙" title="Evening Celebration" detail="Time to be announced" delay={450}/>
        </div>
        <p className="day-note">Full schedule will be shared once confirmed.</p>
      </div>
    </div>
  );
}

/* ── Countdown ───────────────────────────────────────────────────────────── */
function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const getRemaining = () => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  };
  const [rem, setRem] = useState(getRemaining);
  useEffect(() => { const id = setInterval(() => setRem(getRemaining()), 1000); return () => clearInterval(id); }, []);
  return (
    <div className="countdown">
      {(['days', 'hours', 'minutes', 'seconds'] as const).map(unit => (
        <div key={unit} className="countdown__unit">
          <span className="countdown__num">{String(rem[unit]).padStart(2, '0')}</span>
          <span className="countdown__label">{unit}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Venue scene ─────────────────────────────────────────────────────────── */
function VenueScene() {
  return (
    <div className="scene-venue">
      <SeaShimmer />
      <div className="scene-venue__content">
        <div className="venue-icon-wrap" aria-hidden="true">
          <MapPin size={40} strokeWidth={1.2} />
          <div className="venue-ping" />
        </div>
        <h3 className="venue-title">Our Celebration Awaits</h3>
        <p className="venue-desc">
          A breathtaking beachside setting where the sound of the sea will serenade us on this special day.
        </p>
        <div className="venue-tags">
          <span>🏖️ Beachside</span>
          <span>🌴 Tropical</span>
          <span>🌅 Sunset Views</span>
        </div>
        <p className="venue-note">Exact venue details will be shared once confirmed.</p>
      </div>
    </div>
  );
}

/* ── RSVP scene ──────────────────────────────────────────────────────────── */
function RSVPScene() {
  const [draft, setDraft] = useState<RsvpDraft>(() => {
    try { return { ...emptyDraft, ...JSON.parse(localStorage.getItem(draftKey) || '{}') }; } catch { return emptyDraft; }
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [confirmed, setConfirmed] = useState(false);

  const changeDraft = (field: keyof RsvpDraft, value: string) => {
    setDraft(c => ({ ...c, [field]: value }));
    setSaveStatus('idle');
  };

  const saveDraft = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      setSaveStatus('saved');
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3200);
    } catch { setSaveStatus('error'); }
  };

  return (
    <div className="scene-rsvp">
      <GoldenParticles active={saveStatus === 'saved'} />
      {confirmed && (
        <div className="rsvp-confirmation" role="status" aria-live="polite">
          <span className="rsvp-confirmation__icon">✦</span>
          <span className="rsvp-confirmation__text">
            {draft.attendance === 'accept' ? 'We\'re overjoyed! See you there! ✨' : 'Your response has been noted. Thank you.'}
          </span>
        </div>
      )}
      <form className="luxury-rsvp" onSubmit={saveDraft}>
        <p className="luxury-rsvp__note">Your response is saved on this device only.</p>
        <div className="luxury-rsvp__field">
          <label className="luxury-rsvp__label">Your Name</label>
          <input className="luxury-rsvp__input" required value={draft.name}
            onChange={e => changeDraft('name', e.target.value)} autoComplete="name" placeholder="Full name"/>
        </div>
        <div className="luxury-rsvp__row">
          <div className="luxury-rsvp__field">
            <label className="luxury-rsvp__label">Attendance</label>
            <div className="rsvp-toggle">
              <button type="button" className={`rsvp-toggle__btn${draft.attendance === 'accept' ? ' rsvp-toggle__btn--on' : ''}`}
                onClick={() => changeDraft('attendance', 'accept')}>
                <Heart size={14} strokeWidth={2}/> Joyfully Accepts
              </button>
              <button type="button" className={`rsvp-toggle__btn${draft.attendance === 'decline' ? ' rsvp-toggle__btn--off' : ''}`}
                onClick={() => changeDraft('attendance', 'decline')}>
                Regretfully Declines
              </button>
            </div>
          </div>
          <div className="luxury-rsvp__field">
            <label className="luxury-rsvp__label">Guests</label>
            <input className="luxury-rsvp__input luxury-rsvp__input--small" type="number" min="1" max="20"
              value={draft.guests} onChange={e => changeDraft('guests', e.target.value)}/>
          </div>
        </div>
        <div className="luxury-rsvp__field">
          <label className="luxury-rsvp__label">Message <span>(optional)</span></label>
          <textarea className="luxury-rsvp__input" rows={3} value={draft.message}
            onChange={e => changeDraft('message', e.target.value)} placeholder="Share a kind word…"/>
        </div>
        <button type="submit" className={`luxury-rsvp__submit${saveStatus === 'saved' ? ' luxury-rsvp__submit--saved' : ''}`}>
          {saveStatus === 'saved' ? '✦ Response Saved' : 'Confirm Response'}
        </button>
        {saveStatus === 'error' && <p className="luxury-rsvp__error" role="alert">Unable to save. Please check browser settings.</p>}
      </form>
    </div>
  );
}

/* ── Constants ────────────────────────────────────────────────────────────── */
const draftKey = 'wedding-rsvp-draft';
const emptyDraft: RsvpDraft = { name: '', attendance: '', guests: '1', message: '' };
const pageTitles: Record<Exclude<Page, 'home'>, string> = { story: 'Our Story', day: 'The Day', venue: 'Venue', rsvp: 'RSVP' };
const pageList: { id: Exclude<Page, 'home'>; label: string; icon: typeof Heart }[] = [
  { id: 'story', label: 'Story', icon: Heart },
  { id: 'day', label: 'The Day', icon: CalendarDays },
  { id: 'venue', label: 'Venue', icon: MapPin },
  { id: 'rsvp', label: 'RSVP', icon: Mail },
];

/* ── Main invitation ─────────────────────────────────────────────────────── */
export default function Invitation({ onReplay, music }: Props) {
  const [page, setPage] = useState<Page>('home');
  const { playing, needsGesture, toggle } = music;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navigate = (p: Page) => setPage(p);
  const closePanel = () => setPage('home');

  return (
    <main className="wedding-home">
      {/* Background */}
      <div className="wedding-home__background"
        style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/images/cinematic/main-background.png")` }}
        aria-hidden="true">
        <div className="wedding-home__side wedding-home__side--left" />
        <div className="wedding-home__side wedding-home__side--right" />
        <div className="wedding-home__glow" />
      </div>

      {/* Ambient always-on effects */}
      <PalmSway side="left" />
      <PalmSway side="right" />
      <ClothWave />

      {/* Header */}
      <header className={`wedding-home__header${scrolled ? ' wedding-home__header--scrolled' : ''}`}>
        <button className="wedding-home__monogram" onClick={() => navigate('home')} aria-label="Home">
          {wedding.monogram}<span>⌁ ❧ ⌁</span>
        </button>
        <nav className="wedding-home__nav" aria-label="Wedding navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}
            aria-current={page === 'home' ? 'page' : undefined}>Home</button>
          {pageList.map(item => (
            <button key={item.id} className={page === item.id ? 'active' : ''}
              onClick={() => navigate(item.id)} aria-current={page === item.id ? 'page' : undefined}>
              {item.label === 'Story' ? 'Our Story' : item.label}
            </button>
          ))}
        </nav>
        <button className="wedding-home__music" onClick={toggle} aria-pressed={playing}
          aria-label={playing ? 'Pause music' : 'Play music'}>
          <Music2 size={19}/>{playing ? <Pause size={16}/> : <Play size={16}/>}
          <span>{playing ? 'Pause' : 'Music'}</span>
        </button>
        {needsGesture && <span className="wedding-home__music-error" role="status">Tap Music to play the song.</span>}
      </header>

      {/* Body */}
      <div className="wedding-home__body">
        {page === 'home' ? (
          <section className="wedding-hero" aria-labelledby="wedding-home-title">
            {/* Ambient particles always on home */}
            <GoldenParticles active={true} />

            <div className="wedding-hero__shell" aria-hidden="true">
              <span/><LinkedHearts size={42}/><span/>
            </div>
            <p className="wedding-hero__eyebrow"><span/>The wedding of<span/></p>
            <h1 id="wedding-home-title">
              {wedding.bride} <span>&amp;</span> {wedding.groom}
            </h1>
            <div className="wedding-hero__flourish" aria-hidden="true">❧ ♡ ❧</div>
            <div className="wedding-hero__date">
              <span aria-hidden="true">❧</span>
              <time dateTime={wedding.dateISO}>
                <strong>{wedding.day}</strong>{wedding.month} {wedding.year}
              </time>
              <span aria-hidden="true">☙</span>
            </div>

            {/* Scene tiles */}
            <div className="wedding-hero__tiles">
              {pageList.map(({ id, label, icon: Icon }, i) => (
                <button key={id} onClick={() => navigate(id)}
                  style={{ animationDelay: `${i * 90}ms` }}
                  className="hero-tile">
                  <div className="hero-tile__icon"><Icon size={32} strokeWidth={1.4}/></div>
                  <span>{label === 'Story' ? 'Our Story' : label}</span>
                  <div className="hero-tile__shimmer" aria-hidden="true"/>
                </button>
              ))}
            </div>

            <div className="wedding-hero__bottom" aria-hidden="true">❧ ♡ ❧</div>
            {onReplay && (
              <button className="wedding-home__replay" onClick={onReplay}>
                <RotateCcw size={14}/> Replay invitation
              </button>
            )}
          </section>
        ) : (
          <FloatingPanel page={page as Exclude<Page, 'home'>} onClose={closePanel} onNavigate={navigate} />
        )}
      </div>
    </main>
  );
}
