import { motion } from 'framer-motion';

// Original hero technology constellation, preserved with a mobile-safe layout.
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

const DESKTOP_POSITIONS = [
  'left-[0%] top-[2%]', 'right-[0%] top-[2%]',
  'left-[4%] top-[20%]', 'right-[2%] top-[20%]',
  'left-[0%] top-[40%]', 'right-[0%] top-[40%]',
  'left-[4%] top-[60%]', 'right-[2%] top-[60%]',
  'left-[0%] top-[79%]', 'right-[0%] top-[79%]',
  'left-[23%] top-[81%]', 'right-[23%] top-[81%]',
];

function TechSymbol({ name, src }: { name: string; src: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border border-blue-100 bg-white/90 px-1.5 py-2 shadow-sm backdrop-blur-sm" title={name}>
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
        className="h-6 w-6 object-contain sm:h-7 sm:w-7"
      />
      <span className="max-w-full text-center text-[9px] font-bold leading-tight text-brand-navy sm:text-[10px]">{name}</span>
    </div>
  );
}

export function FloatingSkills({ mode }: { mode: 'desktop' | 'mobile' }) {
  if (mode === 'desktop') {
    return (
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-label="Floating technology icons">
        {TECH.map((tech, index) => (
          <motion.div
            key={tech.name}
            className={`absolute h-[66px] w-[76px] xl:h-[72px] xl:w-[84px] ${DESKTOP_POSITIONS[index]}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: [0, -9, 0] }}
            transition={{ opacity: { duration: .5, delay: .2 + index * .06 }, y: { repeat: Infinity, duration: 4.2 + (index % 4) * .55, ease: 'easeInOut', delay: index * .2 } }}
          >
            <TechSymbol name={tech.name} src={tech.src} />
          </motion.div>
        ))}
      </div>
    );
  }
  return (
      <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:hidden" aria-label="Tools and technologies">
        {TECH.map((tech) => (
          <div key={tech.name} className="h-16 min-w-0">
            <TechSymbol name={tech.name} src={tech.src} />
          </div>
        ))}
      </div>
  );
}
