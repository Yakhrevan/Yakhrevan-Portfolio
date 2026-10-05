import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, RefreshCcw } from 'lucide-react';
import { useRobot } from '../hooks/useRobot';
import { RobotCanvas } from '../components/Robot/RobotCanvas';

export const NotFound: React.FC = () => {
  const { state, config, changeState } = useRobot();

  useEffect(() => {
    changeState('Confused', 0, "Hmm... I can't find this page!");
  }, [changeState]);

  return (
    <div className="min-h-screen bg-brand-navy text-white flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-6 relative z-10"
      >
        {/* 3D Robot - Confused */}
        <div className="mx-auto w-full max-w-[280px]">
          <RobotCanvas
            config={{ ...config, state: 'Confused', eyeShape: 'confused' }}
            speed={state.speed}
            isBlueprintMode={false}
            reducedMotion={false}
            enableControls={false}
            cameraPosition={[0, 1.0, 3.5]}
            cameraFov={40}
            className="w-full h-[250px]"
            showShadow={false}
          />
        </div>

        {/* Big 404 */}
        <div className="space-y-3">
          <h1 className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-brand-orange">
            404
          </h1>
          <p className="text-lg font-bold text-white">
            Oops! Looks like you're lost in the circuits
          </p>
          <p className="text-sm text-slate-400 font-medium">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="#home"
            className="px-6 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-sm flex items-center gap-2 shadow-glow-blue transition-all hover:scale-105"
          >
            <HomeIcon className="w-4 h-4" />
            Go Home
          </a>
          <button
            onClick={() => window.location.reload()}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
