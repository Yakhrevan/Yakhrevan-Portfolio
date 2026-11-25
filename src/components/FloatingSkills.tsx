import { motion, useReducedMotion } from 'framer-motion';

// Restored full-hero floating logos, intentionally subtle behind the content.
const TECH = [
  { name: 'ROS 2', src: 'https://cdn.simpleicons.org/ros/22314E' },
  { name: 'React Native', src: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Arduino', src: 'https://cdn.simpleicons.org/arduino/00979D' },
  { name: 'SolidWorks', src: `${import.meta.env.BASE_URL}solidworks.svg` },
  { name: 'STM32', src: 'https://cdn.simpleicons.org/stmicroelectronics/03234B' },
  { name: 'C++', src: 'https://cdn.simpleicons.org/cplusplus/00599C' },
  { name: 'Raspberry Pi', src: 'https://cdn.simpleicons.org/raspberrypi/A22846' },
  { name: 'Python', src: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'OpenCV', src: 'https://cdn.simpleicons.org/opencv/5C3EE8' },
  { name: 'Docker', src: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'Linux', src: 'https://cdn.simpleicons.org/linux/FCC624' },
  { name: 'Git', src: 'https://cdn.simpleicons.org/git/F05032' },
] as const;

// Positioning is relative to the ENTIRE home section, not the portrait frame.
// The small-screen positions keep logos near the edges and away from primary CTAs.
const POSITIONS = [
  'left-[3%] top-[13%] lg:left-[5%] lg:top-[10%]',
  'left-[76%] top-[6%] lg:left-[76%] lg:top-[6%]',
  'left-[26%] top-[8%] lg:left-[38%] lg:top-[12%]',
  'left-[85%] top-[30%] lg:left-[93%] lg:top-[30%]',
  'left-[2%] top-[37%] lg:left-[2%] lg:top-[40%]',
  'left-[51%] top-[27%] lg:left-[58%] lg:top-[30%]',
  'left-[83%] top-[51%] lg:left-[75%] lg:top-[50%]',
  'left-[5%] top-[65%] lg:left-[42%] lg:top-[59%]',
  'left-[48%] top-[64%] lg:left-[24%] lg:top-[70%]',
  'left-[87%] top-[76%] lg:left-[88%] lg:top-[77%]',
  'left-[32%] top-[88%] lg:left-[59%] lg:top-[86%]',
  'left-[7%] top-[90%] lg:left-[9%] lg:top-[89%]',
];

export function FloatingSkills() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {TECH.map((tech, index) => (
        <motion.div
          key={tech.name}
          className={`absolute opacity-[.12] sm:opacity-[.18] lg:opacity-[.23] xl:opacity-[.28] ${POSITIONS[index]}`}
          title={tech.name}
          animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [-6, 5, -6] }}
          transition={reduceMotion ? undefined : { repeat: Infinity, duration: 5 + index % 4, ease: 'easeInOut', delay: index * .24 }}
        >
          <img src={tech.src} alt="" loading="lazy" decoding="async" className="h-10 w-10 object-contain drop-shadow-sm sm:h-12 sm:w-12 xl:h-14 xl:w-14" />
        </motion.div>
      ))}
    </div>
  );
}
