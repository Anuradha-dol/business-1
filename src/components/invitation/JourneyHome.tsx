import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RotateCcw } from 'lucide-react';
import { wedding } from '../../data/wedding';
import './JourneyHome.css';

gsap.registerPlugin(useGSAP);

type ChapterId = 1 | 2 | 3 | 4 | 5;
type Props = {
  onReplayOpening?: () => void;
  onTriggerPetalBurst?: () => void;
};

/* ── Chapter 1: Two butterflies fly to a coastal flower ─────────────── */
function Ch1Scene({ awakened }: { awakened: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current || !awakened) return;
    const tl = gsap.timeline();
    // Wind petals drift
    tl.to('.ch1-petal', { y: 18, x: (i) => (i % 2 === 0 ? 8 : -8), opacity: 0.9, stagger: 0.08, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
    // Butterfly A flies from left
    tl.fromTo('.ch1-bfly-a', { x: -130, y: -40, autoAlpha: 0, rotation: -15 }, { x: 0, y: 0, autoAlpha: 1, rotation: 0, duration: 2.2, ease: 'sine.out' }, 0);
    // Butterfly B flies from right
    tl.fromTo('.ch1-bfly-b', { x: 130, y: -55, autoAlpha: 0, rotation: 15 }, { x: 0, y: 0, autoAlpha: 1, rotation: 0, duration: 2.4, ease: 'sine.out' }, 0.15);
    // Wings flutter after landing
    tl.to('.ch1-bfly-a .ch1-wing-l', { scaleX: 0.3, transformOrigin: 'right center', duration: 0.18, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 2.3);
    tl.to('.ch1-bfly-a .ch1-wing-r', { scaleX: 0.3, transformOrigin: 'left center', duration: 0.18, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.09 }, 2.3);
    tl.to('.ch1-bfly-b .ch1-wing-l', { scaleX: 0.3, transformOrigin: 'right center', duration: 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 2.5);
    tl.to('.ch1-bfly-b .ch1-wing-r', { scaleX: 0.3, transformOrigin: 'left center', duration: 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.1 }, 2.5);
    // Golden glow on flower
    tl.to('.ch1-flower-glow', { opacity: 1, scale: 1.3, duration: 1.2, ease: 'sine.out' }, 1.4);
    return () => { tl.kill(); };
  }, [awakened]);

  return (
    <svg ref={ref} viewBox="0 0 320 320" className="chapter-svg" aria-hidden="true">
      {/* Ocean backdrop */}
      <defs>
        <radialGradient id="c1bg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#f0e8d4" />
          <stop offset="60%" stopColor="#e8d8b8" />
          <stop offset="100%" stopColor="#c8a870" />
        </radialGradient>
        <radialGradient id="c1glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe99a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe99a" stopOpacity="0" />
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Sky & sea */}
      <circle cx="160" cy="160" r="158" fill="url(#c1bg)" />
      <ellipse cx="160" cy="210" rx="130" ry="45" fill="rgba(160,120,60,0.18)" />
      {/* Soft horizon shimmer */}
      <ellipse cx="160" cy="175" rx="100" ry="12" fill="rgba(255,220,140,0.22)" filter="url(#soft)" />

      {/* Floating petals (ambient) */}
      {[60,100,160,200,255].map((x, i) => (
        <ellipse key={i} className="ch1-petal" cx={x} cy={80 + (i * 18 % 60)} rx="5" ry="2.8"
          fill="rgba(255,250,235,0.7)" transform={`rotate(${i * 33} ${x} ${80 + (i * 18 % 60)})`} opacity="0.6" />
      ))}

      {/* Main coastal flower (always visible) */}
      <g transform="translate(160, 190)">
        {/* Stem */}
        <path d="M0,0 C-6,20 -4,50 -2,70" stroke="#6a8c45" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Leaves */}
        <path d="M-4,40 C-20,30 -28,18 -16,8" stroke="#6a8c45" strokeWidth="1.8" fill="rgba(100,140,65,0.4)" strokeLinecap="round"/>
        {/* Petals */}
        {[0,45,90,135,180,225,270,315].map((a, i) => (
          <ellipse key={i} cx={Math.sin(a * Math.PI/180) * 22} cy={-Math.cos(a * Math.PI/180) * 22}
            rx="10" ry="5.5" fill={i % 2 === 0 ? '#fff9f0' : '#f9e8d2'}
            transform={`rotate(${a})`} opacity="0.92"/>
        ))}
        {/* Center */}
        <circle cx="0" cy="0" r="9" fill="#f5c842" />
        <circle cx="0" cy="0" r="5" fill="#e8a820" />
        {/* Glow overlay (animated) */}
        <circle className="ch1-flower-glow" cx="0" cy="0" r="38" fill="url(#c1glow)" opacity="0" />
      </g>

      {/* Butterfly A (starts off-screen left, appears on awaken) */}
      <g className="ch1-bfly-a" transform="translate(108, 148)" style={{ visibility: awakened ? 'visible' : 'hidden' }}>
        <ellipse className="ch1-wing-l" cx="-14" cy="0" rx="20" ry="13" fill="rgba(255,254,245,0.88)" stroke="rgba(190,160,100,0.5)" strokeWidth="1"/>
        <ellipse className="ch1-wing-l" cx="-12" cy="6" rx="13" ry="8" fill="rgba(255,250,230,0.7)" stroke="rgba(190,160,100,0.3)" strokeWidth="0.8"/>
        <ellipse className="ch1-wing-r" cx="14" cy="0" rx="20" ry="13" fill="rgba(255,254,245,0.88)" stroke="rgba(190,160,100,0.5)" strokeWidth="1"/>
        <ellipse className="ch1-wing-r" cx="12" cy="6" rx="13" ry="8" fill="rgba(255,250,230,0.7)" stroke="rgba(190,160,100,0.3)" strokeWidth="0.8"/>
        <ellipse cx="0" cy="2" rx="2.5" ry="7" fill="#b8860b" />
        <line x1="-3" y1="-5" x2="-10" y2="-16" stroke="#8a6520" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="3" y1="-5" x2="10" y2="-16" stroke="#8a6520" strokeWidth="1.2" strokeLinecap="round"/>
      </g>

      {/* Butterfly B (starts off-screen right) */}
      <g className="ch1-bfly-b" transform="translate(215, 142)" style={{ visibility: awakened ? 'visible' : 'hidden' }}>
        <ellipse className="ch1-wing-l" cx="-14" cy="0" rx="18" ry="12" fill="rgba(255,254,245,0.88)" stroke="rgba(190,160,100,0.5)" strokeWidth="1"/>
        <ellipse className="ch1-wing-l" cx="-11" cy="6" rx="11" ry="7" fill="rgba(255,250,230,0.7)" stroke="rgba(190,160,100,0.3)" strokeWidth="0.8"/>
        <ellipse className="ch1-wing-r" cx="14" cy="0" rx="18" ry="12" fill="rgba(255,254,245,0.88)" stroke="rgba(190,160,100,0.5)" strokeWidth="1"/>
        <ellipse className="ch1-wing-r" cx="11" cy="6" rx="11" ry="7" fill="rgba(255,250,230,0.7)" stroke="rgba(190,160,100,0.3)" strokeWidth="0.8"/>
        <ellipse cx="0" cy="2" rx="2.2" ry="6.5" fill="#b8860b" />
        <line x1="-2" y1="-5" x2="-8" y2="-15" stroke="#8a6520" strokeWidth="1" strokeLinecap="round"/>
        <line x1="2" y1="-5" x2="8" y2="-15" stroke="#8a6520" strokeWidth="1" strokeLinecap="round"/>
      </g>

      {/* Title text in scene */}
      <text x="160" y="295" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#8a5c20" letterSpacing="2" opacity="0.75">TWO SOULS, ONE BLOOM</text>
    </svg>
  );
}

/* ── Chapter 2: Twin rosebuds bloom open with petal rain ─────────────── */
function Ch2Scene({ awakened }: { awakened: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current || !awakened) return;
    const tl = gsap.timeline();
    // Rosebuds open (petals unfurl outward)
    tl.to('.ch2-bud-petal', { scaleY: 1, scaleX: 1, transformOrigin: 'center bottom', duration: 1.8, stagger: 0.06, ease: 'back.out(1.4)' }, 0);
    // Petal rain
    tl.fromTo('.ch2-rain-petal', { y: -60, opacity: 0 }, { y: 220, opacity: (i) => 0.4 + (i % 3) * 0.2, stagger: { each: 0.12, from: 'random' }, duration: 2.8, ease: 'sine.in' }, 0.4);
    // Vines grow
    tl.fromTo('.ch2-vine', { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 2.2, stagger: 0.3, ease: 'sine.inOut' }, 0.2);
    // Golden bond glow
    tl.to('.ch2-bond', { opacity: 1, scaleX: 1.3, duration: 1.4, ease: 'sine.out' }, 1.2);
    return () => { tl.kill(); };
  }, [awakened]);

  return (
    <svg ref={ref} viewBox="0 0 320 320" className="chapter-svg" aria-hidden="true">
      <defs>
        <radialGradient id="c2bg" cx="50%" cy="55%" r="65%">
          <stop offset="0%" stopColor="#f5ede0" />
          <stop offset="70%" stopColor="#ead8c0" />
          <stop offset="100%" stopColor="#c9a870" />
        </radialGradient>
        <radialGradient id="c2glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd580" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffd580" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="158" fill="url(#c2bg)" />

      {/* Rain petals */}
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={i} className="ch2-rain-petal"
          cx={30 + (i * 23) % 260} cy={-20 - (i * 11) % 40}
          rx="6" ry="3.5" fill={i % 2 === 0 ? '#fff5f0' : '#ffe8da'}
          transform={`rotate(${i * 25})`} opacity="0" />
      ))}

      {/* Vine decorations */}
      {['M120,260 C110,230 95,210 100,185', 'M200,260 C210,230 225,210 220,185'].map((d, i) => (
        <path key={i} className="ch2-vine" d={d}
          stroke="rgba(90,120,55,0.55)" strokeWidth="1.6" fill="none"
          strokeDasharray="120" strokeDashoffset={awakened ? 0 : 120} strokeLinecap="round"/>
      ))}

      {/* Rosebud A (left) */}
      <g transform="translate(118, 182)">
        <path d="M0,0 C-3,20 -2,45 0,60" stroke="#7a9450" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M-2,35 C-16,28 -22,16 -12,6" stroke="#7a9450" strokeWidth="1.5" fill="rgba(110,145,65,0.4)"/>
        {/* Closed bud petals (scaleY starts 0.15, animates to 1) */}
        {[[-12,-8,'#ffe0e8'],[12,-8,'#ffd8e0'],[0,-16,'#fff0f4'],[-8,-20,'#ffe8ee'],[8,-20,'#ffe8ee']].map(([cx,cy,fill], i) => (
          <ellipse key={i} className="ch2-bud-petal"
            cx={cx as number} cy={cy as number} rx="9" ry="13"
            fill={fill as string} opacity="0.9"
            style={{ transformOrigin: `${cx}px ${(cy as number)+13}px`, transform: `scaleY(${awakened ? 1 : 0.15}) scaleX(${awakened ? 1 : 0.5})` }}/>
        ))}
        <ellipse cx="0" cy="-8" rx="5" ry="5" fill="#f8c0cc" opacity="0.9"/>
      </g>

      {/* Rosebud B (right) */}
      <g transform="translate(202, 178)">
        <path d="M0,0 C3,20 2,45 0,60" stroke="#7a9450" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M2,35 C16,28 22,16 12,6" stroke="#7a9450" strokeWidth="1.5" fill="rgba(110,145,65,0.4)"/>
        {[[-12,-8,'#ffe8ee'],[12,-8,'#ffe0e8'],[0,-16,'#fff0f4'],[-8,-20,'#ffd8e4'],[8,-20,'#ffd8e4']].map(([cx,cy,fill], i) => (
          <ellipse key={i} className="ch2-bud-petal"
            cx={cx as number} cy={cy as number} rx="9" ry="13"
            fill={fill as string} opacity="0.9"
            style={{ transformOrigin: `${cx}px ${(cy as number)+13}px`, transform: `scaleY(${awakened ? 1 : 0.15}) scaleX(${awakened ? 1 : 0.5})` }}/>
        ))}
        <ellipse cx="0" cy="-8" rx="5" ry="5" fill="#f8b8c8" opacity="0.9"/>
      </g>

      {/* Bond glow between buds */}
      <ellipse className="ch2-bond" cx="160" cy="182" rx="55" ry="18"
        fill="url(#c2glow)" opacity={awakened ? 1 : 0} />

      <text x="160" y="295" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#8a5c20" letterSpacing="2" opacity="0.75">LOVE IN FULL BLOOM</text>
    </svg>
  );
}

/* ── Chapter 3: Glass dome lifts → flower blooms → ring rises ─────────── */
function Ch3Scene({ awakened }: { awakened: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current || !awakened) return;
    const tl = gsap.timeline();
    // Dome lifts up
    tl.to('.ch3-dome', { y: -110, opacity: 0, duration: 1.8, ease: 'power2.inOut' }, 0);
    // Flower blooms
    tl.to('.ch3-fl-petal', { scaleY: 1, scaleX: 1, transformOrigin: 'center bottom', duration: 1.4, stagger: 0.05, ease: 'back.out(1.6)' }, 1.0);
    // Ring rises from center
    tl.fromTo('.ch3-ring', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.6, ease: 'back.out(1.3)' }, 1.6);
    // Ring sparkles
    tl.to('.ch3-sparkle', { opacity: 1, scale: 1.4, rotation: 45, duration: 0.5, stagger: 0.12, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 2.2);
    // Ring gentle rotation
    tl.to('.ch3-ring', { rotation: 360, transformOrigin: '50% 50%', duration: 8, repeat: -1, ease: 'none' }, 2.4);
    // Light sweep
    tl.fromTo('.ch3-sweep', { x: -180, opacity: 0 }, { x: 200, opacity: 0.6, duration: 2.0, ease: 'sine.inOut' }, 0.3);
    return () => { tl.kill(); };
  }, [awakened]);

  return (
    <svg ref={ref} viewBox="0 0 320 320" className="chapter-svg" aria-hidden="true">
      <defs>
        <radialGradient id="c3bg" cx="50%" cy="58%" r="68%">
          <stop offset="0%" stopColor="#f2eadb" />
          <stop offset="65%" stopColor="#e6d5bc" />
          <stop offset="100%" stopColor="#c5a060" />
        </radialGradient>
        <linearGradient id="domeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
          <stop offset="50%" stopColor="rgba(240,248,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
        <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="30%" stopColor="#e8b830" />
          <stop offset="60%" stopColor="#fff0a0" />
          <stop offset="100%" stopColor="#c89020" />
        </linearGradient>
        <filter id="glassShadow"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(100,70,20,0.2)"/></filter>
        <filter id="ringGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="domeClip"><ellipse cx="160" cy="210" rx="90" ry="10" /></clipPath>
      </defs>
      <circle cx="160" cy="160" r="158" fill="url(#c3bg)" />

      {/* Light sweep beam */}
      <rect className="ch3-sweep" x="-30" y="0" width="60" height="320" fill="rgba(255,245,215,0.45)" opacity="0" transform="skewX(-18)"/>

      {/* Base plate */}
      <ellipse cx="160" cy="232" rx="88" ry="11" fill="rgba(195,160,100,0.45)" />
      <ellipse cx="160" cy="231" rx="82" ry="8" fill="rgba(215,180,120,0.55)" />

      {/* Flower (always visible, starts closed) */}
      <g transform="translate(160, 210)">
        <path d="M0,0 C-1,8 0,20 0,24" stroke="#7a9050" strokeWidth="2" fill="none"/>
        {/* Petals — start very small, bloom on awaken */}
        {[0,40,80,120,160,200,240,280,320,360].map((a, i) => (
          <ellipse key={i} className="ch3-fl-petal"
            cx={Math.sin(a * Math.PI/180) * 20} cy={-Math.cos(a * Math.PI/180) * 20 - 2}
            rx="8" ry="11" fill={i % 2 === 0 ? '#fff5f8' : '#fce8f0'}
            style={{ transformOrigin: `${Math.sin(a * Math.PI/180) * 20}px ${(-Math.cos(a * Math.PI/180) * 20 - 2) + 11}px`,
              transform: `rotate(${a}deg) scaleY(${awakened ? 1 : 0.1}) scaleX(${awakened ? 1 : 0.4})` }} opacity="0.95"/>
        ))}
        <circle cx="0" cy="-2" r="8" fill="#f8c842" />
        <circle cx="0" cy="-2" r="4.5" fill="#e8a020" />
      </g>

      {/* Diamond ring (rises on awaken) */}
      <g className="ch3-ring" transform="translate(160, 165)" style={{ opacity: 0 }} filter="url(#ringGlow)">
        {/* Band */}
        <ellipse cx="0" cy="12" rx="22" ry="5.5" fill="none" stroke="url(#ringGold)" strokeWidth="5"/>
        <ellipse cx="0" cy="-12" rx="22" ry="5.5" fill="none" stroke="url(#ringGold)" strokeWidth="5"/>
        <rect x="-22" y="-12" width="5" height="24" fill="url(#ringGold)" rx="1"/>
        <rect x="17" y="-12" width="5" height="24" fill="url(#ringGold)" rx="1"/>
        {/* Diamond */}
        <polygon points="0,-38 18,-22 0,-8 -18,-22" fill="rgba(220,240,255,0.95)" stroke="rgba(180,210,255,0.6)" strokeWidth="0.8"/>
        <polygon points="0,-38 18,-22 0,-28" fill="rgba(190,220,255,0.7)"/>
        <polygon points="0,-38 -18,-22 0,-28" fill="rgba(240,248,255,0.9)"/>
        <polygon points="18,-22 0,-8 0,-28" fill="rgba(170,205,245,0.6)"/>
        <polygon points="-18,-22 0,-8 0,-28" fill="rgba(205,230,255,0.8)"/>
        {/* Sparkles */}
        <text className="ch3-sparkle" x="-34" y="-38" fontSize="12" fill="#ffe860" textAnchor="middle" opacity="0">✦</text>
        <text className="ch3-sparkle" x="34" y="-38" fontSize="10" fill="#ffe860" textAnchor="middle" opacity="0">✦</text>
        <text className="ch3-sparkle" x="0" y="-52" fontSize="14" fill="#fff" textAnchor="middle" opacity="0">✦</text>
      </g>

      {/* Glass dome */}
      <g className="ch3-dome" filter="url(#glassShadow)">
        {/* Dome body */}
        <path d="M72,232 C72,140 248,140 248,232" fill="url(#domeGrad)" stroke="rgba(200,220,255,0.6)" strokeWidth="1.5"/>
        {/* Glass reflections */}
        <path d="M88,210 C90,170 105,150 115,145" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M96,220 C98,190 108,172 116,165" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Dome top knob */}
        <ellipse cx="160" cy="140" rx="10" ry="5" fill="rgba(200,220,255,0.7)" />
        <ellipse cx="160" cy="138" rx="6" ry="3" fill="rgba(240,248,255,0.85)" />
      </g>

      <text x="160" y="295" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#8a5c20" letterSpacing="2" opacity="0.75">A TIMELESS VOW</text>
    </svg>
  );
}

/* ── Chapter 4: Music box opens → bride & groom waltz ────────────────── */
function Ch4Scene({ awakened }: { awakened: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current || !awakened) return;
    const tl = gsap.timeline();
    // Box lid opens
    tl.to('.ch4-lid', { rotateX: -110, transformOrigin: 'center bottom', duration: 1.4, ease: 'power2.out' }, 0);
    // Musical notes float up
    tl.fromTo('.ch4-note', { y: 20, autoAlpha: 0 }, { y: -60, autoAlpha: (i) => i % 2 === 0 ? 1 : 0.7, stagger: 0.22, duration: 2.2, ease: 'sine.out', repeat: -1 }, 0.8);
    // Dancers rise
    tl.fromTo('.ch4-dancers', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.6, ease: 'back.out(1.4)' }, 1.0);
    // Waltz sway
    tl.to('.ch4-dancers', { rotation: 8, transformOrigin: 'center bottom', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 2.6);
    // Gown swirl
    tl.to('.ch4-gown', { skewX: 6, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 2.6);
    // Box shimmer
    tl.to('.ch4-shimmer', { opacity: 0.6, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 0.5);
    return () => { tl.kill(); };
  }, [awakened]);

  return (
    <svg ref={ref} viewBox="0 0 320 320" className="chapter-svg" aria-hidden="true">
      <defs>
        <radialGradient id="c4bg" cx="50%" cy="55%" r="68%">
          <stop offset="0%" stopColor="#f0e8d8" />
          <stop offset="65%" stopColor="#e2d0b0" />
          <stop offset="100%" stopColor="#c09050" />
        </radialGradient>
        <linearGradient id="boxWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c8955a" />
          <stop offset="40%" stopColor="#a87040" />
          <stop offset="100%" stopColor="#8a5a28" />
        </linearGradient>
        <linearGradient id="boxLid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a060" />
          <stop offset="100%" stopColor="#b08040" />
        </linearGradient>
        <filter id="boxShadow"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(80,50,15,0.3)"/></filter>
      </defs>
      <circle cx="160" cy="160" r="158" fill="url(#c4bg)" />

      {/* Musical notes */}
      {['♪','♫','♩','♬'].map((note, i) => (
        <text key={i} className="ch4-note"
          x={125 + i * 22} y="160" fontSize={14 + (i % 2) * 4}
          fill={i % 2 === 0 ? '#c8963e' : '#a07028'} opacity="0" textAnchor="middle">{note}</text>
      ))}

      {/* Music box body */}
      <g filter="url(#boxShadow)">
        {/* Box base */}
        <rect x="72" y="210" width="176" height="68" rx="6" fill="url(#boxWood)" />
        {/* Gold inlay border */}
        <rect x="78" y="216" width="164" height="56" rx="4" fill="none" stroke="rgba(215,175,80,0.7)" strokeWidth="2.5"/>
        {/* Wood grain lines */}
        <line x1="80" y1="232" x2="240" y2="232" stroke="rgba(100,60,20,0.2)" strokeWidth="1"/>
        <line x1="80" y1="248" x2="240" y2="248" stroke="rgba(100,60,20,0.15)" strokeWidth="1"/>
        <line x1="80" y1="264" x2="240" y2="264" stroke="rgba(100,60,20,0.2)" strokeWidth="1"/>
        {/* Gold clasp */}
        <rect x="150" y="206" width="20" height="10" rx="3" fill="#d4a840" stroke="#c09020" strokeWidth="1"/>
        <circle cx="160" cy="211" r="2.5" fill="#e8c060"/>
        {/* Inner lining (velvet) */}
        <rect x="80" y="210" width="160" height="12" rx="2" fill="rgba(200,160,180,0.3)"/>
        {/* Shimmer overlay */}
        <rect className="ch4-shimmer" x="80" y="210" width="160" height="68" rx="4"
          fill="rgba(255,230,160,0.0)" opacity="0"/>
      </g>

      {/* Box lid (opens upward via rotateX) */}
      <g className="ch4-lid" style={{ transformOrigin: '160px 210px' }}>
        <rect x="72" y="175" width="176" height="40" rx="6" fill="url(#boxLid)" />
        <rect x="78" y="181" width="164" height="28" rx="3" fill="none" stroke="rgba(215,175,80,0.7)" strokeWidth="2.5"/>
        {/* Lid decoration - floral */}
        <ellipse cx="160" cy="195" rx="22" ry="8" fill="rgba(215,175,80,0.3)" stroke="rgba(215,175,80,0.6)" strokeWidth="1"/>
        <text x="160" y="199" textAnchor="middle" fontSize="13" fill="rgba(190,145,55,0.8)">❧</text>
        {/* Hinge marks */}
        <rect x="78" y="209" width="8" height="6" rx="2" fill="#c09040"/>
        <rect x="234" y="209" width="8" height="6" rx="2" fill="#c09040"/>
      </g>

      {/* Bride & Groom figurines (rise when lid opens) */}
      <g className="ch4-dancers" transform="translate(160, 210)" style={{ opacity: 0 }}>
        {/* Groom */}
        <g transform="translate(-18, -72)">
          {/* Head */}
          <circle cx="0" cy="0" r="9" fill="#f5dfc0" />
          {/* Hair */}
          <ellipse cx="0" cy="-5" rx="9" ry="5" fill="#4a3520" />
          {/* Body / suit (dark) */}
          <path d="M-10,8 L-8,42 L8,42 L10,8 C6,6 2,8 0,8 C-2,8 -6,6 -10,8Z" fill="#2c2c3a" />
          {/* White shirt */}
          <path d="M-4,8 L-3,28 L3,28 L4,8Z" fill="#f5f5f8" />
          {/* Arms holding */}
          <path d="M10,14 L28,22" stroke="#2c2c3a" strokeWidth="5" strokeLinecap="round"/>
          {/* Boutonniere */}
          <circle cx="-5" cy="14" r="2.5" fill="#f9b8c8" />
        </g>
        {/* Bride */}
        <g transform="translate(18, -68)">
          {/* Head */}
          <circle cx="0" cy="0" r="9" fill="#f5e0c8" />
          {/* Hair & veil */}
          <ellipse cx="0" cy="-4" rx="9" ry="5" fill="#8a6030" />
          <path d="M-9,-4 C-14,0 -16,15 -12,25" stroke="rgba(255,250,245,0.7)" strokeWidth="1.5" fill="rgba(255,252,248,0.4)"/>
          {/* Gown top */}
          <path d="M-11,8 C-14,12 -14,22 -12,28 L12,28 C14,22 14,12 11,8 C6,6 -6,6 -11,8Z" fill="#fff8f5" />
          {/* Gown skirt */}
          <path className="ch4-gown" d="M-12,28 C-22,35 -24,55 -18,65 L18,65 C24,55 22,35 12,28Z" fill="rgba(255,248,245,0.95)" />
          {/* Arms extending */}
          <path d="M-11,14 L-28,22" stroke="#f0d8d0" strokeWidth="4" strokeLinecap="round"/>
          {/* Bouquet */}
          <circle cx="-22" cy="24" r="7" fill="#f9b0c0" opacity="0.9"/>
          <circle cx="-24" cy="22" r="4.5" fill="#f8d8e0"/>
          <circle cx="-20" cy="22" r="3.5" fill="#fce8ee"/>
        </g>
      </g>

      <text x="160" y="295" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#8a5c20" letterSpacing="2" opacity="0.75">THE ETERNAL WALTZ</text>
    </svg>
  );
}

/* ── Chapter 5: Two gold rings glide together + name reveal ──────────── */
function Ch5Scene({ awakened }: { awakened: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current || !awakened) return;
    const tl = gsap.timeline();
    // Rings glide to center
    tl.to('.ch5-ring-l', { x: 32, duration: 1.8, ease: 'back.out(1.4)' }, 0);
    tl.to('.ch5-ring-r', { x: -32, duration: 1.8, ease: 'back.out(1.4)' }, 0);
    // Golden burst
    tl.fromTo('.ch5-burst-ray', { scaleY: 0, transformOrigin: 'center bottom', opacity: 0 }, { scaleY: 1, opacity: 0.65, stagger: 0.04, duration: 1.0, ease: 'back.out(2)' }, 1.4);
    // Petal shower
    tl.fromTo('.ch5-petal', { y: -40, opacity: 0 }, { y: 180, opacity: (i) => 0.5 + (i % 3) * 0.18, stagger: 0.1, duration: 2.5, ease: 'sine.in' }, 1.0);
    // Name text rises
    tl.fromTo('.ch5-name', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 1.8);
    // Infinite glow pulse
    tl.to('.ch5-halo', { opacity: 0.85, scale: 1.25, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 1.6);
    return () => { tl.kill(); };
  }, [awakened]);

  return (
    <svg ref={ref} viewBox="0 0 320 320" className="chapter-svg" aria-hidden="true">
      <defs>
        <radialGradient id="c5bg" cx="50%" cy="52%" r="70%">
          <stop offset="0%" stopColor="#f5ecda" />
          <stop offset="60%" stopColor="#e8d5b2" />
          <stop offset="100%" stopColor="#c8a060" />
        </radialGradient>
        <radialGradient id="c5halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe090" stopOpacity="1" />
          <stop offset="60%" stopColor="#ffc840" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffc840" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="c5gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="30%" stopColor="#e8b830" />
          <stop offset="65%" stopColor="#fff0a0" />
          <stop offset="100%" stopColor="#c89020" />
        </linearGradient>
        <filter id="c5glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="160" cy="160" r="158" fill="url(#c5bg)" />

      {/* Burst rays behind rings */}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} className="ch5-burst-ray"
          x="158.5" y="80" width="3" height="60"
          fill="rgba(230,180,50,0.5)" opacity="0"
          transform={`rotate(${i * 22.5} 160 170)`} rx="1.5"/>
      ))}

      {/* Falling petals */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} className="ch5-petal"
          cx={40 + (i * 22) % 240} cy={-15 - (i * 13) % 35}
          rx="5.5" ry="3" fill={i % 2 === 0 ? '#fff4ee' : '#ffe8d8'} opacity="0"/>
      ))}

      {/* Halo glow */}
      <circle className="ch5-halo" cx="160" cy="170" r="72" fill="url(#c5halo)" opacity="0.4" />

      {/* Ring Left — starts offset-left, slides to center */}
      <g className="ch5-ring-l" transform="translate(100, 155)" filter="url(#c5glow)">
        <circle cx="0" cy="0" r="40" fill="none" stroke="url(#c5gold)" strokeWidth="10" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,200,0.4)" strokeWidth="3" strokeDasharray="8 6" />
        {/* Engraving text */}
        <text x="0" y="4" textAnchor="middle" fontSize="7" fill="rgba(140,90,20,0.6)" fontFamily="Georgia,serif">Himeshi</text>
      </g>

      {/* Ring Right — starts offset-right */}
      <g className="ch5-ring-r" transform="translate(220, 155)" filter="url(#c5glow)">
        <circle cx="0" cy="0" r="40" fill="none" stroke="url(#c5gold)" strokeWidth="10" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,200,0.4)" strokeWidth="3" strokeDasharray="8 6" />
        <text x="0" y="4" textAnchor="middle" fontSize="7" fill="rgba(140,90,20,0.6)" fontFamily="Georgia,serif">Madhawa</text>
      </g>

      {/* Name reveal */}
      <g className="ch5-name" style={{ opacity: 0 }}>
        <text x="160" y="258" textAnchor="middle" fontFamily="'Great Vibes', Georgia, cursive" fontSize="20" fill="#8a5212">Himeshi &amp; Madhawa</text>
        <text x="160" y="276" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#9e6b2b" letterSpacing="3">FOREVER BEGINS HERE</text>
      </g>

      <text x="160" y="298" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#8a5c20" letterSpacing="2" opacity={awakened ? 0 : 0.75}>TWO RINGS, ONE PROMISE</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN JOURNEY HOME COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
const CHAPTERS: { id: ChapterId; title: string; caption: string; hint: string }[] = [
  { id: 1, title: 'The First Encounter', caption: 'Two white butterflies drawn to a single coastal bloom.', hint: 'Touch the flower' },
  { id: 2, title: 'When Love Bloomed', caption: 'Two buds unfurling together in a shower of white petals.', hint: 'Touch the rosebuds' },
  { id: 3, title: 'The Promise', caption: 'Beneath crystal glass, a timeless vow emerges in light.', hint: 'Touch to illuminate' },
  { id: 4, title: 'The Union', caption: 'An antique music box opens to a lifelong waltz.', hint: 'Touch the music box' },
  { id: 5, title: 'Forever Begins', caption: 'Two golden rings united in an endless embrace.', hint: 'Touch the rings' },
];

export default function JourneyHome({ onReplayOpening, onTriggerPetalBurst }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<ChapterId>(1);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const busy = useRef(false);

  const { contextSafe } = useGSAP({ scope: stageRef });

  const mergeToChapter = contextSafe((next: ChapterId) => {
    const tl = gsap.timeline({
      onComplete: () => {
        setChapter(next);
        gsap.fromTo(
          '.journey-stage-body',
          { autoAlpha: 0, scale: 0.95, filter: 'blur(8px)' },
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out',
            onComplete: () => { busy.current = false; } }
        );
      },
    });
    tl.to('.journey-stage-body', { autoAlpha: 0, scale: 1.04, filter: 'blur(8px)', duration: 0.9, ease: 'sine.inOut' });
  });

  const interact = contextSafe(() => {
    if (busy.current) return;
    if (chapter === 5 && done[5]) return;
    busy.current = true;

    const finish = (next?: ChapterId) => {
      setDone(prev => ({ ...prev, [chapter]: true }));
      if (next) {
        setTimeout(() => mergeToChapter(next), 800);
      } else {
        busy.current = false;
      }
    };

    if (chapter === 1) {
      // Butterflies will animate via Ch1Scene awakened prop
      setDone(prev => ({ ...prev, 1: true }));
      setTimeout(() => finish(2), 2800);
    } else if (chapter === 2) {
      onTriggerPetalBurst?.();
      setDone(prev => ({ ...prev, 2: true }));
      setTimeout(() => finish(3), 2600);
    } else if (chapter === 3) {
      setDone(prev => ({ ...prev, 3: true }));
      setTimeout(() => finish(4), 2800);
    } else if (chapter === 4) {
      setDone(prev => ({ ...prev, 4: true }));
      setTimeout(() => finish(5), 2800);
    } else if (chapter === 5) {
      onTriggerPetalBurst?.();
      setDone(prev => ({ ...prev, 5: true }));
      busy.current = false;
    }
  });

  const jumpTo = (targetId: ChapterId) => {
    if (busy.current || targetId === chapter) return;
    busy.current = true;
    mergeToChapter(targetId);
  };

  const replayJourney = () => {
    if (busy.current) return;
    busy.current = true;
    setDone({});
    mergeToChapter(1);
  };

  const current = CHAPTERS[chapter - 1];
  const isAwakened = !!done[chapter];

  return (
    <div ref={stageRef} className="journey-stage">
      {/* Ambient silk & ocean layers */}
      <div className="journey-silk-layer" aria-hidden="true" />
      <div className="journey-ocean-glint" aria-hidden="true" />

      {/* Top eyebrow + chapter dots */}
      <header className="journey-header">
        <p className="journey-eyebrow">A Journey to Forever</p>
        <div className="journey-dots" role="tablist" aria-label="Story chapters">
          {CHAPTERS.map(ch => (
            <button
              key={ch.id}
              type="button"
              role="tab"
              aria-selected={chapter === ch.id}
              aria-label={`Chapter ${ch.id}: ${ch.title}`}
              className={`journey-dot${chapter === ch.id ? ' active' : ''}${done[ch.id] ? ' done' : ''}`}
              onClick={() => jumpTo(ch.id)}
            />
          ))}
        </div>
      </header>

      {/* Scene stage — single 100svh chapter view */}
      <div className="journey-stage-body">
        <p className="journey-chapter__num">Chapter 0{current.id}</p>
        <h1 className="journey-chapter__title">{current.title}</h1>

        {/* Interactive SVG scene */}
        <div
          className="journey-object"
          role="button"
          tabIndex={0}
          onClick={interact}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') interact(); }}
          aria-label={`${current.title} — ${current.hint}`}
        >
          <div className="journey-halo" aria-hidden="true" />
          <div className="journey-art-wrap">
            {chapter === 1 && <Ch1Scene awakened={isAwakened} />}
            {chapter === 2 && <Ch2Scene awakened={isAwakened} />}
            {chapter === 3 && <Ch3Scene awakened={isAwakened} />}
            {chapter === 4 && <Ch4Scene awakened={isAwakened} />}
            {chapter === 5 && <Ch5Scene awakened={isAwakened} />}
          </div>
          <span className="journey-touch-hint">{isAwakened ? '✦' : current.hint}</span>
        </div>

        <p className="journey-chapter__caption">{current.caption}</p>

        {chapter === 5 && done[5] && (
          <div className="journey-finale journey-finale--show">
            <h2>{wedding.bride} &amp; {wedding.groom}</h2>
            <p>Forever Begins Here</p>
            <div className="journey-finale-actions">
              <button type="button" className="journey-replay" onClick={replayJourney}>
                <RotateCcw size={12} /> Replay Journey
              </button>
              {onReplayOpening && (
                <button type="button" className="journey-replay" onClick={onReplayOpening}>
                  <RotateCcw size={12} /> Replay Envelope
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
