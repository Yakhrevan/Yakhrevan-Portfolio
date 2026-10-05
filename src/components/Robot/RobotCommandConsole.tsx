import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CornerDownLeft } from 'lucide-react';
import { robotController } from './RobotController';

interface RobotCommandConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'system';
  text: string;
}

export const RobotCommandConsole: React.FC<RobotCommandConsoleProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', text: 'Yakhrevan Robotics Mascot CLI v2.4 initialized.' },
    { type: 'system', text: 'Type "help" for a list of available telemetry & mood commands.' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmdText = inputVal.trim();
    if (cmdText.toLowerCase() === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    const output = robotController.executeCommand(cmdText);

    setLogs((prev) => [
      ...prev,
      { type: 'input', text: `> ${cmdText}` },
      { type: 'output', text: output },
    ]);
    setInputVal('');
  };

  const executePreset = (cmd: string) => {
    const output = robotController.executeCommand(cmd);
    setLogs((prev) => [
      ...prev,
      { type: 'input', text: `> ${cmd}` },
      { type: 'output', text: output },
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-brand-navy/95 border border-brand-sky/40 rounded-2xl shadow-glow-sky overflow-hidden font-mono text-xs text-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-brand-sky/20">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-sky" />
              <span className="font-bold text-white tracking-wide">
                ROBOT_CLI_CONSOLE // Yakhrevan Terminal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-emerald-400 font-semibold">ONLINE</span>
              <button
                onClick={onClose}
                className="ml-2 p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Command Bar */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 whitespace-nowrap">Quick Cmds:</span>
            <button
              onClick={() => executePreset('wave')}
              className="px-2.5 py-1 rounded bg-brand-blue/20 text-brand-sky hover:bg-brand-blue/40 transition-colors whitespace-nowrap"
            >
              wave
            </button>
            <button
              onClick={() => executePreset('mood excited')}
              className="px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/40 transition-colors whitespace-nowrap"
            >
              mood excited
            </button>
            <button
              onClick={() => executePreset('blueprint')}
              className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/40 transition-colors whitespace-nowrap"
            >
              blueprint
            </button>
            <button
              onClick={() => executePreset('status')}
              className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 transition-colors whitespace-nowrap"
            >
              status
            </button>
            <button
              onClick={() => executePreset('help')}
              className="px-2.5 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors whitespace-nowrap"
            >
              help
            </button>
          </div>

          {/* Console Log Area */}
          <div ref={scrollRef} className="p-4 h-72 overflow-y-auto space-y-2 leading-relaxed">
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.type === 'input'
                    ? 'text-brand-sky font-semibold'
                    : log.type === 'output'
                    ? 'text-slate-300 pl-4 border-l-2 border-brand-blue'
                    : 'text-slate-400 italic'
                }
              >
                {log.text}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-brand-sky/20 flex items-center gap-2">
            <span className="text-brand-orange font-bold pl-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type command (e.g. wave, mood celebrating, speed 1.5)..."
              className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs focus:ring-0 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold flex items-center gap-1 transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" /> Run
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
