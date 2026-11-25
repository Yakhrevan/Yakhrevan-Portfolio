import { useEffect, useRef, useState, type ReactNode } from 'react';

interface DeferredSectionProps {
  id: string;
  children: ReactNode;
  placeholder: ReactNode;
}

/** Keeps below-the-fold WebGL assets out of the first page load. */
export function DeferredSection({ id, children, placeholder }: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' },
    );
    const element = ref.current;
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  return <div id={id} ref={ref}>{visible ? children : placeholder}</div>;
}
