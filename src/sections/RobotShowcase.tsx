import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pose } from '../components/Robot';

const VIEWS: { id: Pose; label: string; src: string }[] = [
  { id: 'front', label: 'Front', src: '/brand/robot-front.png' },
  { id: 'back', label: 'Back', src: '/brand/robot-back.png' },
  { id: 'left', label: 'Left', src: '/brand/robot-left.png' },
  { id: 'right', label: 'Right', src: '/brand/robot-right.png' },
];
const TAGS = ['SYSTEM', 'MECHANICAL', 'VISION', 'CONTROL', 'INTERACTION'];

/** Spec #13 — the robot as a designed engineering artifact, not the site guide. */
export function RobotShowcase() {
  const [view, setView] = useState<Pose>('front');
  const active = VIEWS.find((v) => v.id === view)!;

  return (
    <section id="meet-robot" className="py-12 lg:py-24 bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-dots opacity-30 pointer-events-none" />
      <div className="container-x relative grid lg:grid-cols-[1fr_380px] gap-10 items-center">
        <div className="relative h-[420px] sm:h-[520px] rounded-3xl border border-slate-200 bg-white overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.15]" aria-hidden>
            <defs>
              <pattern id="meetgrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#2563EB" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#meetgrid)" />
          </svg>
          <span className="absolute top-4 left-4 technical-label">VIEW // {active.label.toUpperCase()}</span>
          <span className="absolute top-4 right-4 technical-label text-brand-blue">YKV-01</span>
          <AnimatePresence mode="wait">
            <motion.img
              key={view}
              src={active.src}
              alt={`Yakhrevan robot mascot — ${active.label.toLowerCase()} view`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 w-full h-full object-contain p-10 robot-shadow"
            />
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur rounded-full p-1.5 border border-slate-200 shadow-card">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                aria-pressed={view === v.id}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${view === v.id ? 'bg-brand-blue text-white' : 'text-brand-navy/60 hover:text-brand-blue'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="eyebrow">Meet the Robot</span>
          <h2 className="h2 mt-4">Engineering Artifact,<br /><span className="text-brand-blue">Not Just a Mascot.</span></h2>
          <p className="mt-3 text-brand-slate text-sm leading-relaxed">
            Every surface was designed with a purpose — LED status eyes, orange power accents, and a rigid
            mechanical frame built to read clearly from any angle.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-[11px] font-semibold text-brand-slate">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
