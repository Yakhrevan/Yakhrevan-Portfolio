import { Component, type ReactNode } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';

// Serve Draco locally (no CDN) so GLB never hangs offline / behind blockers.
useGLTF.setDecoderPath('/draco/');

/** Offline studio lighting — replaces <Environment preset="city"> which fetched an HDR from a CDN. */
export function SafeEnv() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2} position={[0, 4, 3]} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#38BDF8" position={[-5, 1, -2]} scale={[3, 6, 1]} />
      <Lightformer form="rect" intensity={1} color="#F97316" position={[5, 0, -3]} scale={[2, 5, 1]} />
      <Lightformer form="ring" intensity={1.5} position={[0, 2, -6]} scale={4} />
    </Environment>
  );
}

/** Keeps a failed 3D canvas from taking down the whole page. */
export class Safe3D extends Component<{ children: ReactNode; fallback?: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    return this.state.err
      ? (this.props.fallback ?? <img src="/brand/robot-front.webp" alt="Robot" className="h-full w-full object-contain" />)
      : this.props.children;
  }
}
