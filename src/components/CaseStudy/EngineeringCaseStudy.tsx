import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, CircleHelp, Cpu, ExternalLink, FlaskConical, Layers3, ShieldCheck, Wrench } from 'lucide-react';

type CaseStudyId = 'pickbot' | 'navigation-lab' | 'robot-control-center';

interface Study {
  chapter: string;
  code: string;
  title: string;
  lead: string;
  problem: string;
  constraint: string;
  architecture: { id: string; title: string; caption: string }[];
  implementation: { heading: string; detail: string }[];
  checks: { name: string; assertion: string }[];
  testCount: number;
  testCommand: string;
  testPath: string;
  results: { value: string; label: string; note: string }[];
  resultContext: string;
  evidence: { claim: string; level: 'Source-backed' | 'Simulation-tested' | 'Concept / Pending'; evidence: string }[];
  limitations: string;
  nextMilestones: string[];
  interactiveId: string;
  sourcePath: string;
}

const REPO = 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/blob/main/';

const studies: Record<CaseStudyId, Study> = {
  'pickbot': {
    chapter: '01', code: 'MOBILE MANIPULATION / PICKBOT V6',
    title: 'Coordinating a mecanum base and a four-joint arm',
    lead: 'An independently documented mobile-manipulation concept that makes kinematics, contact checks and drive calculations inspectable in the browser.',
    problem: 'A mobile manipulator must reach a target and transport an object while aligning a holonomic base, articulated arm and gripper. The portfolio needed to explain what can be solved in software before the full robot assembly is available.',
    constraint: 'Only original shoulder, elbow and wrist STL parts were supplied for the arm. The rest of the chassis/wheel geometry is illustrative, and actual joint stops, payload and repeatability are not measured.',
    architecture: [
      { id: '01 / INPUT', title: 'Drag target + joystick', caption: 'Target, grasp command, vx/vy/ω inputs' },
      { id: '02 / ENGINE', title: 'IK + mecanum model', caption: 'Joint solutions, wheel RPM, odometry' },
      { id: '03 / VALIDATION', title: 'Geometric constraints', caption: 'Reach, joint limits, contact and overlap' },
      { id: '04 / OUTPUT', title: 'Virtual motion', caption: 'Four wheels, four joints, gripper state' },
    ],
    implementation: [
      { heading: 'Arm target solver', detail: 'Analytic four-joint inverse kinematics updates the concept arm when the virtual object is repositioned. It rejects unreachable and invalid targets.' },
      { heading: 'Contact-gated grasp', detail: 'A virtual pickup requires tool–object proximity and closed gripper state; simplified payload and rover-deck overlap checks can reject the grasp.' },
      { heading: 'Holonomic drive model', detail: 'Linear X/Y and angular Z commands resolve into FL, FR, RL and RR wheel RPM. Open-loop pose integrates the commanded motion.' },
    ],
    checks: [
      { name: 'IK target solutions', assertion: 'Reachable stations solve; unreachable and non-finite targets reject.' },
      { name: 'Virtual grasp interlock', assertion: 'Open gripper, missed contact and invalid payload position cannot attach.' },
      { name: 'Wheel polarity + RPM', assertion: 'Four-wheel matrix respects the configured drive conventions.' },
      { name: 'Modeled collision limits', assertion: 'Floor and chassis-envelope overlap are flagged in the concept geometry.' },
    ],
    testCount: 8, testCommand: 'npm run test:pickbot-v6', testPath: 'tests/pickbot-v6.test.mjs',
    results: [
      { value: '08/08', label: 'Automated checks passed', note: 'V6 deterministic model tests' },
      { value: '04 + 04', label: 'Wheels + arm joints', note: 'Concept mechanical architecture' },
      { value: '0', label: 'Hardware trials documented', note: 'No physical accuracy claim' },
    ],
    resultContext: 'The verified outcome is mathematical/model behavior. A virtual pick-and-place sequence or wheel trace does not establish real payload handling, roller traction or manipulator repeatability.',
    evidence: [
      { claim: 'Original arm source geometry', level: 'Source-backed', evidence: 'Selected supplied STL arm parts are retained in the visualizer.' },
      { claim: 'IK, grasp gates and mecanum calculations', level: 'Simulation-tested', evidence: 'Browser demo and eight repeatable mathematical regressions.' },
      { claim: 'Exact chassis, traction, physical payload', level: 'Concept / Pending', evidence: 'Illustrative geometry; physical measurements unavailable.' },
      { claim: 'ROS 2 + MoveIt execution', level: 'Concept / Pending', evidence: 'URDF/Xacro, controller and SRDF scaffolds exist but are not runtime-tested.' },
    ],
    limitations: 'This is not a rigid-body simulator or measured CAD assembly. The control math uses concept parameters, not calibrated motor, gripper or joint feedback.',
    nextMilestones: ['Measure actual wheel roller orientation, radius and motor polarity.', 'Calibrate joint limits, tool frame and gripper force on hardware.', 'Run ROS 2 / MoveIt in simulation, then record independent physical pick-and-place evidence.'],
    interactiveId: 'pickbot-interactive-title', sourcePath: 'src/components/PickBot/kinematics.ts',
  },
  'navigation-lab': {
    chapter: '02', code: 'AUTONOMOUS NAVIGATION / P6',
    title: 'Planning, sensing and driving through a virtual warehouse',
    lead: 'A runnable browser navigation experiment that turns a map and goal into observable, collision-checked simulated robot motion.',
    problem: 'A mobile robot should choose a path around obstacles, respond to map changes and reach a goal. A static concept image cannot demonstrate that planning or motion integration actually works.',
    constraint: 'The environment is a grid-backed 2.5D representation with simulated range rays and a differential-drive controller. It does not execute Gazebo physics, Nav2, ROS 2 nodes or hardware sensors.',
    architecture: [
      { id: '01 / ENVIRONMENT', title: 'Occupancy grid + goal', caption: 'Click goals, toggle obstacles' },
      { id: '02 / PLANNER', title: 'Footprint-aware A*', caption: 'Eight-neighbor search + replanning' },
      { id: '03 / CONTROLLER', title: 'Differential drive', caption: 'Heading feedback + pose integration' },
      { id: '04 / FEEDBACK', title: 'LiDAR + run report', caption: '60 ray returns, odom, trajectory JSON' },
    ],
    implementation: [
      { heading: 'Map and routing', detail: 'An 8-connected grid planner rejects occupied goals and diagonal corner cutting, then responds to new obstacle cells with a revised route.' },
      { heading: 'Virtual sensor and odometry', detail: 'A 60-beam raycast estimates obstacle ranges, while fixed simulation steps integrate differential-drive pose, distance and heading.' },
      { heading: 'Inspectable run evidence', detail: 'World and map views read the same state; simulation-speed controls run extra real steps, and the exported JSON records trajectory and mission outcomes.' },
    ],
    checks: [
      { name: 'Three scenario arrivals', assertion: 'Warehouse, aisle and open maps produce collision-free goal arrivals in tests.' },
      { name: 'Dynamic obstacle response', assertion: 'An inserted obstacle revises the route and avoids forbidden cells.' },
      { name: 'LiDAR + safety', assertion: 'Ray distances are bounded; E-stop freezes motion and commands.' },
      { name: 'Deterministic acceleration', assertion: 'Fast simulated steps match the same number of normal steps.' },
    ],
    testCount: 10, testCommand: 'npm run test:nav', testPath: 'tests/navigationCore.test.mjs',
    results: [
      { value: '10/10', label: 'Automated checks passed', note: 'Planner, sensing and controller tests' },
      { value: '26.37 m', label: 'Example travel distance', note: 'One observed warehouse browser run' },
      { value: '0.32 m', label: 'Example goal error', note: 'At 32.2 simulated seconds' },
    ],
    resultContext: 'Distance, duration and goal error describe a single observed, configured browser run—not a benchmark, a physical robot result or guaranteed performance across environments.',
    evidence: [
      { claim: 'A* / differential-drive / LiDAR behavior', level: 'Simulation-tested', evidence: 'Ten repeatable checks across paths, collision rules, range beams and stops.' },
      { claim: 'Warehouse world projection', level: 'Simulation-tested', evidence: 'Live 2.5D view of the same browser robot state.' },
      { claim: 'Nav2 / SLAM / Gazebo execution', level: 'Concept / Pending', evidence: 'No ROS runtime, map server, physics engine or real sensor used in P6.' },
    ],
    limitations: 'The occupancy-grid model does not represent full dynamic robot physics, wheel slip, sensor noise, localization drift or industrial safety requirements.',
    nextMilestones: ['Create an independent ROS 2 Humble robot description and Gazebo world.', 'Validate frames, /odom, LaserScan and collision contacts.', 'Integrate Nav2 and record three reproducible simulated goal missions.'],
    interactiveId: 'navigation-lab', sourcePath: 'src/components/NavLab/navigationCore.ts',
  },
  'robot-control-center': {
    chapter: '03', code: 'ROBOT OPERATIONS / P2',
    title: 'A safe, inspectable operator console for a virtual AMR',
    lead: 'An interactive control-room prototype where tasks, battery estimates, telemetry, safety actions and logs share one deterministic robot state.',
    problem: 'Robot operators need a clear view of tasks, status and faults, and must be able to stop and recover motion without ambiguous controls. A visual mockup alone cannot verify these state transitions.',
    constraint: 'Only one synthetic virtual AMR is represented. The warehouse route, battery estimate and velocity are schematic model values; there is no ROS connection or physical emergency-stop hardware.',
    architecture: [
      { id: '01 / OPERATOR', title: 'Dispatch + controls', caption: 'Queue, start, pause, E-stop, fault' },
      { id: '02 / STATE', title: 'Reducer + interlocks', caption: 'One authoritative transition model' },
      { id: '03 / MOTION', title: 'Waypoint traversal', caption: 'Synthetic position, distance, battery' },
      { id: '04 / EVIDENCE', title: 'Telemetry + event JSON', caption: 'Plot, time, alerts and export' },
    ],
    implementation: [
      { heading: 'Task dispatch', detail: 'Pending jobs maintain queue order. The active job drives a robot marker along connected schematic waypoints, updating progress and distance.' },
      { heading: 'Safety state machine', detail: 'Pause, failed job, synthetic encoder fault and emergency-stop latch inhibit movement. Acknowledging faults or releasing E-stop never silently starts the robot.' },
      { heading: 'Telemetry and logs', detail: 'Battery, position, speed and mission time derive from the reducer; timestamped events and job outcomes export to a JSON evidence file.' },
    ],
    checks: [
      { name: 'Task order + movement', assertion: 'Jobs run in enqueue order with advancing simulated position.' },
      { name: 'E-stop latch', assertion: 'Motion freezes, reset releases to paused, operator must restart.' },
      { name: 'Fault recovery', assertion: 'Synthetic encoder timeout requires acknowledgement and resumption.' },
      { name: 'Export evidence', assertion: 'Failed and completed job IDs are represented without false hardware claims.' },
    ],
    testCount: 9, testCommand: 'npm run test:control', testPath: 'tests/controlCore.test.mjs',
    results: [
      { value: '09/09', label: 'Automated checks passed', note: 'Reducer transitions and route behavior' },
      { value: '01', label: 'Virtual AMR', note: 'Synthetic single-robot demo' },
      { value: '0', label: 'External robot connections', note: 'Browser-local only' },
    ],
    resultContext: 'The dashboard was exercised live with task movement, E-stop engagement, zero commanded velocity and manual release into paused state. These demonstrate its browser state machine, not certified safety behavior.',
    evidence: [
      { claim: 'Task queue and movement state', level: 'Simulation-tested', evidence: 'Nine deterministic reducer tests and interactive browser demo.' },
      { claim: 'E-stop and fault response', level: 'Simulation-tested', evidence: 'Software latch, stop and manual recovery regression tests.' },
      { claim: 'Real ROS topics and physical safety', level: 'Concept / Pending', evidence: 'ROS-style labels only; no network bridge or hardware interlock.' },
    ],
    limitations: 'This is an operator-interface teaching simulator, not an authenticated fleet-control backend, validated safety PLC or real battery estimator. Obstacle collision dynamics are outside P2 scope.',
    nextMilestones: ['Define authenticated, permission-scoped ROS 2 telemetry and command adapter.', 'Validate loss-of-connection, stale telemetry and command inhibit behavior in isolated simulation.', 'Add real safety circuit and hardware review before claiming physical emergency-stop protection.'],
    interactiveId: 'robot-control-center', sourcePath: 'src/components/ControlCenter/controlCore.ts',
  },
};

const badgeStyles = {
  'Source-backed': 'bg-blue-50 text-blue-800 ring-blue-200',
  'Simulation-tested': 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'Concept / Pending': 'bg-amber-50 text-amber-800 ring-amber-200',
};

const chapters = [
  { number: '01', label: 'Problem' },
  { number: '02', label: 'Architecture' },
  { number: '03', label: 'Implementation' },
  { number: '04', label: 'Testing' },
  { number: '05', label: 'Results' },
];

function SectionNumber({ value, caption }: { value: string; caption: string }) {
  return <div className="flex items-center gap-3"><span className="font-mono text-xs font-bold text-brand-blue">/{value}</span><span className="h-px w-9 bg-slate-200" /><span className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{caption}</span></div>;
}

export function EngineeringCaseStudy({ projectId }: { projectId: CaseStudyId }) {
  const study = studies[projectId];
  const sectionId = `case-${projectId}`;
  return (
    <section id="engineering-case-study" aria-labelledby="engineering-case-study-title" className="mt-16 space-y-10 scroll-mt-28 lg:relative lg:left-1/2 lg:w-[min(1120px,calc(100vw-5rem))] lg:-translate-x-1/2">
      <div className="relative overflow-hidden rounded-[28px] border border-[#c9d9e6] bg-[#f1f7fa] px-6 py-8 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full border-[38px] border-[#dbe9f1]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-md bg-[#123049] px-3 py-1.5 font-mono text-[10px] font-black tracking-[.16em] text-cyan-100">CASE STUDY {study.chapter}</span>
            <span className="rounded-md bg-emerald-100 px-3 py-1.5 font-mono text-[10px] font-extrabold uppercase tracking-[.12em] text-emerald-800">Software simulation-tested</span>
            <span className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-amber-800">Hardware unverified</span>
          </div>
          <p className="mt-7 font-mono text-[10px] font-bold tracking-[.18em] text-brand-blue">{study.code}</p>
          <h2 id="engineering-case-study-title" className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">{study.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{study.lead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#cadce7] pt-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy"><BookOpen className="h-4 w-4 text-brand-blue" /> Engineering narrative</span>
            <span className="text-xs text-slate-500">Problem → Architecture → Implementation → Testing → Results</span>
            <a href="https://www.canva.com/d/epHLpVJfvFrEnJF" target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline">View editable-design deck <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </div>

      <nav aria-label="Case study chapters" className="flex flex-wrap gap-2">
        {chapters.map((item) => <a key={item.number} href={`#${sectionId}-${item.number}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-navy transition-colors hover:border-brand-blue hover:text-brand-blue"><span className="font-mono text-[10px] text-brand-blue">{item.number}</span>{item.label}</a>)}
      </nav>

      <div id={`${sectionId}-01`} className="scroll-mt-32">
        <SectionNumber value="01" caption="Problem / Engineering objective" />
        <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7"><h3 className="text-xl font-extrabold tracking-tight text-brand-navy">The challenge</h3><p className="mt-3 text-sm leading-7 text-brand-slate">{study.problem}</p></div>
          <div className="rounded-2xl border border-amber-200 bg-[#fff9ed] p-6 sm:p-7"><div className="flex items-center gap-2 text-amber-800"><CircleHelp className="h-4 w-4" /><span className="font-mono text-[10px] font-bold uppercase tracking-[.12em]">Design boundary</span></div><p className="mt-3 text-sm leading-7 text-amber-950">{study.constraint}</p></div>
        </div>
      </div>

      <div id={`${sectionId}-02`} className="scroll-mt-32">
        <SectionNumber value="02" caption="Architecture / System flow" />
        <div className="mt-4 rounded-3xl border border-[#29485e] bg-[#0b2133] p-5 text-white sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-extrabold">Model-to-output architecture</h3><p className="mt-1.5 text-xs text-slate-400">Original explanatory diagram · not a wired hardware schematic</p></div><Layers3 className="h-6 w-6 text-cyan-300" aria-hidden="true" /></div>
          <div className="mt-6 grid gap-2 md:grid-cols-4 md:gap-3">
            {study.architecture.map((step, index) => <div key={step.id} className="relative min-w-0 rounded-xl border border-[#31576b] bg-[#133044] p-4">
              <div className="mb-4 flex items-center justify-between gap-2"><span className="font-mono text-[9px] font-black uppercase tracking-[.12em] text-cyan-300">{step.id}</span>{index < study.architecture.length - 1 && <ArrowRight className="hidden h-3.5 w-3.5 text-cyan-400 md:block" />}</div>
              <h4 className="text-sm font-bold text-white">{step.title}</h4>
              <p className="mt-2 text-[11px] leading-5 text-slate-300">{step.caption}</p>
            </div>)}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-slate-500">Independent portfolio software / concept model</p>
        </div>
      </div>

      <div id={`${sectionId}-03`} className="scroll-mt-32">
        <SectionNumber value="03" caption="Implementation / Individual proof" />
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy">What was implemented</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {study.implementation.map((item, index) => <div key={item.heading} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f6fb] font-mono text-xs font-bold text-brand-blue">0{index + 1}</div><h4 className="mt-5 text-base font-extrabold text-brand-navy">{item.heading}</h4><p className="mt-2 text-sm leading-6 text-brand-slate">{item.detail}</p></div>)}
        </div>
        <a className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-blue underline-offset-4 hover:underline" target="_blank" rel="noreferrer" href={`${REPO}${study.sourcePath}`}><Cpu className="h-4 w-4" /> Inspect source implementation <ArrowUpRight className="h-4 w-4" /></a>
      </div>

      <div id={`${sectionId}-04`} className="scroll-mt-32">
        <SectionNumber value="04" caption="Testing / Reproducible evidence" />
        <div className="mt-4 grid gap-5 rounded-3xl border border-[#cbdce7] bg-[#f2f8fb] p-5 sm:p-7 lg:grid-cols-[1.2fr_.8fr]">
          <div><h3 className="flex items-center gap-2 text-xl font-extrabold text-brand-navy"><FlaskConical className="h-5 w-5 text-brand-blue" /> Verification checklist</h3><div className="mt-5 space-y-3">{study.checks.map((item) => <div key={item.name} className="flex gap-3 border-b border-slate-200 pb-3 last:border-b-0"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><div><h4 className="text-sm font-bold text-brand-navy">{item.name}</h4><p className="mt-1 text-xs leading-5 text-slate-600">{item.assertion}</p></div></div>)}</div></div>
          <div className="flex flex-col justify-between rounded-2xl bg-[#0b2437] p-5 text-white sm:p-6"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-cyan-300">Automated regression suite</p><p className="mt-5 font-mono text-5xl font-black tracking-tight text-white">{String(study.testCount).padStart(2, '0')}<span className="text-2xl text-cyan-300">/{String(study.testCount).padStart(2, '0')}</span></p><p className="mt-1 text-sm text-slate-300">Tests passed in local verification</p></div><div className="mt-7"><p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Reproduce with Node 22.6+</p><code className="block overflow-x-auto rounded-lg border border-white/10 bg-[#061724] p-3 font-mono text-xs text-cyan-200">{study.testCommand}</code><a className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-200 hover:underline" target="_blank" rel="noreferrer" href={`${REPO}${study.testPath}`}>Open test source <ExternalLink className="h-3.5 w-3.5" /></a></div></div>
        </div>
      </div>

      <div id={`${sectionId}-05`} className="scroll-mt-32">
        <SectionNumber value="05" caption="Results / Evidence interpretation" />
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy">The demonstrated outcome</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">{study.results.map((metric) => <div key={metric.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5"><p className="font-mono text-3xl font-black tracking-tight text-brand-blue sm:text-4xl">{metric.value}</p><h4 className="mt-3 text-sm font-bold text-brand-navy">{metric.label}</h4><p className="mt-1.5 text-xs leading-5 text-slate-500">{metric.note}</p></div>)}</div>
        <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><strong>How to read these results:</strong> {study.resultContext}</p>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><SectionNumber value="06" caption="Claim-to-evidence traceability" /><h3 className="mt-3 text-xl font-extrabold text-brand-navy">What is proven — and what is not</h3></div><ShieldCheck className="h-6 w-6 text-brand-blue" aria-hidden="true" /></div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[630px] border-collapse text-left text-xs sm:text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr><th scope="col" className="w-[32%] px-4 py-3 font-bold">Engineering claim</th><th scope="col" className="w-[22%] px-4 py-3 font-bold">Evidence status</th><th scope="col" className="px-4 py-3 font-bold">Verification boundary</th></tr></thead><tbody>{study.evidence.map((item) => <tr key={item.claim} className="border-t border-slate-100"><th scope="row" className="px-4 py-4 font-bold text-brand-navy">{item.claim}</th><td className="px-4 py-4"><span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ring-1 ${badgeStyles[item.level]}`}>{item.level}</span></td><td className="px-4 py-4 leading-6 text-brand-slate">{item.evidence}</td></tr>)}</tbody></table></div>
      </div>

      <div className="grid gap-6 rounded-3xl bg-brand-navy p-6 text-white sm:p-8 lg:grid-cols-[1fr_1fr]"><div><Wrench className="h-6 w-6 text-cyan-300" /><h3 className="mt-4 text-xl font-extrabold">Next validation milestones</h3><p className="mt-3 text-sm leading-6 text-white/65">{study.limitations}</p><a href={`#${study.interactiveId}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 underline-offset-4 hover:underline">Back to the interactive demonstration <ArrowDown className="h-4 w-4 rotate-180" /></a></div><ol className="space-y-4">{study.nextMilestones.map((item, index) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/85"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 font-mono text-xs font-black text-cyan-300">{index + 1}</span>{item}</li>)}</ol></div>
      <div className="flex flex-wrap items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950"><span className="font-bold">Status legend:</span><span>Source-backed = provided source geometry/code;</span><span>Simulation-tested = repeatable software behavior;</span><span>Concept / Pending = still needs execution or physical measurement.</span><span className="font-bold">No hardware-tested badge has been assigned.</span></div>
    </section>
  );
}
