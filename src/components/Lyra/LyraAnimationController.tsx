import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LyraState = 'splash' | 'idle' | 'greeting' | 'thinking' | 'speaking' | 'success' | 'error' | 'goodbye';

interface LyraContextType {
  currentState: LyraState;
  setState: (state: LyraState) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
}

const LyraContext = createContext<LyraContextType | undefined>(undefined);

export const LyraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentState, setCurrentState] = useState<LyraState>('splash');
  
  // Checking for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  return (
    <LyraContext.Provider value={{ currentState, setState: setCurrentState, reducedMotion, setReducedMotion }}>
      {children}
    </LyraContext.Provider>
  );
};

export const useLyra = () => {
  const context = useContext(LyraContext);
  if (context === undefined) {
    throw new Error('useLyra must be used within a LyraProvider');
  }
  return context;
};
