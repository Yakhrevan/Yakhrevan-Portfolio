import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, CheckCircle2, Tag, Calendar } from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  // Scroll to top when opening this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white relative selection:bg-brand-blue/20">
      {/* Background ambient */}
      <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-brand-sky-light/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar/Header area */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container-x h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-brand-blue hover:text-white transition-all duration-300 text-brand-slate font-medium text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </button>
        </div>
      </header>

      <main className="container-x py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-[11px] font-bold tracking-wider uppercase">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange font-mono text-[11px] font-bold tracking-wider uppercase">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-brand-slate font-medium leading-relaxed">
              {project.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  View Repository
                </a>
              )}
              {(project.demoUrl || project.videoUrl) && (
                <a
                  href={project.demoUrl || project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn bg-white border-2 border-slate-200 text-brand-navy hover:border-brand-blue hover:text-brand-blue flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  {project.videoUrl ? 'Watch Demo' : 'Live Preview'}
                </a>
              )}
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl shadow-brand-navy/5 aspect-[16/9] relative group"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${import.meta.env.BASE_URL}projects/morphobot.svg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Content Grid */}
          <div className="mt-16 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Overview</h2>
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-brand-slate leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>
              </motion.section>

              {/* Key Features */}
              {project.highlights && project.highlights.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">Key Features</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-brand-slate">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Tech Stack */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-blue" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-brand-slate text-[13px] font-semibold shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specs */}
              {project.specs && project.specs.length > 0 && (
                <div className="p-6 rounded-3xl bg-brand-navy text-white shadow-xl shadow-brand-navy/10 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                  <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-orange" />
                    Specifications
                  </h3>
                  <div className="space-y-4 relative z-10">
                    {project.specs.map((spec, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <span className="text-[11px] font-mono text-brand-sky/80 uppercase tracking-wider">
                          {spec.label}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer minimal for project page */}
      <footer className="border-t border-slate-100 py-8 bg-slate-50 mt-12 text-center">
        <p className="text-sm text-brand-slate font-medium">
          Ready to build something amazing together? <a href="#contact" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-brand-blue hover:underline">Let's talk</a>.
        </p>
      </footer>
    </div>
  );
}
