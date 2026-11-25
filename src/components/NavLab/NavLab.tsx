import { useEffect, useMemo, useReducer, type MouseEvent } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, CircleDot, Crosshair, Gauge, MapPin,
  MousePointer2, Pause, Play, Radar, RotateCcw, Route, ShieldAlert, Terminal,
} from 'lucide-react';
import {
  GRID_HEIGHT, GRID_WIDTH, LIDAR_BEAMS, LIDAR_MAX_RANGE, STEP_SECONDS,
  WHEEL_BASE, WHEEL_RADIUS, createInitialState, distance, navigationReducer,
  routeLength, simulateScan, type LabStatus, type Scenario,
} from './navigationCore';

const CELL = 40;
const px = (coordinate: number) => coordinate * CELL;
const format = (value: number, digits = 2) => value.toFixed(digits);

const scenarios: { value: Scenario; label: string; subtitle: string }[] = [
  { value: 'warehouse', label: 'Warehouse', subtitle: 'Shelf rows + cross-aisles' },
  { value: 'aisles', label: 'Narrow aisles', subtitle: 'Long corridors + detours' },
  { value: 'open', label: 'Open arena', subtitle: 'Scattered obstacles' },
];

const statusText: Record<LabStatus, string> = {
  ready: 'ROUTE READY',
  navigating: 'NAVIGATING',
  paused: 'MISSION PAUSED',
  reached: 'GOAL REACHED',
  blocked: 'PATH BLOCKED',
  estop: 'EMERGENCY STOP',
};

const statusColor: Record<LabStatus, string> = {
  ready: 'text-sky-300 bg-sky-400/10 border-sky-400/20',
  navigating: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
  paused: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  reached: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
  blocked: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
  estop: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
};

function SmallStat({ label, value, unit, highlight = false }: {
  label: string; value: string; unit?: string; highlight?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3.5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold">{label}</p>
      <p className={`mt-1.5 font-mono text-xl font-bold tabular-nums sm:text-2xl ${highlight ? 'text-cyan-300' : 'text-white'}`}>
        {value}<span className="ml-1 text-[10px] font-medium text-slate-400">{unit}</span>
      </p>
    </div>
  );
}

export function NavLab() {
  const [state, dispatch] = useReducer(navigationReducer, undefined, () => createInitialState());

  useEffect(() => {
    if (state.status !== 'navigating') return;
    const timer = window.setInterval(() => dispatch({ type: 'tick' }), STEP_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [state.status]);

  const scan = useMemo(() => simulateScan(state.robot, state.obstacles), [state.robot, state.obstacles]);
  const remaining = distance(state.robot, state.goal);
  const pathDistance = routeLength(state.robot, state.route);
  const nearest = Math.min(...scan.map((beam) => beam.distance));
  const leftWheel = (state.command.linear - state.command.angular * WHEEL_BASE / 2) / WHEEL_RADIUS;
  const rightWheel = (state.command.linear + state.command.angular * WHEEL_BASE / 2) / WHEEL_RADIUS;
  const linePath = [{ x: state.robot.x, y: state.robot.y }, ...state.route]
    .map((point) => `${px(point.x)},${px(point.y)}`).join(' ');
  const isRunning = state.status === 'navigating';
  const canStart = state.status === 'ready' || state.status === 'paused';

  function handleMapClick(event: MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * GRID_WIDTH);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * GRID_HEIGHT);
    dispatch({ type: 'map-click', cellX: x, cellY: y });
  }

  return (
    <div className="mt-12 sm:mt-16 space-y-5" id="navigation-lab">
      <section className="rounded-[28px] overflow-hidden bg-[#0b1527] border border-[#172e47] shadow-2xl shadow-slate-900/15 text-slate-100">
        <div className="relative border-b border-white/10 px-5 py-6 md:px-7 md:py-7 overflow-hidden">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="rounded-md bg-orange-400/15 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] uppercase text-orange-300">P6 / Simulation</span>
                <span className="rounded-md border border-white/10 px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase text-slate-400">No physical robot connection</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Autonomous Navigation Lab</h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                Plan a goal, drive a differential robot, inspect 360° LiDAR, and intervene when an obstacle appears.
                Every movement is produced by a collision-aware controller — not a prerecorded animation.
              </p>
            </div>
            <div className={`self-start rounded-full border px-3 py-2 flex items-center gap-2 text-[11px] font-bold tracking-wide ${statusColor[state.status]}`} role="status" aria-live="polite">
              <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-300 animate-pulse' : state.status === 'estop' || state.status === 'blocked' ? 'bg-rose-300' : 'bg-current'}`} />
              {statusText[state.status]}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_272px]">
          <div className="min-w-0 border-b border-white/10 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Radar className="h-4 w-4 text-cyan-300" /> LIVE LOCAL MAP
                <span className="text-[10px] font-mono text-slate-500">24 × 16 m</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-cyan-400" /> Route</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-orange-400" /> Robot</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Goal</span>
              </div>
            </div>
            <div className="relative bg-[#0a1728] p-2 sm:p-4">
              <div className="relative overflow-hidden rounded-xl border border-[#254057]">
                <svg
                  viewBox={`0 0 ${px(GRID_WIDTH)} ${px(GRID_HEIGHT)}`}
                  className="aspect-[3/2] w-full cursor-crosshair select-none touch-manipulation"
                  onClick={handleMapClick}
                  role="img"
                  aria-label={`Interactive navigation map. ${state.interactionMode === 'goal' ? 'Click a free cell to set the robot goal.' : 'Click a cell to add or remove an obstacle.'}`}
                >
                  <rect width={px(GRID_WIDTH)} height={px(GRID_HEIGHT)} fill="#0d2032" />
                  {Array.from({ length: GRID_WIDTH + 1 }, (_, x) => <line key={`v${x}`} x1={px(x)} y1="0" x2={px(x)} y2={px(GRID_HEIGHT)} stroke="#233a4e" strokeWidth="0.7" />)}
                  {Array.from({ length: GRID_HEIGHT + 1 }, (_, y) => <line key={`h${y}`} x1="0" y1={px(y)} x2={px(GRID_WIDTH)} y2={px(y)} stroke="#233a4e" strokeWidth="0.7" />)}
                  {Array.from(state.obstacles, (cell) => {
                    const [x, y] = cell.split(',').map(Number);
                    return <rect key={cell} x={px(x) + 1} y={px(y) + 1} width={CELL - 2} height={CELL - 2} rx="3" fill="#29465c" stroke="#47677d" strokeWidth="1.5" />;
                  })}
                  {state.route.length > 0 && <>
                    <polyline points={linePath} fill="none" stroke="#00d4f5" strokeWidth="10" strokeOpacity="0.12" strokeLinejoin="round" strokeLinecap="round" />
                    <polyline points={linePath} fill="none" stroke="#33d9f6" strokeWidth="3.3" strokeOpacity="0.9" strokeDasharray="11 9" strokeLinejoin="round" strokeLinecap="round" />
                    {state.route.map((point, index) => index % 3 === 0 && <circle key={`waypoint-${index}`} cx={px(point.x)} cy={px(point.y)} r="3" fill="#9ceef9" />)}
                  </>}
                  {scan.map((beam, index) => <line key={`ray-${index}`} x1={px(state.robot.x)} y1={px(state.robot.y)} x2={px(beam.x)} y2={px(beam.y)} stroke="#5de3dc" strokeOpacity="0.16" strokeWidth="1.4" />)}
                  {scan.filter((beam) => beam.hit).map((beam, index) => <circle key={`return-${index}`} cx={px(beam.x)} cy={px(beam.y)} r="2" fill="#64e9ce" opacity="0.76" />)}
                  <circle cx={px(state.goal.x)} cy={px(state.goal.y)} r="14" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="2" />
                  <circle cx={px(state.goal.x)} cy={px(state.goal.y)} r="4" fill="#6ee7b7" />
                  <path d={`M ${px(state.goal.x) - 20} ${px(state.goal.y)} h 8 M ${px(state.goal.x) + 12} ${px(state.goal.y)} h 8 M ${px(state.goal.x)} ${px(state.goal.y) - 20} v 8 M ${px(state.goal.x)} ${px(state.goal.y) + 12} v 8`} stroke="#34d399" strokeWidth="2" />
                  <g transform={`translate(${px(state.robot.x)} ${px(state.robot.y)}) rotate(${state.robot.theta * 180 / Math.PI})`}>
                    <circle r="20" fill="#fb923c" fillOpacity="0.18" stroke="#fb923c" strokeOpacity="0.5" strokeWidth="1.5" />
                    <rect x="-11" y="-12" width="22" height="24" rx="5" fill="#fb923c" stroke="#ffe2b8" strokeWidth="2" />
                    <path d="M 4 -6 L 16 0 L 4 6 Z" fill="#fff7ed" />
                    <rect x="-12" y="-17" width="5" height="9" rx="2" fill="#0e1726" stroke="#fb923c" />
                    <rect x="-12" y="8" width="5" height="9" rx="2" fill="#0e1726" stroke="#fb923c" />
                  </g>
                  {Array.from({ length: GRID_WIDTH }, (_, x) => x % 4 === 2 && <text key={`x-${x}`} x={px(x + 0.5)} y={px(GRID_HEIGHT) - 9} fontSize="10" textAnchor="middle" fill="#7c9bb0">{x}m</text>)}
                </svg>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-[#091624]/90 px-3 py-1.5 text-[10px] font-mono text-cyan-300 border border-cyan-300/20 pointer-events-none">
                  <Crosshair className="h-3 w-3" /> {state.interactionMode === 'goal' ? 'CLICK TO SET GOAL' : 'CLICK TO EDIT OBSTACLES'}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                <span className="mr-1 font-bold uppercase tracking-wider text-slate-500">Quick goals</span>
                {[
                  { label: 'Dock', x: 21, y: 13 },
                  { label: 'North bay', x: 20, y: 2 },
                  { label: 'West bay', x: 3, y: 12 },
                ].map((preset) => <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'set-mode', mode: 'goal' });
                    dispatch({ type: 'map-click', cellX: preset.x, cellY: preset.y });
                  }}
                  className="rounded-full border border-cyan-300/25 bg-cyan-300/5 px-3 py-1.5 font-semibold text-cyan-200 hover:bg-cyan-300/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                >{preset.label}</button>)}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">Grid: 1 m / cell · LiDAR: {LIDAR_BEAMS} beams, {format(LIDAR_MAX_RANGE, 1)} m max · Footprint-aware A* · Differential-drive kinematics</p>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-4 sm:grid-cols-4 md:p-5">
              <SmallStat label="Goal distance" value={format(remaining)} unit="m" highlight />
              <SmallStat label="Route length" value={format(pathDistance, 1)} unit="m" />
              <SmallStat label="Travelled" value={format(state.distanceTraveled, 1)} unit="m" />
              <SmallStat label="Sim time" value={format(state.simulationTime, 1)} unit="s" />
            </div>
          </div>

          <aside className="p-5 space-y-6 bg-[#101d31]">
            <div>
              <label htmlFor="nav-scenario" className="text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400">Environment</label>
              <select
                id="nav-scenario"
                value={state.scenario}
                onChange={(event) => dispatch({ type: 'set-scenario', scenario: event.target.value as Scenario })}
                className="mt-2 w-full rounded-xl border border-slate-600 bg-[#192a40] px-3 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-300"
              >
                {scenarios.map((scenario) => <option key={scenario.value} value={scenario.value}>{scenario.label}</option>)}
              </select>
              <p className="mt-2 text-[11px] text-slate-500">{scenarios.find((scenario) => scenario.value === state.scenario)?.subtitle}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400">Map interaction</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => dispatch({ type: 'set-mode', mode: 'goal' })} aria-pressed={state.interactionMode === 'goal'} className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-bold transition-colors ${state.interactionMode === 'goal' ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200' : 'border-slate-600 text-slate-400 hover:bg-white/5'}`}><MapPin className="h-4 w-4" /> Set goal</button>
                <button onClick={() => dispatch({ type: 'set-mode', mode: 'obstacle' })} aria-pressed={state.interactionMode === 'obstacle'} className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-bold transition-colors ${state.interactionMode === 'obstacle' ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200' : 'border-slate-600 text-slate-400 hover:bg-white/5'}`}><MousePointer2 className="h-4 w-4" /> Obstacles</button>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400">Mission controls</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => dispatch({ type: isRunning ? 'pause' : 'start' })}
                  disabled={!isRunning && !canStart}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-extrabold text-[#092034] hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >{isRunning ? <><Pause className="h-4 w-4" /> Pause mission</> : <><Play className="h-4 w-4" /> Run mission</>}</button>
                <button onClick={() => dispatch({ type: 'reset' })} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-[11px] font-bold text-white hover:bg-white/10"><RotateCcw className="h-4 w-4" /> Reset</button>
                {state.status === 'estop' ?
                  <button onClick={() => dispatch({ type: 'release-stop' })} className="flex items-center justify-center gap-1 rounded-xl bg-amber-500/20 border border-amber-400/40 px-2 py-3 text-[11px] font-bold text-amber-200">Release stop</button> :
                  <button onClick={() => dispatch({ type: 'emergency-stop' })} className="flex items-center justify-center gap-1 rounded-xl bg-rose-500/20 border border-rose-400/40 px-2 py-3 text-[11px] font-bold text-rose-200 hover:bg-rose-500/30"><ShieldAlert className="h-4 w-4" /> E-stop</button>
                }
              </div>
              <p className="mt-2 flex gap-1.5 text-[11px] leading-relaxed text-slate-500"><AlertTriangle className="h-3.5 w-3.5 shrink-0" /> E-stop here only affects this browser simulation.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 space-y-2.5">
              <p className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400"><Gauge className="h-4 w-4 text-cyan-300" /> Drive telemetry</p>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Linear</span><span className="font-mono text-white">{format(state.command.linear)} m/s</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Angular</span><span className="font-mono text-white">{format(state.command.angular)} rad/s</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Nearest obstacle</span><span className="font-mono text-white">{format(nearest)} m</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Route revisions</span><span className="font-mono text-white">{state.routeRevisions}</span></div>
            </div>
          </aside>
        </div>

        <div className="grid gap-0 border-t border-white/10 lg:grid-cols-2">
          <div className="px-5 py-5 lg:border-r border-white/10 md:px-7">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-200"><Activity className="h-4 w-4 text-emerald-300" /> ROS 2 topic analogues <span className="ml-auto text-[10px] font-normal text-orange-300">SIMULATED DATA</span></p>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-white/5 px-3 py-2"><span className="text-cyan-300">/odom</span><span className="text-slate-300">x {format(state.robot.x)} · y {format(state.robot.y)} · θ {format(state.robot.theta)}</span></div>
              <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-white/5 px-3 py-2"><span className="text-cyan-300">/cmd_vel</span><span className="text-slate-300">v {format(state.command.linear)} · ω {format(state.command.angular)}</span></div>
              <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-white/5 px-3 py-2"><span className="text-cyan-300">/scan</span><span className="text-slate-300">{scan.length} beams · min {format(nearest)} m</span></div>
              <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-white/5 px-3 py-2"><span className="text-cyan-300">/wheel_states</span><span className="text-slate-300">L {format(leftWheel)} · R {format(rightWheel)} rad/s</span></div>
              <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-white/5 px-3 py-2"><span className="text-cyan-300">/plan</span><span className="text-slate-300">{state.route.length} remaining waypoints</span></div>
            </div>
          </div>
          <div className="px-5 py-5 md:px-7">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-200"><Terminal className="h-4 w-4 text-orange-300" /> Mission event log <span className="ml-auto font-mono text-[10px] font-normal text-slate-500">LOCAL ENGINE</span></p>
            <div className="min-h-[172px] space-y-2 rounded-xl bg-[#07111e] p-4 font-mono text-[11px] text-slate-400" aria-live="polite">
              {state.events.map((event, index) => <p key={`${event}-${index}`}><span className="mr-2 text-emerald-400">›</span>{event}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Simulation engineering notes">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><Route className="h-4 w-4 text-brand-blue" /> 01 / Planner</div>
          <p className="text-xs leading-relaxed text-brand-slate">A* searches collision-free grid cells with an 8-connected heuristic, diagonal corner-cutting checks, and a footprint-aware obstacle test.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><CircleDot className="h-4 w-4 text-brand-blue" /> 02 / Controller</div>
          <p className="text-xs leading-relaxed text-brand-slate">Heading feedback generates v/ω velocity commands, integrates differential-drive pose, and rejects steps that intersect obstacles.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-brand-navy"><CheckCircle2 className="h-4 w-4 text-brand-blue" /> 03 / Safety</div>
          <p className="text-xs leading-relaxed text-brand-slate">Obstacle edits trigger replanning; unreachable goals block motion; E-stop drives simulated command velocity to zero until manually released.</p>
        </article>
      </section>
      <div className="rounded-2xl bg-sky-50 border border-sky-200 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <strong className="text-brand-navy">Engineering scope:</strong> This is a standalone, deterministic TypeScript simulation illustrating ROS 2 concepts. It does not run ROS 2, Nav2, SLAM Toolbox, Gazebo, or a real LiDAR device. It uses a pre-defined occupancy map, simulated range returns, A* planning and a local differential-drive controller; hardware and ROS 2 integration are future validation steps.
      </div>
    </div>
  );
}
