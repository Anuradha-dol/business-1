import {
  useEffect, useRef, useState, useCallback, type FormEvent, type TouchEvent
} from 'react';
import { CalendarDays, Heart, Mail, MapPin, Music2, Pause, Play, RotateCcw } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './Invitation.css';

type Page = 'home' | 'story' | 'day' | 'venue' | 'rsvp';
type RsvpDraft = { name: string; attendance: string; guests: string; message: string };
type Props = { onReplay?: () => void; music: { playing: boolean; needsGesture: boolean; toggle: () => void } };

/* ── Linked hearts image ─────────────────────────────────────────────────── */
function LinkedHearts({ size = 42, className }: { size?: number; className?: string }) {
  return <img className={className} width={size} height={size}
    src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/linked-hearts.svg`} alt="" aria-hidden="true" />;
}

/* ── Generated SVG Icons ─────────────────────────────────────────────────── */
function IconStory() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-s)" stroke="rgba(185,135,55,.4)" strokeWidth="1"/>
      <defs>
        <radialGradient id="ig-s" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8"/>
          <stop offset="100%" stopColor="#f7e0b0"/>
        </radialGradient>
      </defs>
      {/* Book pages */}
      <path d="M13 14h7a3 3 0 0 1 3 3v13a1 1 0 0 0-1-1h-9V14z" fill="rgba(185,135,55,.18)" stroke="#b88728" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M31 14h-7a3 3 0 0 0-3 3v13a1 1 0 0 1 1-1h9V14z" fill="rgba(185,135,55,.12)" stroke="#b88728" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M22 17v13" stroke="#c89830" strokeWidth="1" strokeDasharray="2 2"/>
      {/* Heart on book */}
      <path d="M19 19.5c0-1.1.9-2 2-2s2 .9 2 2 2 1.1 2 2a2 2 0 0 1-4 0" fill="none" stroke="#c08020" strokeWidth="1.1"/>
      <path d="M22 25.5l-3-2.5c0-1 .9-1.5 1.5-1s1.5.5 1.5 0 .5-1 1.5-1 1.5.5 1.5 1.5z" fill="#c89830" opacity=".7"/>
    </svg>
  );
}

function IconDay() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-d)" stroke="rgba(185,135,55,.4)" strokeWidth="1"/>
      <defs>
        <radialGradient id="ig-d" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8"/>
          <stop offset="100%" stopColor="#f7e0b0"/>
        </radialGradient>
      </defs>
      {/* Calendar */}
      <rect x="12" y="15" width="20" height="17" rx="3" fill="rgba(185,135,55,.12)" stroke="#b88728" strokeWidth="1.3"/>
      <line x1="12" y1="20" x2="32" y2="20" stroke="#b88728" strokeWidth="1.1"/>
      <line x1="17" y1="12" x2="17" y2="17" stroke="#c08020" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="27" y1="12" x2="27" y2="17" stroke="#c08020" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Heart on date */}
      <text x="22" y="28.5" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#c08020">15</text>
      <text x="22" y="30" textAnchor="middle" fontSize="4" fill="#c89830">♡</text>
    </svg>
  );
}

function IconVenue() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-v)" stroke="rgba(185,135,55,.4)" strokeWidth="1"/>
      <defs>
        <radialGradient id="ig-v" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8"/>
          <stop offset="100%" stopColor="#f7e0b0"/>
        </radialGradient>
      </defs>
      {/* Map pin with palm */}
      <path d="M22 10c-4.4 0-8 3.6-8 8 0 5.5 8 16 8 16s8-10.5 8-16c0-4.4-3.6-8-8-8z" fill="rgba(185,135,55,.2)" stroke="#b88728" strokeWidth="1.3"/>
      <circle cx="22" cy="18" r="3" fill="rgba(185,135,55,.5)" stroke="#b88728" strokeWidth="1"/>
      {/* Waves */}
      <path d="M13 31c3-2 6 2 9-1s6-1 9 1" stroke="#c08020" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".6"/>
    </svg>
  );
}

function IconRSVP() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="url(#ig-r)" stroke="rgba(185,135,55,.4)" strokeWidth="1"/>
      <defs>
        <radialGradient id="ig-r" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8e8"/>
          <stop offset="100%" stopColor="#f7e0b0"/>
        </radialGradient>
      </defs>
      {/* Envelope */}
      <rect x="10" y="15" width="24" height="16" rx="2.5" fill="rgba(185,135,55,.15)" stroke="#b88728" strokeWidth="1.3"/>
      <path d="M10 17l12 9 12-9" stroke="#b88728" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      {/* Wax seal heart */}
      <circle cx="22" cy="23" r="3.5" fill="rgba(185,135,55,.4)" stroke="#c08020" strokeWidth="1"/>
      <path d="M20.5 22.5c0-.6.5-1 1-1s1 .4 1 1 .5.4.5 1a1 1 0 0 1-2 0" fill="#c08020" opacity=".7" stroke="none"/>
    </svg>
  );
}

/* ── SVG Floral ornament ─────────────────────────────────────────────────── */
function FloralDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg className={`floral-divider${flip ? ' floral-divider--flip' : ''}`}
      viewBox="0 0 320 28" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {/* Centre heart */}
      <path d="M160 14 C160 10 155 7 151 10 C148 13 151 17 160 22 C169 17 172 13 169 10 C165 7 160 10 160 14Z"
        fill="rgba(185,135,55,.55)"/>
      {/* Left vine */}
      <path d="M158 14 C140 14 120 8 100 12 C80 16 60 10 40 13 C20 16 10 13 2 14"
        stroke="rgba(185,135,55,.45)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Right vine */}
      <path d="M162 14 C180 14 200 8 220 12 C240 16 260 10 280 13 C300 16 310 13 318 14"
        stroke="rgba(185,135,55,.45)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Left leaves */}
      {[70, 110, 140].map((x, i) => (
        <ellipse key={i} cx={x} cy={12 + (i % 2 === 0 ? -3 : 3)} rx="5" ry="2.5"
          fill="rgba(185,135,55,.3)" transform={`rotate(${-20 + i * 15} ${x} 12)`}/>
      ))}
      {/* Right leaves */}
      {[180, 210, 250].map((x, i) => (
        <ellipse key={i} cx={x} cy={12 + (i % 2 === 0 ? 3 : -3)} rx="5" ry="2.5"
          fill="rgba(185,135,55,.3)" transform={`rotate(${20 - i * 15} ${x} 12)`}/>
      ))}
    </svg>
  );
}

/* ── SVG Corner filigree ──────────────────────────────────────────────────── */
function CornerFiligree({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const sx = corner.includes('r') ? -1 : 1;
  const sy = corner.includes('b') ? -1 : 1;
  return (
    <svg className={`corner-filigree corner-filigree--${corner}`}
      viewBox="0 0 60 60" fill="none" aria-hidden="true"
      style={{ transform: `scale(${sx},${sy})` }}>
      <path d="M5 5 C5 30 30 5 55 5" stroke="rgba(185,135,55,.35)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M5 5 C5 30 5 55 5 55" stroke="rgba(185,135,55,.35)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="2" fill="rgba(185,135,55,.4)"/>
      <circle cx="20" cy="6" r="1.2" fill="rgba(185,135,55,.3)"/>
      <circle cx="6" cy="20" r="1.2" fill="rgba(185,135,55,.3)"/>
      <path d="M12 12 C18 12 12 18 18 18" stroke="rgba(185,135,55,.3)" strokeWidth="1" fill="none"/>
    </svg>
  );
}

/* ── SVG wave section divider ────────────────────────────────────────────── */
function WaveDivider() {
  return (
    <svg className="wave-divider" viewBox="0 0 400 18" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,9 C40,0 80,18 120,9 C160,0 200,18 240,9 C280,0 320,18 360,9 C380,4 390,7 400,9"
        stroke="rgba(185,135,55,.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M0,13 C50,4 100,20 150,13 C200,6 250,20 300,13 C350,6 380,16 400,13"
        stroke="rgba(185,135,55,.18)" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Sparkle sticker ─────────────────────────────────────────────────────── */
function Sparkle({ x, y, size = 16, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) {
  return (
    <svg className="sparkle-sticker" style={{ left: x, top: y, width: size, height: size, animationDelay: `${delay}s` }}
      viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke="rgba(185,135,55,.7)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2.5" fill="rgba(185,135,55,.55)"/>
    </svg>
  );
}

/* ── Golden particle canvas ─────────────────────────────────────────────── */
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
    const pts: P[] = []; const MAX = 60;
    const spawn = () => {
      if (pts.length >= MAX) return;
      pts.push({ x: Math.random() * canvas.width, y: canvas.height + 10,
        vx: (Math.random() - .5) * .7, vy: -(Math.random() * 1 + .4),
        size: Math.random() * 3 + 1, alpha: 0, life: 0,
        maxLife: 200 + Math.random() * 160, hue: Math.random() * 20 - 10 });
    };
    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 5 === 0) spawn();
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx + Math.sin(p.life * .04) * .4; p.y += p.vy; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < .15 ? t / .15 : t > .75 ? (1 - t) / .25 : 1;
        if (p.life > p.maxLife) { pts.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.alpha * .8;
        ctx.fillStyle = `hsl(${42 + p.hue},85%,62%)`; ctx.shadowColor = `hsl(${42 + p.hue},100%,72%)`; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className={`cinematic-particles${active ? ' cinematic-particles--active' : ''}`} aria-hidden="true" />;
}

/* ── Petal rain ──────────────────────────────────────────────────────────── */
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
    const petals: P[] = []; const MAX = 32;
    const spawn = () => {
      if (petals.length >= MAX) return;
      const w = 9 + Math.random() * 11;
      petals.push({ x: Math.random() * canvas.width, y: -20,
        vx: (Math.random() - .5) * 1, vy: .7 + Math.random() * .6,
        rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .04,
        w, h: w * .55, alpha: 0, life: 0, maxLife: 300 + Math.random() * 180 });
    };
    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 16 === 0) spawn();
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx + Math.sin(p.life * .025) * .6; p.y += p.vy; p.rot += p.vrot; p.life++;
        const t = p.life / p.maxLife;
        p.alpha = t < .1 ? t / .1 : t > .85 ? (1 - t) / .15 : 1;
        if (p.life > p.maxLife || p.y > canvas.height + 20) { petals.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha * .65;
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

/* ── Sea shimmer ─────────────────────────────────────────────────────────── */
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
        const amp = 5 - layer * 1.5; const freq = .011 + layer * .007; const speed = t * (.9 + layer * .3);
        const yBase = h * (.5 + layer * .15);
        ctx.beginPath(); ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 4) {
          const y = yBase + Math.sin(x * freq + speed) * amp + Math.cos(x * .008 + speed * .6) * amp * .5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = `rgba(170,130,70,${.065 - layer * .015})`; ctx.fill();
      }
      for (let g = 0; g < 10; g++) {
        const gx = (w * (g / 9)) + Math.sin(t * 1.1 + g) * 28;
        const gy = h * .58 + Math.cos(t * .9 + g * 1.5) * 14;
        const sz = 2.5 + Math.sin(t * 2 + g) * 1.5;
        const a2 = Math.max(0, Math.sin(t * 1.8 + g * .7)) * .4;
        ctx.beginPath(); ctx.arc(gx, gy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,120,${a2})`; ctx.fill();
      }
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="cinematic-sea" aria-hidden="true" />;
}

/* ── Palm sway ───────────────────────────────────────────────────────────── */
function PalmSway({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`cinematic-palm cinematic-palm--${side}`} aria-hidden="true">
      <svg viewBox="0 0 110 240" fill="none">
        <path d={side === 'left'
          ? 'M55 240 C52 200 50 160 53 120 C55 95 57 70 51 38'
          : 'M55 240 C58 200 60 160 57 120 C55 95 53 70 59 38'}
          stroke="#8B6914" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55"/>
        {[...Array(7)].map((_, i) => {
          const a = (i / 6) * 190 - 65; const r = (a * Math.PI) / 180;
          const ex = 51 + Math.cos(r) * 48, ey = 38 + Math.sin(r) * 38;
          return <path key={i} d={`M51 38 Q${51 + Math.cos(r) * 24} ${38 + Math.sin(r) * 18} ${ex} ${ey}`}
            stroke="#4a6e10" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".45"/>;
        })}
      </svg>
    </div>
  );
}

/* ── Cloth wave ──────────────────────────────────────────────────────────── */
function ClothWave() {
  return (
    <div className="cinematic-cloth" aria-hidden="true">
      <svg viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9e4c8" stopOpacity=".85"/>
            <stop offset="100%" stopColor="#f0d0a0" stopOpacity=".2"/>
          </linearGradient>
        </defs>
        <path className="cloth-wave-path"
          d="M0,18 C40,6 80,30 120,18 S200,6 240,18 S320,30 360,18 S400,6 400,18 L400,50 L0,50 Z"
          fill="url(#cg)"/>
      </svg>
    </div>
  );
}

/* ── Countdown ───────────────────────────────────────────────────────────── */
function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const get = () => {
    const d = Math.max(0, target - Date.now());
    return { days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) };
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

/* ── Timeline item ───────────────────────────────────────────────────────── */
function TimelineItem({ icon, title, detail, delay }: { icon: string; title: string; detail: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } }, { threshold: .2 });
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

/* ══════════════════════════════════════════════════════════════════════════
   SECTION SCENES
   ══════════════════════════════════════════════════════════════════════════ */
function StoryScene() {
  return (
    <div className="scene-story">
      <PetalRain active={true} />
      <Sparkle x="8%" y="10%" size={14} delay={0} />
      <Sparkle x="88%" y="15%" size={10} delay={.4} />
      <Sparkle x="78%" y="75%" size={12} delay={.8} />
      <div className="scene-story__content">
        <p className="scene-intro">Two hearts, one beautiful journey.</p>
        <FloralDivider />
        <div className="story-timeline">
          <TimelineItem icon="🌊" title="Where It Began" detail="A quiet beach evening that changed everything." delay={0}/>
          <TimelineItem icon="💫" title="The Spark" detail="Laughter, shared silences, and endless stories." delay={110}/>
          <TimelineItem icon="🌸" title="Growing Together" detail="Every season brought us closer than the last." delay={220}/>
          <TimelineItem icon="💍" title="The Promise" detail="A moment we'll carry forever in our hearts." delay={330}/>
          <TimelineItem icon="✨" title="Our Next Chapter" detail="We look forward to sharing this joy with you." delay={440}/>
        </div>
        <FloralDivider flip />
      </div>
    </div>
  );
}

function DayScene() {
  return (
    <div className="scene-day">
      <Sparkle x="5%" y="20%" size={13} delay={.2} />
      <Sparkle x="90%" y="30%" size={10} delay={.6} />
      <div className="day-countdown"><Countdown targetISO={wedding.dateISO} /></div>
      <WaveDivider />
      <div className="scene-day__content">
        <time className="day-date-display" dateTime={wedding.dateISO}>
          <span className="day-date-display__day">{wedding.day}</span>
          <span className="day-date-display__month-year">{wedding.month} {wedding.year}</span>
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

function VenueScene() {
  return (
    <div className="scene-venue">
      <SeaShimmer />
      <Sparkle x="12%" y="12%" size={12} delay={0} />
      <Sparkle x="82%" y="20%" size={9} delay={.5} />
      <div className="scene-venue__content">
        <div className="venue-icon-wrap" aria-hidden="true">
          <MapPin size={36} strokeWidth={1.2} />
          <div className="venue-ping" /><div className="venue-ping venue-ping--2" />
        </div>
        <h3 className="venue-title">Our Celebration Awaits</h3>
        <FloralDivider />
        <p className="venue-desc">A breathtaking beachside setting where the sound of the sea will serenade us.</p>
        <div className="venue-tags">
          <span>🏖️ Beachside</span><span>🌴 Tropical</span><span>🌅 Sunset Views</span>
        </div>
        <p className="venue-note">Exact venue details will be shared once confirmed.</p>
      </div>
    </div>
  );
}

function RSVPScene() {
  const [draft, setDraft] = useState<RsvpDraft>(() => {
    try { return { ...emptyDraft, ...JSON.parse(localStorage.getItem(draftKey) || '{}') }; } catch { return emptyDraft; }
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [confirmed, setConfirmed] = useState(false);
  const change = (f: keyof RsvpDraft, v: string) => { setDraft(c => ({ ...c, [f]: v })); setSaveStatus('idle'); };
  const save = (e: FormEvent) => {
    e.preventDefault();
    try { localStorage.setItem(draftKey, JSON.stringify(draft)); setSaveStatus('saved'); setConfirmed(true); setTimeout(() => setConfirmed(false), 3200); }
    catch { setSaveStatus('error'); }
  };
  return (
    <div className="scene-rsvp">
      <GoldenParticles active={saveStatus === 'saved'} />
      <Sparkle x="6%" y="8%" size={12} delay={.3} />
      <Sparkle x="90%" y="12%" size={9} delay={.7} />
      {confirmed && (
        <div className="rsvp-confirmation" role="status" aria-live="polite">
          <span className="rsvp-confirmation__icon">✦</span>
          <span className="rsvp-confirmation__text">
            {draft.attendance === 'accept' ? "We're overjoyed! See you there! ✨" : 'Your response has been noted. Thank you.'}
          </span>
        </div>
      )}
      <form className="luxury-rsvp" onSubmit={save}>
        <p className="luxury-rsvp__note">Your response is saved on this device only.</p>
        <div className="luxury-rsvp__field">
          <label className="luxury-rsvp__label">Your Name</label>
          <input className="luxury-rsvp__input" required value={draft.name}
            onChange={e => change('name', e.target.value)} autoComplete="name" placeholder="Full name"/>
        </div>
        <div className="luxury-rsvp__field">
          <label className="luxury-rsvp__label">Attendance</label>
          <div className="rsvp-toggle">
            <button type="button"
              className={`rsvp-toggle__btn${draft.attendance === 'accept' ? ' rsvp-toggle__btn--on' : ''}`}
              onClick={() => change('attendance', 'accept')}>
              <Heart size={13} strokeWidth={2}/> Joyfully Accepts
            </button>
            <button type="button"
              className={`rsvp-toggle__btn${draft.attendance === 'decline' ? ' rsvp-toggle__btn--off' : ''}`}
              onClick={() => change('attendance', 'decline')}>
              Regretfully Declines
            </button>
          </div>
        </div>
        <div className="luxury-rsvp__field">
          <label className="luxury-rsvp__label">Number of Guests</label>
          <div className="guest-stepper">
            <button type="button" className="guest-stepper__btn"
              onClick={() => change('guests', String(Math.max(1, Number(draft.guests) - 1)))}>−</button>
            <span className="guest-stepper__val">{draft.guests}</span>
            <button type="button" className="guest-stepper__btn"
              onClick={() => change('guests', String(Math.min(20, Number(draft.guests) + 1)))}>+</button>
          </div>
        </div>
        <div className="luxury-rsvp__field">
          <label className="luxury-rsvp__label">Message <span>(optional)</span></label>
          <textarea className="luxury-rsvp__input" rows={3} value={draft.message}
            onChange={e => change('message', e.target.value)} placeholder="Share a kind word…"/>
        </div>
        <button type="submit" className={`luxury-rsvp__submit${saveStatus === 'saved' ? ' luxury-rsvp__submit--saved' : ''}`}>
          {saveStatus === 'saved' ? '✦ Response Saved' : 'Confirm Response'}
        </button>
        {saveStatus === 'error' && <p className="luxury-rsvp__error" role="alert">Unable to save. Please check browser settings.</p>}
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING PANEL
   ══════════════════════════════════════════════════════════════════════════ */
function FloatingPanel({ page, onClose, onNavigate }: {
  page: Exclude<Page, 'home'>; onClose: () => void; onNavigate: (p: Page) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(t); }, []);
  const close = useCallback(() => { setLeaving(true); setTimeout(onClose, 440); }, [onClose]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [close]);

  return (
    <div className="floating-panel-backdrop" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className={`floating-panel floating-panel--${page}${visible ? ' floating-panel--in' : ''}${leaving ? ' floating-panel--out' : ''}`}
        role="dialog" aria-modal="true" aria-label={pageTitles[page]}>
        {/* Corner filigrees */}
        <CornerFiligree corner="tl"/><CornerFiligree corner="tr"/>
        <CornerFiligree corner="bl"/><CornerFiligree corner="br"/>
        {/* Header */}
        <div className="fp-header">
          <LinkedHearts size={26} className="fp-hearts" />
          <p className="fp-eyebrow">Himeshi &amp; Madhawa</p>
          <h2 className="fp-title">{pageTitles[page]}</h2>
          <div className="fp-ornament" aria-hidden="true">❧ ♡ ❧</div>
          <button className="fp-close" onClick={close} aria-label="Close panel">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="fp-body">
          {page === 'story' && <StoryScene />}
          {page === 'day'   && <DayScene />}
          {page === 'venue' && <VenueScene />}
          {page === 'rsvp'  && <RSVPScene />}
        </div>
        {/* Nav */}
        <nav className="fp-nav" aria-label="Section navigation">
          {pageList.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`fp-nav__btn${page === id ? ' fp-nav__btn--active' : ''}`}
              onClick={() => onNavigate(id)}>
              <Icon size={15} strokeWidth={1.5}/><span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HORIZONTAL SCENE CAROUSEL
   ══════════════════════════════════════════════════════════════════════════ */
const CARDS = [
  { id: 'story' as const, label: 'Our Story',  Icon: IconStory,  bg: '#fff8ed', accent: '#d4a845', emoji: '📖' },
  { id: 'day'   as const, label: 'The Day',    Icon: IconDay,    bg: '#fff5e8', accent: '#c09030', emoji: '📅' },
  { id: 'venue' as const, label: 'Venue',      Icon: IconVenue,  bg: '#fff3e5', accent: '#b88020', emoji: '📍' },
  { id: 'rsvp'  as const, label: 'RSVP',       Icon: IconRSVP,   bg: '#fff1e2', accent: '#a87018', emoji: '✉️' },
];

const CARD_DESCS: Record<string, string> = {
  story: 'Two hearts, one beautiful journey',
  day:   '15 January 2027 · Celebration',
  venue: 'Beachside · Tropical · Sunset',
  rsvp:  'Share your joyful response',
};

function SceneCarousel({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const dragging = useRef(false);

  /* Scroll to card index */
  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current; if (!track) return;
    const card = track.children[idx] as HTMLElement;
    if (!card) return;
    const offset = card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: offset, behavior: 'smooth' });
    setActive(idx);
  }, []);

  /* Sync active dot on scroll */
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

  /* Touch drag for extra momentum feel on desktop */
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startScroll.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = startScroll.current - (e.clientX - startX.current);
  };
  const onMouseUp = () => { dragging.current = false; };

  return (
    <div className="scene-carousel">
      {/* Track */}
      <div ref={trackRef} className="scene-carousel__track"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        {CARDS.map((card, i) => (
          <div key={card.id} className={`scene-card${active === i ? ' scene-card--active' : ''}`}
            style={{ '--card-accent': card.accent, '--card-bg': card.bg } as React.CSSProperties}
            onClick={() => { scrollTo(i); setTimeout(() => onNavigate(card.id), 160); }}>
            {/* Card background glow */}
            <div className="scene-card__glow" aria-hidden="true"/>
            {/* Top filigree */}
            <div className="scene-card__filigree" aria-hidden="true">
              <svg viewBox="0 0 100 12" fill="none">
                <path d="M5 6 C15 2 25 10 35 6 S55 2 65 6 S85 10 95 6"
                  stroke="rgba(185,135,55,.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
                <circle cx="50" cy="6" r="2" fill="rgba(185,135,55,.55)"/>
              </svg>
            </div>
            {/* Icon */}
            <div className="scene-card__icon"><card.Icon /></div>
            {/* Label */}
            <h3 className="scene-card__label">{card.label}</h3>
            {/* Description */}
            <p className="scene-card__desc">{CARD_DESCS[card.id]}</p>
            {/* CTA */}
            <span className="scene-card__cta">
              Explore <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {/* Bottom filigree */}
            <div className="scene-card__filigree scene-card__filigree--bottom" aria-hidden="true">
              <svg viewBox="0 0 100 12" fill="none">
                <path d="M5 6 C15 10 25 2 35 6 S55 10 65 6 S85 2 95 6"
                  stroke="rgba(185,135,55,.4)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="scene-carousel__dots" role="tablist" aria-label="Carousel navigation">
        {CARDS.map((c, i) => (
          <button key={c.id} role="tab" aria-selected={active === i} aria-label={c.label}
            className={`carousel-dot${active === i ? ' carousel-dot--active' : ''}`}
            onClick={() => scrollTo(i)}/>
        ))}
      </div>

      {/* Swipe hint (shown first render only) */}
      <p className="carousel-hint" aria-hidden="true">‹ swipe to explore ›</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════ */
const draftKey = 'wedding-rsvp-draft';
const emptyDraft: RsvpDraft = { name: '', attendance: '', guests: '1', message: '' };
const pageTitles: Record<Exclude<Page, 'home'>, string> = { story: 'Our Story', day: 'The Day', venue: 'Venue', rsvp: 'RSVP' };
const pageList: { id: Exclude<Page, 'home'>; label: string; icon: typeof Heart }[] = [
  { id: 'story', label: 'Story',  icon: Heart },
  { id: 'day',   label: 'The Day', icon: CalendarDays },
  { id: 'venue', label: 'Venue',   icon: MapPin },
  { id: 'rsvp',  label: 'RSVP',   icon: Mail },
];

/* ══════════════════════════════════════════════════════════════════════════
   MAIN INVITATION
   ══════════════════════════════════════════════════════════════════════════ */
export default function Invitation({ onReplay, music }: Props) {
  const [page, setPage] = useState<Page>('home');
  const { playing, needsGesture, toggle } = music;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
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

      {/* Ambient always-on */}
      <PalmSway side="left" />
      <PalmSway side="right" />
      <ClothWave />

      {/* Global sparkles */}
      <Sparkle x="4%"  y="22%" size={11} delay={0} />
      <Sparkle x="94%" y="18%" size={9}  delay={.6} />
      <Sparkle x="8%"  y="68%" size={8}  delay={1.1} />
      <Sparkle x="92%" y="72%" size={10} delay={.3} />

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
              {item.id === 'story' ? 'Our Story' : item.label}
            </button>
          ))}
        </nav>
        <button className="wedding-home__music" onClick={toggle} aria-pressed={playing}
          aria-label={playing ? 'Pause music' : 'Play music'}>
          <Music2 size={18}/>{playing ? <Pause size={15}/> : <Play size={15}/>}
          <span>{playing ? 'Pause' : 'Music'}</span>
        </button>
        {needsGesture && <span className="wedding-home__music-error" role="status">Tap Music to play the song.</span>}
      </header>

      {/* Body */}
      <div className="wedding-home__body">
        {page === 'home' ? (
          <section className="wedding-hero" aria-labelledby="wedding-home-title">
            <GoldenParticles active={true} />

            {/* Shell row */}
            <div className="wedding-hero__shell" aria-hidden="true">
              <span/><LinkedHearts size={40}/><span/>
            </div>

            {/* Eyebrow */}
            <p className="wedding-hero__eyebrow"><span/>The wedding of<span/></p>

            {/* Names */}
            <h1 id="wedding-home-title">
              {wedding.bride} <span>&amp;</span> {wedding.groom}
            </h1>

            {/* Floral divider */}
            <FloralDivider />

            {/* Date */}
            <div className="wedding-hero__date">
              <span aria-hidden="true">❧</span>
              <time dateTime={wedding.dateISO}>
                <strong>{wedding.day}</strong>{wedding.month} {wedding.year}
              </time>
              <span aria-hidden="true">☙</span>
            </div>

            {/* ── CAROUSEL replaces the 2×2 grid ── */}
            <SceneCarousel onNavigate={navigate} />

            {/* Bottom flourish */}
            <WaveDivider />
            <div className="wedding-hero__bottom" aria-hidden="true">❧ ♡ ❧</div>

            {onReplay && (
              <button className="wedding-home__replay" onClick={onReplay}>
                <RotateCcw size={13}/> Replay invitation
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
