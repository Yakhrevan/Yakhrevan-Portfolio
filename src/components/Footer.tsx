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
      <div className="container-x py-14 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Brand */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}brand/logo-white.png`} alt="" className="h-9" aria-hidden="true" />
            <span className="text-xl font-extrabold tracking-wide">YAKHREVAN</span>
          </div>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed pr-4">{P.tagline}</p>
          <p className="mt-2 text-[11px] tracking-widest text-slate-500 uppercase">
            Robotics · Embedded · AI
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-blue hover:scale-110 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 lg:col-span-4 flex md:justify-center">
          <div>
            <h4 className="font-bold mb-5 text-sm tracking-wide text-white uppercase">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-slate-400">
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="hover:text-brand-sky hover:translate-x-1 inline-block transition-all"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Motto */}
        <div className="md:col-span-4 lg:col-span-4 md:text-right flex flex-col md:items-end justify-start pt-2">
          <div className="font-hand text-3xl text-brand-sky leading-snug">
            Build · Learn
            <br />
            Explore · Repeat
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-6 mt-4 text-center text-xs text-slate-500 font-medium tracking-wide">
        © {new Date().getFullYear()} Yakhrevan. All rights reserved.
      </div>
    </footer>
  );
}
