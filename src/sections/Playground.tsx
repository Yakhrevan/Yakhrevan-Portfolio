import { useState } from 'react';
import { Bot, Terminal } from 'lucide-react';
import { RobotPlaygroundOverlay } from '../components/Robot/RobotPlaygroundOverlay';
import { RobotCommandConsole } from '../components/Robot/RobotCommandConsole';
import { useRobot } from '../hooks/useRobot';

/** Compact disclosure that reveals the full 16-state animation controller (spec #14). */
export function Playground() {
  const [open, setOpen] = useState(false);
  const { toggleConsole, state } = useRobot();

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container-x text-center">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-brand-navy text-white font-bold text-sm shadow-lift hover:bg-brand-navy/90 hover:-translate-y-0.5 transition"
          >
            <Bot className="w-4 h-4 text-brand-sky" /> Interact With Robot
          </button>
        ) : (
          <div className="text-left">
            <RobotPlaygroundOverlay />
            <button
              onClick={() => toggleConsole()}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-slate hover:text-brand-blue transition"
            >
              <Terminal className="w-3.5 h-3.5" /> {state.isConsoleOpen ? 'Close' : 'Open'} CLI Console
            </button>
            <RobotCommandConsole isOpen={state.isConsoleOpen} onClose={() => toggleConsole()} />
          </div>
        )}
      </div>
    </section>
  );
}
