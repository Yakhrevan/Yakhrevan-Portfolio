import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, CheckCircle2, Github, Linkedin, Sparkles, ArrowRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useRobot } from '../hooks/useRobot';
import { RobotCanvas } from '../components/Robot/RobotCanvas';

export const Contact: React.FC = () => {
  const { state, config, changeState } = useRobot();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    changeState('Celebrating', 5000, `Thank you ${formData.name}! Your message has been received!`);
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange font-mono text-xs font-bold border border-brand-orange/20">
              <Sparkles className="w-3.5 h-3.5" />
              GET IN TOUCH
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Have an idea?{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">
                Let's build it together.
              </span>
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-lg">
              I'm always open to discussing projects, opportunities, or just talking about robotics and technology.
            </p>
          </motion.div>

          {/* Robot with speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <RobotCanvas
              config={{ ...config, state: 'Waving', eyeShape: 'happy' }}
              speed={state.speed}
              isBlueprintMode={false}
              reducedMotion={state.reducedMotion}
              enableControls={false}
              cameraPosition={[0.5, 1.0, 3.5]}
              cameraFov={36}
              className="w-full h-[250px]"
              showShadow={false}
            />
            {/* Let's Connect bubble */}
            <div className="absolute top-2 right-4 bg-white px-4 py-2.5 rounded-2xl shadow-card border border-slate-100">
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45" />
              <p className="text-xs font-bold text-brand-navy">Let's Connect! 🤝</p>
            </div>
          </motion.div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email */}
            <a
              href={`mailto:${PERSONAL_INFO.socials.email}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-sky/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Email</span>
                <span className="text-sm font-bold text-brand-navy">{PERSONAL_INFO.socials.email}</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-sky/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-sky/10 text-brand-sky flex items-center justify-center group-hover:bg-brand-sky group-hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">LinkedIn</span>
                <span className="text-sm font-bold text-brand-navy">linkedin.com/in/yakhrevan</span>
              </div>
            </a>

            {/* GitHub */}
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-sky/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">GitHub</span>
                <span className="text-sm font-bold text-brand-navy">github.com/Yakhrevan</span>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Location</span>
                <span className="text-sm font-bold text-brand-navy">{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold">Message Sent! 🎉</h4>
                  <p className="text-sm font-medium">
                    Thank you {formData.name}! I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Yakhrevan"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-sky focus:bg-white outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-sky focus:bg-white outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Collaboration"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-sky focus:bg-white outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Yakhrevan, I'd like to discuss..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-sky focus:bg-white outline-none transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-sm shadow-glow-blue flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    Send a Message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
