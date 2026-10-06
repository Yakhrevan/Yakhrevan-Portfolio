import React, { useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLyra } from './LyraAnimationController';

export const LyraRobotModel: React.FC = () => {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}robot/robot.glb`);
  const { currentState, reducedMotion } = useLyra();
  
  // Ref for the main group to apply procedural animations
  const groupRef = useRef<THREE.Group>(null);
  
  // Track time for procedural animations
  const timeRef = useRef(0);
  const stateTimeRef = useRef(0);
  const prevState = useRef(currentState);

  // Reset state time on state change
  if (prevState.current !== currentState) {
    stateTimeRef.current = 0;
    prevState.current = currentState;
  }

  // Initial splash state position is lower and slightly scaled down
  let targetPosition = new THREE.Vector3(0, 0.5, 0); // Raised base position
  let targetScale = 1.2;
  
  if (currentState === 'splash') {
    targetPosition.set(0, -1.0, 0);
    targetScale = 0.8;
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const lerpSpeed = 4.0;
    
    // Smoothly transition scale
    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * lerpSpeed);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);

    if (!reducedMotion) {
      timeRef.current += delta;
      stateTimeRef.current += delta;
      
      const t = timeRef.current;
      const st = stateTimeRef.current;
      
      // State-specific procedural animations
      if (currentState === 'greeting') {
        // Jump, spin and wave
        const jump = Math.sin(Math.min(st * 4, Math.PI)) * 0.6; // Higher jump
        targetPosition.y += jump > 0 ? jump : 0;
        
        // Add a full 360 spin
        const spinProgress = Math.min(st * 3, Math.PI * 2);
        
        // We'll apply the spin to rotation Y, and override the idle rotation Y temporarily
        groupRef.current.rotation.y = spinProgress;

        // More pronounced wave (tilt side to side)
        groupRef.current.rotation.z = Math.sin(st * 15) * 0.25 * Math.max(0, 1 - st/1.5);
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 4);
      }
      // Idle state procedural animation
      if (currentState === 'idle') {
        // Very subtle side-to-side drift rotation
        const targetRotY = Math.sin(t * 0.5) * 0.05;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 2);
      } else if (currentState !== 'greeting') {
        // Reset rotation Y in other states (except greeting which handles its own rotation Y)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 2);
      }
    }
    
    // Smoothly transition position (apply after state modifications)
    groupRef.current.position.lerp(targetPosition, delta * lerpSpeed);
  });

  return (
    <group dispose={null}>
      <Float
        speed={reducedMotion || currentState === 'splash' ? 0 : 2}
        rotationIntensity={reducedMotion || currentState === 'splash' ? 0 : 0.1}
        floatIntensity={reducedMotion || currentState === 'splash' ? 0 : 0.2}
        floatingRange={[-0.05, 0.05]}
      >
        <group ref={groupRef} position={[0, -0.8, 0]} scale={0.8}>
          <primitive object={scene} />
        </group>
      </Float>
    </group>
  );
};

useGLTF.preload(`${import.meta.env.BASE_URL}robot/robot.glb`);
