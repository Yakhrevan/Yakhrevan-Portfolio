import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';
import { PERSONAL_INFO as P } from '../data/portfolioData';
import { Robot3D } from '../components/Robot3D';

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: 'Email',
    value: P.socials.email,
    href: `mailto:${P.socials.email}`,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/yakhrevans',
    href: P.socials.linkedin,
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/Yakhrevan',
    href: P.socials.github,
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-sky/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-blue/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Content & Links */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            <div>
              <span className="eyebrow">Let's Connect</span>
              <h2 className="h2 mt-4">
                Have an idea?
                <br />
                Let's build it{' '}
                <span className="text-brand-blue">together.</span>
              </h2>
              <p className="mt-4 text-brand-slate leading-relaxed">
                I'm always open to discussing robotics projects, engineering opportunities, collaboration, or interesting technical ideas. Let's create something meaningful.
              </p>
            </div>

            {/* Contact links */}
            <div className="space-y-4">
              {CONTACT_LINKS.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="card p-4 flex gap-4 items-center hover:shadow-card-hover hover:-translate-y-1 hover:border-brand-sky/40 bg-white/60 backdrop-blur-sm transition-all duration-300 group"
                >
                  <div className="p-3 rounded-2xl bg-brand-sky-light text-brand-blue group-hover:bg-brand-blue group-hover:text-white group-hover:shadow-glow-blue/20 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-brand-navy">{label}</p>
                    <p className="text-xs font-semibold text-brand-slate truncate mt-0.5">{value}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-blue/30 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 relative"
          >
            {/* Form Card */}
            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-2xl shadow-brand-blue/5 border border-white relative z-10">
              
              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-brand-navy">Send me a message</h3>
                <p className="text-sm text-brand-slate mt-2">Fill out the form and I'll get back to you directly.</p>
              </div>
              
              {/* formsubmit.co form (direct to email) */}
              <form action={`https://formsubmit.co/${P.socials.email}`} method="POST" className="space-y-5">
                <input type="hidden" name="_subject" value="New message from Portfolio!" />
                <input type="hidden" name="_captcha" value="false" />
                {/* Optional: Add a hidden next url if you want to redirect them after submission. 
                    If omitted, formsubmit provides a default thank you page. */}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-brand-navy uppercase tracking-wider ml-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="w-full px-5 py-3.5 rounded-2xl bg-brand-bg/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-medium text-brand-navy placeholder:text-brand-slate/40" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-brand-navy uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="w-full px-5 py-3.5 rounded-2xl bg-brand-bg/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-medium text-brand-navy placeholder:text-brand-slate/40" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-brand-navy uppercase tracking-wider ml-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows={5} 
                    className="w-full px-5 py-4 rounded-2xl bg-brand-bg/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-medium text-brand-navy placeholder:text-brand-slate/40 resize-none" 
                    placeholder="How can we collaborate?"
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full btn-primary justify-center py-4 text-base mt-2 shadow-glow-blue/20 hover:shadow-glow-blue/40">
                  Send Message <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>

            {/* Small Floating Robot */}
            <div className="absolute -top-16 -right-8 w-32 h-32 sm:w-48 sm:h-48 z-20 hidden md:block">
              <Robot3D
                clip="Big_Wave_Hello"
                className="w-full h-full drop-shadow-2xl"
                cam={[0, 1.0, 3.5]}
                fov={38}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
