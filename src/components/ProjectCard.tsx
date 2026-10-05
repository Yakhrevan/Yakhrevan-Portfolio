import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FolderDot } from 'lucide-react';
import { Project } from '../types/portfolio';
import { useRobot } from '../hooks/useRobot';

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const { changeState } = useRobot();

  const handleMouseEnter = () => {
    changeState(project.robotMood, 3000, project.robotComment);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      onMouseEnter={handleMouseEnter}
      onClick={() => onSelect?.(project)}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-brand-sky/60 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      {/* Top Banner Image with Category Badge */}
      <div className="relative h-52 bg-brand-light-bg overflow-hidden">
        <img
          src={project.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/projects/morphobot.svg"; }}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-brand-blue/90 text-white font-mono text-[11px] font-semibold backdrop-blur-md shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {project.subtitle}
          </p>
          <p className="text-sm text-slate-600 font-medium leading-relaxed mt-3 line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-lg bg-brand-light-bg text-brand-blue border border-slate-100 text-[11px] font-mono font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue group-hover:text-brand-orange transition-colors">
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-brand-light-bg hover:bg-slate-200 text-slate-700 transition-colors"
                title="View Source Code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white transition-colors"
                title="Live Demo"
              >
                <FolderDot className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
