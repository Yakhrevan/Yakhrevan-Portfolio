import { useState } from 'react';
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
import { ProjectDetail } from './pages/ProjectDetail';
import { Project } from './types/portfolio';

const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'lab', 'contact'] as const;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Splash onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && selectedProject && (
        <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
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
            <Projects onProjectClick={setSelectedProject} />
            <RobotLab />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
