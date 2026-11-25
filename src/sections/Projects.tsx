import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2, Code2, FlaskConical } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { Project } from '../types/portfolio';

interface ProjectsProps {
  onProjectClick?: (project: Project) => void;
}

const EVIDENCE = [
  {
    id: 'pickbot',
    number: '01',
    discipline: 'Mobile manipulation',
    contribution: 'Designed the arm CAD, specified the four-wheel/four-joint configuration and reviewed the AI-assisted IK, grasp and drive demo.',
    proof: '8 passing kinematics + drive tests',
    boundary: 'Arm CAD supplied · Chassis illustrative · Hardware pending',
    source: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/tree/main/src/components/PickBot',
  },
  {
    id: 'navigation-lab',
    number: '02',
    discipline: 'Autonomous navigation',
    contribution: 'Defined the goal-navigation, LiDAR and obstacle-replanning requirements and reviewed the AI-assisted simulation workflow.',
    proof: '10 passing navigation tests',
    boundary: 'Browser simulation · No Nav2 or Gazebo execution',
    source: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/tree/main/src/components/NavLab',
  },
  {
    id: 'robot-control-center',
    number: '03',
    discipline: 'Robot operations software',
    contribution: 'Specified the AMR task, telemetry, fault and E-stop workflows and reviewed the AI-assisted interactive control demo.',
    proof: '9 passing control-state tests',
    boundary: 'Browser simulation · No ROS 2 or hardware connection',
    source: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/tree/main/src/components/ControlCenter',
  },
] as const;

const FEATURED_IDS = new Set<string>(EVIDENCE.map((item) => item.id));

export function Projects({ onProjectClick }: ProjectsProps) {
  const otherProjects = PROJECTS_DATA.filter((project) => !FEATURED_IDS.has(project.id));

  return (
    <section id="projects" className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div className="absolute -right-32 top-12 h-96 w-96 rounded-full bg-brand-sky/5 blur-3xl pointer-events-none" />
      <div className="container-x relative z-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow">Featured engineering work / 01–03</span>
            <h2 className="h2 mt-4">Three projects. <span className="text-brand-blue">Real, inspectable logic.</span></h2>
            <p className="mt-4 text-brand-slate leading-relaxed">
              Start with a working browser demo, open the five-part engineering case study, then inspect the public implementation. These AI-assisted portfolio builds are software demonstrations, not claims of physical robot validation.
            </p>
          </div>
          <div className="flex w-fit shrink-0 items-center gap-3 rounded-xl border border-blue-100 bg-brand-bg px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-brand-blue" aria-hidden="true" />
            <div>
              <p className="text-sm font-extrabold text-brand-navy">27 deterministic tests</p>
              <p className="text-[11px] text-brand-slate">8 PickBot · 10 Navigation · 9 Control</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {EVIDENCE.map((item, index) => {
            const project = PROJECTS_DATA.find((candidate) => candidate.id === item.id);
            if (!project) return null;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .05 }}
                transition={{ duration: .4, delay: index * .06 }}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_8px_35px_-22px_rgba(15,23,42,.2)] transition-shadow hover:shadow-[0_18px_46px_-24px_rgba(15,23,42,.32)]"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-56 lg:h-48 xl:h-56">
                  <img
                    src={project.image}
                    alt={`${project.title} project visualization`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                  <div className="absolute left-4 top-4 rounded-md bg-brand-navy/90 px-2.5 py-1.5 font-mono text-[11px] font-bold text-white">PROJECT {item.number}</div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.17em] text-brand-blue">{item.discipline}</p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight text-brand-navy">{project.title.replace(/^P\d+ — /, '')}</h3>
                  <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-brand-slate">{project.subtitle}</p>
                  <div className="my-5 h-px bg-slate-100" />

                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-blue">My contribution</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-brand-navy/85">{item.contribution}</p>

                  <div className="mt-5 space-y-2">
                    <p className="flex items-start gap-2 text-xs font-bold text-emerald-700"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{item.proof}</p>
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-brand-slate"><FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" aria-hidden="true" />{item.boundary}</p>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => onProjectClick?.(project)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-blue-dark"
                    >
                      Live demo + case study <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <a href={item.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-1.5 py-1 text-xs font-bold text-brand-blue hover:underline">
                      <Code2 className="h-3.5 w-3.5" aria-hidden="true" /> Review source <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">More work</span>
              <h3 className="mt-3 text-2xl font-extrabold text-brand-navy">Additional engineering explorations</h3>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-brand-slate">Project descriptions below reflect the published portfolio; verification and supporting evidence vary by project.</p>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {otherProjects.map((project) => (
              <article key={project.id} className="flex min-w-0 gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4">
                <img src={project.image} alt="" loading="lazy" decoding="async" className="h-20 w-20 shrink-0 rounded-xl bg-slate-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-extrabold leading-snug text-brand-navy">{project.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-brand-slate">{project.subtitle}</p>
                  <button type="button" onClick={() => onProjectClick?.(project)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline">
                    Project details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
