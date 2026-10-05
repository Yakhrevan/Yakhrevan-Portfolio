import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { experiences } from '../data/portfolioData';
import { ExperienceItem } from '../types/portfolio';
import { useRobot } from '../hooks/useRobot';

export const Experience: React.FC = () => {
  const { changeState } = useRobot();

  return (
    <section id="experience" className="py-20 relative bg-brand-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold border border-brand-blue/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
            MY JOURNEY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Learning, Building & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-sky to-brand-orange">
              Growing
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            The path of a Mechatronics Engineer from academic foundations to building real-world robotic systems.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-brand-sky/20">
          {experiences.map((exp: ExperienceItem, i: number) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onMouseEnter={() => changeState('Working', 2500)}
              className="relative flex flex-col sm:flex-row items-start group"
            >
              {/* Timeline Center Dot */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-brand-blue flex items-center justify-center text-brand-blue shadow-glow-blue z-10 transition-transform group-hover:scale-110">
                <Briefcase className="w-4 h-4" />
              </div>

              {/* Card Container */}
              <div className={`w-full sm:w-[calc(50%-2rem)] ml-12 sm:ml-0 ${i % 2 === 0 ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto'}`}>
                <div className="glass-panel p-6 rounded-3xl border border-slate-200 hover:border-brand-sky/60 shadow-sm hover:shadow-card-hover transition-all space-y-3">
                  <div className={`flex flex-wrap items-center gap-2 font-mono text-xs text-brand-blue ${i % 2 === 0 ? 'sm:justify-end' : 'justify-start'}`}>
                    <span className="flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5" /> {exp.period}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" /> {exp.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy">{exp.role}</h3>
                  <p className="text-xs font-bold text-brand-orange uppercase font-mono">{exp.company}</p>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {exp.description}
                  </p>

                  <ul className={`space-y-1 text-xs text-slate-700 pt-2 font-medium ${i % 2 === 0 ? 'sm:text-right' : 'text-left'}`}>
                    {exp.achievements.map((ach: string, idx: number) => (
                      <li key={idx} className={`flex items-start gap-1.5 ${i % 2 === 0 ? 'sm:flex-row-reverse' : 'flex-row'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`flex flex-wrap gap-1.5 pt-2 ${i % 2 === 0 ? 'sm:justify-end' : 'justify-start'}`}>
                    {exp.technologies.map((tech: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md bg-brand-light-bg text-brand-blue border border-brand-sky/20 text-[10px] font-mono font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
