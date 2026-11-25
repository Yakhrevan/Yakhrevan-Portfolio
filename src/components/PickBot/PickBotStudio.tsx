import { Component, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Move3D, Pause, Play, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  DEMO_DURATION_MS,
  DEMO_STEPS,
  DROP_POINT,
  HOME_POSE,
  PICKUP_POINT,
  samplePickPlace,
} from './demo';
import type { DriveMode, PickBotControls } from './demo';
import { PickBotIKLab } from './PickBotIKLab';
import { PickBotMecanumLab } from './PickBotMecanumLab';
import { ARM, graspContact, integrateMecanum, solveIK, ZERO_DRIVE_POSE, ZERO_TWIST } from './kinematics';
import type { IKResult, Position3, Twist2, DrivePose } from './kinematics';

const PickBotCanvas = lazy(() => import('./PickBotCanvas'));
const IMAGE_URL = `${import.meta.env.BASE_URL}projects/pickbot-v3.webp`;
const STAGE_IMAGE = (frame: string) => `${import.meta.env.BASE_URL}projects/pickbot-sim-${frame}.webp`;
const STAGE_FRAMES: Record<string, string> = {
  Ready: 'ready', Approach: 'approach', Align: 'align', Grasp: 'pick',
  Lift: 'lift', Transfer: 'transfer', Place: 'place', Release: 'release', Complete: 'complete',
};

type Joint = keyof PickBotControls;
type StudioTab = 'ik' | 'joints' | 'drive' | 'demo';

const SLIDERS: { key: Joint; label: string; min: number; max: number; unit: string }[] = [
  { key: 'base', label: 'J1 · Base yaw', min: -140, max: 140, unit: '°' },
  { key: 'shoulder', label: 'J2 · Shoulder pitch', min: -35, max: 100, unit: '°' },
  { key: 'elbow', label: 'J3 · Elbow pitch', min: -90, max: 90, unit: '°' },
  { key: 'wrist', label: 'J4 · Wrist pitch', min: -90, max: 90, unit: '°' },
  { key: 'grip', label: 'Gripper opening', min: 0, max: 100, unit: '%' },
];

const TABS: { id: StudioTab; label: string }[] = [
  { id: 'ik', label: 'IK target' },
  { id: 'joints', label: 'Joint control' },
  { id: 'drive', label: 'Mecanum drive' },
  { id: 'demo', label: 'Pick & place' },
];

class ViewerErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-3 px-8 text-center">
          <img src={IMAGE_URL} alt="PickBot 3D concept fallback" className="max-h-72 w-full object-contain" />
          <p className="text-sm text-white/75">The interactive viewer could not start. A static model preview is shown instead.</p>
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

export function PickBotStudio() {
  const prefersReducedMotion = useReducedMotion();
  const [tab, setTab] = useState<StudioTab>('ik');
  const [manualControls, setManualControls] = useState<PickBotControls>({ ...HOME_POSE });
  const [ikTarget, setIkTarget] = useState<Position3>({ x: PICKUP_POINT[0], y: PICKUP_POINT[1], z: PICKUP_POINT[2] });
  const [ikControls, setIkControls] = useState<PickBotControls>({ base: 0, shoulder: 60, elbow: 0, wrist: 0, grip: 100 });
  const [ikSolution, setIkSolution] = useState<IKResult>(() => solveIK({ x: PICKUP_POINT[0], y: PICKUP_POINT[1], z: PICKUP_POINT[2] }));
  const [ikAttached, setIkAttached] = useState(false);
  const [ikNotice, setIkNotice] = useState('Move the object in the top-view workspace, then close the gripper to test contact.');
  const [driveCommand, setDriveCommand] = useState<Twist2>({ ...ZERO_TWIST });
  const [drivePreset, setDrivePreset] = useState<DriveMode>('stop');
  const [driveState, setDriveState] = useState<{ pose: DrivePose; trail: DrivePose[] }>({ pose: { ...ZERO_DRIVE_POSE }, trail: [{ ...ZERO_DRIVE_POSE }] });
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  const demo = useMemo(() => samplePickPlace(elapsedMs), [elapsedMs]);
  const displayedControls = tab === 'demo' ? demo.controls : tab === 'ik' ? ikControls : manualControls;
  // When WebGL is disabled, advance real CAD renders with the timeline instead
  // of leaving the robot frozen on the old product thumbnail.
  const stillFrame = STAGE_FRAMES[demo.step.label] ?? 'ready';
  const stillImage = tab === 'demo' ? STAGE_IMAGE(stillFrame) : IMAGE_URL;

  useEffect(() => {
    if (prefersReducedMotion) {
      setPlaying(false);
      setDriveCommand({ ...ZERO_TWIST });
      setDrivePreset('stop');
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (tab !== 'drive' || (driveCommand.vx === 0 && driveCommand.vy === 0 && driveCommand.omega === 0)) return;
    const interval = window.setInterval(() => {
      setDriveState(({ pose, trail }) => {
        const next = integrateMecanum(pose, driveCommand, 0.05);
        return { pose: next, trail: [...trail.slice(-239), next] };
      });
    }, 50);
    return () => window.clearInterval(interval);
  }, [tab, driveCommand]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let lastPaint = 0;
    const offset = performance.now() - elapsedMs;

    const tick = (now: number) => {
      const next = Math.min(DEMO_DURATION_MS, now - offset);
      if (now - lastPaint > 40 || next >= DEMO_DURATION_MS) {
        setElapsedMs(next);
        lastPaint = now;
      }
      if (next >= DEMO_DURATION_MS) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Playback start is captured when `playing` toggles; updates won't restart the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const launchViewer = (): boolean => {
    if (supportsWebGL()) {
      setEnabled(true);
      setUnsupported(false);
      return true;
    }
    setUnsupported(true);
    return false;
  };

  const selectTab = (next: StudioTab) => {
    setPlaying(false);
    setDriveCommand({ ...ZERO_TWIST });
    setDrivePreset('stop');
    setTab(next);
  };

  const changeIKTarget = (next: Position3) => {
    const result = solveIK(next, ikControls);
    setIkTarget(next);
    setIkSolution(result);
    if (result.ok) {
      setIkControls({ ...result.controls, grip: ikAttached ? 0 : 100 });
      setIkNotice(ikAttached ? 'Payload follows the solved gripper pose. Lower onto support before release.' : 'Target solved. Close the virtual fingers to verify grasp contact.');
    } else {
      setIkNotice(`Motion stopped: ${result.reason}`);
    }
  };

  const resetIK = () => {
    const target = { x: PICKUP_POINT[0], y: PICKUP_POINT[1], z: PICKUP_POINT[2] };
    const controls = { base: 0, shoulder: 60, elbow: 0, wrist: 0, grip: 100 };
    setIkTarget(target);
    setIkControls(controls);
    setIkSolution(solveIK(target, controls));
    setIkAttached(false);
    setIkNotice('Object reset on its source pedestal. Drag it or close the gripper to attempt pickup.');
  };

  const graspIK = () => {
    const closed = { ...ikControls, grip: 0 };
    setIkControls(closed);
    const grasp = graspContact(closed, ikTarget);
    if (!ikSolution.ok || !grasp.contact) {
      setIkAttached(false);
      setIkNotice(`Failed grasp · ${ikSolution.ok ? grasp.reason : ikSolution.reason}`);
      return;
    }
    setIkAttached(true);
    setIkNotice('Gripper contact confirmed. Payload attached; lift, transfer, then lower before release.');
  };

  const releaseIK = () => {
    if (!ikAttached) return;
    if (!ikSolution.ok || Math.abs(ikTarget.y - ARM.objectHeight) > ARM.contactTolerance) {
      setIkNotice('Release blocked: lower the payload onto its support plane at Y = 284 mm first.');
      return;
    }
    const contact = graspContact({ ...ikControls, grip: 0 }, ikTarget);
    if (!contact.contact) {
      setIkNotice(`Release blocked: ${contact.reason}`);
      return;
    }
    setIkAttached(false);
    setIkControls((current) => ({ ...current, grip: 100 }));
    setIkNotice('Object released on its support. Contact verified; gripper fingers opened.');
  };

  const updateDriveCommand = (command: Twist2) => {
    setDrivePreset('stop');
    setDriveCommand(command);
    if (!enabled && !unsupported) launchViewer();
  };

  const selectDrivePreset = (mode: DriveMode) => {
    const next = drivePreset === mode ? 'stop' : mode;
    const commands: Record<DriveMode, Twist2> = {
      stop: ZERO_TWIST,
      forward: { vx: 0.24, vy: 0, omega: 0 },
      reverse: { vx: -0.24, vy: 0, omega: 0 },
      'strafe-left': { vx: 0, vy: 0.24, omega: 0 },
      'strafe-right': { vx: 0, vy: -0.24, omega: 0 },
      'rotate-left': { vx: 0, vy: 0, omega: 0.75 },
      'rotate-right': { vx: 0, vy: 0, omega: -0.75 },
    };
    setDrivePreset(next);
    setDriveCommand(commands[next]);
    if (!enabled && !unsupported) launchViewer();
  };

  const updateControl = (key: Joint, value: number) => {
    setManualControls((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setPlaying(false);
    setElapsedMs(0);
    setDriveCommand({ ...ZERO_TWIST });
    setManualControls({ ...HOME_POSE });
  };

  const toggleDemo = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (elapsedMs >= DEMO_DURATION_MS) setElapsedMs(0);
    if (!enabled) launchViewer();
    setDriveCommand({ ...ZERO_TWIST });
    setPlaying(true);
  };

  return (
    <section aria-labelledby="pickbot-interactive-title" className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-brand-navy/5">
      <div className="px-6 pb-6 pt-7 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-sky-light px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-brand-blue">Interactive engineering studio</span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-400">PickBot · V6 engineering simulation</span>
        </div>
        <h2 id="pickbot-interactive-title" className="mt-3 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Target. Grasp. Drive. Simulate.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-slate">
          Drag a virtual target to solve arm IK and test contact-based grasping. Drive four mecanum wheels with X/Y/yaw commands, inspect calculated RPM and a plotted path, or replay the original calibrated sequence. No real hardware commands are sent.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative min-h-[340px] overflow-hidden bg-[#101d2b] sm:min-h-[500px] lg:h-[690px]">
          {enabled ? (
            <ViewerErrorBoundary>
              <Suspense fallback={<div className="flex min-h-[340px] items-center justify-center text-sm font-semibold text-white/80">Preparing interactive viewer…</div>}>
                <PickBotCanvas
                  controls={displayedControls}
                  driveMode="stop"
                  payloadState={tab === 'ik' ? ikAttached ? 'attached' : 'target' : tab === 'demo' ? demo.payload : 'hidden'}
                  ikTarget={tab === 'ik' ? ikTarget : undefined}
                  driveVelocity={tab === 'drive' ? driveCommand : undefined}
                  drivePose={tab === 'drive' ? driveState.pose : undefined}
                />
              </Suspense>
            </ViewerErrorBoundary>
          ) : (
            <div className="relative flex h-full min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[500px]">
              <img src={stillImage} alt={tab === 'demo' ? `CAD-rendered ${demo.step.label.toLowerCase()} simulation stage` : "Concept render of PickBot's four mecanum wheels and four-joint arm"} className={`absolute inset-0 h-full w-full object-contain ${tab === 'demo' ? 'opacity-95' : 'opacity-75'}`} />
              <div className={`absolute inset-0 bg-gradient-to-t ${tab === 'demo' ? 'from-[#101d2b]/75 via-transparent to-transparent' : 'from-[#101d2b]/95 via-[#101d2b]/25 to-[#101d2b]/25'}`} />
              <div className="relative z-10 mt-auto flex flex-col items-center gap-3">
                <button type="button" onClick={launchViewer} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-lg transition-colors hover:bg-brand-sky-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <Box className="h-4 w-4" aria-hidden="true" /> Launch interactive 3D
                </button>
                <p className="text-xs text-white/70">Loads on demand · Drag to orbit · Scroll to zoom</p>
              </div>
              {unsupported && <p role="alert" className="relative z-10 mt-4 max-w-sm rounded-xl bg-brand-navy/90 p-3 text-sm text-white">WebGL is unavailable in this browser. The static preview and simulation timeline remain accessible.</p>}
              {tab === 'demo' && <span className="absolute right-4 top-4 z-10 rounded-full bg-brand-navy/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white/90">CAD stage preview</span>}
            </div>
          )}
          {enabled && (
            <div className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-brand-navy/70 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-md">
              <Move3D className="h-4 w-4" aria-hidden="true" /> Drag to orbit · Scroll to zoom
            </div>
          )}
          {tab === 'demo' && (
            <div aria-live="off" className="pointer-events-none absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-xl border border-white/15 bg-brand-navy/85 px-4 py-2 text-white shadow-lg backdrop-blur-md">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-brand-sky">Simulation · {Math.round(elapsedMs / 1000)}s / 24s</span>
              <p className="mt-1 text-sm font-bold">{demo.step.label}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col border-t border-slate-200 bg-slate-50/80 lg:max-h-[690px] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div role="tablist" aria-label="PickBot interactive controls" className="grid grid-cols-4 gap-1 border-b border-slate-200 bg-white p-2">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                id={`pickbot-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-controls={`pickbot-panel-${id}`}
                onClick={() => selectTab(id)}
                className={`rounded-lg px-1.5 py-2.5 text-[11px] font-bold leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${tab === id ? 'bg-brand-blue text-white' : 'text-brand-slate hover:bg-brand-sky-light hover:text-brand-blue'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'ik' && <PickBotIKLab target={ikTarget} controls={ikControls} solution={ikSolution} attached={ikAttached} notice={ikNotice} onTarget={changeIKTarget} onReset={resetIK} onGrasp={graspIK} onRelease={releaseIK} onLift={() => changeIKTarget({ ...ikTarget, y: ikTarget.y + 0.12 })} onLower={() => changeIKTarget({ ...ikTarget, y: ARM.objectHeight })} onDropBay={() => changeIKTarget({ x: DROP_POINT[0], y: ikTarget.y, z: DROP_POINT[2] })} />}

          {tab === 'joints' && (
            <div id="pickbot-panel-joints" role="tabpanel" aria-labelledby="pickbot-tab-joints" className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-brand-navy">Joint controller</h3>
                <span className="rounded-md bg-white px-2 py-1 font-mono text-[10px] font-bold text-brand-blue shadow-sm">4 DOF + gripper</span>
              </div>
              <div className="space-y-5">
                {SLIDERS.map(({ key, label, min, max, unit }) => (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <label htmlFor={`pickbot-${key}`} className="text-xs font-semibold text-brand-slate">{label}</label>
                      <output htmlFor={`pickbot-${key}`} className="min-w-12 text-right font-mono text-xs font-bold tabular-nums text-brand-blue">{Math.round(manualControls[key])}{unit}</output>
                    </div>
                    <input
                      id={`pickbot-${key}`}
                      type="range"
                      min={min}
                      max={max}
                      step={1}
                      value={manualControls[key]}
                      onChange={(event) => updateControl(key, Number(event.target.value))}
                      className="h-2 w-full cursor-pointer accent-brand-blue"
                      aria-valuetext={`${Math.round(manualControls[key])} ${unit === '°' ? 'degrees' : 'percent'}`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">These slider ranges are display values, not measured physical joint limits.</p>
              <button type="button" onClick={reset} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-slate hover:border-brand-blue hover:text-brand-blue"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset pose</button>
            </div>
          )}

          {tab === 'drive' && <PickBotMecanumLab command={driveCommand} pose={driveState.pose} trail={driveState.trail} activePreset={drivePreset} onCommand={updateDriveCommand} onPreset={selectDrivePreset} onStop={() => { setDriveCommand({ ...ZERO_TWIST }); setDrivePreset('stop'); }} onReset={() => { setDriveCommand({ ...ZERO_TWIST }); setDrivePreset('stop'); setDriveState({ pose: { ...ZERO_DRIVE_POSE }, trail: [{ ...ZERO_DRIVE_POSE }] }); }} />}

          {tab === 'demo' && (
            <div id="pickbot-panel-demo" role="tabpanel" aria-labelledby="pickbot-tab-demo" className="flex flex-1 flex-col p-5 sm:p-6">
              <div>
                <span className="rounded-lg bg-amber-50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-800 ring-1 ring-amber-200">Virtual sequence · 24 sec</span>
                <h3 className="mt-4 text-lg font-extrabold text-brand-navy">Pick-and-place playback</h3>
                <p className="mt-2 min-h-14 text-xs leading-relaxed text-brand-slate" aria-live="polite">{demo.step.description}</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-brand-slate">
                  <span>{demo.step.label}</span>
                  <span className="font-mono tabular-nums">{(elapsedMs / 1000).toFixed(1)} / 24.0 s</span>
                </div>
                <div role="progressbar" aria-label="Simulation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(demo.progress)} className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-brand-blue transition-[width] duration-75" style={{ width: `${demo.progress}%` }} />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button type="button" onClick={toggleDemo} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-blue px-3 py-3 text-xs font-bold text-white hover:bg-brand-navy">
                  {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                  {playing ? 'Pause demo' : elapsedMs >= DEMO_DURATION_MS ? 'Replay demo' : 'Play demo'}
                </button>
                <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-brand-slate hover:border-brand-blue"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart</button>
              </div>
              <div className="mt-6 max-h-52 space-y-1 overflow-y-auto pr-1" aria-label="Simulation stages">
                {DEMO_STEPS.map((step, index) => (
                  <button key={step.at} type="button" onClick={() => { setPlaying(false); setElapsedMs(step.at * 1000); }} aria-current={demo.stepIndex === index ? 'step' : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${demo.stepIndex === index ? 'bg-brand-sky-light font-bold text-brand-blue' : 'text-brand-slate hover:bg-white'}`}>
                    <span className="w-8 shrink-0 font-mono text-[10px] tabular-nums">{String(step.at).padStart(2, '0')}s</span>
                    <span>{step.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-slate-500">The pickup/drop stations and contact poses are aligned to the concept GLB. This is a calibrated visual sequence, not a collision, dynamics or inverse-kinematics simulation, nor recorded hardware footage.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
