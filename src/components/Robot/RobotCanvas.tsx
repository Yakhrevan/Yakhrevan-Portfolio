import React, { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import { RobotModel } from './RobotModel';
import { RobotStateConfig } from '../../types/robot';

interface RobotCanvasProps {
  config: RobotStateConfig;
  speed: number;
  isBlueprintMode: boolean;
  reducedMotion: boolean;
  onRobotClick?: () => void;
  onRobotHover?: () => void;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  className?: string;
  showShadow?: boolean;
}

// Error Boundary for WebGL context loss
class WebGLErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('WebGL Rendering Notice:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const RobotCanvas: React.FC<RobotCanvasProps> = ({
  config,
  speed,
  isBlueprintMode,
  reducedMotion,
  onRobotClick,
  onRobotHover,
  enableControls = true,
  cameraPosition = [0, 1.0, 4.0],
  cameraFov = 40,
  className = 'w-full h-full min-h-[400px]',
  showShadow = true,
}) => {
  return (
    <div className={`relative ${className}`}>
      <WebGLErrorBoundary
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50 border border-brand-sky/20 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-2xl font-bold mb-3">
              🤖
            </div>
            <h4 className="text-base font-bold text-brand-navy">3D Robot Loading</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              WebGL context is loading. The interactive robot will appear shortly.
            </p>
          </div>
        }
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: cameraPosition, fov: cameraFov }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Studio Lighting Setup */}
          <ambientLight intensity={isBlueprintMode ? 0.4 : 0.7} />

          {/* Key light */}
          <directionalLight
            position={[4, 8, 6]}
            intensity={1.4}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={15}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-3}
          />

          {/* Fill light — cool blue from left */}
          <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#38BDF8" />

          {/* Rim light — warm from behind */}
          <directionalLight position={[0, 3, -5]} intensity={0.3} color="#F97316" />

          {/* State-reactive point light */}
          <pointLight
            position={[0, 2, 2.5]}
            intensity={0.6}
            color={config.lightColor}
            distance={6}
          />

          {/* Under glow */}
          <pointLight
            position={[0, -1, 1]}
            intensity={0.3}
            color="#38BDF8"
            distance={4}
          />

          {/* Blueprint Mode Grid */}
          {isBlueprintMode && (
            <gridHelper
              args={[12, 24, '#38BDF8', '#0EA5E9']}
              position={[0, -1.2, 0]}
            />
          )}

          {/* 3D Robot Model */}
          <Suspense fallback={null}>
            <Float
              speed={reducedMotion ? 0 : 1.8}
              rotationIntensity={reducedMotion ? 0 : 0.15}
              floatIntensity={reducedMotion ? 0 : 0.25}
              floatingRange={[-0.04, 0.04]}
            >
              <RobotModel
                config={config}
                speed={speed}
                isBlueprintMode={isBlueprintMode}
                reducedMotion={reducedMotion}
                onClick={onRobotClick}
                onPointerOver={onRobotHover}
              />
            </Float>

            {/* Contact Shadow */}
            {!isBlueprintMode && showShadow && (
              <ContactShadows
                position={[0, -1.0, 0]}
                opacity={0.5}
                scale={5}
                blur={2.5}
                far={4}
                color="#0F172A"
              />
            )}
          </Suspense>

          {/* Orbit Controls */}
          {enableControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={2.5}
              maxDistance={7.0}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              rotateSpeed={0.6}
            />
          )}
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
