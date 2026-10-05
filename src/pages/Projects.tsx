import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ExternalLink, Github, CheckCircle } from 'lucide-react';
import { projects } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { useRobot } from '../hooks/useRobot';

export const Projects: React.FC = () => {
  const { changeState } = useRobot();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    if (project.robotMood) {
      changeState(project.robotMood as any, 5000, project.robotComment || '');
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange font-mono text-xs font-bold border border-brand-orange/20">
              <Sparkles className="w-3.5 h-3.5" />
              FEATURED PROJECTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Real Ideas.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">
                Real Machines.
              </span>
            </h2>
          </motion.div>

          {/* Category filters + View All */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-sky/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => openProjectDetail(project)}
                className="group cursor-pointer rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-sky/30 transition-all"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🤖
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-brand-blue/90 text-white text-[10px] font-bold backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-brand-navy group-hover:text-brand-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ====== Project Detail Modal ====== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-brand-navy">{selectedProject.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-brand-blue/10 text-brand-blue text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {selectedProject.longDescription}
                </p>

                {/* Specs Grid */}
                {selectedProject.specs && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProject.specs.map((spec) => (
                      <div key={spec.label} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{spec.label}</span>
                        <p className="text-xs font-bold text-brand-navy mt-1">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {selectedProject.highlights && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-navy">Key Features</h4>
                    <ul className="space-y-1.5">
                      {selectedProject.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                          <CheckCircle className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  {selectedProject.githubUrl && selectedProject.githubUrl !== '#' && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center gap-2 hover:bg-brand-navy-light transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View GitHub
                    </a>
                  )}
                  {(selectedProject as any).liveUrl && (
                    <a
                      href={(selectedProject as any).liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold flex items-center gap-2 hover:bg-brand-blue-dark transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
