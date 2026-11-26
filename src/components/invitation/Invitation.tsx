import {
  useEffect, useRef, useState, useCallback, type FormEvent, type ReactNode
} from 'react';
import {
  CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Heart, Mail, MapPin, Music2, Pause, Play, RotateCcw
} from 'lucide-react';
import { wedding } from '../../data/wedding';
import './Invitation.css';

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

/* ── Watercolor Floral Corner Art ────────────────────────────────────────── */
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

/* ── Custom Gold Line-Art SVG Icons ──────────────────────────────────────── */
function GoldIcon({ children }: { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9d6724" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const StoryWaveIcon = () => (
  <GoldIcon>
    <path d="M2 12c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 5-2.5 5 0" />
    <path d="M2 17c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 5-2.5 5 0" />
    <circle cx="12" cy="6" r="2.2" />
  </GoldIcon>
);

const StorySparkIcon = () => (
  <GoldIcon>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    <circle cx="12" cy="12" r="3" />
  </GoldIcon>
);

const StoryRingsIcon = () => (
  <GoldIcon>
    <circle cx="9.5" cy="13.5" r="5" />
    <circle cx="15" cy="13.5" r="5" />
    <path d="M12 5l1.5 2h-3L12 5z" />
  </GoldIcon>
);

const StoryChapterIcon = () => (
  <GoldIcon>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H12v16H6.5A2.5 2.5 0 0 0 4 22V6.5z" />
    <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H12v16h5.5a2.5 2.5 0 0 1 2.5 2V6.5z" />
  </GoldIcon>
);

const DaySunriseIcon = () => (
  <GoldIcon>
    <path d="M12 4v3M4.9 10.9l2.1 2.1M19.1 10.9l-2.1 2.1" />
    <path d="M7 17a5 5 0 0 1 10 0" />
    <path d="M3 17h18M6 20h12" />
  </GoldIcon>
);

const DayToastIcon = () => (
  <GoldIcon>
    <path d="M8 3h8l-1 6a3 3 0 0 1-6 0L8 3z" />
    <path d="M12 12v8M8.5 20h7" />
  </GoldIcon>
);

const DayMoonIcon = () => (
  <GoldIcon>
    <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />
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

/* ── Carousel Gold Badges ────────────────────────────────────────────────── */
function IconStory() {
  return (
    <svg width="42" height="42" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-s)" stroke="rgba(185,135,55,.45)" strokeWidth="1" />
      <defs>
        <radialGradient id="ig-s" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="100%" stopColor="#f7e0b0" />
        </radialGradient>
      </defs>
      <path d="M13 14h7a3 3 0 0 1 3 3v13a1 1 0 0 0-1-1h-9V14z" fill="rgba(185,135,55,.16)" stroke="#b88728" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M31 14h-7a3 3 0 0 0-3 3v13a1 1 0 0 1 1-1h9V14z" fill="rgba(185,135,55,.1)" stroke="#b88728" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M22 17v13" stroke="#c89830" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function IconDay() {
  return (
    <svg width="42" height="42" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-d)" stroke="rgba(185,135,55,.45)" strokeWidth="1" />
      <defs>
        <radialGradient id="ig-d" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="100%" stopColor="#f7e0b0" />
        </radialGradient>
      </defs>
      <rect x="12" y="15" width="20" height="17" rx="3" fill="rgba(185,135,55,.12)" stroke="#b88728" strokeWidth="1.3" />
      <line x1="12" y1="20" x2="32" y2="20" stroke="#b88728" strokeWidth="1.1" />
      <line x1="17" y1="12" x2="17" y2="17" stroke="#c08020" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="12" x2="27" y2="17" stroke="#c08020" strokeWidth="1.5" strokeLinecap="round" />
      <text x="22" y="28.5" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8.5" fill="#9d6724">15</text>
    </svg>
  );
}

function IconVenue() {
  return (
    <svg width="42" height="42" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-v)" stroke="rgba(185,135,55,.45)" strokeWidth="1" />
      <defs>
        <radialGradient id="ig-v" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="100%" stopColor="#f7e0b0" />
        </radialGradient>
      </defs>
      <path d="M22 10c-4.4 0-8 3.6-8 8 0 5.5 8 15 8 15s8-9.5 8-15c0-4.4-3.6-8-8-8z" fill="rgba(185,135,55,.2)" stroke="#b88728" strokeWidth="1.3" />
      <circle cx="22" cy="18" r="2.8" fill="rgba(185,135,55,.45)" stroke="#b88728" strokeWidth="1" />
      <path d="M13 31c3-2 6 2 9-1s6-1 9 1" stroke="#c08020" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  );
}

function IconRSVP() {
  return (
    <svg width="42" height="42" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-r)" stroke="rgba(185,135,55,.45)" strokeWidth="1" />
      <defs>
        <radialGradient id="ig-r" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="100%" stopColor="#f7e0b0" />
        </radialGradient>
      </defs>
      <rect x="10" y="15" width="24" height="16" rx="2.5" fill="rgba(185,135,55,.15)" stroke="#b88728" strokeWidth="1.3" />
      <path d="M10 17l12 9 12-9" stroke="#b88728" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
      <circle cx="22" cy="23" r="3" fill="rgba(185,135,55,.45)" stroke="#c08020" strokeWidth="1" />
    </svg>
  );
}

/* ── Decorative SVG Ornaments ────────────────────────────────────────────── */
function FloralDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg className={`floral-divider${flip ? ' floral-divider--flip' : ''}`} viewBox="0 0 320 28" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d="M160 14 C160 10 155 7 151 10 C148 13 151 17 160 22 C169 17 172 13 169 10 C165 7 160 10 160 14Z" fill="rgba(185,135,55,.55)" />
      <path d="M158 14 C140 14 120 8 100 12 C80 16 60 10 40 13 C20 16 10 13 2 14" stroke="rgba(185,135,55,.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M162 14 C180 14 200 8 220 12 C240 16 260 10 280 13 C300 16 310 13 318 14" stroke="rgba(185,135,55,.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {[70, 110, 140].map((x, i) => (
        <ellipse key={i} cx={x} cy={12 + (i % 2 === 0 ? -3 : 3)} rx="5" ry="2.5" fill="rgba(185,135,55,.3)" transform={`rotate(${-20 + i * 15} ${x} 12)`} />
      ))}
      {[180, 210, 250].map((x, i) => (
        <ellipse key={i} cx={x} cy={12 + (i % 2 === 0 ? 3 : -3)} rx="5" ry="2.5" fill="rgba(185,135,55,.3)" transform={`rotate(${20 - i * 15} ${x} 12)`} />
      ))}
    </svg>
  );
}

function WaveDivider() {
  return (
    <svg className="wave-divider" viewBox="0 0 400 18" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,9 C40,0 80,18 120,9 C160,0 200,18 240,9 C280,0 320,18 360,9 C380,4 390,7 400,9" stroke="rgba(185,135,55,.3)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M0,13 C50,4 100,20 150,13 C200,6 250,20 300,13 C350,6 380,16 400,13" stroke="rgba(185,135,55,.16)" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Sparkle({ x, y, size = 14, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) {
  return (
    <svg className="sparkle-sticker" style={{ left: x, top: y, width: size, height: size, animationDelay: `${delay}s` }} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke="rgba(185,135,55,.65)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.2" fill="rgba(185,135,55,.55)" />
    </svg>
  );
}

/* ── Canvas Effects ──────────────────────────────────────────────────────── */
function GoldenParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    type P = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; maxLife: number; hue: number };
    const pts: P[] = []; const MAX = 48;
    const spawn = () => {
      if (pts.length >= MAX) return;
      pts.push({
        x: Math.random() * canvas.width, y: canvas.height + 10,
        vx: (Math.random() - .5) * .6, vy: -(Math.random() * .85 + .35),
        size: Math.random() * 2.5 + 1, alpha: 0, life: 0,
        maxLife: 200 + Math.random() * 150, hue: Math.random() * 20 - 10,
      });
    };
    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 6 === 0) spawn();
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx + Math.sin(p.life * .04) * .35; p.y += p.vy; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < .15 ? t / .15 : t > .75 ? (1 - t) / .25 : 1;
        if (p.life > p.maxLife) { pts.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.alpha * .7;
        ctx.fillStyle = `hsl(${42 + p.hue},85%,62%)`;
        ctx.shadowColor = `hsl(${42 + p.hue},100%,72%)`; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className={`cinematic-particles${active ? ' cinematic-particles--active' : ''}`} aria-hidden="true" />;
}

function PetalRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    type P = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; w: number; h: number; alpha: number; life: number; maxLife: number };
    const petals: P[] = []; const MAX = 20;
    const spawn = () => {
      if (petals.length >= MAX) return;
      const w = 8 + Math.random() * 9;
      petals.push({
        x: Math.random() * canvas.width, y: -20,
        vx: (Math.random() - .5) * .85, vy: .55 + Math.random() * .5,
        rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .035,
        w, h: w * .55, alpha: 0, life: 0, maxLife: 300 + Math.random() * 180,
      });
    };
    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 22 === 0) spawn();
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx + Math.sin(p.life * .025) * .5; p.y += p.vy; p.rot += p.vrot; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < .1 ? t / .1 : t > .85 ? (1 - t) / .15 : 1;
        if (p.life > p.maxLife || p.y > canvas.height + 20) { petals.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha * .52;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w);
        g.addColorStop(0, '#fdf0e8'); g.addColorStop(.5, '#f7cfc1'); g.addColorStop(1, 'rgba(220,120,100,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className={`cinematic-petals${active ? ' cinematic-petals--active' : ''}`} aria-hidden="true" />;
}

function SeaShimmer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    let t = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      t += .012; ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { width: w, height: h } = canvas;
      for (let layer = 0; layer < 3; layer++) {
        const amp = 5 - layer * 1.4; const freq = .011 + layer * .007; const speed = t * (.9 + layer * .3);
        const yBase = h * (.48 + layer * .16);
        ctx.beginPath(); ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 4) {
          const y = yBase + Math.sin(x * freq + speed) * amp + Math.cos(x * .008 + speed * .6) * amp * .5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = `rgba(170,130,70,${.06 - layer * .014})`; ctx.fill();
      }
      for (let g = 0; g < 10; g++) {
        const gx = (w * (g / 9)) + Math.sin(t * 1.1 + g) * 24;
        const gy = h * .58 + Math.cos(t * .9 + g * 1.5) * 12;
        const sz = 2.2 + Math.sin(t * 2 + g) * 1.3;
        const a2 = Math.max(0, Math.sin(t * 1.8 + g * .7)) * .38;
        ctx.beginPath(); ctx.arc(gx, gy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,120,${a2})`; ctx.fill();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="cinematic-sea" aria-hidden="true" />;
}

/* ── Ambient Palm & Cloth ────────────────────────────────────────────────── */
function PalmSway({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`cinematic-palm cinematic-palm--${side}`} aria-hidden="true">
      <svg viewBox="0 0 110 240" fill="none">
        <path d={side === 'left' ? 'M55 240 C52 200 50 160 53 120 C55 95 57 70 51 38' : 'M55 240 C58 200 60 160 57 120 C55 95 53 70 59 38'} stroke="#8B6914" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" />
        {[...Array(7)].map((_, i) => {
          const a = (i / 6) * 190 - 65; const r = (a * Math.PI) / 180;
          const ex = 51 + Math.cos(r) * 48, ey = 38 + Math.sin(r) * 38;
          return <path key={i} d={`M51 38 Q${51 + Math.cos(r) * 24} ${38 + Math.sin(r) * 18} ${ex} ${ey}`} stroke="#4a6e10" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".45" />;
        })}
      </svg>
    </div>
  );
}

function ClothWave() {
  return (
    <div className="cinematic-cloth" aria-hidden="true">
      <svg viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9e4c8" stopOpacity=".85" />
            <stop offset="100%" stopColor="#f0d0a0" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <path className="cloth-wave-path" d="M0,18 C40,6 80,30 120,18 S200,6 240,18 S320,30 360,18 S400,6 400,18 L400,50 L0,50 Z" fill="url(#cg)" />
      </svg>
    </div>
  );
}

/* ── Countdown ───────────────────────────────────────────────────────────── */
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

/* ── Staggered Timeline Item ─────────────────────────────────────────────── */
function TimelineItem({ icon, title, detail, delay }: { icon: ReactNode; title: string; detail: string; delay: number }) {
  return (
    <div className="timeline-item timeline-item--visible" style={{ animationDelay: `${delay}ms` }}>
      <div className="timeline-icon">{icon}</div>
      <div className="timeline-content">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

/* ── Horizontal Scene Carousel ───────────────────────────────────────────── */
const CARDS = [
  { id: 'story' as const, label: 'Our Story', Icon: IconStory, bg: '#fff8ed', accent: '#c89228', desc: 'How we met & our journey' },
  { id: 'day'   as const, label: 'The Day',   Icon: IconDay,   bg: '#fff5e8', accent: '#b88220', desc: '15 January 2027 · Galle' },
  { id: 'venue' as const, label: 'Venue',     Icon: IconVenue, bg: '#fff3e5', accent: '#aa741c', desc: 'Jetwing Lighthouse, Galle' },
  { id: 'rsvp'  as const, label: 'RSVP',      Icon: IconRSVP,  bg: '#fff1e2', accent: '#9b6818', desc: 'Confirm your attendance' },
];

function SceneCarousel({ onNavigate }: { onNavigate: (p: SectionId) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const dragging = useRef(false);
  const moved = useRef(false);

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current; if (!track) return;
    const card = track.children[idx] as HTMLElement;
    if (!card) return;
    const offset = card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: offset, behavior: 'smooth' });
    setActive(idx);
  }, []);

  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    const handler = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.offsetWidth / 2;
      let best = 0, bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestDist) { best = i; bestDist = d; }
      });
      setActive(best);
    };
    track.addEventListener('scroll', handler, { passive: true });
    return () => track.removeEventListener('scroll', handler);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true; moved.current = false;
    startX.current = e.clientX;
    startScroll.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    if (Math.abs(e.clientX - startX.current) > 5) moved.current = true;
    trackRef.current.scrollLeft = startScroll.current - (e.clientX - startX.current);
  };
  const onMouseUp = () => { dragging.current = false; };

  return (
    <div className="scene-carousel">
      <div ref={trackRef} className="scene-carousel__track"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        {CARDS.map((card, i) => (
          <button
            type="button"
            key={card.id}
            className={`scene-card${active === i ? ' scene-card--active' : ''}`}
            style={{ '--card-accent': card.accent, '--card-bg': card.bg } as React.CSSProperties}
            onClick={() => {
              if (moved.current) return;
              scrollTo(i);
              onNavigate(card.id);
            }}
          >
            <div className="scene-card__glow" aria-hidden="true" />
            <div className="scene-card__icon"><card.Icon /></div>
            <h3 className="scene-card__label">{card.label}</h3>
            <p className="scene-card__desc">{card.desc}</p>
            <span className="scene-card__cta">
              Open
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>
      <div className="scene-carousel__dots" role="tablist" aria-label="Carousel navigation">
        {CARDS.map((c, i) => (
          <button key={c.id} type="button" role="tab" aria-selected={active === i} aria-label={c.label}
            className={`carousel-dot${active === i ? ' carousel-dot--active' : ''}`}
            onClick={() => scrollTo(i)} />
        ))}
      </div>
    </div>
  );
}

/* ── Constants ───────────────────────────────────────────────────────────── */
const draftKey = 'wedding-rsvp-draft';
const emptyDraft: RsvpDraft = { name: '', attendance: '', guests: '1', message: '' };
const order: SectionId[] = ['home', 'story', 'day', 'venue', 'rsvp'];
const navItems: { id: SectionId; label: string; icon: typeof Heart }[] = [
  { id: 'home',  label: 'Home',      icon: Heart },
  { id: 'story', label: 'Our Story', icon: Heart },
  { id: 'day',   label: 'The Day',   icon: CalendarDays },
  { id: 'venue', label: 'Venue',     icon: MapPin },
  { id: 'rsvp',  label: 'RSVP',      icon: Mail },
];

/* ══════════════════════════════════════════════════════════════════════════
   MAIN 100SVH LUXURY SCENE SWITCHER (App-like experience, zero scroll jump)
   ══════════════════════════════════════════════════════════════════════════ */
export default function Invitation({ onReplay, music }: Props) {
  const [active, setActive] = useState<SectionId>('home');
  const { playing, needsGesture, toggle } = music;

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
      setTimeout(() => setConfirmed(false), 4000);
    } catch { setSaveStatus('error'); }
  };

  const idx = order.indexOf(active);
  const goPrev = () => setActive(order[(idx - 1 + order.length) % order.length]);
  const goNext = () => setActive(order[(idx + 1) % order.length]);

  return (
    <main className="wedding-home">
      <div
        className="wedding-home__background"
        style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/images/cinematic/main-background.png")` }}
        aria-hidden="true"
      />

      <PalmSway side="left" />
      <PalmSway side="right" />
      <ClothWave />
      <Sparkle x="4%"  y="22%" size={11} delay={0} />
      <Sparkle x="93%" y="18%" size={9}  delay={.6} />
      <Sparkle x="7%"  y="68%" size={8}  delay={1.1} />
      <Sparkle x="91%" y="72%" size={10} delay={.3} />

      {/* Header */}
      <header className="wedding-home__header wedding-home__header--scrolled">
        <button className="wedding-home__monogram" onClick={() => setActive('home')} aria-label="Home">
          {wedding.monogram}<span>⌁ ❧ ⌁</span>
        </button>

        <nav className="wedding-home__nav" aria-label="Wedding navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              className={active === item.id ? 'active' : ''}
              onClick={() => setActive(item.id)}
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

      {/* Active Scene Stage — fits 100% inside viewport with smooth transition */}
      <div className="wedding-stage">

        {active === 'home' && (
          <section key="home" className="stage-scene stage-scene--home" aria-labelledby="wedding-home-title">
            <GoldenParticles active={true} />
            <div className="wedding-hero">
              <div className="wedding-hero__shell" aria-hidden="true">
                <span /><LinkedHearts size={38} /><span />
              </div>
              <p className="wedding-hero__eyebrow"><span />The wedding of<span /></p>
              <h1 id="wedding-home-title">
                {wedding.bride} <span>&amp;</span> {wedding.groom}
              </h1>
              <FloralDivider />
              <div className="wedding-hero__date">
                <span aria-hidden="true">❧</span>
                <time dateTime={wedding.dateISO}>
                  <strong>{wedding.day}</strong>{wedding.month} {wedding.year}
                </time>
                <span aria-hidden="true">☙</span>
              </div>

              <SceneCarousel onNavigate={setActive} />

              {onReplay && (
                <button className="wedding-home__replay" onClick={onReplay}>
                  <RotateCcw size={12} /> Replay opening invitation
                </button>
              )}
            </div>
          </section>
        )}

        {active === 'story' && (
          <section key="story" className="stage-scene" aria-labelledby="story-title">
            <div className="luxury-card luxury-card--story">
              <FloralCornerArt />
              <PetalRain active={true} />
              <div className="luxury-card__inner">
                <LinkedHearts size={26} className="luxury-card__hearts" />
                <p className="luxury-card__eyebrow">Himeshi &amp; Madhawa</p>
                <h2 id="story-title" className="luxury-card__title">Our Story</h2>
                <p className="scene-intro">Together with our families, we invite you to celebrate our wedding.</p>
                <FloralDivider />
                <div className="story-timeline">
                  <TimelineItem icon={<StoryWaveIcon />} title="Where We Met" detail="Two paths crossed, and everything felt right." delay={60} />
                  <TimelineItem icon={<StorySparkIcon />} title="Growing Closer" detail="Years of shared laughter, family, and friendship." delay={140} />
                  <TimelineItem icon={<StoryRingsIcon />} title="The Engagement" detail="A quiet promise to walk through life together." delay={220} />
                  <TimelineItem icon={<StoryChapterIcon />} title="15 January 2027" detail="Beginning our next chapter in Galle with everyone we love." delay={300} />
                </div>
              </div>
            </div>
          </section>
        )}

        {active === 'day' && (
          <section key="day" className="stage-scene" aria-labelledby="day-title">
            <div className="luxury-card luxury-card--day">
              <FloralCornerArt />
              <div className="luxury-card__inner">
                <LinkedHearts size={26} className="luxury-card__hearts" />
                <p className="luxury-card__eyebrow">Save the Date</p>
                <h2 id="day-title" className="luxury-card__title">The Day</h2>
                <FloralDivider />
                <div className="day-countdown">
                  <Countdown targetISO={wedding.dateISO} />
                </div>
                <WaveDivider />
                <time className="day-date-display" dateTime={wedding.dateISO}>
                  <span className="day-date-display__day">{wedding.day}</span>
                  <span className="day-date-display__month-year">{wedding.month} {wedding.year}</span>
                </time>
                <div className="day-timeline">
                  <TimelineItem icon={<DaySunriseIcon />} title="Wedding Ceremony" detail="Time to be confirmed" delay={60} />
                  <TimelineItem icon={<DayToastIcon />} title="Cocktail &amp; Reception" detail="Time to be confirmed" delay={150} />
                  <TimelineItem icon={<DayMoonIcon />} title="Dinner &amp; Celebration" detail="Time to be confirmed" delay={240} />
                </div>
                <p className="luxury-card__note">Exact timings and dress code will be shared closer to the wedding.</p>
              </div>
            </div>
          </section>
        )}

        {active === 'venue' && (
          <section key="venue" className="stage-scene" aria-labelledby="venue-title">
            <div className="luxury-card luxury-card--venue">
              <FloralCornerArt />
              <SeaShimmer />
              <div className="luxury-card__inner">
                <LinkedHearts size={26} className="luxury-card__hearts" />
                <p className="luxury-card__eyebrow">Galle, Sri Lanka</p>
                <h2 id="venue-title" className="luxury-card__title">Venue</h2>
                <FloralDivider />

                {/* Clickable Location Pin — opens Google Maps directly */}
                <a
                  className="venue-icon-wrap"
                  href={wedding.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Track Jetwing Lighthouse location on Google Maps"
                  title="Tap to open in Google Maps"
                >
                  <MapPin size={30} strokeWidth={1.4} />
                  <span className="venue-ping" aria-hidden="true" />
                  <span className="venue-ping venue-ping--2" aria-hidden="true" />
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
        )}

        {active === 'rsvp' && (
          <section key="rsvp" className="stage-scene" aria-labelledby="rsvp-title">
            <div className="luxury-card luxury-card--rsvp">
              <FloralCornerArt />
              <GoldenParticles active={saveStatus === 'saved'} />
              <div className="luxury-card__inner">
                <LinkedHearts size={26} className="luxury-card__hearts" />
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
                  <p className="luxury-rsvp__note">Please let us know if you will be able to join us. Saved locally on your device.</p>

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
                        <Heart size={14} strokeWidth={1.8} />
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
                    <textarea
                      id="rsvp-msg"
                      className="luxury-rsvp__input"
                      rows={2}
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
        )}

      </div>

      {/* Subtle App-like Bottom Stepper Bar (for non-home scenes) */}
      {active !== 'home' && (
        <div className="scene-pager">
          <button type="button" className="scene-pager__btn" onClick={goPrev} aria-label="Previous section">
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>
          <span className="scene-pager__dots" aria-hidden="true">
            {order.map(id => (
              <span key={id} className={active === id ? 'active' : ''} />
            ))}
          </span>
          <button type="button" className="scene-pager__btn" onClick={goNext} aria-label="Next section">
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
