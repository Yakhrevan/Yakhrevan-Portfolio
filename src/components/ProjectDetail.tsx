import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Cpu, Layers, HardDrive, LayoutGrid } from 'lucide-react';
import { Project } from '../types/portfolio';
import { robotController } from './Robot/RobotController';

interface ProjectDetailProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isOpen, onClose }) => {
  // Trigger robot reaction when modal opens
  useEffect(() => {
    if (isOpen && project) {
      document.body.style.overflow = 'hidden';
      robotController.setState('Working', 0, `Analyzing engineering specs for ${project.title}...`);
    } else {
      document.body.style.overflow = '';
      robotController.setState('Idle'); // Return to idle when closed
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md pointer-events-auto"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-slate-200"
          >
            {/* Header / Banner Image */}
            <div className="relative h-64 sm:h-80 shrink-0 bg-brand-navy overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-brand-blue text-white text-xs font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-white/80 text-xs font-mono font-semibold">#{tag}</span>
                    ))}
                  </div>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                  {project.title}
                </h2>
                <p className="text-brand-sky text-lg sm:text-xl font-medium mt-2">
                  {project.subtitle}
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12">
              <div className="grid lg:grid-cols-3 gap-12">
                
                {/* Left Column: Description & Highlights */}
                <div className="lg:col-span-2 space-y-10">
                  <section>
                    <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5 text-brand-blue" />
                      Project Overview
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {project.longDescription}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-brand-orange" />
                      Technical Achievements
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {project.highlights.map((highlight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-brand-blue font-bold text-sm shrink-0 shadow-sm border border-slate-200">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-700 leading-snug">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Right Column: Specs & Links */}
                <div className="space-y-8">
                  <div className="p-6 rounded-2xl bg-brand-light-bg border border-brand-sky/20">
                    <h3 className="text-lg font-bold text-brand-navy mb-5 flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-brand-sky" />
                      System Specifications
                    </h3>
                    <div className="space-y-4">
                      {project.specs.map((spec: { label: string; value: string }, idx: number) => (
                        <div key={idx} className="flex justify-between items-end border-b border-slate-200/60 pb-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                          <span className="text-sm font-bold text-brand-navy text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                    <h3 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-400" />
                      Project Links
                    </h3>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between w-full p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-blue hover:shadow-glow-blue text-brand-navy transition-all group"
                      >
                        <span className="font-bold flex items-center gap-2">
                          <Github className="w-5 h-5" /> Source Code
                        </span>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-blue" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between w-full p-4 rounded-xl bg-brand-blue text-white hover:bg-brand-blue-dark shadow-glow-blue transition-all group"
                      >
                        <span className="font-bold flex items-center gap-2">
                          Live Demonstration
                        </span>
                        <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
