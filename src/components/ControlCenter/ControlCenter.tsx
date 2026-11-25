import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  Activity, AlertOctagon, AlertTriangle, ArrowRight, BatteryCharging, CheckCircle2,
  CircleDot, Clock3, Download, Gauge, ListChecks, MapPinned, Pause, Play,
  Plus, Radio, RotateCcw, ShieldAlert, Terminal, Zap,
} from 'lucide-react';
import {
  NODES, TASK_TEMPLATES, TICK_SECONDS, controlReducer, createControlState,
  exportControlRun, type ControlState, type NodeId, type TaskKind,
} from './controlCore';

const MODE_LABEL: Record<ControlState['mode'], string> = {
  standby: 'STANDBY', running: 'JOB IN PROGRESS', paused: 'OPERATOR PAUSED',
  fault: 'FAULT DETECTED', estop: 'E-STOP LATCHED',
};

const MODE_STYLE: Record<ControlState['mode'], string> = {
  standby: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
  running: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  paused: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  fault: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  estop: 'border-rose-400/50 bg-rose-400/20 text-rose-200',
};

const MAP_W = 600;
const MAP_H = 400;
const pointX = (x: number) => (x / 12) * MAP_W;
const pointY = (y: number) => (y / 8) * MAP_H;

const SHELVES = [
  { x: 2.6, y: 0.52, w: 1.75, h: 0.8 },
  { x: 4.6, y: 0.52, w: 1.75, h: 0.8 },
  { x: 6.6, y: 0.52, w: 1.75, h: 0.8 },
  { x: 3.1, y: 2.85, w: 1.1, h: 0.75 },
  { x: 6.3, y: 2.85, w: 1.1, h: 0.75 },
  { x: 3.1, y: 5.25, w: 1.5, h: 0.9 },
  { x: 6.25, y: 5.25, w: 1.5, h: 0.9 },
];

function MicroLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{children}</span>;
}

function StatCard({ icon: Icon, label, value, unit, accent = false }: {
  icon: typeof Activity; label: string; value: string; unit?: string; accent?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-[#102437]/80 p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-2"><MicroLabel>{label}</MicroLabel><Icon className={`h-4 w-4 ${accent ? 'text-cyan-300' : 'text-slate-500'}`} aria-hidden="true" /></div>
      <div className={`mt-3 font-mono text-[24px] font-semibold leading-none tracking-tight tabular-nums sm:text-[28px] ${accent ? 'text-cyan-200' : 'text-white'}`}>
        {value}<span className="ml-1.5 text-[11px] font-medium text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function WarehouseMap({ state }: { state: ControlState }) {
  const path = [{ x: state.pose.x, y: state.pose.y }, ...state.remainingRoute.map((id) => NODES[id])];
  const points = path.map((point) => `${pointX(point.x)},${pointY(point.y)}`).join(' ');
  const angle = state.pose.theta * 180 / Math.PI;
  const robotX = pointX(state.pose.x);
  const robotY = pointY(state.pose.y);
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block aspect-[3/2] w-full sm:aspect-[3/2]" role="img" aria-label={`Simulated warehouse schematic. Robot AMR-01 at x ${state.pose.x.toFixed(1)}, y ${state.pose.y.toFixed(1)} metres. ${state.remainingRoute.length} route waypoints remain.`}>
      <defs>
        <pattern id="control-dots" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1.25" cy="1.25" r="1" fill="#29445a" /></pattern>
        <pattern id="control-rack" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0" stroke="#49667a" strokeWidth="1" opacity="0.45" /></pattern>
        <radialGradient id="control-robot-glow"><stop offset="0%" stopColor="#4ce6ed" stopOpacity=".38" /><stop offset="100%" stopColor="#4ce6ed" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="#0b1e2d" />
      <rect width={MAP_W} height={MAP_H} fill="url(#control-dots)" />
      <rect x="35" y="28" width="530" height="344" rx="6" fill="none" stroke="#345468" strokeWidth="1.5" strokeDasharray="6 7" />
      {SHELVES.map((rack, index) => (
        <g key={index}>
          <rect x={pointX(rack.x)} y={pointY(rack.y)} width={pointX(rack.w)} height={pointY(rack.h)} rx="5" fill="#1c374a" stroke="#3d5b70" strokeWidth="1.5" />
          <rect x={pointX(rack.x) + 4} y={pointY(rack.y) + 4} width={pointX(rack.w) - 8} height={pointY(rack.h) - 8} rx="3" fill="url(#control-rack)" />
          <text x={pointX(rack.x + rack.w / 2)} y={pointY(rack.y + rack.h / 2) + 3} fill="#89a6b9" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="1">R{String(index + 1).padStart(2, '0')}</text>
        </g>
      ))}
      {(['dock', 'inspection', 'dispatch'] as NodeId[]).map((id) => (
        <g key={id}>
          <circle cx={pointX(NODES[id].x)} cy={pointY(NODES[id].y)} r="10" fill="#122e40" stroke="#6ab2b7" strokeWidth="1.5" />
          <circle cx={pointX(NODES[id].x)} cy={pointY(NODES[id].y)} r="3" fill="#6bd9dd" />
          <text x={pointX(NODES[id].x)} y={pointY(NODES[id].y) - 17} fill="#9bb5c6" fontSize="10" fontFamily="monospace" textAnchor="middle">{id === 'dock' ? 'LOAD 01' : id === 'inspection' ? 'QC 02' : 'DROP 03'}</text>
        </g>
      ))}
      {state.active && state.remainingRoute.length > 0 && <>
        <polyline points={points} fill="none" stroke="#43d9e8" strokeWidth="13" strokeOpacity=".09" strokeLinejoin="round" />
        <polyline points={points} fill="none" stroke="#70eff1" strokeWidth="2.5" strokeDasharray="8 7" strokeLinecap="round" strokeLinejoin="round" />
        {state.remainingRoute.map((id, i) => <circle key={`${id}-${i}`} cx={pointX(NODES[id].x)} cy={pointY(NODES[id].y)} r="3.5" fill="#70eff1" />)}
      </>}
      <circle cx={robotX} cy={robotY} r="42" fill="url(#control-robot-glow)" />
      <g transform={`translate(${robotX} ${robotY}) rotate(${angle})`}>
        <rect x="-18" y="-13" width="36" height="26" rx="6" fill="#c3fcff" stroke="#48e2ea" strokeWidth="2.2" />
        <rect x="-10" y="-9" width="20" height="18" rx="3" fill="#1d5267" />
        <rect x="-20" y="-10" width="4" height="7" rx="1" fill="#66e4e9" />
        <rect x="-20" y="3" width="4" height="7" rx="1" fill="#66e4e9" />
        <rect x="16" y="-10" width="4" height="7" rx="1" fill="#66e4e9" />
        <rect x="16" y="3" width="4" height="7" rx="1" fill="#66e4e9" />
        <path d="M9 0L22 0M17 -4L22 0L17 4" fill="none" stroke="#09283b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <rect x="10" y="347" width="150" height="41" rx="6" fill="#091727" fillOpacity=".9" stroke="#38536c" />
      <text x="23" y="364" fill="#6fdde5" fontSize="9" letterSpacing="1.4" fontFamily="monospace">AMR-01 · SIMULATED</text>
      <text x="23" y="378" fill="#c7d9e7" fontSize="10" fontFamily="monospace">X {state.pose.x.toFixed(2)}  Y {state.pose.y.toFixed(2)}</text>
      <text x="582" y="372" fill="#5e879d" fontSize="10" textAnchor="end" fontFamily="monospace">12 × 8 m  /  SCHEMATIC</text>
    </svg>
  );
}

function TelemetryChart({ state }: { state: ControlState }) {
  const recent = state.samples;
  const max = Math.max(1, recent.length - 1);
  const points = recent.map((entry, index) => `${(index / max) * 320},${96 - (entry.speed / 1.2) * 76}`).join(' ');
  const area = `0,98 ${points} 320,98`;
  return (
    <svg viewBox="0 0 320 114" className="w-full" role="img" aria-label={`Simulated velocity plot, latest ${state.speed.toFixed(2)} metres per second across ${recent.length} samples.`}>
      {[20, 45, 70, 95].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#2c4458" strokeDasharray="3 5" />)}
      <polygon points={area} fill="#36d5e3" fillOpacity=".11" />
      <polyline points={points} fill="none" stroke="#79eaf0" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <text x="2" y="109" fill="#6e91a5" fontSize="9" fontFamily="monospace">OLD</text>
      <text x="318" y="109" fill="#6e91a5" fontSize="9" fontFamily="monospace" textAnchor="end">NOW</text>
    </svg>
  );
}

function downloadRun(state: ControlState) {
  const content = JSON.stringify(exportControlRun(state), null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'control-center-simulated-run.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ControlCenter() {
  const [state, dispatch] = useReducer(controlReducer, undefined, createControlState);
  const [newTask, setNewTask] = useState<TaskKind>('return');
  const activeProgress = state.active
    ? state.initialTaskDistance > 0 ? Math.min(100, (state.taskDistance / state.initialTaskDistance) * 100) : 100
    : 0;
  const canStart = (state.mode === 'standby' || state.mode === 'paused') && (state.active !== null || state.queue.length > 0);

  useEffect(() => {
    if (state.mode !== 'running') return;
    const timer = window.setInterval(() => dispatch({ type: 'tick' }), TICK_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [state.mode]);

  const commandText = useMemo(() => state.mode === 'running' ? `${state.speed.toFixed(2)} / 0.00 / 0.00` : '0.00 / 0.00 / 0.00', [state.mode, state.speed]);
  const blocked = state.mode === 'estop' || state.mode === 'fault';

  return (
    <div id="robot-control-center" className="mt-12 space-y-5 lg:relative lg:left-1/2 lg:w-[min(1180px,calc(100vw-5rem))] lg:-translate-x-1/2">
      <section className="overflow-hidden rounded-[26px] border border-[#294253] bg-[#081825] text-slate-100 shadow-2xl shadow-slate-950/15">
        <div className="relative flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 font-mono text-sm font-black tracking-tighter text-cyan-200">Y/</div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2"><MicroLabel>YAKHREVAN / ENGINEERING LABS</MicroLabel><span className="h-1 w-1 rounded-full bg-slate-500" /><span className="font-mono text-[10px] text-cyan-400">P2 · 001</span></div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">Robot Control Center<span className="ml-2 text-cyan-300">/</span></h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-amber-300/25 bg-amber-400/10 px-2.5 py-2 font-mono text-[10px] font-bold tracking-wider text-amber-200"><CircleDot className="h-3.5 w-3.5" /> SIMULATION · OFFLINE</span>
            <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[10px] font-bold tracking-wider ${MODE_STYLE[state.mode]}`} role="status" aria-live="polite"><span className={`h-2 w-2 rounded-full ${state.mode === 'running' ? 'animate-pulse bg-emerald-300' : 'bg-current'}`} />{MODE_LABEL[state.mode]}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 bg-[#0b1b29] p-3.5 sm:gap-3 sm:p-5 lg:grid-cols-4 lg:px-7">
          <StatCard icon={BatteryCharging} label="Battery SOC" value={state.battery.toFixed(1)} unit="%" accent />
          <StatCard icon={Gauge} label="Ground speed" value={state.speed.toFixed(2)} unit="m/s" />
          <StatCard icon={ListChecks} label="Queued jobs" value={String(state.queue.length).padStart(2, '0')} unit="tasks" />
          <StatCard icon={MapPinned} label="Distance run" value={state.totalDistance.toFixed(1)} unit="m" />
        </div>

        <div className="grid gap-px bg-white/10 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
          <div className="min-w-0 bg-[#0b1b29]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3.5 sm:px-6"><div className="flex items-center gap-2 text-xs font-bold tracking-wide text-white"><MapPinned className="h-4 w-4 text-cyan-300" /> WAREHOUSE DIGITAL TWIN <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[9px] text-cyan-200">ILLUSTRATIVE</span></div><MicroLabel>MAP 01 / LIVE STATE</MicroLabel></div>
            <div className="p-2.5 sm:p-4"><div className="overflow-hidden rounded-lg border border-[#29445a]"><WarehouseMap state={state} /></div></div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-slate-400"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-cyan-200" /> AMR-01</span><span><i className="mr-1.5 inline-block h-0.5 w-3 align-middle bg-cyan-400" /> Scheduled route</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-[#405d71]" /> Schematic racks</span></div>
              <span className="font-mono text-[10px] text-slate-500">X {state.pose.x.toFixed(2)} / Y {state.pose.y.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col bg-[#0c2030]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5"><div className="flex items-center gap-2 text-xs font-bold tracking-wide"><Activity className="h-4 w-4 text-cyan-300" /> LIVE TELEMETRY</div><span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-400"><Radio className="h-3 w-3 text-amber-300" /> MOCK STREAM</span></div>
            <div className="flex-1 p-4 sm:p-5">
              <div className="flex items-baseline justify-between"><MicroLabel>Velocity / Simulated odometry</MicroLabel><span className="font-mono text-lg font-semibold text-cyan-200">{state.speed.toFixed(2)} <span className="text-xs text-slate-400">m/s</span></span></div>
              <div className="mt-2 rounded-lg border border-white/5 bg-[#0a1a28] p-2"><TelemetryChart state={state} /></div>
              <div className="mt-5 space-y-3.5">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3"><MicroLabel>Battery reserve</MicroLabel><span className="font-mono text-xs font-bold text-white">{state.battery.toFixed(1)}%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#2b4254]"><div className="h-full rounded-full bg-cyan-300 transition-[width] duration-200" style={{ width: `${state.battery}%` }} /></div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><MicroLabel>Simulation clock</MicroLabel><span className="font-mono text-xs font-bold tabular-nums text-white">{state.time.toFixed(1)} s</span></div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><MicroLabel>Heading / yaw</MicroLabel><span className="font-mono text-xs font-bold tabular-nums text-white">{(state.pose.theta * 180 / Math.PI).toFixed(0)}°</span></div>
                <div className="space-y-1"><MicroLabel>/cmd_vel analogue · VX / VY / WZ</MicroLabel><p className="font-mono text-[11px] tabular-nums text-cyan-200">{commandText} <span className="text-slate-500">(modeled)</span></p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/10 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,1fr)_minmax(0,.88fr)]">
          <div className="min-w-0 bg-[#0b1b29] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-xs font-bold tracking-wide"><ListChecks className="h-4 w-4 text-cyan-300" /> TASK DISPATCH</div><span className="font-mono text-[10px] text-slate-500">{state.finished.length} DONE / {state.failed.length} FAILED</span></div>
            <div className="mb-3 rounded-lg border border-cyan-300/25 bg-cyan-300/[.06] p-3">
              <div className="mb-2 flex items-center justify-between gap-2"><MicroLabel>{state.active ? state.active.id : 'NO ACTIVE JOB'}</MicroLabel><span className="font-mono text-[10px] text-cyan-300">{state.active ? `${activeProgress.toFixed(0)}%` : 'IDLE'}</span></div>
              <p className="min-h-8 text-sm font-semibold text-white">{state.active?.label ?? 'Ready for next dispatch'}</p>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-cyan-300 transition-[width] duration-200" style={{ width: `${activeProgress}%` }} /></div>
            </div>
            <div className="min-h-16 space-y-1.5" aria-label="Pending task queue">
              {state.queue.slice(0, 4).map((task, index) => <div key={task.id} className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[.03] px-3 py-2.5"><span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1 truncate text-[11px] text-slate-300">{task.label}</span><span className="font-mono text-[9px] text-slate-500">{task.id}</span></div>)}
              {state.queue.length === 0 && <p className="py-2 text-xs text-slate-500">No pending jobs. Add a task below.</p>}
              {state.queue.length > 4 && <p className="font-mono text-[10px] text-slate-500">+{state.queue.length - 4} more queued</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <label className="min-w-0 flex-1"><span className="sr-only">New task type</span><select value={newTask} onChange={(event) => setNewTask(event.target.value as TaskKind)} className="w-full min-w-0 rounded-lg border border-white/15 bg-[#10283a] px-2.5 py-2.5 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">{(Object.keys(TASK_TEMPLATES) as TaskKind[]).map((kind) => <option key={kind} value={kind}>{TASK_TEMPLATES[kind].label}</option>)}</select></label>
              <button type="button" onClick={() => dispatch({ type: 'enqueue', kind: newTask })} disabled={state.queue.length >= 8} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-2 text-[11px] font-black text-[#092535] transition-colors hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /> ADD</button>
            </div>
          </div>

          <div className="min-w-0 bg-[#0b1b29] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wide"><Zap className="h-4 w-4 text-cyan-300" /> OPERATOR CONTROLS</div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={!canStart} onClick={() => dispatch({ type: 'start' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-3 py-3 text-xs font-extrabold text-[#092535] transition-colors hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"><Play className="h-4 w-4 fill-current" />{state.mode === 'paused' ? 'RESUME' : 'START JOB'}</button>
              <button type="button" disabled={state.mode !== 'running'} onClick={() => dispatch({ type: 'pause' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-3 text-xs font-bold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"><Pause className="h-4 w-4" /> PAUSE</button>
              <button type="button" disabled={!state.active || state.mode === 'estop'} onClick={() => dispatch({ type: 'fail-task' })} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"><AlertTriangle className="h-3.5 w-3.5" /> Mark current job failed</button>
            </div>
            <div className="mt-4 rounded-xl border border-rose-500/35 bg-[#321d28] p-3">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-rose-200"><ShieldAlert className="h-4 w-4" /> Safety Interlock · Simulated</div>
              <button type="button" onClick={() => dispatch({ type: state.mode === 'estop' ? 'release-estop' : 'estop' })} className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-3.5 text-xs font-black tracking-[.08em] transition-colors ${state.mode === 'estop' ? 'border border-rose-300/50 bg-rose-300/15 text-rose-100 hover:bg-rose-300/25' : 'bg-[#ed5b63] text-[#21080c] hover:bg-[#ff8b8c]'}`}><AlertOctagon className="h-5 w-5" />{state.mode === 'estop' ? 'RESET E-STOP LATCH' : 'EMERGENCY STOP'}</button>
              <p className="mt-2.5 text-[10px] leading-relaxed text-rose-200/65">{state.mode === 'estop' ? 'LATCHED · Releasing does not restart motion.' : 'Stops simulated motion and latches until manual reset.'}</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={() => dispatch({ type: blocked && state.mode === 'fault' ? 'ack-fault' : 'inject-fault' })} disabled={state.mode === 'estop'} className="flex-1 rounded-lg border border-amber-400/25 bg-amber-400/[.07] px-2 py-2.5 text-[10px] font-bold text-amber-200 hover:bg-amber-400/15 disabled:opacity-30">{state.mode === 'fault' ? 'ACK FAULT' : 'INJECT FAULT'}</button>
              <button type="button" onClick={() => dispatch({ type: 'reset' })} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-2.5 text-[10px] font-bold text-slate-300 hover:bg-white/10" title="Reset simulated mission and all local tasks"><RotateCcw className="h-3.5 w-3.5" /> RESET</button>
            </div>
          </div>

          <div className="min-w-0 bg-[#0b1b29] p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-1"><div className="flex items-center gap-2 text-xs font-bold tracking-wide"><Terminal className="h-4 w-4 text-cyan-300" /> EVENT LOG</div><Clock3 className="h-3.5 w-3.5 text-slate-600" /></div>
            <div className="max-h-[310px] min-h-[240px] space-y-0.5 overflow-y-auto" aria-label="Simulated robot event log" role="log" aria-live="polite">
              {state.logs.slice(0, 12).map((entry) => <div key={entry.id} className="grid grid-cols-[38px_7px_1fr] items-start gap-2 border-b border-white/5 py-2.5"><span className="font-mono text-[9px] tabular-nums text-slate-500">{entry.time.toFixed(1)}s</span><span className={`mt-1 h-1.5 w-1.5 rounded-full ${entry.level === 'error' ? 'bg-rose-400' : entry.level === 'warning' ? 'bg-amber-400' : entry.level === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}`} /><p className="text-[11px] leading-relaxed text-slate-300">{entry.message}</p></div>)}
            </div>
            <button type="button" onClick={() => downloadRun(state)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:border-cyan-300/50 hover:text-cyan-200"><Download className="h-3.5 w-3.5" /> EXPORT SIMULATION JSON</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#263d4f] bg-[#081522] px-5 py-3.5 sm:px-7"><p className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-400"><span className="text-cyan-300">ROS-STYLE INTERFACE STUDY</span><span>/cmd_vel</span><span>/odom</span><span>/battery_state</span></p><p className="flex items-center gap-1.5 font-mono text-[10px] text-amber-200"><AlertTriangle className="h-3 w-3" /> NO ROS 2 OR HARDWARE CONNECTION</p></div>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Engineering notes">
        {[
          { label: '01 / ARCHITECTURE', title: 'One authoritative state', text: 'Task dispatcher, route marker, battery estimate, controls and log share a deterministic TypeScript reducer. No prerecorded completion animation.' },
          { label: '02 / SAFETY', title: 'Latched E-stop', text: 'Emergency stop inhibits simulated motion. Releasing the latch or clearing a fault never auto-resumes a job.' },
          { label: '03 / NEXT INTEGRATION', title: 'ROS 2 adapter contract', text: 'Future adapter can subscribe to real telemetry and send commands through a secured bridge. This demo does not connect to ROS 2.' },
        ].map((note) => <div key={note.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="font-mono text-[10px] font-bold tracking-[.12em] text-brand-blue">{note.label}</p><h3 className="mt-2 text-sm font-bold text-brand-navy">{note.title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-600">{note.text}</p></div>)}
      </section>
      <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Evidence boundary:</strong> This is a simulation-tested browser interface and an illustrative warehouse layout. Route travel is a simple waypoint kinematic model; the UI is not evidence of physical collision safety, battery calibration, networking or a working ROS 2 connection.</span><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 opacity-40" /></p>
    </div>
  );
}
