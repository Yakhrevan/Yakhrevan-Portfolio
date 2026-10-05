import { useState, useEffect, useCallback } from 'react';

/**
 * Tracks scroll progress as a 0-1 value.
 * Also exposes the currently visible section ID.
 */
export function useScrollProgress(sectionIds: string[] = []) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0);

    // Determine active section
    let current = sectionIds[0] || '';
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 160) {
        current = id;
      }
    }
    setActiveSection(current);
  }, [sectionIds]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { progress, activeSection };
}
