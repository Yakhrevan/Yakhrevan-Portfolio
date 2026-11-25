import { useRef, type PointerEvent } from 'react';
import { Move, Pause, RotateCcw } from 'lucide-react';
import { DRIVE_CHOICES, type DriveMode } from './demo';
import { MECANUM, mecanumWheelRpm, type DrivePose, type Twist2 } from './kinematics';

const WHEEL_NAMES = ['FL', 'FR', 'RL', 'RR'] as const;
const MAX = MECANUM.maxLinear;
const coord = (value: number) => Math.round(value * 100) / 100;

interface Props {
  command: Twist2;
  pose: DrivePose;
  trail: DrivePose[];
  activePreset: DriveMode;
  onCommand: (command: Twist2) => void;
  onPreset: (mode: DriveMode) => void;
  onStop: () => void;
  onReset: () => void;
}

export function PickBotMecanumLab({ command, pose, trail, activePreset, onCommand, onPreset, onStop, onReset }: Props) {
  const dragging = useRef(false);
  const rpm = mecanumWheelRpm(command);
  const dragCommand = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const magnitude = Math.max(1, Math.hypot(dx, dy));
    onCommand({ vx: coord(-dy / magnitude * MAX), vy: coord(-dx / magnitude * MAX), omega: command.omega });
  };
  const stopJoystick = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    onCommand({ vx: 0, vy: 0, omega: command.omega });
  };
  const normalizedX = -command.vy / MAX;
  const normalizedY = -command.vx / MAX;
  const points = trail.length ? trail : [pose];
  const extent = Math.max(0.9, ...points.map((point) => Math.max(Math.abs(point.x), Math.abs(point.y))), Math.abs(pose.x), Math.abs(pose.y));
  const mapScale = 73 / extent;
  const showX = (x: number) => 160 + x * mapScale;
  const showY = (y: number) => 90 - y * mapScale;

  return (
    <div id="pickbot-panel-drive" role="tabpanel" aria-labelledby="pickbot-tab-drive" className="flex-1 space-y-4 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-extrabold text-brand-navy">Mecanum velocity control</h3>
        <p className="mt-1 text-xs leading-relaxed text-brand-slate">+X forward, +Y left, +Z yaw. Hold joystick to drive; release to stop translation. The path below integrates commanded body-frame motion.</p>
      </div>
      <div className="mx-auto max-w-[238px]">
        <div
          role="img"
          aria-label="Two-axis simulated drive joystick. Pointer up commands positive X; pointer left commands positive Y."
          className="relative aspect-square cursor-crosshair touch-none select-none overflow-hidden rounded-full border-2 border-sky-300/60 bg-[#102b44] shadow-inner"
          onPointerDown={(event) => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); dragCommand(event); }}
          onPointerMove={(event) => { if (dragging.current) dragCommand(event); }}
          onPointerUp={stopJoystick}
          onPointerCancel={stopJoystick}
        >
          <div className="absolute inset-5 rounded-full border border-sky-300/20" />
          <div className="absolute inset-[27%] rounded-full border border-dashed border-sky-200/20" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-sky-300/20" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-sky-300/20" />
          <span className="absolute left-1/2 top-3 -translate-x-1/2 font-mono text-[10px] text-sky-200">+X</span>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-sky-200">+Y</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-sky-200">−Y</span>
          <div className="absolute h-14 w-14 rounded-full border-2 border-orange-200 bg-orange-400 shadow-lg shadow-orange-400/30 transition-[left,top] duration-75" style={{ left: `calc(50% + ${normalizedX * 34}% - 28px)`, top: `calc(50% + ${normalizedY * 34}% - 28px)` }} />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-brand-slate"><span>vx {command.vx.toFixed(2)} m/s</span><span>vy {command.vy.toFixed(2)} m/s</span></div>
      </div>
      <div>
        <label htmlFor="pickbot-v6-yaw" className="mb-2 flex justify-between gap-2 text-xs font-semibold text-brand-slate"><span>Yaw rate · angular.z</span><output className="font-mono text-brand-blue">{command.omega.toFixed(2)} rad/s</output></label>
        <input id="pickbot-v6-yaw" type="range" min={-MECANUM.maxAngular} max={MECANUM.maxAngular} step="0.05" value={command.omega} onChange={(event) => onCommand({ ...command, omega: Number(event.target.value) })} className="h-2 w-full cursor-pointer accent-brand-blue" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DRIVE_CHOICES.map(({ mode, label }) => <button key={mode} type="button" aria-pressed={activePreset === mode} onClick={() => onPreset(mode)} className={`rounded-xl border px-1.5 py-2.5 text-[10px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${activePreset === mode ? 'border-brand-blue bg-brand-blue text-white' : 'border-slate-200 bg-white text-brand-slate hover:border-brand-blue'}`}>{label}</button>)}
      </div>
      <div className="grid grid-cols-4 gap-2 rounded-xl border border-slate-200 bg-white p-3">
        {rpm.map((speed, i) => <div key={i} className="text-center" aria-label={`${WHEEL_NAMES[i]} wheel ${speed.toFixed(1)} revolutions per minute`}>
          <p className="font-mono text-[10px] font-bold text-slate-500">{WHEEL_NAMES[i]}</p>
          <p className={`mt-1 font-mono text-sm font-extrabold ${speed < -0.01 ? 'text-orange-600' : 'text-brand-blue'}`}>{speed >= 0 ? '+' : ''}{speed.toFixed(1)}</p>
        </div>)}
        <p className="col-span-4 pt-1 text-center font-mono text-[10px] text-slate-500">CALCULATED WHEEL RPM · FL / FR / RL / RR</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-[#102034] p-3">
        <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-sky-200"><span><Move className="mr-1 inline h-3 w-3" />Trajectory · odometry</span><span className="font-mono text-slate-400">{trail.length} samples</span></div>
        <svg viewBox="0 0 320 180" className="w-full aspect-[16/9]" role="img" aria-label="Simulated X/Y path with robot heading">
          <rect width="320" height="180" fill="#0c1a2b" rx="8" />
          <path d="M0 90H320M160 0V180" stroke="#385872" strokeDasharray="3 5" strokeWidth="1" />
          <polyline points={points.map((point) => `${showX(point.x)},${showY(point.y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="160" cy="90" r="3" fill="#94a3b8" />
          <g transform={`translate(${showX(pose.x)} ${showY(pose.y)}) rotate(${-pose.theta * 180 / Math.PI})`}><circle r="7" fill="#fb923c" stroke="#fdba74" strokeWidth="2" /><path d="M8 0L0 -4L0 4Z" fill="white" /></g>
          <text x="12" y="17" fontSize="10" fill="#a3c7d7">X {pose.x.toFixed(2)} m · Y {pose.y.toFixed(2)} m</text>
          <text x="12" y="168" fontSize="10" fill="#7d9db2">θ {(pose.theta * 180 / Math.PI).toFixed(0)}° · dynamic scale</text>
        </svg>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onStop} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy px-3 py-3 text-xs font-bold text-white hover:bg-brand-blue"><Pause className="h-4 w-4" />Stop command</button>
        <button type="button" onClick={onReset} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-brand-slate hover:border-brand-blue"><RotateCcw className="h-4 w-4" />Clear path</button>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-500">Simulated open-loop odometry only; wheel radius 91 mm and wheel offsets 221/226 mm are sourced from the concept GLB, not calibrated encoder measurements. ROS 2 controller alignment: linear.x/y (m/s), angular.z (rad/s). No hardware commands are transmitted.</p>
    </div>
  );
}
