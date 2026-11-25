import { Component, lazy, Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Move3D, Pause, Play, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const PickBotCanvas = lazy(() => import('./PickBotCanvas'));
const IMAGE_URL = `${import.meta.env.BASE_URL}projects/pickbot-v3.webp`;

export interface PickBotControls {
  base: number;
  shoulder: number;
  elbow: number;
  wrist: number;
  grip: number;
}

const INITIAL_POSE: PickBotControls = {
  base: 0,
  shoulder: 0,
  elbow: 0,
  wrist: 0,
  grip: 0,
};

type Joint = keyof PickBotControls;

const SLIDERS: { key: Joint; label: string; min: number; max: number; unit: string }[] = [
  { key: 'base', label: 'J1 · Base yaw', min: -140, max: 140, unit: '°' },
  { key: 'shoulder', label: 'J2 · Shoulder pitch', min: -45, max: 45, unit: '°' },
  { key: 'elbow', label: 'J3 · Elbow pitch', min: -45, max: 45, unit: '°' },
  { key: 'wrist', label: 'J4 · Wrist pitch', min: -50, max: 50, unit: '°' },
  { key: 'grip', label: 'Gripper opening', min: 0, max: 100, unit: '%' },
];

class ViewerErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
          <img src={IMAGE_URL} alt="PickBot 3D concept fallback" className="max-h-72 w-full object-contain" />
          <p className="text-sm text-white/75">Interactive 3D is unavailable here. The model preview is shown instead.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function PickBotInteractive() {
  const prefersReducedMotion = useReducedMotion();
  const [controls, setControls] = useState<PickBotControls>(INITIAL_POSE);
  const [spinning, setSpinning] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) setSpinning(false);
  }, [prefersReducedMotion]);

  const updateControl = (key: Joint, value: number) => {
    setControls((current) => ({ ...current, [key]: value }));
  };

  const launchViewer = (): boolean => {
    if (supportsWebGL()) {
      setEnabled(true);
      setUnsupported(false);
      return true;
    }
    setUnsupported(true);
    return false;
  };

  const resetPose = () => {
    setControls({ ...INITIAL_POSE });
    setSpinning(false);
  };

  return (
    <section aria-labelledby="pickbot-interactive-title" className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-brand-navy/5">
      <div className="px-6 pb-6 pt-7 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-sky-light px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-brand-blue">Interactive CAD concept</span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-400">PickBot · V3</span>
        </div>
        <h2 id="pickbot-interactive-title" className="mt-3 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Explore the mobile manipulator
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-slate">
          Orbit the four-mecanum-wheel rover, adjust four arm joints and try the gripper. All controls demonstrate a visual model — they do not operate real hardware.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative min-h-[340px] overflow-hidden bg-[#101d2b] sm:min-h-[480px]">
          {enabled ? (
            <ViewerErrorBoundary>
              <Suspense fallback={<div className="flex h-full min-h-[340px] items-center justify-center text-sm font-semibold text-white/80">Preparing interactive viewer…</div>}>
                <PickBotCanvas controls={controls} spinning={spinning} />
              </Suspense>
            </ViewerErrorBoundary>
          ) : (
            <div className="relative flex h-full min-h-[340px] flex-col items-center justify-center gap-5 px-6 py-12 text-center sm:min-h-[480px]">
              <img src={IMAGE_URL} alt="PickBot V3 four-mecanum-wheel rover with four-joint arm" className="absolute inset-0 h-full w-full object-contain opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101d2b]/90 via-[#101d2b]/30 to-[#101d2b]/30" />
              <div className="relative z-10 mt-auto flex flex-col items-center gap-3">
                <button type="button" onClick={launchViewer} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-lg transition-colors hover:bg-brand-sky-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <Box className="h-4 w-4" /> Launch interactive 3D
                </button>
                <p className="text-xs text-white/70">Loads on demand · drag to orbit · scroll to zoom</p>
              </div>
              {unsupported && <p role="alert" className="relative z-10 max-w-sm rounded-xl bg-brand-navy/90 p-3 text-sm text-white">WebGL is not supported by this browser. The static model preview remains available.</p>}
            </div>
          )}
          {enabled && (
            <div className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-brand-navy/70 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-md">
              <Move3D className="h-4 w-4" /> Drag to orbit · Scroll to zoom
            </div>
          )}
        </div>

        <div className="flex flex-col border-t border-slate-200 bg-slate-50/80 p-6 lg:border-l lg:border-t-0">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-brand-navy">Joint controller</h3>
            <span className="rounded-md bg-white px-2 py-1 font-mono text-[10px] font-bold text-brand-blue shadow-sm">4 DOF</span>
          </div>

          <div className="space-y-5">
            {SLIDERS.map(({ key, label, min, max, unit }) => (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label htmlFor={`pickbot-${key}`} className="text-xs font-semibold text-brand-slate">{label}</label>
                  <output htmlFor={`pickbot-${key}`} className="min-w-12 text-right font-mono text-xs font-bold tabular-nums text-brand-blue">
                    {controls[key]}{unit}
                  </output>
                </div>
                <input
                  id={`pickbot-${key}`}
                  type="range"
                  min={min}
                  max={max}
                  step={1}
                  value={controls[key]}
                  onChange={(event) => updateControl(key, Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-brand-blue"
                  aria-valuetext={`${controls[key]} ${unit === '°' ? 'degrees' : 'percent'}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (!enabled && !launchViewer()) return;
                setSpinning((value) => !value);
              }}
              aria-pressed={spinning}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-blue px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-navy"
            >
              {spinning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {spinning ? 'Pause wheels' : 'Spin wheels'}
            </button>
            <button type="button" onClick={resetPose} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-slate transition-colors hover:border-brand-blue hover:text-brand-blue">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-slate-500">
            Demo angles are not calibrated physical joint limits. The original shoulder, elbow and wrist STL parts are preserved; chassis and drive assemblies are concept geometry.
          </p>
        </div>
      </div>
    </section>
  );
}
