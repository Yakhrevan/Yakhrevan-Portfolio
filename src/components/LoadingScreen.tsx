import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
              setTimeout(onComplete, 600); // Wait for exit animation
            }
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          {/* Background Decor */}
          <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-brand-sky/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main Logo Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            {/* Robot Mascot / Logo Graphic */}
            <div className="relative">
              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-1.5rem] rounded-full border-2 border-transparent border-t-brand-blue border-r-brand-sky border-b-brand-orange border-l-brand-blue/30 opacity-60"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-2rem] rounded-full border border-transparent border-t-brand-orange/40 border-b-brand-sky/40 border-dashed"
              />
              
              {/* Robot sleeping pose (using a static illustration or icon for loading) */}
              <div className="w-32 h-32 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-lg overflow-hidden relative">
                {/* 2D Robot Sleep illustration representation */}
                <div className="flex flex-col items-center justify-center opacity-80">
                  <div className="w-12 h-10 bg-brand-navy rounded-t-[20px] rounded-b-xl relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-brand-navy">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-orange rounded-full" />
                    </div>
                    {/* Sleep eyes */}
                    <div className="flex gap-4 justify-center mt-4">
                      <div className="w-3 h-1 bg-brand-sky rounded-full" />
                      <div className="w-3 h-1 bg-brand-sky rounded-full" />
                    </div>
                  </div>
                  <div className="w-8 h-6 bg-brand-blue rounded-xl mt-1" />
                </div>
                {/* Zzz floating animation */}
                <motion.span 
                  animate={{ y: [0, -10, -20], opacity: [0, 1, 0], x: [0, 5, 10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 right-6 text-brand-sky text-sm font-bold font-mono"
                >
                  Z
                </motion.span>
                <motion.span 
                  animate={{ y: [0, -10, -20], opacity: [0, 1, 0], x: [0, -5, -10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-2 right-4 text-brand-sky text-lg font-bold font-mono"
                >
                  Z
                </motion.span>
              </div>
            </div>

            {/* Brand Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold text-brand-navy tracking-[0.15em] uppercase">
                YAKHREVAN
              </h1>
              <div className="flex items-center justify-center gap-2 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                <span>Ideas</span>
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                <span>Robots</span>
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                <span>Real Impact</span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 space-y-3 mt-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Initializing awesome things...
                </span>
                <span className="text-[10px] font-mono font-bold text-brand-navy">
                  {Math.min(100, progress)}%
                </span>
              </div>
              
              {/* Progress Track */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                  className="h-full bg-brand-blue relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] -skew-x-12" />
                </motion.div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mt-8 text-xs italic text-slate-400 font-medium">
              "A small engineer for a bigger tomorrow."
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
