import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Robot3D } from './Robot3D';

interface SplashProps {
  onDone: () => void;
}

export function Splash({ onDone }: SplashProps) {
  const [pct, setPct] = useState(0);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    // Start the wave animation after a short delay
    const waveTimer = setTimeout(() => setWaving(true), 800);

    // Simulate loading progress
    const id = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + Math.ceil(Math.random() * 5 + 2));
        return next;
      });
    }, 80);

    return () => {
      clearInterval(id);
      clearTimeout(waveTimer);
    };
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
  }, [pct, onDone]);

  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(56,189,248,0.08), transparent 60%), #F6F9FF',
      }}
    >
      {/* Robot */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-56 h-56 sm:w-64 sm:h-64"
      >
        <Robot3D
          clip={waving ? 'Big_Wave_Hello' : 'Idle_15'}
          loop={!waving}
          className="w-full h-full"
          cam={[0, 1.1, 3.6]}
          fov={32}
        />
      </motion.div>

      {/* Name/Logo */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col items-center mt-4"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.3em] text-brand-navy">
          YAKH<span className="text-brand-blue">REVAN</span>
        </h1>
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
          {pct < 100 ? `Loading...` : 'Welcome!'}
        </p>
      </motion.div>
    </motion.div>
  );
}
