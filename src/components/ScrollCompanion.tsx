import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Robot3D } from './Robot3D';
import type { ClipName } from './RobotModel';

// Map section IDs to animation clips for the companion robot
const SECTION_CLIPS: Record<string, ClipName> = {
  home: 'Idle_15',
  about: 'Mirror_Viewing',           // Thinking/Curious
  skills: 'Talk_with_Left_Hand_on_Hip', // Working
  projects: 'Bubble_Dance',          // Excited
  lab: 'CrouchLookAroundBow',        // Curious/Focused
  contact: 'Big_Wave_Hello',         // Waving
};

interface ScrollCompanionProps {
  sectionIds: string[];
}

export function ScrollCompanion({ sectionIds }: ScrollCompanionProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show companion after scrolling past the hero
      setVisible(scrollY > window.innerHeight * 0.7);

      // Determine active section
      let current = sectionIds[0] || 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const currentClip = SECTION_CLIPS[activeSection] || 'Idle_15';

  return (
    <AnimatePresence>
      <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-8 right-4 z-40 pointer-events-none"
          style={{ width: '120px', height: '140px' }}
          aria-hidden="true"
        >
          <Robot3D
            clip={currentClip}
            loop
            className="w-full h-full"
            cam={[0, 0.8, 3.2]}
            fov={28}
          />
        </motion.div>
    </AnimatePresence>
  );
}
