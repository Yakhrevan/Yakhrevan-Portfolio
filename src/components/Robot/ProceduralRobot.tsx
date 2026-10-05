import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RobotStateConfig } from '../../types/robot';
import { createRobotFaceTexture } from './RobotExpressions';

interface ProceduralRobotProps {
  config: RobotStateConfig;
  speed: number;
  isBlueprintMode: boolean;
  reducedMotion: boolean;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: () => void;
}

export const ProceduralRobot: React.FC<ProceduralRobotProps> = ({
  config,
  speed,
  isBlueprintMode,
  reducedMotion,
  onPointerOver,
  onPointerOut,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const torsoRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  
  const faceplateMeshRef = useRef<THREE.Mesh>(null!);

  const mousePos = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Face texture
  const faceTexture = useMemo(() => {
    return createRobotFaceTexture(config.eyeShape, config.lightColor, '#F43F5E');
  }, [config.eyeShape, config.lightColor]);

  // ============ MATERIALS ============
  const mat = (m: THREE.Material) => (isBlueprintMode ? wireMat : m);

  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF', roughness: 0.1, metalness: 0.1, wireframe: isBlueprintMode, transparent: isBlueprintMode, opacity: isBlueprintMode ? 0.35 : 1.0,
  }), [isBlueprintMode]);



  const darkGrayMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1F2937', roughness: 0.5, metalness: 0.3, wireframe: isBlueprintMode,
  }), [isBlueprintMode]);

  const blueMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2563EB', roughness: 0.8, metalness: 0.05, // Cloth-like
    wireframe: isBlueprintMode, transparent: isBlueprintMode, opacity: isBlueprintMode ? 0.5 : 1.0,
  }), [isBlueprintMode]);

  const cyanGlowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00FFFF', roughness: 0.1, metalness: 0.5, emissive: '#00FFFF', emissiveIntensity: isBlueprintMode ? 1.0 : 0.8, wireframe: isBlueprintMode,
  }), [isBlueprintMode]);

  const faceMat = useMemo(() => new THREE.MeshBasicMaterial({
    map: faceTexture, wireframe: isBlueprintMode, transparent: true,
  }), [faceTexture, isBlueprintMode]);

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00FFFF', wireframe: true,
  }), []);

  // ============ HORN GEOMETRY ============
  const hornGeometry = useMemo(() => {
    class HornCurve extends THREE.Curve<THREE.Vector3> {
      constructor() {
        super();
      }
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const x = Math.sin(t * Math.PI * 0.4) * 0.3;
        const y = t * 0.6;
        const z = Math.sin(t * Math.PI * 0.5) * 0.2;
        return optionalTarget.set(x, y, z);
      }
    }
    return new THREE.TubeGeometry(new HornCurve(), 20, 0.08, 12, false);
  }, []);

  // ============ ANIMATION LOOP ============
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const lerpFactor = Math.min(1.0, delta * 5.0 * speed);
    const time = state.clock.getElapsedTime() * speed;

    // Hover floating
    const floatAmplitude = reducedMotion ? 0.02 : 0.05;
    const floatFreq = config.bodyPose.floatSpeed;
    const targetY = config.bodyPose.hoverOffset + Math.sin(time * floatFreq) * floatAmplitude;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, lerpFactor);

    // Torso rotation
    if (torsoRef.current) {
      torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, config.bodyPose.torsoRotation[0], lerpFactor);
      torsoRef.current.rotation.y = THREE.MathUtils.lerp(torsoRef.current.rotation.y, config.bodyPose.torsoRotation[1], lerpFactor);
      torsoRef.current.rotation.z = THREE.MathUtils.lerp(torsoRef.current.rotation.z, config.bodyPose.torsoRotation[2], lerpFactor);
    }

    // Head rotation + mouse tracking
    if (headRef.current) {
      const mouseTiltX = reducedMotion ? 0 : mousePos.current.y * 0.1;
      const mouseTiltY = reducedMotion ? 0 : mousePos.current.x * 0.15;

      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, config.bodyPose.headRotation[0] - mouseTiltX, lerpFactor);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, config.bodyPose.headRotation[1] + mouseTiltY, lerpFactor);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, config.bodyPose.headRotation[2], lerpFactor);

      headRef.current.position.x = THREE.MathUtils.lerp(headRef.current.position.x, config.bodyPose.headPosition[0], lerpFactor);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 0.95 + config.bodyPose.headPosition[1], lerpFactor);
      headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, config.bodyPose.headPosition[2], lerpFactor);
    }

    // Arms
    if (leftArmRef.current && rightArmRef.current) {
      let leftX = config.bodyPose.leftArmRotation[0];
      let leftZ = config.bodyPose.leftArmRotation[2];
      let rightX = config.bodyPose.rightArmRotation[0];
      let rightZ = config.bodyPose.rightArmRotation[2];

      if (config.state === 'Waving') {
        leftZ = 0.5 + Math.sin(time * 10) * 0.4;
        leftX = -2.2 + Math.sin(time * 8) * 0.2;
      } else if (config.state === 'Walking') {
        leftX = Math.sin(time * 5) * 0.6;
        rightX = -Math.sin(time * 5) * 0.6;
      } else if (config.state === 'Celebrating') {
        leftZ = 0.5 + Math.sin(time * 12) * 0.25;
        rightZ = -0.5 - Math.sin(time * 12) * 0.25;
        leftX = -2.2 + Math.sin(time * 8) * 0.15;
        rightX = -2.2 + Math.cos(time * 8) * 0.15;
      }

      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, leftX, lerpFactor);
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, leftZ, lerpFactor);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rightX, lerpFactor);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, rightZ, lerpFactor);
    }

    // Legs
    if (leftLegRef.current && rightLegRef.current) {
      let legSwayL = 0;
      let legSwayR = 0;
      if (config.state === 'Walking') {
        legSwayL = Math.sin(time * 5) * 0.4;
        legSwayR = -Math.sin(time * 5) * 0.4;
      } else if (config.state === 'Sleepy' || config.state === 'Idle') {
        legSwayL = -1.2;
        legSwayR = -1.2;
      }
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, legSwayL, lerpFactor);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, legSwayR, lerpFactor);
    }
  });

  return (
    <group ref={groupRef} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick} dispose={null}>
      
      {/* ============ TORSO (HOODIE & BACKPACK) ============ */}
      <group ref={torsoRef} position={[0, 0, 0]}>
        {/* Main Hoodie Body */}
        <mesh position={[0, 0.4, 0]} material={mat(blueMat)}>
          <capsuleGeometry args={[0.35, 0.4, 16, 24]} />
        </mesh>

        {/* Hood Ring around neck */}
        <mesh position={[0, 0.65, -0.05]} rotation={[0.2, 0, 0]} material={mat(blueMat)}>
          <torusGeometry args={[0.25, 0.1, 16, 32]} />
        </mesh>

        {/* Hoodie Strings */}
        <mesh position={[-0.1, 0.5, 0.32]} rotation={[0, 0, 0.1]} material={mat(whiteMat)}>
          <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
        </mesh>
        <mesh position={[0.1, 0.5, 0.32]} rotation={[0, 0, -0.1]} material={mat(whiteMat)}>
          <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
        </mesh>

        {/* Bull Logo Decal Approximation (White V shape on chest) */}
        <group position={[0, 0.35, 0.36]}>
          <mesh rotation={[0, 0, -0.5]} position={[-0.05, 0, 0]} material={mat(whiteMat)}>
            <boxGeometry args={[0.02, 0.08, 0.01]} />
          </mesh>
          <mesh rotation={[0, 0, 0.5]} position={[0.05, 0, 0]} material={mat(whiteMat)}>
            <boxGeometry args={[0.02, 0.08, 0.01]} />
          </mesh>
          <mesh rotation={[0, 0, 0]} position={[0, 0.04, 0]} material={mat(whiteMat)}>
            <boxGeometry args={[0.15, 0.01, 0.01]} />
          </mesh>
        </group>

        {/* Backpack (Dark Gray with Cyan Lines) */}
        <group position={[0, 0.4, -0.32]}>
          {/* Main bag */}
          <mesh material={mat(darkGrayMat)}>
            <boxGeometry args={[0.45, 0.5, 0.25]} />
          </mesh>
          {/* Front pouch */}
          <mesh position={[0, -0.05, -0.15]} material={mat(darkGrayMat)}>
            <boxGeometry args={[0.35, 0.3, 0.1]} />
          </mesh>
          {/* Glowing accent lines on backpack */}
          <mesh position={[-0.15, 0, -0.21]} material={mat(cyanGlowMat)}>
            <boxGeometry args={[0.02, 0.2, 0.01]} />
          </mesh>
          <mesh position={[0.15, 0, -0.21]} material={mat(cyanGlowMat)}>
            <boxGeometry args={[0.02, 0.2, 0.01]} />
          </mesh>
        </group>

        {/* ============ ARMS ============ */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.42, 0.6, 0]}>
          {/* Sleeve Shoulder */}
          <mesh material={mat(blueMat)}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          {/* Sleeve Arm */}
          <mesh position={[-0.12, -0.22, 0]} rotation={[0, 0, 0.2]} material={mat(blueMat)}>
            <capsuleGeometry args={[0.1, 0.25, 12, 16]} />
          </mesh>
          {/* White Cuff */}
          <mesh position={[-0.2, -0.42, 0]} rotation={[0, 0, 0.2]} material={mat(whiteMat)}>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
          </mesh>
          {/* Hand/Glove (Dark Gray) */}
          <mesh position={[-0.23, -0.52, 0]} material={mat(darkGrayMat)}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          {/* Fingers */}
          <mesh position={[-0.25, -0.62, 0.05]} material={mat(darkGrayMat)}>
            <capsuleGeometry args={[0.03, 0.08, 8, 8]} />
          </mesh>
          <mesh position={[-0.32, -0.58, 0]} rotation={[0, 0, 0.5]} material={mat(darkGrayMat)}>
            <capsuleGeometry args={[0.03, 0.06, 8, 8]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.42, 0.6, 0]}>
          <mesh material={mat(blueMat)}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          <mesh position={[0.12, -0.22, 0]} rotation={[0, 0, -0.2]} material={mat(blueMat)}>
            <capsuleGeometry args={[0.1, 0.25, 12, 16]} />
          </mesh>
          <mesh position={[0.2, -0.42, 0]} rotation={[0, 0, -0.2]} material={mat(whiteMat)}>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
          </mesh>
          <mesh position={[0.23, -0.52, 0]} material={mat(darkGrayMat)}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[0.25, -0.62, 0.05]} material={mat(darkGrayMat)}>
            <capsuleGeometry args={[0.03, 0.08, 8, 8]} />
          </mesh>
          <mesh position={[0.32, -0.58, 0]} rotation={[0, 0, -0.5]} material={mat(darkGrayMat)}>
            <capsuleGeometry args={[0.03, 0.06, 8, 8]} />
          </mesh>
        </group>

        {/* ============ LEGS & SNEAKERS ============ */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.18, 0.1, 0]}>
          {/* Pant Leg */}
          <mesh position={[0, -0.15, 0]} material={mat(blueMat)}>
            <cylinderGeometry args={[0.11, 0.12, 0.25, 16]} />
          </mesh>
          {/* Sneaker Main White Base */}
          <mesh position={[0, -0.32, 0.05]} material={mat(whiteMat)}>
            <boxGeometry args={[0.22, 0.15, 0.32]} />
          </mesh>
          {/* Sneaker Blue Side Panels */}
          <mesh position={[-0.115, -0.32, 0.05]} material={mat(blueMat)}>
            <boxGeometry args={[0.02, 0.1, 0.25]} />
          </mesh>
          <mesh position={[0.115, -0.32, 0.05]} material={mat(blueMat)}>
            <boxGeometry args={[0.02, 0.1, 0.25]} />
          </mesh>
          {/* Sneaker Dark Gray Toe/Strap */}
          <mesh position={[0, -0.25, 0.1]} material={mat(darkGrayMat)}>
            <boxGeometry args={[0.18, 0.02, 0.1]} />
          </mesh>
          {/* Sole Base (Dark Gray) */}
          <mesh position={[0, -0.4, 0.05]} material={mat(darkGrayMat)}>
            <boxGeometry args={[0.24, 0.04, 0.34]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.18, 0.1, 0]}>
          <mesh position={[0, -0.15, 0]} material={mat(blueMat)}>
            <cylinderGeometry args={[0.11, 0.12, 0.25, 16]} />
          </mesh>
          <mesh position={[0, -0.32, 0.05]} material={mat(whiteMat)}>
            <boxGeometry args={[0.22, 0.15, 0.32]} />
          </mesh>
          <mesh position={[-0.115, -0.32, 0.05]} material={mat(blueMat)}>
            <boxGeometry args={[0.02, 0.1, 0.25]} />
          </mesh>
          <mesh position={[0.115, -0.32, 0.05]} material={mat(blueMat)}>
            <boxGeometry args={[0.02, 0.1, 0.25]} />
          </mesh>
          <mesh position={[0, -0.25, 0.1]} material={mat(darkGrayMat)}>
            <boxGeometry args={[0.18, 0.02, 0.1]} />
          </mesh>
          <mesh position={[0, -0.4, 0.05]} material={mat(darkGrayMat)}>
            <boxGeometry args={[0.24, 0.04, 0.34]} />
          </mesh>
        </group>
      </group>

      {/* ============ HEAD ============ */}
      <group ref={headRef} position={[0, 0.95, 0]}>
        
        {/* Main Head Base (White Sphere) */}
        <mesh material={mat(whiteMat)}>
          <sphereGeometry args={[0.55, 32, 32]} />
        </mesh>

        {/* The V-Cut Visor Approximation */}
        <group position={[0, 0, 0]}>
          {/* Dark inner faceplate base */}
          <mesh position={[0, 0, 0.15]} material={mat(darkGrayMat)}>
            <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
          
          {/* Angled White Side Cheeks to form the V-shape cutout */}
          <mesh position={[-0.35, -0.25, 0.4]} rotation={[0, 0, -0.6]} material={mat(whiteMat)}>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
          </mesh>
          <mesh position={[0.35, -0.25, 0.4]} rotation={[0, 0, 0.6]} material={mat(whiteMat)}>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
          </mesh>

          {/* Forehead V emblem */}
          <mesh position={[0, 0.38, 0.45]} rotation={[0, 0, 0]} material={mat(darkGrayMat)}>
            <cylinderGeometry args={[0.05, 0.01, 0.08, 3]} />
          </mesh>
        </group>

        {/* Face Screen Texture (Mapped closely onto front) */}
        <mesh position={[0, -0.05, 0.51]} ref={faceplateMeshRef} material={faceMat}>
          <planeGeometry args={[0.65, 0.35]} />
        </mesh>

        {/* ---- HORNS ---- */}
        <group position={[-0.35, 0.4, 0.1]} rotation={[0, -0.2, 0.2]}>
          <mesh material={mat(darkGrayMat)} geometry={hornGeometry} />
          {/* White Horn Tip */}
          <mesh position={[-0.2, 0.55, 0.15]} rotation={[0, 0, 0.5]} material={mat(whiteMat)}>
            <coneGeometry args={[0.08, 0.2, 12]} />
          </mesh>
        </group>

        <group position={[0.35, 0.4, 0.1]} rotation={[0, 0.2, -0.2]}>
          {/* Scale X to mirror the tube */}
          <mesh material={mat(darkGrayMat)} geometry={hornGeometry} scale={[-1, 1, 1]} />
          <mesh position={[0.2, 0.55, 0.15]} rotation={[0, 0, -0.5]} material={mat(whiteMat)}>
            <coneGeometry args={[0.08, 0.2, 12]} />
          </mesh>
        </group>

        {/* ---- EARS / AUDIO MODULES ---- */}
        {/* Left Ear */}
        <group position={[-0.52, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mat(whiteMat)}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
          </mesh>
          <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat(darkGrayMat)}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
          </mesh>
          {/* Glowing Cyan Ring */}
          <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat(cyanGlowMat)}>
            <torusGeometry args={[0.1, 0.015, 16, 32]} />
          </mesh>
        </group>

        {/* Right Ear */}
        <group position={[0.52, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mat(whiteMat)}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
          </mesh>
          <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat(darkGrayMat)}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
          </mesh>
          {/* Glowing Cyan Ring */}
          <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat(cyanGlowMat)}>
            <torusGeometry args={[0.1, 0.015, 16, 32]} />
          </mesh>
        </group>

      </group>
    </group>
  );
};
