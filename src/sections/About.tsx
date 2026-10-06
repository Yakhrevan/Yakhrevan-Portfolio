import { motion } from 'framer-motion';
import { GraduationCap, Target, Sparkles } from 'lucide-react';
import { PERSONAL_INFO as P } from '../data/portfolioData';

const INFO_CARDS = [
  {
    icon: GraduationCap,
    label: 'Education',
    value: 'B.E. Mechatronics',
  },
  {
    icon: Target,
    label: 'Focus',
    value: 'Robotics • Embedded • AI',
  },
  {
    icon: Sparkles,
    label: 'Interests',
    value: 'Autonomous Systems, Computer Vision, Embedded Design',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function About() {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-white via-brand-bg/50 to-white relative overflow-hidden"
    >
      {/* Background ambient blobs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-brand-sky/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span variants={fadeUp} custom={0} className="eyebrow">
            About Me
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="h2 mt-3">
            Engineering Ideas into{' '}
            <span className="text-brand-blue">Real-World Impact</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-3 text-brand-slate text-base">
            Combining hardware, embedded control & intelligent software to build next-generation machines.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Main Profile Card (centered) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-10 lg:col-start-2"
          >
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-card group">
              {/* Outer glow on hover */}
              <div className="absolute -inset-0.5 rounded-[1.8rem] bg-gradient-to-r from-brand-blue/15 via-brand-sky/20 to-brand-orange/10 blur opacity-0 group-hover:opacity-60 transition duration-500 -z-10" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                {/* Profile Picture */}
                <div className="relative shrink-0">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-md ring-4 ring-white">
                    <img
                      src={`${import.meta.env.BASE_URL}profile.jpg`}
                      alt={P.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Available badge */}
                  <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-100 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Available
                    </span>
                  </div>
                </div>

                {/* Profile details */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sky-light text-brand-blue text-xs font-bold mb-3">
                    <GraduationCap className="w-4 h-4" />
                    <span>Mechatronics Engineer</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-brand-navy">{P.name}</h3>
                  <p className="text-base text-brand-slate mt-4 leading-relaxed">
                    {P.bio}
                  </p>
                </div>
              </div>

              {/* Info cards */}
              <div className="mt-8 grid sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                {INFO_CARDS.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex gap-4 items-start p-4 rounded-xl hover:bg-brand-bg transition-colors"
                  >
                    <div className="p-3 rounded-xl bg-brand-sky-light text-brand-blue shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{label}</p>
                      <p className="text-sm text-brand-slate mt-1">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
