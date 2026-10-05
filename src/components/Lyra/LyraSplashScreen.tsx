import { SafeEnv } from '../SafeEnv';
import React, { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { LyraRobotModel } from './LyraRobotModel';
import { LyraProvider, useLyra } from './LyraAnimationController';

interface LyraSplashScreenProps {
  onComplete: () => void;
}

const SplashContent: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setState, reducedMotion } = useLyra();
  const [showUI, setShowUI] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Sequence: 
    const timer1 = setTimeout(() => {
      setShowUI(true);
      setState('greeting');
      
      // Return to 'idle' after greeting finishes
      setTimeout(() => {
        setState('idle');
      }, 1500);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  const handleBegin = () => {
    setIsExiting(true);
    setState('idle'); // Change state to idle just before exiting
    setTimeout(() => {
      onComplete();
    }, 1000); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Futuristic Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/10 via-slate-950 to-slate-950 pointer-events-none" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTYsIDE4OSwgMjQ4LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] pointer-events-none" />

          {/* 3D Canvas - Moved up so robot is above the text */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pb-32">
            <Canvas
              shadows
              camera={{ position: [0, 0.5, 5], fov: 40 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.6} />
              <SafeEnv />
              <directionalLight position={[4, 8, 6]} intensity={1.5} color="#ffffff" />
              <directionalLight position={[-5, 4, -3]} intensity={0.8} color="#38BDF8" /> {/* Blue rim */}
              <pointLight position={[0, -1, 1]} intensity={0.5} color="#38BDF8" distance={5} /> {/* Underglow */}
              
              <Suspense fallback={null}>
                <LyraRobotModel />
                <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
              </Suspense>
            </Canvas>
          </div>

          {/* UI Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-end h-full pb-24 pointer-events-none">
            <AnimatePresence>
              {showUI && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col items-center text-center space-y-6 pointer-events-auto"
                >
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                      Hi, Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sky to-brand-blue">Yakhrevan's</span> Portfolio.
                    </h1>
                    <p className="text-lg text-slate-400 font-medium tracking-wide">
                      Ideas · Robots · Real Impact
                    </p>
                  </div>

                  <motion.button
                    whileHover={reducedMotion ? {} : { scale: 1.05, boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)" }}
                    whileTap={reducedMotion ? {} : { scale: 0.95 }}
                    onClick={handleBegin}
                    className="px-8 py-3.5 mt-4 rounded-full bg-brand-blue text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] border border-brand-sky/30 hover:bg-brand-blue-dark"
                  >
                    Let's Begin
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LyraSplashScreen: React.FC<LyraSplashScreenProps> = ({ onComplete }) => {
  return (
    <LyraProvider>
      <SplashContent onComplete={onComplete} />
    </LyraProvider>
  );
};
