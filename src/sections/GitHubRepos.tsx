import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Bot, Code2, Github, Globe2, GraduationCap, NotebookTabs } from 'lucide-react';

const REPOSITORIES = [
  {
    name: 'ROS 2 Robotics Engineering Notebook',
    description: 'A structured engineering notebook covering Linux, ROS 2 architecture, DDS/QoS, robot integration, navigation, perception, and autonomy topics.',
    stack: 'Robotics · ROS 2 · C++ · Python',
    href: 'https://github.com/Yakhrevan/ros2-robotics-engineering-notebook',
    icon: NotebookTabs,
    label: 'Study & engineering notes',
  },
  {
    name: 'ROS Academy',
    description: 'An interactive robotics learning platform with guided lessons, browser-based demonstrations, quizzes, and project roadmaps.',
    stack: 'ROS 2 Humble · Learning UI',
    href: 'https://github.com/Yakhrevan/ros-academy',
    icon: GraduationCap,
    label: 'Interactive learning',
  },
  {
    name: 'Robotics Portfolio',
    description: 'The source code for this portfolio: React, TypeScript, Three.js, an interactive 3D robot companion, project pages, and Robot Lab.',
    stack: 'React · TypeScript · Three.js',
    href: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio',
    icon: Code2,
    label: 'This website',
  },
  {
    name: 'Morphobot Website',
    description: 'A dedicated web project presenting the Morphobot robotics concept and its ground-control experience.',
    stack: 'Robotics · Web development',
    href: 'https://github.com/Yakhrevan/Morphobot-Website',
    icon: Bot,
    label: 'Robotics project',
  },
  {
    name: 'GitHub Profile',
    description: 'Browse the full collection of public repositories, experiments, learning resources, and engineering projects.',
    stack: 'All public repositories',
    href: 'https://github.com/Yakhrevan?tab=repositories',
    icon: Github,
    label: 'Explore everything',
  },
];

export function GitHubRepos() {
  return (
    <section id="github" className="relative overflow-hidden bg-[#070B16] py-16 text-white lg:py-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
            <Github className="h-3.5 w-3.5" /> Open-source footprint
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore my <span className="text-sky-400">GitHub</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Engineering notes, robotics learning tools, and the code behind my portfolio. Open a repository to explore its README, implementation, and progress.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {REPOSITORIES.map((repo, index) => {
            const Icon = repo.icon;
            return (
              <motion.a
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="group relative flex min-h-[255px] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#101827] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/70 hover:bg-[#13213A] hover:shadow-[0_18px_55px_-20px_rgba(37,99,235,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-transparent opacity-80" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-sky-300 transition-colors group-hover:bg-blue-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-500 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-sky-300" />
                </div>

                <span className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">
                  {repo.label}
                </span>
                <h3 className="mt-2 text-lg font-extrabold leading-snug text-white">{repo.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{repo.description}</p>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-700/80 pt-4 text-xs font-semibold text-slate-400">
                  <Globe2 className="h-3.5 w-3.5 text-blue-300" />
                  {repo.stack}
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-400/25 bg-gradient-to-r from-blue-600/15 via-slate-900/70 to-slate-900/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 shrink-0 text-sky-300" />
            <div>
              <p className="font-bold text-white">Follow the engineering journey</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">Repositories evolve as I document experiments, learn new concepts, and improve project implementations.</p>
            </div>
          </div>
          <a
            href="https://github.com/Yakhrevan?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500"
          >
            View all repositories <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
