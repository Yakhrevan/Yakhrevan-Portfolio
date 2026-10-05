import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS_DATA } from '../data/portfolioData';
import { Code2, Cpu, PenTool, Layout, Database, Cloud, Activity } from 'lucide-react';

const getIconUrl = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('c++')) return 'https://cdn.simpleicons.org/cplusplus/00599C';
  if (n.includes('python')) return 'https://cdn.simpleicons.org/python/3776AB';
  if (n.includes('java')) return 'https://cdn.simpleicons.org/java/007396';
  if (n.includes('ros')) return 'https://cdn.simpleicons.org/ros/22314E';
  if (n.includes('html')) return 'https://cdn.simpleicons.org/html5/E34F26';
  if (n.includes('react')) return 'https://cdn.simpleicons.org/react/61DAFB';
  if (n.includes('docker')) return 'https://cdn.simpleicons.org/docker/2496ED';
  if (n.includes('git')) return 'https://cdn.simpleicons.org/git/F05032';
  if (n.includes('arduino')) return 'https://cdn.simpleicons.org/arduino/00979D';
  if (n.includes('rpi') || n.includes('raspberry')) return 'https://cdn.simpleicons.org/raspberrypi/A22846';
  if (n.includes('opencv')) return 'https://cdn.simpleicons.org/opencv/5C3EE8';
  if (n.includes('solidworks')) return 'https://cdn.simpleicons.org/dassaultsystemes/005F9E';
  if (n.includes('blender')) return 'https://cdn.simpleicons.org/blender/F5792A';
  if (n.includes('linux')) return 'https://cdn.simpleicons.org/linux/FCC624';
  if (n.includes('autocad')) return 'https://cdn.simpleicons.org/autodesk/0696D7';
  if (n.includes('esp')) return 'https://cdn.simpleicons.org/espressif/E7352C';
  if (n.includes('stm32')) return 'https://cdn.simpleicons.org/stmicroelectronics/03234B';
  if (n.includes('can') || n.includes('uart') || n.includes('i2c')) return 'https://cdn.simpleicons.org/microchip/E42528';
  return null;
}

const getGenericIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('design') || n.includes('cad')) return <PenTool className="w-8 h-8 text-brand-orange" />;
  if (n.includes('code') || n.includes('c') || n.includes('script')) return <Code2 className="w-8 h-8 text-brand-blue" />;
  if (n.includes('web') || n.includes('app')) return <Layout className="w-8 h-8 text-brand-sky" />;
  if (n.includes('hardware') || n.includes('embedded')) return <Cpu className="w-8 h-8 text-slate-700" />;
  if (n.includes('database')) return <Database className="w-8 h-8 text-emerald-500" />;
  if (n.includes('cloud')) return <Cloud className="w-8 h-8 text-sky-400" />;
  return <Activity className="w-8 h-8 text-brand-navy" />;
}

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Flatten skills with their parent category
  const allSkills = SKILLS_DATA.flatMap(category => 
    category.skills.map(skill => ({ ...skill, categoryTitle: category.title }))
  );

  const filteredSkills = activeCategory === 'All' 
    ? allSkills 
    : allSkills.filter(s => s.categoryTitle === activeCategory);

  const categories = ['All', ...SKILLS_DATA.map(c => c.title)];

  return (
    <section id="skills" className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-sky/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-x relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
        
        {/* Left Side: Skills Content */}
        <div className="w-full lg:flex-1 space-y-8">
          
          <div className="relative inline-block">
            {/* Orange squiggly decoration from the image concept */}
            <svg className="absolute -top-6 -left-6 w-12 h-12 text-brand-orange/60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50 Q 25 20, 50 50 T 90 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight">
              Tools That Power <br className="hidden sm:block lg:hidden" /> My Ideas
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.replace('Languages', '').replace('Frameworks & ', '').trim()}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 pt-6">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, idx) => {
                const iconUrl = getIconUrl(skill.name);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.2) }}
                    key={skill.name}
                    className="group bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-sky/40 transition-all duration-300 cursor-default"
                  >
                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {iconUrl ? (
                        <img src={iconUrl} alt={skill.name} className="w-8 h-8 object-contain" />
                      ) : (
                        getGenericIcon(skill.name)
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-brand-navy text-center leading-tight">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* Right Side: Robot Image */}
        <div className="hidden lg:flex w-[28rem] flex-col items-center sticky top-32 mt-4">
          <div className="w-full relative z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-sky/10 to-transparent rounded-full blur-3xl -z-10" />
            <img 
              src={`${import.meta.env.BASE_URL}brand/robot-skills.png`} 
              alt="Robot working on laptop" 
              className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
