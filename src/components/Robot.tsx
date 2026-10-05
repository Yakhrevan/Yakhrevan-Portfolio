import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Hand, ShieldCheck } from 'lucide-react';
import { RobotCanvas } from './Robot/RobotCanvas';
import { useRobot } from '../hooks/useRobot';

export type Pose = 'front' | 'back' | 'left' | 'right';

interface Props {
  pose?: Pose;
  className?: string;
  follow?: boolean;
  float?: boolean;
  alt?: string;
  showControls?: boolean;
}

/** 3D Interactive Mascot component with WebGL canvas, mouse tracking, and animation controls. */
export function Robot({
  className = '',
  follow = true,
  float: _float = true,
  showControls = true,
}: Props) {
  const { state, config, changeState, triggerWave, toggleBlueprintMode } = useRobot();
  const [hovered, setHovered] = useState(false);

  const handleRobotClick = () => {
    // Cycle between fun animations on click
    if (config.state === 'Idle') {
      changeState('Celebrating', 3000);
    } else if (config.state === 'Celebrating') {
      changeState('Happy', 2500);
    } else {
      triggerWave();
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (config.state === 'Idle') {
      changeState('Happy', 1500);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className={`relative group flex flex-col items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle background ambient light blur */}
      <div className={`absolute inset-4 rounded-full bg-gradient-to-tr from-brand-sky/20 via-brand-blue/10 to-brand-orange/15 blur-2xl pointer-events-none transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-70'}`} />

      {/* 3D WebGL Canvas */}
      <div className="w-full h-full relative z-10">
        <RobotCanvas
          config={config}
          speed={state.speed}
          isBlueprintMode={state.isBlueprintMode}
          reducedMotion={state.reducedMotion}
          onRobotClick={handleRobotClick}
          enableControls={follow}
          cameraPosition={[0, 0.9, 3.8]}
          cameraFov={40}
          className="w-full h-full min-h-[300px]"
        />
      </div>

      {/* Floating Interactive Micro-Action Bar */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lift"
        >
          <button
            onClick={() => triggerWave()}
            title="Wave Hand"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 hover:text-brand-blue hover:bg-brand-sky-light/80 transition-all duration-200"
          >
            <Hand className="w-3.5 h-3.5 text-brand-orange" />
            <span>Wave</span>
          </button>
          <div className="w-[1px] h-3 bg-slate-200" />
          <button
            onClick={() => changeState('Celebrating', 3500)}
            title="Celebrate!"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 hover:text-brand-blue hover:bg-brand-sky-light/80 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
            <span>Joy</span>
          </button>
          <div className="w-[1px] h-3 bg-slate-200" />
          <button
            onClick={() => toggleBlueprintMode()}
            title="Toggle Blueprint Wireframe"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 ${
              state.isBlueprintMode
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-700 hover:text-brand-blue hover:bg-brand-sky-light/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cyber</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function SpeechNote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-hand text-xl sm:text-2xl text-brand-blue leading-tight select-none bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-card border border-brand-sky/20 ${className}`}>
      {children}
    </div>
  );
}

