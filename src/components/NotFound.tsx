import { SafeEnv } from './SafeEnv';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Html } from '@react-three/drei';
import { Loader2, Home } from 'lucide-react';
import { RobotModel } from './RobotModel';

/** Standalone 404 page — matches the "14. 404 Page" board. Shown for any unknown path. */
export function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <p className="technical-label mb-2">ERROR · 404</p>
      <h1 className="text-6xl sm:text-7xl font-extrabold" style={{ color: 'var(--accent-blue)' }}>404</h1>
      <p className="mt-3 text-lg font-semibold">Oops! Looks like you're lost in the circuits.</p>
      <div className="w-56 h-56 sm:w-64 sm:h-64 my-6">
        <Canvas camera={{ position: [0, 1.1, 3.4], fov: 32 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          <Suspense fallback={<Html center><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-blue)' }} /></Html>}>
            <RobotModel clip="CrouchLookAroundBow" loop position={[0, -1.05, 0]} />
            <SafeEnv />
            <ContactShadows position={[0, -1.05, 0]} opacity={0.35} blur={2.2} far={2} />
          </Suspense>
        </Canvas>
      </div>
      <a href="/" className="btn-primary">
        <Home className="w-4 h-4" /> Go Home
      </a>
    </main>
  );
}
