import { motion } from 'framer-motion';
import { EXPERIENCE_DATA } from '../data/portfolioData';
import { Robot, SpeechNote } from '../components/Robot';
import { useRobot } from '../hooks/useRobot';

export function Experience() {
  const { changeState, setSpeed } = useRobot();

  const handleViewportEnter = (index: number) => {
    if (index === 0) {
      changeState('Walking');
      setSpeed(2.5); // Fast running effect
    } else if (index === 1) {
      changeState('Excited'); // Alert / Excited
      setSpeed(1);
    } else if (index === 2) {
      changeState('Curious');
      setSpeed(1);
    }
  };

  return (
    <section id="experience" className="py-24 bg-brand-bg">
      <div className="container-x grid lg:grid-cols-[1fr_auto] gap-10">
        <div>
          <span className="eyebrow">My Journey</span>
          <h2 className="h2 mt-4">Learning · Building · <span className="text-brand-blue">Growing</span></h2>
          <div className="mt-12 relative border-l-2 border-blue-200 ml-3 space-y-10">
            {EXPERIENCE_DATA.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                onViewportEnter={() => handleViewportEnter(i)}
                viewport={{ margin: "-30% 0px -30% 0px" }}
                transition={{ delay: i * 0.08 }}
                className="pl-8 relative"
              >
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand-blue ring-4 ring-white" />
                <p className="text-sm font-extrabold text-brand-navy/60">{e.period}</p>
                <h3 className="text-lg font-extrabold mt-0.5">{e.role}</h3>
                <p className="text-brand-blue font-semibold text-sm">{e.company}</p>
                <p className="mt-2 text-sm text-brand-slate max-w-xl leading-relaxed">{e.description}</p>
                {e.achievements && e.achievements.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {e.achievements.map((ach, idx) => (
                      <motion.li key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + idx * 0.1 }} viewport={{ once: true }} className="text-[13px] text-brand-slate/90 flex items-start">
                        <span className="text-brand-blue mr-2 mt-0.5 font-bold">▹</span>
                        <span className="leading-relaxed">{ach}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
                {e.technologies && e.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {e.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-brand-sky-light/50 border border-brand-blue/10 text-[11px] font-mono text-brand-blue font-semibold shadow-sm">{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block relative w-80">
          <div className="sticky top-32 flex flex-col items-center">
            <SpeechNote className="mb-4 rotate-6 z-10">Every step<br />counts!</SpeechNote>
            <Robot pose="front" className="w-80 h-[32rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}
