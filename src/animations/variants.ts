import type { Variants } from 'framer-motion';

// ──────────────────────────────────────────────
// ANIMATION 4: Stagger Cascade Reveal
// ──────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ──────────────────────────────────────────────
// ANIMATION 9: Scroll-Triggered Scale-In
// ──────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// ──────────────────────────────────────────────
// ANIMATION 10: Elastic Spring Hover
// ──────────────────────────────────────────────
export const elasticHover = {
  rest: { scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  hover: { scale: 1.04, y: -8, transition: { type: 'spring', stiffness: 400, damping: 10 } },
};

// ──────────────────────────────────────────────
// ANIMATION 11: Reveal Clip-Path Wipe
// ──────────────────────────────────────────────
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)', opacity: 1,
    transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] },
  },
};

// ──────────────────────────────────────────────
// ANIMATION 17: Slide-In Drawer (Mobile Nav)
// ──────────────────────────────────────────────
export const slideDrawer: Variants = {
  closed: {
    opacity: 0, height: 0, y: -10,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  open: {
    opacity: 1, height: 'auto', y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ──────────────────────────────────────────────
// Slide from Left / Right
// ──────────────────────────────────────────────
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: 'blur(4px)' },
  visible: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: 'blur(4px)' },
  visible: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ──────────────────────────────────────────────
// ANIMATION 7: Flip Card 3D Rotate
// ──────────────────────────────────────────────
export const flipCard: Variants = {
  hidden: { rotateY: -90, opacity: 0 },
  visible: {
    rotateY: 0, opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ──────────────────────────────────────────────
// ANIMATION 19: Accordion Expand
// ──────────────────────────────────────────────
export const accordionExpand: Variants = {
  collapsed: {
    height: 0, opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  expanded: {
    height: 'auto', opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade up (generic)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
