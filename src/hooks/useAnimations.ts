import { useEffect, useState, useRef, useCallback } from 'react';

// ──────────────────────────────────────────────
// ANIMATION 1: Typewriter Effect
// ──────────────────────────────────────────────
export function useTypewriter(text: string, speed = 50, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

// ──────────────────────────────────────────────
// ANIMATION 6: Counter Count-Up
// ──────────────────────────────────────────────
export function useCountUp(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered) setTriggered(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [triggered, end, duration, start]);

  return { count, ref };
}

// ──────────────────────────────────────────────
// ANIMATION 12: Text Scramble / Decode
// ──────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export function useTextScramble(finalText: string, duration = 1500) {
  const [text, setText] = useState('');
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered) setTriggered(true);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const totalFrames = Math.round(duration / 16);
    let frame = 0;
    const tick = () => {
      const progress = frame / totalFrames;
      const chars = finalText.split('').map((c, i) => {
        if (c === ' ') return ' ';
        if (i < finalText.length * progress) return finalText[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      setText(chars);
      frame++;
      if (frame <= totalFrames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [triggered, finalText, duration]);

  return { text: text || finalText.replace(/./g, ' '), ref };
}

// ──────────────────────────────────────────────
// ANIMATION 2: Magnetic Cursor Follow
// ──────────────────────────────────────────────
export function useMagneticHover(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    setTransform({ x: dx, y: dy });
  }, [strength]);

  const handleLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouse);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouse);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [handleMouse, handleLeave]);

  return { ref, transform };
}

// ──────────────────────────────────────────────
// ANIMATION 16: 3D Tilt Perspective
// ──────────────────────────────────────────────
export function useTiltEffect(maxTilt = 15) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouse = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * maxTilt;
    const rotateY = (x - 0.5) * maxTilt;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
      transition: 'transform 0.1s ease',
    });
  }, [maxTilt]);

  const handleLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 0.5s ease',
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouse);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouse);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [handleMouse, handleLeave]);

  return { ref, style };
}

// ──────────────────────────────────────────────
// ANIMATION 18: Particle Constellation
// ──────────────────────────────────────────────
export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function useParticles(count = 30): Particle[] {
  const [particles] = useState<Particle[]>(() => {
    const colors = ['#38BDF8', '#2563EB', '#F97316', '#818CF8', '#34D399'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      color: colors[i % colors.length],
    }));
  });
  return particles;
}

// ──────────────────────────────────────────────
// Dark Mode Hook
// ──────────────────────────────────────────────
export function useDarkMode() {
  // Always starts on the white/light theme, regardless of OS preference.
  // Only switches to dark if the visitor explicitly toggles it (and remembers that choice).
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}
