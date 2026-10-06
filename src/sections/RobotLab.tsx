import { SafeEnv, Safe3D } from '../components/SafeEnv';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Html } from '@react-three/drei';
import { Loader2, RotateCcw } from 'lucide-react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// ──────────────────────────────────────────────
// INLINE LAB ROBOT MODEL
// Loads /models/robot.glb, detects real animation clips,
// and plays them with crossfade support.
// ──────────────────────────────────────────────

interface LabRobotProps {
  clipName: string;
  position?: [number, number, number];
}

function LabRobot({ clipName, position = [0, -1, 0] }: LabRobotProps) {
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/robot.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { ref, actions, mixer } = useAnimations(animations);

  useEffect(() => {
    const action = actions[clipName];
    if (!action) return;

    // Fade out all current
    Object.values(actions).forEach((a) => a?.fadeOut(0.35));

    // One-shot clips
    const ONE_SHOT = new Set(['Big_Wave_Hello', 'Wake_Up_and_Look_Up', 'Alert', 'Dead']);
    const isOneShot = ONE_SHOT.has(clipName);

    action.reset().fadeIn(0.35).play();
    action.setLoop(isOneShot ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = isOneShot;

    // If one-shot, return to idle when done
    const handleFinished = () => {
      const idle = actions['Idle_15'];
      if (idle && isOneShot) {
        action.fadeOut(0.35);
        idle.reset().fadeIn(0.35).play();
        idle.setLoop(THREE.LoopRepeat, Infinity);
      }
    };
    if (isOneShot) {
      mixer.addEventListener('finished', handleFinished);
    }

    return () => {
      if (isOneShot) {
        mixer.removeEventListener('finished', handleFinished);
      }
    };
  }, [clipName, actions, mixer]);

  return <primitive ref={ref} object={clone} scale={1} position={position} />;
}

// ──────────────────────────────────────────────
// ANIMATION CLIPS DETECTOR
// ──────────────────────────────────────────────

// Human-readable labels for known Mixamo clips
const CLIP_LABELS: Record<string, string> = {
  'Idle_15': 'Idle',
  'Big_Wave_Hello': 'Wave Hello',
  'Walking': 'Walking',
  'Running': 'Running',
  'Bubble_Dance': 'Dance',
  'Wake_Up_and_Look_Up': 'Wake Up',
  'Dozing_Elderly': 'Sleepy',
  'Talk_with_Left_Hand_on_Hip': 'Talking',
  'Mirror_Viewing': 'Thinking',
  'Alert': 'Alert',
  'CrouchLookAroundBow': 'Curious',
  'Dead': 'Dead',
};

function AnimationDetector({ onClipsLoaded }: { onClipsLoaded: (clips: string[]) => void }) {
  const { animations } = useGLTF(`${import.meta.env.BASE_URL}models/robot.glb`);
  
  useEffect(() => {
    if (animations && animations.length > 0) {
      onClipsLoaded(animations.map(a => a.name));
    }
  }, [animations, onClipsLoaded]);
  
  return null;
}

// ──────────────────────────────────────────────
// LOADING INDICATOR
// ──────────────────────────────────────────────

function Loading() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 text-brand-sky animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Loading robot...</span>
      </div>
    </Html>
  );
}

// ──────────────────────────────────────────────
// 3D ROBOT LAB SECTION
// ──────────────────────────────────────────────

export function RobotLab() {
  const [clip, setClip] = useState('Idle_15');
  const [autoRotate, setAutoRotate] = useState(true);
  const [clips, setClips] = useState<{ id: string; label: string }[]>([]);

  return (
    <section id="lab" className="py-24 bg-brand-navy text-white relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-[#0B1120] to-brand-navy pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow !text-brand-sky">3D Robot Lab</span>
          <h2 className="h2 mt-4 !text-white">
            Explore the <span className="text-brand-sky">Robot</span> · 360°
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl">
            Drag to orbit, scroll to zoom, and try the animation clips.
          </p>
        </motion.div>

        {/* Lab Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-10 grid lg:grid-cols-[1fr_240px] gap-6"
        >
          {/* 3D Viewport */}
          <div className="relative h-[440px] sm:h-[520px] lg:h-[560px] rounded-3xl overflow-hidden border border-white/10 bg-black/30">
            <Safe3D><Canvas
              camera={{ position: [0, 1.4, 4.2], fov: 36 }}
              dpr={[1, 2]}
              shadows
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
              <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#38BDF8" />
              <pointLight position={[0, -1, 1]} intensity={0.3} color="#38BDF8" distance={5} />

              <Suspense fallback={<Loading />}>
                <AnimationDetector onClipsLoaded={(clipNames) => {
                  setClips(clipNames.map(id => ({ id, label: CLIP_LABELS[id] || id })));
                }} />
                <LabRobot clipName={clip} position={[0, -1, 0]} />
                <SafeEnv />
                <ContactShadows
                  position={[0, -1, 0]}
                  opacity={0.45}
                  blur={2.4}
                  far={3}
                  color="#000000"
                />
              </Suspense>

              <Grid
                position={[0, -1, 0]}
                args={[20, 20]}
                cellColor="#1E293B"
                sectionColor="#2563EB"
                fadeDistance={14}
                infiniteGrid
              />

              <OrbitControls
                autoRotate={autoRotate}
                autoRotateSpeed={1.2}
                enablePan={false}
                enableZoom
                minDistance={2.2}
                maxDistance={7}
                minPolarAngle={0.4}
                maxPolarAngle={1.5}
                target={[0, 0.2, 0]}
              />
            </Canvas></Safe3D>

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <p className="text-[11px] text-slate-500 font-medium">
                🖱️ Drag to explore
              </p>
              <button
                onClick={() => setAutoRotate((a) => !a)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-semibold hover:bg-white/20 transition-colors"
                aria-label={autoRotate ? 'Pause auto rotation' : 'Resume auto rotation'}
              >
                <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
                {autoRotate ? 'Pause' : 'Auto Rotate'}
              </button>
            </div>
          </div>

          {/* Animation Selector */}
          <div className="flex flex-col gap-1.5 max-h-[560px] overflow-y-auto pr-1">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2 px-1">
              Animations
            </p>
            {clips.map((c) => (
              <button
                key={c.id}
                onClick={() => setClip(c.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200 ${
                  clip === c.id
                    ? 'bg-brand-blue text-white shadow-glow-blue/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                aria-pressed={clip === c.id}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
