import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface RocketLaunchProps {
  onComplete: () => void;
}

export default function RocketLaunch({ onComplete }: RocketLaunchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flamesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Phase 1: Power Up (0-1s)
    tl.to(glowRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      onStart: () => setPhase(1),
    });

    // Phase 2: Ignition (1-2s)
    tl.to(flamesRef.current, {
      opacity: 1,
      scaleY: 1.5,
      duration: 0.3,
      ease: 'power4.out',
      onStart: () => setPhase(2),
    }, '-=0.3');

    tl.to(containerRef.current, {
      x: 'random(-3, 3)',
      y: 'random(-3, 3)',
      duration: 0.1,
      repeat: 10,
      yoyo: true,
      ease: 'none',
    }, '<');

    // Phase 3: Liftoff (2-3.5s)
    tl.to(rocketRef.current, {
      y: '-60%',
      duration: 0.5,
      ease: 'power4.in',
      onStart: () => setPhase(3),
    });

    tl.to(rocketRef.current, {
      y: '-200%',
      duration: 1,
      ease: 'power4.in',
    }, '-=0.2');

    tl.to(flamesRef.current, {
      scaleY: 3,
      opacity: 0.8,
      duration: 0.5,
    }, '<');

    // Speed lines
    tl.to('.speed-line', {
      opacity: 1,
      y: '100vh',
      duration: 0.5,
      stagger: 0.05,
      ease: 'none',
    }, '-=1');

    // Phase 4: Exit & Reveal (3.5-4.5s)
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onStart: () => setPhase(4),
      onComplete: () => {
        onComplete();
      },
    }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${50 + (Math.random() - 0.5) * 20}%`,
    delay: Math.random() * 0.5,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a12 0%, #050508 100%)' }}
    >
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.7,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Speed Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-100px',
              height: '100px',
            }}
          />
        ))}
      </div>

      {/* Rocket Container */}
      <div ref={rocketRef} className="relative z-10">
        {/* Engine Glow */}
        <div
          ref={glowRef}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0) 70%)',
            transform: 'scale(0)',
            filter: 'blur(10px)',
          }}
        />

        {/* Flames */}
        <div
          ref={flamesRef}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-16 h-24 opacity-0"
          style={{
            background: 'linear-gradient(to bottom, #f97316, #ef4444, transparent)',
            filter: 'blur(8px)',
            borderRadius: '50% 50% 50% 50% / 0% 0% 100% 100%',
            transformOrigin: 'top center',
          }}
        />

        {/* Rocket SVG */}
        <div className="relative w-24 h-40">
          <svg viewBox="0 0 100 160" className="w-full h-full drop-shadow-2xl">
            {/* Rocket Body */}
            <defs>
              <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="rocketNose" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>

            {/* Left Fin */}
            <path d="M10 120 L30 100 L30 140 Z" fill="url(#finGradient)" />
            
            {/* Right Fin */}
            <path d="M90 120 L70 100 L70 140 Z" fill="url(#finGradient)" />
            
            {/* Main Body */}
            <ellipse cx="50" cy="90" rx="25" ry="60" fill="url(#rocketBody)" />
            
            {/* Nose Cone */}
            <path d="M25 40 Q50 0 75 40 Z" fill="url(#rocketNose)" />
            
            {/* Window */}
            <circle cx="50" cy="70" r="12" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
            <circle cx="50" cy="70" r="10" fill="#0ea5e9" opacity="0.6" />
            <circle cx="53" cy="67" r="3" fill="white" opacity="0.8" />
            
            {/* Detail Lines */}
            <line x1="50" y1="40" x2="50" y2="150" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
            <ellipse cx="50" cy="130" rx="15" ry="5" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        {/* Particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                bottom: '-20px',
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, ${Math.random() > 0.5 ? '#f97316' : '#ef4444'} 0%, transparent 70%)`,
                opacity: 0,
                animation: `particle-rise 1s ease-out ${p.delay}s forwards`,
              }}
            />
          ))}
        </div>
      </div>

      {/* HUD Elements */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-cyan-400 font-mono text-xs">
        <div className="space-y-1">
          <div className="opacity-50">SYSTEM STATUS</div>
          <div className={phase >= 1 ? 'text-green-400' : ''}>
            {phase >= 1 ? '● ONLINE' : '○ STANDBY'}
          </div>
          <div className={phase >= 2 ? 'text-green-400' : ''}>
            {phase >= 2 ? '● ENGINES READY' : '○ ENGINES'}
          </div>
          <div className={phase >= 3 ? 'text-green-400' : ''}>
            {phase >= 3 ? '● LIFTOFF' : '○ LIFTOFF'}
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="opacity-50">THRUST</div>
          <div className="text-2xl font-bold">
            {phase === 0 && '0%'}
            {phase === 1 && '35%'}
            {phase === 2 && '78%'}
            {phase >= 3 && '100%'}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 text-center">
        <div className="text-white/60 font-mono text-sm tracking-widest">
          {phase === 0 && 'INITIALIZING...'}
          {phase === 1 && 'POWERING UP...'}
          {phase === 2 && 'IGNITION SEQUENCE...'}
          {phase === 3 && 'LIFTOFF!'}
          {phase === 4 && 'ENTERING ORBIT...'}
        </div>
      </div>

      <style>{`
        @keyframes particle-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-200px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
