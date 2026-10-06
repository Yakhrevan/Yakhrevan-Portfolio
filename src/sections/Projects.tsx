import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { Project } from '../types/portfolio';

interface ProjectsProps {
  onProjectClick?: (project: Project) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function Projects({ onProjectClick }: ProjectsProps) {
  return (
    <section id="projects" className="py-12 lg:py-24 bg-white relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Featured Projects</span>
          <h2 className="h2 mt-4">
            From Ideas to <span className="text-brand-blue">Real Machines</span>
          </h2>
          <p className="mt-3 text-brand-slate max-w-xl">
            A few things I've built, explored and learned from.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS_DATA.map((project) => (
            <motion.article
              key={project.id}
              variants={cardVariants}
              onClick={() => onProjectClick?.(project)}
              className="card overflow-hidden group hover:shadow-lift hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="h-52 overflow-hidden bg-slate-100 relative">
                <img
                  src={project.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${import.meta.env.BASE_URL}projects/morphobot.svg`; }}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-brand-blue/90 text-white font-mono text-[11px] font-semibold backdrop-blur-sm shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-brand-blue transition-colors">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-sm text-brand-slate leading-relaxed">
                  {project.subtitle}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-brand-sky-light text-brand-blue text-[11px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Project link */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onProjectClick?.(project);
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue group-hover:gap-3 transition-all duration-300 bg-transparent border-none p-0 cursor-pointer"
                >
                  View Project <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
