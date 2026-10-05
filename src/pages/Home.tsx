import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { useRobot } from '../hooks/useRobot';
import { RobotCanvas } from '../components/Robot/RobotCanvas';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Home: React.FC = () => {
  const { state, config, changeState } = useRobot();

  return (
    <section id="home" className="pt-24 pb-16 min-h-screen flex flex-col justify-center relative overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-sky/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/3 w-32 h-32 bg-brand-orange/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ====== LEFT COLUMN — Text & CTAs ====== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Brand Name */}
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-brand-blue tracking-[0.3em] uppercase">
                Y A K H R E V A N
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>IDEAS</span>
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                <span>ROBOTS</span>
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                <span>REAL IMPACT</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-brand-navy tracking-tight leading-[1.1]">
              Hi, I'm{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-sky">
                Yakhrevan
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-bold text-brand-navy/80">
              A small engineer for a bigger tomorrow.
            </p>

            {/* Bio */}
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              I design, build and explore intelligent machines with robotics, embedded systems and AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="btn-primary"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="btn-secondary"
              >
                <Download className="w-4 h-4 text-brand-orange" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Quote */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs italic text-slate-400 font-medium">
                " A small engineer for a bigger tomorrow. "
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-brand-blue hover:text-white text-slate-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-brand-blue hover:text-white text-slate-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href={`mailto:${PERSONAL_INFO.socials.email}`}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-600 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-2 text-xs font-bold">
              <div className="text-center">
                <span className="text-2xl font-extrabold text-brand-navy font-mono">3+</span>
                <p className="text-slate-400 mt-0.5">Projects</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-extrabold text-brand-navy font-mono">1+</span>
                <p className="text-slate-400 mt-0.5">Years</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-extrabold text-brand-navy font-mono">∞</span>
                <p className="text-slate-400 mt-0.5">Curiosity</p>
              </div>
            </div>
          </motion.div>

          {/* ====== RIGHT COLUMN — Live 3D Robot ====== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 relative"
          >
            {/* Background glow behind robot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-sky/10 rounded-full blur-3xl z-0" />

            {/* 3D Robot Canvas */}
            <div className="relative z-10">
              <RobotCanvas
                config={config}
                speed={state.speed}
                isBlueprintMode={state.isBlueprintMode}
                reducedMotion={state.reducedMotion}
                onRobotClick={() => changeState('Celebrating', 3000)}
                onRobotHover={() => changeState('Happy', 2000)}
                enableControls={true}
                cameraPosition={[0, 0.8, 3.8]}
                cameraFov={42}
                className="w-full h-[450px] sm:h-[500px] lg:h-[550px]"
              />
            </div>

            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="absolute top-6 right-4 sm:right-8 z-20 bg-white px-4 py-3 rounded-2xl shadow-card border border-slate-100 max-w-[200px]"
            >
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45" />
              <p className="text-xs font-bold text-brand-navy">
                Hello! Let's build something amazing! 🚀
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
