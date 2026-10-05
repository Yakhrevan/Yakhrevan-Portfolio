import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Wrench } from 'lucide-react';
import { useRobot } from '../hooks/useRobot';
import { RobotCanvas } from '../components/Robot/RobotCanvas';

export const ComingSoon: React.FC = () => {
  const { state, config, changeState } = useRobot();

  useEffect(() => {
    changeState('Working', 0, "Building something awesome... Please wait!");
  }, [changeState]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-8 relative z-10"
      >
        {/* 3D Robot - Working */}
        <div className="mx-auto w-full max-w-[320px] relative">
          {/* Construction Hat Decoration (Optional HTML overlay, or just rely on robot Working pose) */}
          <div className="absolute -top-4 right-1/4 z-20 transform rotate-12 drop-shadow-md hidden sm:block">
            <div className="w-16 h-12 bg-amber-400 rounded-t-full border-b-4 border-amber-500 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full" />
            </div>
          </div>
          
          <RobotCanvas
            config={{ ...config, state: 'Working', eyeShape: 'squint' }}
            speed={state.speed}
            isBlueprintMode={false}
            reducedMotion={false}
            enableControls={false}
            cameraPosition={[0, 1.2, 3.2]}
            cameraFov={38}
            className="w-full h-[280px]"
            showShadow={true}
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange font-mono text-xs font-bold border border-brand-orange/20">
            <Wrench className="w-3.5 h-3.5" />
            UNDER CONSTRUCTION
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Something Awesome <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-sky">
              is in the Works!
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
            Stay tuned... The gears are turning and new features will be deployed here soon.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto space-y-2">
          <div className="flex justify-between text-xs font-bold text-brand-navy">
            <span>Progress</span>
            <span className="text-brand-blue">60%</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-brand-blue rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" />
            </motion.div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-4 flex justify-center">
          <a
            href="#home"
            className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <HomeIcon className="w-4 h-4" />
            Go Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};
