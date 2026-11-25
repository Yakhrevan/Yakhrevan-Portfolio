import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DeferredSection } from './components/DeferredSection';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';
import { GitHubRepos } from './sections/GitHubRepos';
import { ProjectDetail } from './pages/ProjectDetail';
import { Project } from './types/portfolio';
import { PROJECTS_DATA } from './data/portfolioData';

const SECTION_IDS = ['home', 'projects', 'about', 'skills', 'experience', 'lab', 'contact'] as const;
const RobotLab = lazy(() => import('./sections/RobotLab').then((module) => ({ default: module.RobotLab })));
const ScrollCompanion = lazy(() => import('./components/ScrollCompanion').then((module) => ({ default: module.ScrollCompanion })));
const Splash = lazy(() => import('./components/Splash').then((module) => ({ default: module.Splash })));

function projectFromUrl(): Project | null {
  const projectId = new URLSearchParams(window.location.search).get('project');
  return PROJECTS_DATA.find((project) => project.id === projectId) ?? null;
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projectFromUrl);
  const [showCompanion, setShowCompanion] = useState(false);
  const [showIntro, setShowIntro] = useState(() =>
    projectFromUrl() === null &&
    window.location.hash === '' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const dismissIntro = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    const handleBackForward = () => setSelectedProject(projectFromUrl());
    window.addEventListener('popstate', handleBackForward);
    return () => window.removeEventListener('popstate', handleBackForward);
  }, []);

  useEffect(() => {
    const enableCompanionAfterEngagement = () => {
      const canShow = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches;
      if (canShow && window.scrollY > window.innerHeight * 1.5) {
        setShowCompanion(true);
        window.removeEventListener('scroll', enableCompanionAfterEngagement);
      }
    };
    enableCompanionAfterEngagement();
    window.addEventListener('scroll', enableCompanionAfterEngagement, { passive: true });
    return () => window.removeEventListener('scroll', enableCompanionAfterEngagement);
  }, []);

  const openProject = (project: Project) => {
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.id);
    url.hash = '';
    window.history.pushState({}, '', url);
    setSelectedProject(project);
  };

  const closeProject = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    url.hash = 'projects';
    window.history.pushState({}, '', url);
    setSelectedProject(null);
    requestAnimationFrame(() => document.getElementById('projects')?.scrollIntoView());
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg text-sm font-bold text-brand-blue" role="status">Preparing your robotics portfolio…</div>}>
            <Splash onDone={dismissIntro} />
          </Suspense>
        )}
      </AnimatePresence>
      {selectedProject && (
        <ProjectDetail project={selectedProject} onBack={closeProject} />
      )}
      {!selectedProject && (
        <>
          <Navbar />
          {showCompanion && (
            <Suspense fallback={null}>
              <ScrollCompanion sectionIds={[...SECTION_IDS]} />
            </Suspense>
          )}
          <main>
            <Hero />
            <Projects onProjectClick={openProject} />
            <About />
            <Skills />
            <Experience />
            <GitHubRepos />
            <DeferredSection
              id="lab"
              placeholder={<section className="min-h-[480px] bg-brand-navy px-6 py-20 text-center text-white"><p className="font-mono text-xs uppercase tracking-widest text-brand-sky">Interactive 3D lab</p><p className="mt-4 text-2xl font-extrabold">Robot lab loads as you explore</p></section>}
            >
              <Suspense fallback={<section className="min-h-[480px] bg-brand-navy px-6 py-20 text-center text-slate-200">Preparing the interactive robot lab…</section>}>
                <RobotLab />
              </Suspense>
            </DeferredSection>
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
