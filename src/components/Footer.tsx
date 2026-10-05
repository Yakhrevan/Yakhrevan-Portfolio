import { Github, Linkedin, Mail } from 'lucide-react';
import { PERSONAL_INFO as P } from '../data/portfolioData';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'lab', label: 'Robot Lab' },
  { id: 'contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  { icon: Github, href: P.socials.github, label: 'GitHub' },
  { icon: Linkedin, href: P.socials.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${P.socials.email}`, label: 'Email' },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="container-x py-14 grid md:grid-cols-3 gap-10 items-start">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand/logo-white.png" alt="" className="h-9" aria-hidden="true" />
            <span className="text-xl font-extrabold tracking-wide">YAKHREVAN</span>
          </div>
          <p className="mt-4 text-sm text-slate-300">{P.tagline}</p>
          <p className="mt-2 text-[11px] tracking-widest text-slate-500 uppercase">
            Robotics · Embedded · AI
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-brand-blue transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4 text-sm">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="hover:text-brand-sky transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Motto */}
        <div className="md:text-right">
          <div className="font-hand text-3xl text-brand-sky leading-snug">
            Build · Learn
            <br />
            Explore · Repeat
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Yakhrevan. All rights reserved.
      </div>
    </footer>
  );
}
