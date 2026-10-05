import { SafeEnv, Safe3D } from './SafeEnv';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { RobotModel, type ClipName } from './RobotModel';

interface Props {
  clip?: ClipName;
  loop?: boolean;
  onFinished?: () => void;
  className?: string;
  cam?: [number, number, number];
  fov?: number;
}

/** Lightweight canvas for the GLB robot (no orbit controls) — used in Splash & sections. */
export function Robot3D({ clip = 'Idle_15', loop = true, onFinished, className = '', cam = [0, 1.1, 3.2], fov = 32 }: Props) {
  return (
    <div className={`${className} relative`}>
      <Safe3D>
      <Canvas style={{ position: "absolute", inset: 0 }} camera={{ position: cam, fov }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#38BDF8" />
        <Suspense fallback={null}>
          <RobotModel clip={clip} loop={loop} onFinished={onFinished} position={[0, -1.05, 0]} />
          <SafeEnv />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.35} blur={2.2} far={2} />
        </Suspense>
      </Canvas></Safe3D>
    </div>
  );
}
