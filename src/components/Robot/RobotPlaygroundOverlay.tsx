import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RobotState } from '../../types/robot';
import { useRobot } from '../../hooks/useRobot';
import {
  Layers,
  Terminal as TerminalIcon,
  Gauge,
  MessageSquare,
  Eye,
  Bot,
  Activity,
  Sparkles,
} from 'lucide-react';

interface StateCategory {
  name: string;
  states: { state: RobotState; label: string; icon: string }[];
}

const STATE_CATEGORIES: StateCategory[] = [
  {
    name: 'Moods',
    states: [
      { state: 'Idle', label: 'Idle', icon: '🤖' },
      { state: 'Happy', label: 'Happy', icon: '😊' },
      { state: 'Excited', label: 'Excited', icon: '🤩' },
      { state: 'Curious', label: 'Curious', icon: '🤔' },
      { state: 'Confused', label: 'Confused', icon: '❓' },
      { state: 'Sad', label: 'Sad', icon: '🥺' },
      { state: 'Sleepy', label: 'Sleepy', icon: '😴' },
    ],
  },
  {
    name: 'Actions',
    states: [
      { state: 'Waving', label: 'Waving', icon: '👋' },
      { state: 'Blink', label: 'Blink', icon: '👁️' },
      { state: 'Thinking', label: 'Thinking', icon: '💭' },
      { state: 'Focused', label: 'Focused', icon: '🎯' },
      { state: 'Walking', label: 'Walking', icon: '🚶' },
      { state: 'Working', label: 'Working', icon: '🛠️' },
      { state: 'Celebrating', label: 'Celebrating', icon: '🎉' },
    ],
  },
  {
    name: 'System',
    states: [
      { state: 'Error', label: 'Error', icon: '⚠️' },
      { state: 'Wake Up', label: 'Wake Up', icon: '⚡' },
    ],
  },
];

export const RobotPlaygroundOverlay: React.FC = () => {
  const {
    state,
    config,
    changeState,
    toggleBlueprintMode,
    toggleConsole,
    setSpeed,
    setSpeechBubbleVisible,
  } = useRobot();

  const [activeCategory, setActiveCategory] = useState('Moods');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue font-mono text-xs font-bold border border-brand-blue/20">
          <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
          INTERACTIVE PLAYGROUND
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Robot Mascot{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-sky to-brand-orange">
            Playground
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          Interact with the 3D robot mascot — change its mood, speed, and appearance in real-time.
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="glass-panel rounded-3xl p-6 shadow-card-hover border border-brand-sky/20 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-sky flex items-center justify-center text-white shadow-glow-sky">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                Animation Controller
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono font-semibold">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Current State: <span className="font-semibold text-brand-blue">{state.currentState}</span>
                {' • '}Speed: <span className="font-semibold text-brand-orange">{state.speed.toFixed(1)}x</span>
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleBlueprintMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                state.isBlueprintMode
                  ? 'bg-brand-sky text-white shadow-glow-sky'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Wireframe
            </button>

            <button
              onClick={toggleConsole}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-navy text-white hover:bg-brand-navy-light flex items-center gap-1.5 shadow-sm transition-all"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-brand-sky" />
              Console
            </button>

            <button
              onClick={() => setSpeechBubbleVisible(!state.speechBubbleVisible)}
              className={`p-2 rounded-xl text-xs transition-colors ${
                state.speechBubbleVisible
                  ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              title="Toggle Speech Bubble"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Speed & Telemetry Panel */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <Gauge className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Speed: <span className="text-brand-blue font-mono">{state.speed.toFixed(1)}x</span>
            </span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={state.speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-brand-blue cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>
                <strong className="text-brand-navy">{state.currentState}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Eye className="w-3.5 h-3.5 text-brand-sky" />
              <span className="inline-block w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: config.lightColor }} />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {STATE_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.name
                    ? 'bg-brand-blue text-white shadow-glow-blue'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-[10px] opacity-70">({cat.states.length})</span>
              </button>
            ))}
          </div>

          {/* State Cards Grid */}
          <AnimatePresence mode="wait">
            {STATE_CATEGORIES.filter((c) => c.name === activeCategory).map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2"
              >
                {cat.states.map((item) => {
                  const isActive = state.currentState === item.state;
                  return (
                    <motion.button
                      key={item.state}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => changeState(item.state, item.state === 'Blink' ? 500 : 0)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                        isActive
                          ? 'bg-gradient-to-b from-brand-blue to-brand-blue-dark text-white shadow-glow-blue font-bold ring-2 ring-brand-sky'
                          : 'bg-white border border-slate-200/80 text-brand-navy hover:border-brand-sky/60 hover:bg-sky-50/50 font-medium'
                      }`}
                    >
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span className="text-xs tracking-tight">{item.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
