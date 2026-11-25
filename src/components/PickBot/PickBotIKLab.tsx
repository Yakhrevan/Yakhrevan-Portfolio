import { useRef, type PointerEvent } from 'react';
import { AlertTriangle, CheckCircle2, Crosshair, Hand, Move, RotateCcw } from 'lucide-react';
import { ARM, armPoints, distance3, toolTip, type IKResult, type Position3 } from './kinematics';
import type { PickBotControls } from './demo';

const SIZE = 360;
const CENTRE = SIZE / 2;
const SCALE = 255;
const svgX = (z: number) => CENTRE - z * SCALE;
const svgY = (x: number) => CENTRE - x * SCALE;
const asMm = (v: number) => `${Math.round(v * 1000)} mm`;

interface Props {
  target: Position3;
  controls: PickBotControls;
  solution: IKResult;
  attached: boolean;
  notice: string;
  onTarget: (position: Position3) => void;
  onReset: () => void;
  onGrasp: () => void;
  onRelease: () => void;
  onLift: () => void;
  onLower: () => void;
  onDropBay: () => void;
}

export function PickBotIKLab({ target, controls, solution, attached, notice, onTarget, onReset, onGrasp, onRelease, onLift, onLower, onDropBay }: Props) {
  const drag = useRef(false);
  const joints = armPoints(controls);
  const tip = toolTip(controls);
  const contact = distance3(tip, target) <= ARM.contactTolerance;
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mappedX = (event.clientX - rect.left) / rect.width * SIZE;
    const mappedY = (event.clientY - rect.top) / rect.height * SIZE;
    const x = Math.max(-0.63, Math.min(0.63, (CENTRE - mappedY) / SCALE));
    const z = Math.max(-0.63, Math.min(0.63, (CENTRE - mappedX) / SCALE));
    onTarget({ x, y: target.y, z });
  };
  const startDrag = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  };
  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div id="pickbot-panel-ik" role="tabpanel" aria-labelledby="pickbot-tab-ik" className="flex-1 space-y-4 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-extrabold text-brand-navy">IK target workspace</h3>
        <p className="mt-1 text-xs leading-relaxed text-brand-slate">Drag the orange object to move its 3D target. J1–J4 angles solve automatically from the calibrated concept model.</p>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-[#102034] border border-slate-600">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full aspect-square cursor-crosshair touch-none select-none"
          aria-label="Top-view drag workspace: front is up, robot left is on screen left. Drag the orange object to set the target."
          role="img"
          onPointerDown={startDrag}
          onPointerMove={(event) => { if (drag.current) updateFromPointer(event); }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            <pattern id="pickbot-ik-grid" width="25.5" height="25.5" patternUnits="userSpaceOnUse"><path d="M25.5 0H0V25.5" fill="none" stroke="#34516c" strokeWidth="0.7" /></pattern>
          </defs>
          <rect width={SIZE} height={SIZE} fill="url(#pickbot-ik-grid)" />
          <circle cx={CENTRE} cy={CENTRE} r={0.51 * SCALE} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="7 6" opacity="0.45" />
          <circle cx={CENTRE} cy={CENTRE} r={0.18 * SCALE} fill="#f59e0b" fillOpacity="0.055" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 7" opacity="0.65" />
          <rect x={CENTRE - 0.226 * SCALE} y={CENTRE - 0.221 * SCALE} width={0.452 * SCALE} height={0.442 * SCALE} rx="11" fill="#304761" stroke="#62839a" strokeWidth="2" />
          {[-1, 1].flatMap((side) => [-1, 1].map((end) => <rect key={`${side}-${end}`} x={CENTRE + side * 0.226 * SCALE - 7} y={CENTRE + end * 0.221 * SCALE - 16} width="14" height="32" rx="5" fill="#141d2c" stroke="#8094aa" strokeWidth="2" />))}
          <text x={CENTRE} y={CENTRE - 9} textAnchor="middle" fontSize="11" fontWeight="700" fill="#b7d8e8">PICKBOT</text>
          <text x={CENTRE} y={CENTRE + 8} textAnchor="middle" fontSize="9" fill="#88aac1">4 × MECANUM</text>
          <line x1={CENTRE} x2={CENTRE} y1="15" y2="37" stroke="#7fe0ef" strokeWidth="2" />
          <path d={`M${CENTRE - 5} 23L${CENTRE} 14L${CENTRE + 5} 23`} fill="none" stroke="#7fe0ef" strokeWidth="2" />
          <text x={CENTRE + 14} y="25" fontSize="10" fill="#8ab8ca">+X FRONT</text>
          <polyline points={joints.map((point) => `${svgX(point.z)},${svgY(point.x)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.86" />
          <line x1={svgX(tip.z)} y1={svgY(tip.x)} x2={svgX(target.z)} y2={svgY(target.x)} stroke={contact ? '#6ee7b7' : '#fb7185'} strokeWidth="2" strokeDasharray="5 5" />
          {joints.map((point, index) => <circle key={index} cx={svgX(point.z)} cy={svgY(point.x)} r={index === 3 ? 6 : 4} fill="#bae6fd" stroke="#134060" strokeWidth="2" />)}
          <circle cx={svgX(target.z)} cy={svgY(target.x)} r="18" fill={solution.ok ? '#fb923c' : '#f87171'} fillOpacity="0.18" stroke={solution.ok ? '#fdba74' : '#fca5a5'} strokeWidth="2" />
          <rect x={svgX(target.z) - 8} y={svgY(target.x) - 8} width="16" height="16" rx="3" fill={solution.ok ? '#fb923c' : '#f87171'} stroke="#ffedd5" strokeWidth="1.5" />
          <path d={`M${svgX(target.z) - 26} ${svgY(target.x)}h10 M${svgX(target.z) + 16} ${svgY(target.x)}h10 M${svgX(target.z)} ${svgY(target.x) - 26}v10 M${svgX(target.z)} ${svgY(target.x) + 16}v10`} stroke="#fdba74" strokeWidth="1.5" />
        </svg>
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-brand-navy/85 px-2 py-1 font-mono text-[10px] text-sky-200"><Crosshair className="mr-1 inline h-3 w-3" />DRAG TARGET · TOP VIEW</div>
        {attached && <div className="absolute right-2 top-2 rounded-md bg-emerald-400/15 px-2 py-1 font-mono text-[10px] font-bold text-emerald-200 border border-emerald-400/30">PAYLOAD ATTACHED</div>}
      </div>
      <div className={`flex items-start gap-2 rounded-xl border px-3 py-3 text-[11px] leading-relaxed ${solution.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-800'}`} role="status" aria-live="polite">
        {solution.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
        <span>{solution.ok ? `Target reachable · tool error ${asMm(solution.error)} · ${contact ? 'contact aligned' : 'move target to align'}.` : solution.reason}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center">
        <div><p className="text-[10px] font-semibold text-slate-500">X FORWARD</p><p className="mt-1 font-mono text-xs font-bold text-brand-navy">{asMm(target.x)}</p></div>
        <div><p className="text-[10px] font-semibold text-slate-500">Z LATERAL</p><p className="mt-1 font-mono text-xs font-bold text-brand-navy">{asMm(target.z)}</p></div>
        <div><p className="text-[10px] font-semibold text-slate-500">Y HEIGHT</p><p className="mt-1 font-mono text-xs font-bold text-brand-navy">{asMm(target.y)}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={attached ? onRelease : onGrasp} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold text-white ${attached ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-blue hover:bg-brand-navy'}`}><Hand className="h-4 w-4" />{attached ? 'Release at contact' : 'Close & grasp'}</button>
        <button type="button" onClick={onReset} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-brand-slate hover:border-brand-blue"><RotateCcw className="h-4 w-4" />Reset target</button>
        <button type="button" disabled={!attached} onClick={onLift} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-xs font-bold text-brand-blue disabled:cursor-not-allowed disabled:opacity-40">Lift +120 mm</button>
        <button type="button" disabled={!attached} onClick={onDropBay} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-xs font-bold text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"><Move className="mr-1 inline h-4 w-4" />Move to drop bay</button>
        <button type="button" disabled={!attached} onClick={onLower} className="col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-brand-slate disabled:cursor-not-allowed disabled:opacity-40">Lower onto support plane</button>
      </div>
      <p className="min-h-9 text-xs leading-relaxed text-brand-slate" aria-live="polite">{notice}</p>
      <p className="text-[11px] leading-relaxed text-slate-500">Simulation uses exact V3 GLB joint origins; limits and chassis envelope are illustrative. Dragging tests reachability; attachment happens only after the virtual fingers close *and* the tool contacts the target.</p>
    </div>
  );
}
