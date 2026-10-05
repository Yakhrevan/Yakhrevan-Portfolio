import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Globe, MapPin, Sparkles } from 'lucide-react';
import { useRobot } from '../hooks/useRobot';
import { RobotCanvas } from '../components/Robot/RobotCanvas';
import { PERSONAL_INFO } from '../data/portfolioData';

export const About: React.FC = () => {
  const { state, config, changeState } = useRobot();

  const infoCards = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      label: 'Education',
      value: 'B.E. Mechatronics',
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10',
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Focus',
      value: 'Robotics | AI | IoT',
      color: 'text-brand-sky',
      bg: 'bg-brand-sky/10',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Interests',
      value: 'Autonomous Systems\nComputer Vision\nEmbedded Design',
      color: 'text-brand-orange',
      bg: 'bg-brand-orange/10',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: PERSONAL_INFO.location,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-sky/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* ====== LEFT — Content ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold border border-brand-blue/20">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              KNOW MORE
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Engineering Ideas{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-sky">
                into Real-World Impact
              </span>
            </h2>

            {/* Bio */}
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              {PERSONAL_INFO.bio}
            </p>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {infoCards.map((card) => (
                <div
                  key={card.label}
                  className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-2"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    {card.label}
                  </span>
                  <p className="text-xs font-bold text-brand-navy whitespace-pre-line leading-relaxed">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ====== RIGHT — 3D Robot ====== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-blue/8 rounded-full blur-3xl z-0" />

            <RobotCanvas
              config={{ ...config, state: 'Thinking', eyeShape: 'thinking' }}
              speed={state.speed}
              isBlueprintMode={state.isBlueprintMode}
              reducedMotion={state.reducedMotion}
              onRobotClick={() => changeState('Curious', 3000)}
              enableControls={false}
              cameraPosition={[0.5, 1.0, 3.5]}
              cameraFov={38}
              className="w-full h-[400px] lg:h-[450px] relative z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
