import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { labExperiments } from '../data/portfolioData';
import { LabExperiment } from '../types/portfolio';
import { useRobot } from '../hooks/useRobot';

export const RoboticsLab: React.FC = () => {
  const { changeState } = useRobot();
  const [activeExpId, setActiveExpId] = useState(labExperiments[0].id);
  const [pidGains, setPidGains] = useState({ kp: 2.5, ki: 0.8, kd: 0.15 });
  const [simLog, setSimLog] = useState<string[]>([
    'Kinematics engine simulation ready.',
    'Virtual nodes connected.',
    'Test environment initialized.',
  ]);

  const runExperiment = (expId: string) => {
    setActiveExpId(expId);
    if (expId === 'exp-lab-1') {
      changeState('Thinking', 3000, "Calculating inverse kinematics matrix... Simulation target reached!");
      setSimLog((prev) => [...prev, `[KINEMATICS] Joint solver returned target pose: [x:0.45, y:-0.2, z:0.8]`]);
    } else if (expId === 'exp-lab-2') {
      changeState('Focused', 3000, "LiDAR scan simulation processing virtual points.");
      setSimLog((prev) => [...prev, `[SIM-VISION] Virtual occupancy grid map updated. Loop closure simulated.`]);
    } else if (expId === 'exp-lab-3') {
      changeState('Working', 3000, `PID Loop Gains updated: Kp=${pidGains.kp}, Ki=${pidGains.ki}, Kd=${pidGains.kd}`);
      setSimLog((prev) => [...prev, `[SIM-CONTROL] PID step response settled in simulation. Zero overshoot.`]);
    }
  };

  return (
    <section id="lab" className="py-20 relative bg-brand-navy text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-sky/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sky/10 text-brand-sky font-mono text-xs font-bold border border-brand-sky/30">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
            PORTFOLIO SIMULATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Robotics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sky via-brand-blue to-brand-orange">
              Playground
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            A sandbox environment demonstrating core robotics concepts like kinematics, perception, and control loops through interactive simulations.
          </p>
        </div>

        {/* Experiment Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Module Selection */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold text-brand-sky uppercase tracking-wider block">
              Simulation Modules
            </span>

            {labExperiments.map((exp: LabExperiment) => {
              const isActive = exp.id === activeExpId;
              return (
                <motion.div
                  key={exp.id}
                  whileHover={{ x: 4 }}
                  onClick={() => runExperiment(exp.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/80 border-brand-sky shadow-glow-sky'
                      : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-blue/30 text-brand-sky font-mono text-[10px] font-bold">
                      {exp.type}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {exp.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">{exp.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">
                    {exp.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runExperiment(exp.id);
                    }}
                    className="mt-3 px-3.5 py-1.5 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    {exp.interactiveAction}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Interactive Console */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 shadow-xl backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-brand-sky">
                  <Terminal className="w-4 h-4" />
                  <span className="font-bold">SIMULATION_CONSOLE</span>
                </div>
                <span className="text-slate-400 font-semibold">VIRTUAL ENVIRONMENT</span>
              </div>

              {/* PID Controller Live Tuner Widget (Shown if Simulation type is active or just always) */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-brand-orange font-bold">PID Loop Tuning Simulator</span>
                  <button
                    onClick={() => {
                      setPidGains({ kp: 2.5, ki: 0.8, kd: 0.15 });
                      changeState('Working');
                    }}
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">Kp (Proportional): {pidGains.kp}</label>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={pidGains.kp}
                      onChange={(e) => setPidGains({ ...pidGains, kp: parseFloat(e.target.value) })}
                      className="w-full accent-brand-sky cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">Ki (Integral): {pidGains.ki}</label>
                    <input
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.05"
                      value={pidGains.ki}
                      onChange={(e) => setPidGains({ ...pidGains, ki: parseFloat(e.target.value) })}
                      className="w-full accent-brand-orange cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">Kd (Derivative): {pidGains.kd}</label>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      value={pidGains.kd}
                      onChange={(e) => setPidGains({ ...pidGains, kd: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Output Log Window */}
              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 font-mono text-xs text-slate-300 h-48 overflow-y-auto space-y-2">
                {simLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-brand-sky font-bold">&gt;</span>
                    <span className="leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>

              {/* Action Trigger */}
              <div className="flex justify-end gap-3 text-xs font-mono">
                <button
                  onClick={() => {
                    changeState('Celebrating', 3000, "All simulated tests passed!");
                    setSimLog((prev) => [...prev, '[SYSTEM] Simulation diagnostics complete: SUCCESS']);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Run Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
