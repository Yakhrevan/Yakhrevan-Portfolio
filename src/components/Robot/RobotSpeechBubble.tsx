import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Volume2 } from 'lucide-react';
import { RobotStateConfig } from '../../types/robot';

interface RobotSpeechBubbleProps {
  config: RobotStateConfig;
  customMessage?: string | null;
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
}

export const RobotSpeechBubble: React.FC<RobotSpeechBubbleProps> = ({
  config,
  customMessage,
  isVisible,
  onClose,
  className = '',
}) => {
  const displayText = customMessage || config.speechText;
  const [displayedChars, setDisplayedChars] = useState('');

  // Typewriter effect when speech text changes
  useEffect(() => {
    let index = 0;
    setDisplayedChars('');
    const timer = setInterval(() => {
      if (index < displayText.length) {
        setDisplayedChars((prev) => prev + displayText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [displayText]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`relative z-20 max-w-sm glass-panel p-4 rounded-2xl shadow-glow-sky border border-brand-sky/30 text-brand-navy ${className}`}
      >
        {/* Tail pointing towards robot */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-r border-brand-sky/30 rotate-45" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: config.lightColor }}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
              Mascot AI • {config.state}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-brand-navy rounded-lg hover:bg-slate-100 transition-colors"
              title="Hide speech bubble"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message body */}
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800 font-sans">
          {displayedChars}
          <span className="inline-block w-1.5 h-4 ml-1 bg-brand-sky animate-pulse align-middle" />
        </p>

        {/* Audio / Telemetry footer */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-brand-sky" /> Audio Synthesis Active
          </span>
          <span>SYSTEM READY</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
