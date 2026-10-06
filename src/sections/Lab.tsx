import { SafeEnv, Safe3D } from '../components/SafeEnv';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Html } from '@react-three/drei';
import { Loader2, FlaskConical } from 'lucide-react';
import { RobotModel, type ClipName } from '../components/RobotModel';
import { LAB_EXPERIMENTS } from '../data/portfolioData';

const CLIPS: { id: ClipName; label: string }[] = [
  { id: 'Idle_15', label: 'Idle' },
  { id: 'Big_Wave_Hello', label: 'Wave Hello' },
  { id: 'Walking', label: 'Walking' },
  { id: 'Running', label: 'Running' },
  { id: 'Bubble_Dance', label: 'Dance' },
  { id: 'Wake_Up_and_Look_Up', label: 'Wake Up' },
  { id: 'Dozing_Elderly', label: 'Sleepy' },
  { id: 'Talk_with_Left_Hand_on_Hip', label: 'Talking' },
  { id: 'Mirror_Viewing', label: 'Mirror_Viewing' },
  { id: 'Alert', label: 'Alert' },
  { id: 'CrouchLookAroundBow', label: 'Curious' },
];

function Loading() {
  return <Html center><Loader2 className="w-6 h-6 text-brand-blue animate-spin" /></Html>;
}

/** Dedicated full 3D platform: orbit the GLB robot 360° on a grid, and switch its animation. */
export function Lab() {
  const [clip, setClip] = useState<ClipName>('Idle_15');
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <section id="lab" className="py-12 lg:py-24 bg-brand-navy text-white">
      <div className="container-x">
        <span className="eyebrow !text-brand-sky">3D Lab</span>
        <h2 className="h2 mt-4 text-white">Rotate the <span className="text-brand-sky">Robot</span> · 360°</h2>
        <p className="mt-3 text-slate-300 max-w-xl">Drag to orbit, scroll to zoom, and try the animation clips exported from the rig.</p>

        <div className="mt-10 grid lg:grid-cols-[1fr_260px] gap-6">
          <div className="relative h-[480px] sm:h-[560px] rounded-3xl overflow-hidden border border-white/10 bg-black/20">
            <Safe3D><Canvas camera={{ position: [0, 1.4, 4.2], fov: 36 }} dpr={[1, 1.5]} shadows>
              <ambientLight intensity={0.7} />
              <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
              <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#38BDF8" />
              <Suspense fallback={<Loading />}>
                <RobotModel clip={clip} loop position={[0, -1, 0]} />
                <SafeEnv />
                <ContactShadows position={[0, -1, 0]} opacity={0.45} blur={2.4} far={3} />
              </Suspense>
              <Grid position={[0, -1, 0]} args={[20, 20]} cellColor="#1E293B" sectionColor="#2563EB" fadeDistance={14} infiniteGrid />
              <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.6} enablePan={false} minDistance={2.2} maxDistance={7} minPolarAngle={0.4} maxPolarAngle={1.5} target={[0, 0.2, 0]} />
            </Canvas></Safe3D>
            <button onClick={() => setAutoRotate((a) => !a)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-xs font-semibold hover:bg-white/20 transition">
              {autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 content-start">
            {CLIPS.map((c) => (
              <button key={c.id} onClick={() => setClip(c.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition ${clip === c.id ? 'bg-brand-blue text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {LAB_EXPERIMENTS.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div className="flex items-center justify-between">
                <FlaskConical className="w-4 h-4 text-brand-sky" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400">{e.status}</span>
              </div>
              <h3 className="mt-3 font-bold text-sm">{e.title}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{e.description}</p>
              <span className="mt-3 inline-block text-[11px] font-mono text-brand-sky">{e.type} · {e.interactiveAction}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
