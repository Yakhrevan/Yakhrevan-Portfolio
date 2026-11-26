import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { PERSONAL_INFO as P } from '../data/portfolioData';
import { FloatingSkills } from '../components/FloatingSkills';

const CAPABILITIES = ['Robot motion & IK', 'Autonomous navigation', 'Embedded control', 'Operator interfaces'];

export function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="home" className="bg-hero relative overflow-hidden pb-14 pt-24 sm:pt-32 xl:pt-36 xl:pb-24">
      <div className="absolute inset-0 grid-dots opacity-30 [mask-image:radial-gradient(65%_65%_at_75%_45%,#000,transparent)] pointer-events-none" />
      <div className="absolute top-24 right-0 w-96 h-96 bg-brand-sky/15 rounded-full blur-3xl pointer-events-none" />
      <FloatingSkills />

      <div className="container-x relative z-10 grid items-center gap-12 sm:gap-14 xl:grid-cols-[minmax(0,1.14fr)_minmax(380px,.86fr)] xl:gap-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="min-w-0"
        >
          <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-brand-blue/15 bg-white/85 px-3.5 py-2 text-[11px] font-bold tracking-wider text-brand-blue shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-orange" aria-hidden="true" />
            <span>MECHATRONICS ENGINEER</span>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-brand-slate">ROBOTICS + EMBEDDED SYSTEMS</span>
          </div>

          <p className="mt-8 text-sm font-bold tracking-wide text-brand-blue">Hi, I'm {P.name}.</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.05rem,9.5vw,2.8rem)] leading-[1.1] sm:text-6xl lg:text-[4.2rem] xl:text-[5rem] font-extrabold tracking-[-.045em] text-brand-navy">
            I build robotics systems
            <span className="block text-brand-blue">you can explore and test.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base font-extrabold tracking-tight text-brand-navy/85 sm:text-lg">
            A small engineer, bigger tomorrow.
          </p>

          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-brand-slate">
            I work across mechanical design, embedded control and autonomous software. Explore three independent, interactive engineering demos with public source, case studies and clearly stated simulation limits.
          </p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Engineering focus areas">
            {CAPABILITIES.map((capability) => (
              <span key={capability} className="rounded-md border border-brand-blue/10 bg-white/85 px-2.5 py-1.5 text-xs font-semibold text-brand-navy/80">
                {capability}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary w-full justify-center sm:w-auto">
              Explore engineering work <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={`${import.meta.env.BASE_URL}Yakhrevan_S_Resume.pdf`} download="Yakhrevan_S_Resume.pdf" className="btn-ghost w-full justify-center sm:w-auto">
              <Download className="h-4 w-4" aria-hidden="true" /> Download CV
            </a>
            <a href={`mailto:${P.socials.email}`} className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-bold text-brand-navy hover:text-brand-blue">
              Contact <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-slate-200/80 pt-5 text-xs font-semibold text-brand-slate">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-blue" />{P.location}</span>
            <span>{P.status}</span>
            <div className="flex items-center gap-3">
              <a href={P.socials.github} target="_blank" rel="noreferrer" aria-label="Yakhrevan on GitHub" className="hover:text-brand-blue"><Github className="h-4 w-4" /></a>
              <a href={P.socials.linkedin} target="_blank" rel="noreferrer" aria-label="Yakhrevan on LinkedIn" className="hover:text-brand-blue"><Linkedin className="h-4 w-4" /></a>
              <a href={`mailto:${P.socials.email}`} aria-label="Email Yakhrevan" className="hover:text-brand-blue"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: .65, delay: .1 }}
          className="mx-auto w-full max-w-[500px] lg:max-w-none"
        >
          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="relative mx-auto aspect-square w-[86%] max-w-[390px] overflow-hidden rounded-[1.6rem] border-4 border-white bg-white shadow-[0_24px_65px_-22px_rgba(15,42,94,.34)] ring-4 ring-brand-blue/10">
              <img
                src={`${import.meta.env.BASE_URL}profile.webp`}
                alt="Portrait of Yakhrevan S"
                width="880"
                height="924"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative mt-4 flex items-center gap-4 rounded-xl border border-blue-100/70 bg-white/90 p-3 sm:p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-blue/10 bg-brand-bg sm:h-20 sm:w-20">
                <img src={`${import.meta.env.BASE_URL}brand/hero-robot-reading.png`} alt="Illustration of a friendly robot reading" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-brand-blue">My engineering motto</p>
                <p className="mt-1 text-base font-extrabold leading-tight text-brand-navy sm:text-lg">
                  <span className="text-brand-blue">Think.</span> <span className="text-brand-orange">Build.</span> <span className="text-brand-blue">Repeat.</span>
                </p>
              </div>
            </div>
            <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100/60 bg-white/90 px-4 py-3">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-brand-blue">Portfolio focus</p>
                <p className="mt-1 text-sm font-extrabold text-brand-navy">Robotics · Controls · Autonomy</p>
              </div>
              <span className="rounded-lg bg-brand-navy px-3 py-2 font-mono text-[10px] font-bold text-white">BUILD / TEST</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
