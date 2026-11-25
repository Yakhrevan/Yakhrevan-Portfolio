import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Splash } from './components/Splash';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollCompanion } from './components/ScrollCompanion';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { RobotLab } from './sections/RobotLab';
import { Contact } from './sections/Contact';
import { GitHubRepos } from './sections/GitHubRepos';
import { ProjectDetail } from './pages/ProjectDetail';
import { Project } from './types/portfolio';
import { PROJECTS_DATA } from './data/portfolioData';

const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'lab', 'contact'] as const;

function projectFromUrl(): Project | null {
  const projectId = new URLSearchParams(window.location.search).get('project');
  return PROJECTS_DATA.find((project) => project.id === projectId) ?? null;
}

export default function App() {
  // A shared project URL opens directly, without delaying the visitor behind the splash.
  const [loading, setLoading] = useState(() => projectFromUrl() === null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(projectFromUrl);

  useEffect(() => {
    const handleBackForward = () => setSelectedProject(projectFromUrl());
    window.addEventListener('popstate', handleBackForward);
    return () => window.removeEventListener('popstate', handleBackForward);
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
      <AnimatePresence mode="wait">
        {loading && <Splash onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && selectedProject && (
        <ProjectDetail project={selectedProject} onBack={closeProject} />
      )}
      {!loading && !selectedProject && (
        <>
          <Navbar />
          <ScrollCompanion sectionIds={[...SECTION_IDS]} />
          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects onProjectClick={openProject} />
            <GitHubRepos />
            <RobotLab />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
