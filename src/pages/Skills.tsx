import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Activity, PenTool, Globe, Wrench, Cloud } from 'lucide-react';
import { skillCategories } from '../data/portfolioData';
import { useRobot } from '../hooks/useRobot';
import { RobotCanvas } from '../components/Robot/RobotCanvas';

const ICON_MAP: Record<string, React.FC<any>> = {
  Code, Cpu, Activity, PenTool, Globe, Wrench, Cloud
};

export const Skills: React.FC = () => {
  const { state, config, changeState } = useRobot();

  const ALL_LOGOS: string[] = [];
  const radius = 210; // Orbit radius

  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-sky/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[2px] w-8 bg-brand-orange"></div>
            <span className="text-brand-blue font-bold text-xs tracking-widest uppercase">
              Skills & Technologies
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
            Tools that Power <span className="text-brand-blue">My Ideas</span>
          </h2>
          <p className="text-slate-500 mt-4 text-base">
            A combination of software, hardware and creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ====== LEFT — Skills Grid ====== */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {skillCategories.map((category, i) => {
                const IconComponent = ICON_MAP[category.iconName] || Code;
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300"
                  >
                    {/* Header with Icon and Title */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shrink-0 shadow-md">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-brand-navy text-[15px]">{category.title}</h3>
                    </div>
                    
                    {/* Skills List with Progress Bars */}
                    <div className="space-y-4">
                      {category.skills.map((skill, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-end">
                            <span className="text-[13px] font-bold text-brand-navy leading-none">{skill.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium leading-none">{skill.tagline}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                              className="h-full bg-brand-blue rounded-full relative"
                            >
                              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30" />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ====== RIGHT — 3D Robot with Orbiting Logos ====== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 relative flex justify-center items-center h-[500px]"
          >
            {/* Orbiting Logos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
              {ALL_LOGOS.map((logo, idx) => {
                const angle = (idx / ALL_LOGOS.length) * 360;
                return (
                  <motion.div
                    key={idx}
                    className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5"
                    initial={{ rotate: angle }}
                    animate={{ rotate: angle + 360 }}
                    transition={{
                      duration: 40,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <motion.div
                      className="w-full h-full bg-white rounded-full p-2 shadow-lg border border-slate-100 flex items-center justify-center"
                      style={{ transform: `translateY(-${radius}px)` }}
                      initial={{ rotate: -angle }}
                      animate={{ rotate: -(angle + 360) }}
                      transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <img src={logo} alt="skill logo" className="w-full h-full object-contain" />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Robot Canvas */}
            <div className="relative w-full h-full flex items-center justify-center z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-sky/10 rounded-full blur-3xl z-0" />
              <RobotCanvas
                config={{ ...config, state: 'Happy', eyeShape: 'happy' }}
                speed={state.speed}
                isBlueprintMode={state.isBlueprintMode}
                reducedMotion={state.reducedMotion}
                onRobotClick={() => changeState('Excited', 3000)}
                enableControls={false}
                cameraPosition={[0.3, 0.5, 3.8]}
                cameraFov={35}
                className="w-full h-[500px] relative z-10 scale-110"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====== BOTTOM — Running Logo Marquee ====== */}
      <div className="mt-20 w-full overflow-hidden flex bg-slate-50/80 py-8 border-y border-slate-100 relative z-10">
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {[...ALL_LOGOS, ...ALL_LOGOS].map((logo, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 mx-6 w-16 h-16 bg-white p-3 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center group cursor-pointer"
            >
              <img 
                src={logo} 
                alt="skill logo" 
                className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
