import { ArrowUpRight, CheckCircle2, CircleDashed, Cpu, Layers3, Move3D, Route, Wrench } from 'lucide-react';

const evidence = [
  {
    title: 'Arm CAD',
    status: 'Source geometry',
    detail: 'Supplied shoulder, elbow and wrist STL components are retained in the visualization.',
    confirmed: true,
  },
  {
    title: 'Rover layout',
    status: 'Concept assembly',
    detail: 'Four mecanum wheels and chassis illustrate the intended architecture; dimensions are not measured CAD.',
    confirmed: false,
  },
  {
    title: 'Tool path & grasp',
    status: 'CAD-aligned visual demo',
    detail: 'The virtual block and two raised stations align with forward-kinematic tool-tip positions calculated from the concept GLB. Four joints and the gripper remain user-controllable.',
    confirmed: true,
  },
  {
    title: 'Physical performance',
    status: 'Not validated here',
    detail: 'Torque, payload, repeatability, motor wiring and physical joint limits need real robot tests.',
    confirmed: false,
  },
];

const nextChecks = [
  'Confirm all four wheel roller orientations and motor direction mapping on the real rover.',
  'Measure joint limits, homing offsets and clearances from the mechanical assembly.',
  'Test gripper closing force, object retention and repeatable release with hardware.',
  'Validate controller-to-actuator commands and record an actual pick-and-place trial.',
];

function DiagramCard({ eyebrow, heading, detail, icon: Icon, dark = false }: {
  eyebrow: string;
  heading: string;
  detail: string;
  icon: typeof Cpu;
  dark?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${dark ? 'border-brand-blue/30 bg-brand-navy text-white' : 'border-slate-200 bg-white text-brand-navy'}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-brand-sky' : 'text-slate-400'}`}>{eyebrow}</span>
        <Icon className={`h-5 w-5 ${dark ? 'text-brand-sky' : 'text-brand-blue'}`} aria-hidden="true" />
      </div>
      <h4 className="text-base font-extrabold">{heading}</h4>
      <p className={`mt-2 text-xs leading-relaxed ${dark ? 'text-white/65' : 'text-brand-slate'}`}>{detail}</p>
    </div>
  );
}

export function PickBotCaseStudy() {
  return (
    <section aria-labelledby="pickbot-case-study-title" className="mt-20 space-y-12">
      <div className="rounded-3xl border border-slate-200 bg-[#f4f8fc] p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-blue px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">Engineering case study</span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-slate">Design · CAD · Simulation</span>
        </div>
        <h2 id="pickbot-case-study-title" className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          One mobile platform. Two kinds of motion.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-brand-slate sm:text-base">
          PickBot explores a four-mecanum-wheel base paired with a four-joint pick-and-place arm. My mechanical CAD work informed the arm; this portfolio combines those supplied parts with an illustrative rover assembly and software-driven motion demos. Physical performance has not been established by the web simulation.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="font-mono text-3xl font-black text-brand-blue">04</p>
            <p className="mt-1 text-xs font-bold text-brand-navy">Mecanum drive wheels</p>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="font-mono text-3xl font-black text-brand-blue">04</p>
            <p className="mt-1 text-xs font-bold text-brand-navy">Articulated arm joints</p>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="font-mono text-3xl font-black text-brand-blue">01</p>
            <p className="mt-1 text-xs font-bold text-brand-navy">Separate gripper function</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-blue">System concept</p>
            <h3 className="mt-2 text-2xl font-extrabold text-brand-navy">Command architecture</h3>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">Browser simulation — not a hardware control diagram</span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_32px_1fr_32px_1fr] lg:items-center">
          <DiagramCard icon={Move3D} eyebrow="01 · Input" heading="Operator interface" detail="Manual J1–J4 sliders, gripper opening, drive mode selection and a timed demo." />
          <ArrowUpRight className="mx-auto hidden h-5 w-5 rotate-45 text-brand-blue lg:block" aria-hidden="true" />
          <DiagramCard icon={Cpu} eyebrow="02 · Simulation" heading="Pose & wheel commands" detail="Interpolated poses with GLB-aligned pickup/drop contact points and an X-roller wheel matrix; no physics solver or IK." dark />
          <ArrowUpRight className="mx-auto hidden h-5 w-5 rotate-45 text-brand-blue lg:block" aria-hidden="true" />
          <div className="grid gap-3">
            <DiagramCard icon={Route} eyebrow="03a · Locomotion" heading="FL · FR · RL · RR" detail="Four independent mecanum wheel pivots." />
            <DiagramCard icon={Wrench} eyebrow="03b · Manipulator" heading="J1 · J2 · J3 · J4" detail="Four arm joints and a separate gripper." />
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">The display arm cannot reach a floor-level object outside its base at the modeled dimensions, so this demo uses raised pickup/drop stations. The real embedded controller, actuator interfaces, wiring, joint limits, calibration and feedback loop remain outside this browser model and require hardware evidence.</p>
      </div>

      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-blue">Evidence ledger</p>
        <h3 className="mt-2 text-2xl font-extrabold text-brand-navy">What's original, illustrative or still untested?</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {evidence.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-extrabold text-brand-navy">{item.title}</h4>
                {item.confirmed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" /> : <CircleDashed className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />}
              </div>
              <span className="mt-2 inline-block rounded-lg bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-brand-slate">{item.status}</span>
              <p className="mt-3 text-sm leading-relaxed text-brand-slate">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 rounded-3xl bg-brand-navy p-7 text-white sm:p-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Layers3 className="h-7 w-7 text-brand-sky" aria-hidden="true" />
          <h3 className="mt-5 text-2xl font-extrabold">The next engineering milestones</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            The simulation is a communication and interaction prototype, not proof of robotic accuracy. Here are the physical checks needed before publishing hardware performance claims.
          </p>
          <a href="#pickbot-interactive-title" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-sky underline-offset-4 hover:underline">
            Explore the simulation <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <ol className="space-y-4">
          {nextChecks.map((check, index) => (
            <li key={check} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-bold text-brand-sky">{index + 1}</span>
              <span>{check}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
