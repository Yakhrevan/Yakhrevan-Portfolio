import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'lab', label: 'Robot Lab' },
  { id: 'contact', label: 'Contact' },
] as const;

export function Navbar() {
  const [active, setActive] = useState<string>('home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      let cur = 'home';
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_12px_-4px_rgba(15,23,42,0.08)] border-b border-slate-100/60'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          className="flex items-center gap-2.5 group"
          aria-label="Go to home"
        >
          <img src="/brand/logo-navy.png" alt="Yakhrevan Logo" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-extrabold tracking-wide text-brand-navy text-lg">
            YAKH<span className="text-brand-blue">REVAN</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(id); }}
              className={`relative px-3.5 py-2 text-[13px] font-semibold rounded-lg transition-colors duration-200 ${
                active === id
                  ? 'text-brand-blue'
                  : 'text-brand-navy/70 hover:text-brand-blue hover:bg-brand-bg'
              }`}
            >
              {label}
              {active === id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-brand-blue rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
            className="hidden md:inline-flex btn-primary !py-2 !px-5 !text-xs"
          >
            Let's Connect
          </a>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white border-t border-slate-100 shadow-lift overflow-hidden"
          >
            <nav className="px-5 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(id); }}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    active === id
                      ? 'text-brand-blue bg-brand-sky-light'
                      : 'text-brand-navy hover:bg-slate-50'
                  }`}
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                className="btn-primary mt-2 justify-center"
              >
                Let's Connect
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
