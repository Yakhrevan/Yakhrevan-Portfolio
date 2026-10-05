import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';
import { PERSONAL_INFO as P } from '../data/portfolioData';
import { Robot3D } from '../components/Robot3D';

const FLOATING_SKILLS = [
  // Top area
  { name: 'ROS 2', src: 'https://cdn.simpleicons.org/ros/22314E', top: '12%', left: '48%', delay: 0, size: 'w-14 h-14' },
  { name: 'React Native', src: 'https://cdn.simpleicons.org/react/61DAFB', top: '8%', left: '75%', delay: 3, size: 'w-12 h-12' },
  { name: 'Arduino', src: 'https://cdn.simpleicons.org/arduino/00979D', top: '15%', left: '25%', delay: 1.2, size: 'w-12 h-12' },

  // Center & Mid-Left/Right
  { name: 'SolidWorks', src: `${import.meta.env.BASE_URL}solidworks.svg`, top: '25%', left: '85%', delay: 1, size: 'w-16 h-16' },
  { name: 'STM32', src: 'https://cdn.simpleicons.org/stmicroelectronics/03234B', top: '45%', left: '2%', delay: 2.5, size: 'w-14 h-14' },
  { name: 'C++', src: 'https://cdn.simpleicons.org/cplusplus/00599C', top: '40%', left: '52%', delay: 2, size: 'w-12 h-12' },
  { name: 'Raspberry Pi', src: 'https://cdn.simpleicons.org/raspberrypi/A22846', top: '55%', left: '42%', delay: 0.8, size: 'w-12 h-12' },

  // Bottom area
  { name: 'Python', src: 'https://cdn.simpleicons.org/python/3776AB', top: '78%', left: '50%', delay: 1.5, size: 'w-14 h-14' },
  { name: 'OpenCV', src: 'https://cdn.simpleicons.org/opencv/5C3EE8', top: '82%', left: '28%', delay: 0.5, size: 'w-12 h-12' },
  { name: 'Docker', src: 'https://cdn.simpleicons.org/docker/2496ED', top: '85%', left: '72%', delay: 2.2, size: 'w-12 h-12' },
  { name: 'Linux', src: 'https://cdn.simpleicons.org/linux/FCC624', top: '65%', left: '92%', delay: 1.8, size: 'w-12 h-12' },
  { name: 'Git', src: 'https://cdn.simpleicons.org/git/F05032', top: '85%', left: '8%', delay: 2.7, size: 'w-10 h-10' },
];


export function Hero() {
  return (
    <section
      id="home"
      className="bg-hero relative overflow-hidden pt-28 pb-16 lg:pt-32 min-h-screen flex items-center"
    >
      {/* Background elements */}
      <div className="absolute inset-0 grid-dots opacity-30 [mask-image:radial-gradient(60%_60%_at_70%_40%,#000,transparent)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-sky/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-blue/8 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Skill Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {FLOATING_SKILLS.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20, rotate: -10 }}
            animate={{ opacity: 0.8, y: [0, -20, 0], rotate: [-10, 10, -10] }}
            transition={{ 
              opacity: { duration: 1, delay: 0.5 + skill.delay },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: skill.delay },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: skill.delay }
            }}
            className={`absolute ${skill.size} hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer`}
            style={{ top: skill.top, left: skill.left }}
            title={skill.name}
          >
            <img src={skill.src} alt={skill.name} className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform duration-300" />
          </motion.div>
        ))}
      </div>

      <div className="container-x relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 2xl:gap-24">
        {/* Left Column: Text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full lg:w-[55%] 2xl:w-[60%] space-y-6 shrink-0"
        >
          {/* Profile badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-brand-blue/30 shrink-0">
              <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt={P.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-brand-navy tracking-wide">
              {P.name}{' '}
              <span className="text-slate-400 font-normal">| {P.title}</span>
            </span>
            <span className="flex h-2 w-2 relative" aria-label="Available">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-brand-navy">
            Hi, I'm
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-sky to-brand-blue">
              {P.name}
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-bold text-brand-navy/90 leading-snug">
            {P.tagline}
          </p>

          {/* Description */}
          <p className="max-w-xl text-brand-slate leading-relaxed text-sm sm:text-base 2xl:text-lg">
            I design, build and explore intelligent machines using robotics, embedded systems, autonomous systems, computer vision, AI and software.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#contact"
              className="btn-primary"
            >
              Connect with me <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${import.meta.env.BASE_URL}YAKHREVAN_S_Resume.pdf`}
              download="Yakhrevan_S_Resume.pdf"
              className="btn-ghost flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download CV
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 pt-2">
            {[
              [Github, P.socials.github, 'GitHub'],
              [Linkedin, P.socials.linkedin, 'LinkedIn'],
              [Mail, `mailto:${P.socials.email}`, 'Email'],
            ].map(([Icon, href, label], i) => {
              const I = Icon as typeof Github;
              const isMail = (href as string).startsWith('mailto:');
              return (
                <a
                  key={i}
                  href={href as string}
                  target={isMail ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={label as string}
                  className="p-3 rounded-xl bg-white border border-slate-100 shadow-card text-brand-navy hover:text-brand-blue hover:scale-105 hover:shadow-lift transition-all duration-200"
                >
                  <I className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full lg:w-[40%] 2xl:w-[35%] relative flex flex-col justify-center items-center lg:items-end"
        >
          {/* Background glow */}
          <div className="absolute w-[80%] aspect-square rounded-full bg-gradient-to-br from-brand-sky/20 via-brand-blue/10 to-brand-orange/5 blur-3xl pointer-events-none" />

          {/* Large Profile photo */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 xl:w-[420px] xl:h-[420px] rounded-full overflow-hidden shadow-2xl ring-8 ring-white/50 border-4 border-white z-20">
            <img
              src={`${import.meta.env.BASE_URL}profile.jpg`}
              alt={P.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Small robot and slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white z-20"
          >
             <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 drop-shadow-md overflow-hidden rounded-full">
               <Robot3D clip="Idle_15" cam={[0, 1.0, 3.5]} fov={38} className="w-full h-full" />
             </div>
             <div className="text-sm font-bold text-brand-navy text-center sm:text-left">
               "<span className="text-brand-blue">Think.</span> <span className="text-brand-orange">Build.</span> <span className="text-brand-blue">Repeat.</span>"
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
