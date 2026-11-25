import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Robot3D = lazy(() => import('./Robot3D').then((module) => ({ default: module.Robot3D })));

interface SplashProps {
  onDone: () => void;
}

export function Splash({ onDone }: SplashProps) {
  const [pct, setPct] = useState(0);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const waveTimer = window.setTimeout(() => setWaving(true), 650);
    const startedAt = performance.now();
    const id = window.setInterval(() => {
      setPct(Math.min(100, Math.round(((performance.now() - startedAt) / 2600) * 100)));
    }, 45);
    // Exit even when a 3D resource cannot load. The intro is never a blocker.
    const doneTimer = window.setTimeout(onDone, 2900);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(waveTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(56,189,248,0.08), transparent 60%), #F6F9FF',
      }}
      role="region"
      aria-label="Portfolio welcome animation"
    >
      <button type="button" onClick={onDone} className="absolute right-6 top-6 z-10 rounded-lg border border-blue-100 bg-white/90 px-4 py-2 text-xs font-bold text-brand-blue hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue sm:right-10 sm:top-10">
        Skip intro →
      </button>
      {/* Robot */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-56 h-56 sm:w-64 sm:h-64"
      >
        <Suspense fallback={<img src={`${import.meta.env.BASE_URL}brand/robot-front.webp`} alt="Friendly robot greeting visitors" className="h-full w-full object-contain" />}>
          <Robot3D
            clip={waving ? 'Big_Wave_Hello' : 'Idle_15'}
            loop={!waving}
            className="w-full h-full"
            cam={[0, 1.1, 3.6]}
            fov={32}
          />
        </Suspense>
      </motion.div>

      {/* Name/Logo */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col items-center mt-4"
      >
        <p className="text-2xl sm:text-3xl font-extrabold tracking-[0.3em] text-brand-navy">
          YAKH<span className="text-brand-blue">REVAN</span>
        </p>
        <p className="mt-2 text-[10px] tracking-[0.25em] text-brand-slate uppercase font-medium">
          Robotics & Mechatronics Engineer
        </p>
      </motion.div>

      {/* Hi text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: waving ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-3 text-lg font-hand text-brand-blue"
      >
        Hi! 👋
      </motion.p>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 w-56 sm:w-64"
      >
        <div className="h-1 rounded-full bg-blue-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-sky rounded-full transition-all duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-[11px] font-mono text-brand-slate">
            {pct < 100 ? 'Preparing your robotics portfolio…' : 'Welcome!'}
        </p>
      </motion.div>
    </motion.div>
  );
}
