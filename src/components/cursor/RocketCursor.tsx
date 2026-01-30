import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function RocketCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const trailIdRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef(Date.now());
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTimeRef.current = Date.now();

      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: trailIdRef.current++,
      };

      setTrailPoints((prev) => {
        const updated = [...prev, newPoint];
        return updated.slice(-12);
      });
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.2 });
      }
    };

    const animate = () => {
      const current = positionRef.current;
      const target = targetRef.current;

      current.x = lerp(current.x, target.x, 0.15);
      current.y = lerp(current.y, target.y, 0.15);

      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const targetRotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      rotationRef.current = lerp(rotationRef.current, targetRotation, 0.1);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${current.x}px, ${current.y}px) translate(-50%, -50%) rotate(${rotationRef.current}deg)`;
      }

      const now = Date.now();
      const timeSinceMove = now - lastMoveTimeRef.current;
      if (timeSinceMove > 100 && cursorRef.current) {
        const pulse = 1 + Math.sin(now * 0.005) * 0.05;
        const engine = cursorRef.current.querySelector('.engine-glow') as HTMLElement;
        if (engine) {
          engine.style.transform = `scale(${pulse})`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleElementHover = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 0.8, duration: 0.2, ease: 'power2.out' });
      }
    };

    const handleElementLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleElementHover);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lerp]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail */}
      <div className="fixed inset-0 pointer-events-none z-[9998]" style={{ mixBlendMode: 'screen' }}>
        {trailPoints.map((point, index) => {
          const size = 4 + (index / trailPoints.length) * 4;
          const opacity = index / trailPoints.length;
          return (
            <div
              key={point.id}
              className="absolute rounded-full"
              style={{
                left: point.x,
                top: point.y,
                width: size,
                height: size,
                background: `radial-gradient(circle, rgba(249, 115, 22, ${opacity}) 0%, rgba(249, 115, 22, 0) 70%)`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </div>

      {/* Rocket Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0"
        style={{ willChange: 'transform' }}
      >
        <div className="relative w-8 h-8">
          {/* Engine Glow */}
          <div
            className="engine-glow absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0) 70%)',
              filter: 'blur(4px)',
              transition: 'transform 0.1s ease-out',
            }}
          />

          {/* Rocket SVG */}
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="cursorRocket" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="cursorNose" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>

            {/* Body */}
            <ellipse cx="16" cy="18" rx="6" ry="12" fill="url(#cursorRocket)" />

            {/* Nose */}
            <path d="M10 10 Q16 2 22 10 Z" fill="url(#cursorNose)" />

            {/* Window */}
            <circle cx="16" cy="14" r="3" fill="#06b6d4" stroke="#0891b2" strokeWidth="0.5" />
            <circle cx="16" cy="14" r="2.5" fill="#0ea5e9" opacity="0.6" />
            <circle cx="17" cy="13" r="1" fill="white" opacity="0.8" />

            {/* Fins */}
            <path d="M8 20 L4 16 L8 18 Z" fill="#06b6d4" />
            <path d="M24 20 L28 16 L24 18 Z" fill="#06b6d4" />
          </svg>
        </div>
      </div>
    </>
  );
}
