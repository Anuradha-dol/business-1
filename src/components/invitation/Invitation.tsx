import {
  useEffect, useRef, useState, type FormEvent, type ReactNode
} from 'react';
import {
  CalendarDays, ExternalLink, Heart, Mail, MapPin, Music2, Pause, Play
} from 'lucide-react';
import { wedding } from '../../data/wedding';
import CinematicJourney from './cinematic/CinematicJourney';
import StorySection from './StorySection';
import { useSectionScrollMotion } from './useSectionScrollMotion';
import './Invitation.css';
import './SectionMotion.css';

type SectionId = 'home' | 'story' | 'day' | 'venue' | 'rsvp';
type RsvpDraft = { name: string; attendance: string; guests: string; message: string };
type Props = { onReplay?: () => void; music: { playing: boolean; needsGesture: boolean; toggle: () => void } };

function LinkedHearts({ size = 42, className }: { size?: number; className?: string }) {
  return (
    <img
      className={className}
      width={size}
      height={size}
      src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`}
      alt=""
      aria-hidden="true"
    />
  );
}

function FloralCornerArt() {
  return (
    <img
      className="card-floral-art"
      src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/floral-corner.jpg`}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

function GoldIcon({ children }: { children: ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9d6724" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const DayCeremonyIcon = () => (
  <GoldIcon>
    <circle cx="9.5" cy="13.5" r="4.5" />
    <circle cx="14.5" cy="13.5" r="4.5" />
    <path d="M12 5l1.5 2h-3L12 5z" />
  </GoldIcon>
);

const DayPoruwaIcon = () => (
  <GoldIcon>
    <path d="M12 4c1.4 1.6 1.4 3.4 0 5-1.4-1.6-1.4-3.4 0-5z" />
    <path d="M7 11h10l-1.5 4h-7L7 11z" />
    <path d="M12 15v5M8.5 20h7" />
  </GoldIcon>
);

const DayToastIcon = () => (
  <GoldIcon>
    <path d="M8 3h8l-1 6a3 3 0 0 1-6 0L8 3z" />
    <path d="M12 12v8M8.5 20h7" />
  </GoldIcon>
);

const DayFarewellIcon = () => (
  <GoldIcon>
    <path d="M18.5 14.5A7 7 0 0 1 9.5 5.5a7 7 0 1 0 9 9z" />
    <path d="M16 5l.6 1.4L18 7l-1.4.6L16 9l-.6-1.4L14 7l1.4-.6L16 5z" />
  </GoldIcon>
);

const VenueBeachIcon = () => (
  <GoldIcon>
    <path d="M2 16c2.5-2 5-2 7.5 0s5 2 7.5 0 5-2 5 0" />
    <path d="M4 20h16" />
    <circle cx="16.5" cy="7.5" r="2.5" />
  </GoldIcon>
);

const VenuePalmIcon = () => (
  <GoldIcon>
    <path d="M12 21c0-6 1-10 3-13" />
    <path d="M15 8c-3-2-6-1-8 1" />
    <path d="M15 8c2-2 5-1 6 1" />
    <path d="M15 8c-2-3-2-5 0-6" />
  </GoldIcon>
);

const VenueSunsetIcon = () => (
  <GoldIcon>
    <path d="M17 15a5 5 0 0 0-10 0" />
    <path d="M3 15h18M5 19h14" />
    <path d="M12 5v3" />
  </GoldIcon>
);

function FloralDivider() {
  return (
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
  );
}

/* ── Global Ambient Canvas Effects (Active Across ALL Tabs) ──────────────── */
function GoldenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    type P = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; maxLife: number; hue: number };
    const pts: P[] = []; const MAX = 42;
    const spawn = () => {
      if (pts.length >= MAX) return;
      pts.push({
        x: Math.random() * canvas.width, y: canvas.height + 10,
        vx: (Math.random() - .5) * .5, vy: -(Math.random() * .75 + .3),
        size: Math.random() * 2.4 + 1, alpha: 0, life: 0,
        maxLife: 240 + Math.random() * 140, hue: Math.random() * 18 - 9,
      });
    };
    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 7 === 0) spawn();
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx + Math.sin(p.life * .035) * .32; p.y += p.vy; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < .15 ? t / .15 : t > .75 ? (1 - t) / .25 : 1;
        if (p.life > p.maxLife) { pts.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.alpha * .7;
        ctx.fillStyle = `hsl(${42 + p.hue},88%,64%)`;
        ctx.shadowColor = `hsl(${42 + p.hue},100%,75%)`; ctx.shadowBlur = 9;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="global-particles" aria-hidden="true" />;
}

function PetalRain({ burstKey }: { burstKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const burstRef = useRef(0);

  useEffect(() => {
    if (burstKey > 0) burstRef.current = 18;
  }, [burstKey]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    type P = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; w: number; h: number; alpha: number; life: number; maxLife: number; blush: boolean };
    const petals: P[] = []; const MAX = 38;
    const spawn = () => {
      if (petals.length >= MAX) return;
      const w = 7 + Math.random() * 8;
      petals.push({
        x: Math.random() * canvas.width, y: -20,
        vx: (Math.random() - .5) * .8, vy: .6 + Math.random() * .55,
        rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .035,
        w, h: w * .56, alpha: 0, life: 0, maxLife: 320 + Math.random() * 180,
        blush: Math.random() > 0.45,
      });
    };
    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (burstRef.current > 0 && frame % 3 === 0) {
        spawn();
        burstRef.current--;
      } else if (frame % 16 === 0) {
        spawn();
      }
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx + Math.sin(p.life * .025) * .55; p.y += p.vy; p.rot += p.vrot; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < .1 ? t / .1 : t > .85 ? (1 - t) / .15 : 1;
        if (p.life > p.maxLife || p.y > canvas.height + 20) { petals.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha * .72;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w);
        if (p.blush) {
          g.addColorStop(0, '#fff7f5'); g.addColorStop(.55, '#f5c7be'); g.addColorStop(1, 'rgba(230,150,140,0)');
        } else {
          g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#f9ebda'); g.addColorStop(1, 'rgba(240,210,175,0)');
        }
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="global-petals" aria-hidden="true" />;
}

function SeaShimmer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const resize = () => {
      requestAnimationFrame(() => {
        if (!canvas) return;
        const w = Math.max(1, Math.min(canvas.clientWidth || 360, 600));
        const h = Math.max(1, Math.min(canvas.clientHeight || 180, 320));
        canvas.width = w;
        canvas.height = h;
        if (visible && reducedMotion.matches) draw();
      });
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    let t = 0;
    const draw = () => {
      t += .012; ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { width: w, height: h } = canvas;
      for (let layer = 0; layer < 3; layer++) {
        const amp = 4 - layer * 1.1; const freq = .012 + layer * .006; const speed = t * (.9 + layer * .3);
        const yBase = h * (.5 + layer * .16);
        ctx.beginPath(); ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 4) {
          const y = yBase + Math.sin(x * freq + speed) * amp + Math.cos(x * .008 + speed * .6) * amp * .5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = `rgba(170,130,70,${.055 - layer * .014})`; ctx.fill();
      }
      if (visible && !document.hidden && !reducedMotion.matches) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        rafRef.current = 0;
      }
    };
    const syncAnimation = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      if (visible && !document.hidden) draw();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', syncAnimation);
    reducedMotion.addEventListener('change', syncAnimation);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncAnimation);
      reducedMotion.removeEventListener('change', syncAnimation);
    };
  }, []);
  return <canvas ref={canvasRef} className="cinematic-sea" aria-hidden="true" />;
}

function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const get = () => {
    const d = Math.max(0, target - Date.now());
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  };
  const [rem, setRem] = useState(get);
  useEffect(() => { const id = setInterval(() => setRem(get()), 1000); return () => clearInterval(id); }, []);
  return (
    <div className="countdown">
      {(['days', 'hours', 'minutes', 'seconds'] as const).map(u => (
        <div key={u} className="countdown__unit">
          <span className="countdown__num">{String(rem[u]).padStart(2, '0')}</span>
          <span className="countdown__label">{u}</span>
        </div>
      ))}
    </div>
  );
}

function TimelineItem({ icon, title, detail, delay }: { icon: ReactNode; title: string; detail: string; delay: number }) {
  return (
    <div className="timeline-item" style={{ animationDelay: `${delay}ms` }}>
      <div className="timeline-icon">{icon}</div>
      <div className="timeline-content">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

const draftKey = 'wedding-rsvp-draft';
const emptyDraft: RsvpDraft = { name: '', attendance: '', guests: '1', message: '' };
const navItems: { id: SectionId; label: string; icon: typeof Heart }[] = [
  { id: 'home',  label: 'Home',      icon: Heart },
  { id: 'story', label: 'Our Story', icon: Heart },
  { id: 'day',   label: 'The Day',   icon: CalendarDays },
  { id: 'venue', label: 'Venue',     icon: MapPin },
  { id: 'rsvp',  label: 'RSVP',      icon: Mail },
];

export default function Invitation({ onReplay, music }: Props) {
  useSectionScrollMotion();
  const [active, setActive] = useState<SectionId>('home');
  const headerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [petalBurstKey, setPetalBurstKey] = useState(0);
  const { playing, needsGesture, toggle } = music;

  useEffect(() => {
    const header = headerRef.current;
    const stage = stageRef.current;
    if (!header || !stage) return;
    const sections = Array.from(stage.querySelectorAll<HTMLElement>('[data-section]'));
    let frame = 0;
    const measureHeader = () => {
      const headerHeight = header.getBoundingClientRect().height;
      stage.style.setProperty('--invitation-header-height', `${headerHeight}px`);
      schedule();
    };
    const update = () => {
      frame = 0;
      const stageRect = stage.getBoundingClientRect();
      const readingLine = stageRect.top + stageRect.height * .38;
      const current = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      if (current) setActive(current.dataset.section as SectionId);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resizeObserver = new ResizeObserver(measureHeader);
    resizeObserver.observe(header);
    stage.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measureHeader, { passive: true });
    measureHeader();
    return () => {
      stage.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measureHeader);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const changeSection = (next: SectionId) => {
    const target = stageRef.current?.querySelector<HTMLElement>(`[data-section="${next}"]`);
    target?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  };

  /* Preload all journey & floral assets immediately so tab/scroll transitions are instant */
  useEffect(() => {
    const base = `${import.meta.env.BASE_URL}assets/images/cinematic/`;
    [
      `${base}ambient/floral-corner.jpg`,
      `${base}journey/beach-plate.webp`,
      `${base}journey/encounter-rose.webp`,
      `${base}journey/butterfly.webp`,
      `${base}journey/calla-left.webp`,
      `${base}journey/calla-right.webp`,
      `${base}journey/union-box-v2.webp`,
      `${base}journey/union-couple-v2.webp`,
      `${base}journey/silk.webp`,
      `${base}journey/promise-cloche-v2.webp`,
      `${base}journey/promise-ring-v2.webp`,
      `${base}journey/promise-rose-v2.webp`,
      `${base}journey/wedding-band.webp`,
    ].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const [draft, setDraft] = useState<RsvpDraft>(() => {
    try { return { ...emptyDraft, ...JSON.parse(localStorage.getItem(draftKey) || '{}') }; } catch { return emptyDraft; }
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [confirmed, setConfirmed] = useState(false);

  const changeDraft = (f: keyof RsvpDraft, v: string) => {
    setDraft(c => ({ ...c, [f]: v }));
    setSaveStatus('idle');
  };

  const saveRsvp = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      setSaveStatus('saved');
      setConfirmed(true);
      setPetalBurstKey(k => k + 1);
      setTimeout(() => setConfirmed(false), 4000);
    } catch { setSaveStatus('error'); }
  };

  return (
    <main className="wedding-home">
      <div
        className="wedding-home__background"
        style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/images/cinematic/journey/beach-plate.webp")` }}
        aria-hidden="true"
      />

      {/* Global Petals & Golden Particles on ALL Tabs */}
      <GoldenParticles />
      <PetalRain burstKey={petalBurstKey} />

      <header ref={headerRef} className="wedding-home__header wedding-home__header--scrolled">
        <button className="wedding-home__monogram" onClick={() => changeSection('home')} aria-label="Home">
          {wedding.monogram}<span>⌁ ❧ ⌁</span>
        </button>

        <nav className="wedding-home__nav" aria-label="Wedding navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              className={active === item.id ? 'active' : ''}
              onClick={() => changeSection(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="wedding-home__music"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          <Music2 size={17} />{playing ? <Pause size={14} /> : <Play size={14} />}
          <span>{playing ? 'Pause' : 'Music'}</span>
        </button>
        {needsGesture && <span className="wedding-home__music-error" role="status">Tap Music to play the song.</span>}
      </header>

      <div className="wedding-stage" ref={stageRef}>

        {/* ── HOME: A JOURNEY TO FOREVER ─────────────────────────────────── */}
        <section data-section="home" className={`stage-scene stage-scene--home${active === 'home' ? ' is-active' : ''}`} aria-label="A Journey to Forever">
          <CinematicJourney onReplayOpening={onReplay} />
        </section>

        {/* ── OUR STORY ──────────────────────────────────────────────────── */}
        <section data-section="story" className={`stage-scene${active === 'story' ? ' is-active' : ''}`} aria-labelledby="story-title">
          <StorySection active={active === 'story'} />
        </section>

        {/* ── THE DAY ────────────────────────────────────────────────────── */}
          <section data-section="day" className={`stage-scene${active === 'day' ? ' is-active' : ''}`} aria-labelledby="day-title">
            <div className="luxury-card luxury-card--day">
              <FloralCornerArt />
              <div className="card-sheen" aria-hidden="true" />
              <div className="luxury-card__inner">
                <LinkedHearts size={24} className="luxury-card__hearts" />
                <p className="luxury-card__eyebrow">Save the Date</p>
                <h2 id="day-title" className="luxury-card__title">The Day</h2>
                <FloralDivider />
                <div className="day-countdown">
                  <Countdown targetISO={wedding.dateISO} />
                </div>
                <time className="day-date-display" dateTime={wedding.dateISO}>
                  <span className="day-date-display__day">{wedding.day}</span>
                  <span className="day-date-display__month-year">{wedding.month} {wedding.year}</span>
                </time>
                <div className="day-timeline">
                  <TimelineItem icon={<DayCeremonyIcon />} title="Wedding Ceremony" detail="4:00 PM" delay={160} />
                  <TimelineItem icon={<DayPoruwaIcon />} title="Poruwa Ceremony" detail="4:14 PM" delay={260} />
                  <TimelineItem icon={<DayToastIcon />} title="Cocktail &amp; Reception" detail="4:55 PM" delay={360} />
                  <TimelineItem icon={<DayFarewellIcon />} title="Couple’s Farewell" detail="10:15 PM" delay={460} />
                </div>
              </div>
            </div>
          </section>

        {/* ── VENUE ──────────────────────────────────────────────────────── */}
          <section data-section="venue" className={`stage-scene${active === 'venue' ? ' is-active' : ''}`} aria-labelledby="venue-title">
            <div className="luxury-card luxury-card--venue">
              <FloralCornerArt />
              <div className="card-sheen" aria-hidden="true" />
              <SeaShimmer />
              <div className="luxury-card__inner">
                <LinkedHearts size={24} className="luxury-card__hearts" />
                <p className="luxury-card__eyebrow">Galle, Sri Lanka</p>
                <h2 id="venue-title" className="luxury-card__title">Venue</h2>
                <FloralDivider />

                <a
                  className="venue-icon-wrap"
                  href={wedding.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Track Jetwing Lighthouse location on Google Maps"
                  title="Tap to open in Google Maps"
                >
                  <MapPin size={26} strokeWidth={1.4} />
                </a>
                <span className="venue-tap-hint">Tap pin to track on Google Maps</span>

                <h3 className="venue-subtitle">{wedding.venue.name}</h3>
                <p className="venue-address">{wedding.venue.address}</p>
                <p className="venue-desc">
                  Located along the southern coast in Galle, overlooking the Indian Ocean.
                </p>

                <div className="venue-highlights">
                  <div className="venue-highlight">
                    <VenueBeachIcon />
                    <span>Indian Ocean</span>
                  </div>
                  <div className="venue-highlight">
                    <VenuePalmIcon />
                    <span>Galle Coast</span>
                  </div>
                  <div className="venue-highlight">
                    <VenueSunsetIcon />
                    <span>15 Jan 2027</span>
                  </div>
                </div>

                <a
                  className="venue-map-btn"
                  href={wedding.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={14} />
                  <span>Track on Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </section>

        {/* ── RSVP ───────────────────────────────────────────────────────── */}
          <section data-section="rsvp" className={`stage-scene${active === 'rsvp' ? ' is-active' : ''}`} aria-labelledby="rsvp-title">
            <div className="luxury-card luxury-card--rsvp">
              <FloralCornerArt />
              <div className="card-sheen" aria-hidden="true" />
              <div className="luxury-card__inner">
                <LinkedHearts size={24} className="luxury-card__hearts" />
                <p className="luxury-card__eyebrow">Kindly Reply</p>
                <h2 id="rsvp-title" className="luxury-card__title">RSVP</h2>
                <FloralDivider />

                {confirmed && (
                  <div className="rsvp-confirmation" role="status" aria-live="polite">
                    <div className="wax-seal" aria-hidden="true">
                      <span>{wedding.monogram}</span>
                    </div>
                    <div className="rsvp-confirmation__body">
                      <strong>Response Saved</strong>
                      <span>
                        {draft.attendance === 'accept'
                          ? 'Thank you — we look forward to celebrating with you in Galle.'
                          : 'Thank you for letting us know.'}
                      </span>
                    </div>
                  </div>
                )}

                <form className="luxury-rsvp" onSubmit={saveRsvp}>
                  <p className="luxury-rsvp__note">Please let us know if you will be able to join us. Saved on this device.</p>

                  <div className="luxury-rsvp__field">
                    <label className="luxury-rsvp__label" htmlFor="rsvp-name">Full Name</label>
                    <input
                      id="rsvp-name"
                      className="luxury-rsvp__input"
                      required
                      value={draft.name}
                      onChange={e => changeDraft('name', e.target.value)}
                      autoComplete="name"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="luxury-rsvp__field">
                    <span className="luxury-rsvp__label">Will you be attending?</span>
                    <div className="rsvp-toggle" role="group" aria-label="Attendance">
                      <button
                        type="button"
                        className={`rsvp-toggle__btn${draft.attendance === 'accept' ? ' rsvp-toggle__btn--on' : ''}`}
                        onClick={() => changeDraft('attendance', 'accept')}
                      >
                        <Heart size={13} strokeWidth={1.8} />
                        <span>Joyfully Accepts</span>
                      </button>
                      <button
                        type="button"
                        className={`rsvp-toggle__btn${draft.attendance === 'decline' ? ' rsvp-toggle__btn--off' : ''}`}
                        onClick={() => changeDraft('attendance', 'decline')}
                      >
                        <span>Unable to Attend</span>
                      </button>
                    </div>
                  </div>

                  <div className="luxury-rsvp__field luxury-rsvp__field--inline">
                    <span className="luxury-rsvp__label">Guests</span>
                    <div className="guest-stepper">
                      <button
                        type="button"
                        className="guest-stepper__btn"
                        aria-label="Decrease guests"
                        onClick={() => changeDraft('guests', String(Math.max(1, Number(draft.guests) - 1)))}
                      >−</button>
                      <span className="guest-stepper__val">{draft.guests}</span>
                      <button
                        type="button"
                        className="guest-stepper__btn"
                        aria-label="Increase guests"
                        onClick={() => changeDraft('guests', String(Math.min(20, Number(draft.guests) + 1)))}
                      >+</button>
                    </div>
                  </div>

                  <div className="luxury-rsvp__field">
                    <label className="luxury-rsvp__label" htmlFor="rsvp-msg">Message <span>(optional)</span></label>
                    <input
                      id="rsvp-msg"
                      className="luxury-rsvp__input"
                      value={draft.message}
                      onChange={e => changeDraft('message', e.target.value)}
                      placeholder="Write a note or dietary preference…"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`luxury-rsvp__submit${saveStatus === 'saved' ? ' luxury-rsvp__submit--saved' : ''}`}
                  >
                    {saveStatus === 'saved' ? '✦ Saved on This Device' : 'Save Response'}
                  </button>
                  {saveStatus === 'error' && (
                    <p className="luxury-rsvp__error" role="alert">Unable to save. Please check browser storage settings.</p>
                  )}
                </form>
              </div>
            </div>
          </section>

      </div>
    </main>
  );
}
