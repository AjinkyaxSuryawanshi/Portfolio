import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const animate = () => {
      // Smooth interpolation
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.1);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.1);

      const { innerWidth, innerHeight } = window;
      
      setPosition({
        x: currentRef.current.x,
        y: currentRef.current.y,
        normalizedX: (currentRef.current.x / innerWidth) * 2 - 1,
        normalizedY: -(currentRef.current.y / innerHeight) * 2 + 1,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lerp]);

  return position;
}

// Hook for smooth interpolated values
export function useSmoothValue(target: number, factor: number = 0.1) {
  const [value, setValue] = useState(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setValue((prev) => prev + (target - prev) * factor);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, factor]);

  return value;
}
