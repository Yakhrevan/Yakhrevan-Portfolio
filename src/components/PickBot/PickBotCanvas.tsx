import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
import { Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRIVE_PATTERNS, DRIVE_PREVIEW_POSES, DROP_POINT, GLTF_AXLE_SPIN_SIGN, PHYSICAL_WHEEL_NODES, PICKUP_POINT, TOOL_TIP_OFFSET } from './demo';
import type { DriveMode, PayloadState, PickBotControls } from './demo';

const MODEL_URL = `${import.meta.env.BASE_URL}models/pickbot-v3.glb.gz`;
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);
// Calibrated against the actual V3 GLB hierarchy, including a 65 mm tool-tip offset.
// The 60° shoulder pose touches the pickup station; +85° base yaw touches the drop.
const SOURCE_POSITION = new Vector3(...PICKUP_POINT);
const DESTINATION_POSITION = new Vector3(...DROP_POINT);
const TOOL_OFFSET = new Vector3(...TOOL_TIP_OFFSET);

type JointKey = 'base' | 'shoulder' | 'elbow' | 'wrist';

const JOINT_PREFIXES: Record<JointKey, string> = {
  base: 'J1_Base_Yaw',
  shoulder: 'J2_Shoulder_Pitch',
  elbow: 'J3_Elbow_Pitch',
  wrist: 'J4_Wrist_Pitch',
};

function getNamedNode(root: Object3D, prefix: string): Object3D | undefined {
  let result: Object3D | undefined;
  root.traverse((node) => {
    if (!result && node.name.startsWith(prefix)) result = node;
  });
  return result;
}

function useCompressedModel(): Object3D | null {
  const [scene, setScene] = useState<Object3D | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadModel() {
      const response = await fetch(MODEL_URL, { signal: controller.signal });
      if (!response.ok) throw new Error(`PickBot model request failed (${response.status})`);
      if (!response.body || typeof DecompressionStream === 'undefined') {
        throw new Error('This browser does not support compressed 3D models.');
      }

      // The full GLB is preserved inside gzip. Decompress in the browser to
      // reduce the download and repository size without changing CAD geometry.
      const stream = response.body.pipeThrough(new DecompressionStream('gzip'));
      const buffer = await new Response(stream).arrayBuffer();
      const loader = new GLTFLoader();
      const parsed = await new Promise<GLTF>((resolve, reject) => {
        loader.parse(buffer, '', resolve, reject);
      });
      if (!controller.signal.aborted) setScene(parsed.scene);
    }

    loadModel().catch((reason: unknown) => {
      if (!controller.signal.aborted) {
        setError(reason instanceof Error ? reason : new Error('Unable to open the 3D model.'));
      }
    });
    return () => controller.abort();
  }, []);

  if (error) throw error;
  return scene;
}

interface AssemblyProps {
  controls: PickBotControls;
  driveMode: DriveMode;
  payloadState: PayloadState;
}

function RobotAssembly({ controls, driveMode, payloadState }: AssemblyProps) {
  const original = useCompressedModel();
  if (!original) {
    return <Html center><div className="whitespace-nowrap rounded-full bg-brand-navy/90 px-4 py-2 text-sm font-semibold text-white shadow-lg">Loading PickBot model…</div></Html>;
  }
  return <LoadedRobot original={original} controls={controls} driveMode={driveMode} payloadState={payloadState} />;
}

function LoadedRobot({ original, controls, driveMode, payloadState }: AssemblyProps & { original: Object3D }) {
  const scene = useMemo(() => original.clone(true), [original]);
  const wheelPhase = useRef([0, 0, 0, 0]);
  const rollerPhase = useRef([0, 0, 0, 0]);
  const motionPhase = useRef(0);
  const payloadRef = useRef<Mesh>(null);
  const payloadPosition = useMemo(() => new Vector3(), []);
  const payloadRotation = useMemo(() => new Quaternion(), []);
  const toolOffset = useMemo(() => new Vector3(), []);
  const wheelRotation = useMemo(() => new Quaternion(), []);
  const rollerRotation = useMemo(() => new Quaternion(), []);

  const parts = useMemo(() => {
    const joints = Object.fromEntries(
      (Object.entries(JOINT_PREFIXES) as [JointKey, string][]).map(([key, prefix]) => [
        key,
        getNamedNode(scene, prefix),
      ]),
    ) as Record<JointKey, Object3D | undefined>;

    // The authored asset's L/R suffixes are reversed relative to robot +Y-left.
    // Convert to physical FL, FR, RL, RR so the X-roller drive matrix is correct.
    const wheels = PHYSICAL_WHEEL_NODES
      .map((position) => getNamedNode(scene, `DRIVE_WHEEL_${position}`))
      .filter((node): node is Object3D => Boolean(node));
    const rollers = wheels.map((wheel) => {
      const items: Object3D[] = [];
      wheel.traverse((node) => {
        if (node.name.includes('MECANUM_45deg_roller_')) items.push(node);
      });
      return items;
    });

    const leftFinger = getNamedNode(scene, 'GRIPPER_FINGER_L');
    const rightFinger = getNamedNode(scene, 'GRIPPER_FINGER_R');
    const gripperMount = getNamedNode(scene, 'GRIPPER_TOOL_MOUNT');
    const jointRest = Object.fromEntries(
      (Object.entries(joints) as [JointKey, Object3D | undefined][])
        .filter((entry): entry is [JointKey, Object3D] => Boolean(entry[1]))
        .map(([key, node]) => [key, node.quaternion.clone()]),
    ) as Partial<Record<JointKey, Quaternion>>;

    scene.traverse((node) => {
      const mesh = node as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return {
      joints,
      jointRest,
      wheels,
      wheelRest: wheels.map((wheel) => wheel.quaternion.clone()),
      rollers,
      rollerRest: rollers.map((wheelRollers) => wheelRollers.map((roller) => roller.quaternion.clone())),
      leftFinger,
      rightFinger,
      gripperMount,
      leftFingerRest: leftFinger?.position.z ?? 0,
      rightFingerRest: rightFinger?.position.z ?? 0,
    };
  }, [scene]);

  useEffect(() => {
    (Object.keys(JOINT_PREFIXES) as JointKey[]).forEach((joint) => {
      const node = parts.joints[joint];
      const rest = parts.jointRest[joint];
      if (!node || !rest) return;

      // Blender Z-up -> glTF Y-up: base +Z becomes +Y, but pitch +Y becomes -Z.
      // Negating J2–J4 is essential: otherwise positive shoulder values lift
      // the tool instead of lowering it toward the pickup station.
      const axis = joint === 'base' ? Y_AXIS : Z_AXIS;
      node.quaternion.copy(rest).multiply(
        new Quaternion().setFromAxisAngle(axis, ((joint === 'base' ? 1 : -1) * controls[joint] * Math.PI) / 180),
      );
    });
  }, [controls, parts]);

  useEffect(() => {
    // Gripper opening travels along local Z in the exported Y-up GLB.
    const spread = (controls.grip / 100) * 0.018;
    if (parts.leftFinger) parts.leftFinger.position.z = parts.leftFingerRest + spread;
    if (parts.rightFinger) parts.rightFinger.position.z = parts.rightFingerRest - spread;
  }, [controls.grip, parts]);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    const pattern = DRIVE_PATTERNS[driveMode];
    parts.wheels.forEach((wheel, index) => {
      // Blender's +local-Y axle becomes -local-Z under the glTF Y-up export.
      wheelPhase.current[index] += GLTF_AXLE_SPIN_SIGN * dt * 4 * pattern[index];
      // Signed wheel patterns illustrate kinematics, not calibrated odometry.
      wheel.quaternion.copy(parts.wheelRest[index]).multiply(
        wheelRotation.setFromAxisAngle(Z_AXIS, wheelPhase.current[index]),
      );
    });

    // Free-running diagonal rollers are what allow sideways motion. At the
    // contact patch their rolling speed follows lateral chassis velocity:
    // v_y + yaw_rate * wheel_x (front +, rear -). Only a visual approximation.
    const lateral = driveMode === 'strafe-left' ? 1 : driveMode === 'strafe-right' ? -1 : 0;
    const yaw = driveMode === 'rotate-left' ? 1 : driveMode === 'rotate-right' ? -1 : 0;
    parts.rollers.forEach((wheelRollers, index) => {
      rollerPhase.current[index] += dt * 8 * (lateral + yaw * (index < 2 ? 1 : -1));
      wheelRollers.forEach((roller, rollerIndex) => {
        roller.quaternion.copy(parts.rollerRest[index][rollerIndex]).multiply(
          rollerRotation.setFromAxisAngle(Y_AXIS, rollerPhase.current[index]),
        );
      });
    });

    // A bounded one-direction maneuver, never a sinusoidal reversal of the command.
    motionPhase.current = driveMode === 'stop' ? 0 : Math.min(1, motionPhase.current + dt * 0.9);
    const preview = motionPhase.current * motionPhase.current * (3 - 2 * motionPhase.current);
    // glTF X is forward and -Z is robot-left.
    const [dx, dz, yawOffset] = DRIVE_PREVIEW_POSES[driveMode];
    const blend = Math.min(1, dt * 7);
    scene.position.x += (dx * preview - scene.position.x) * blend;
    scene.position.z += (dz * preview - scene.position.z) * blend;
    scene.rotation.y += (yawOffset * preview - scene.rotation.y) * blend;

    if (payloadRef.current && payloadState !== 'hidden') {
      if (payloadState === 'attached' && parts.gripperMount) {
        scene.updateWorldMatrix(true, true);
        parts.gripperMount.getWorldPosition(payloadPosition);
        parts.gripperMount.getWorldQuaternion(payloadRotation);
        payloadPosition.add(toolOffset.copy(TOOL_OFFSET).applyQuaternion(payloadRotation));
        payloadRef.current.position.copy(payloadPosition);
        // Keep the display payload upright during transport: no simulated object tumbling.
        payloadRef.current.quaternion.identity();
      } else {
        payloadRef.current.position.copy(payloadState === 'destination' ? DESTINATION_POSITION : SOURCE_POSITION);
        payloadRef.current.quaternion.identity();
      }
    }
  });

  return (
    <>
      <primitive object={scene} />
      {payloadState !== 'hidden' && (
        <>
          {[SOURCE_POSITION, DESTINATION_POSITION].map((position, index) => (
            <group key={index} position={[position.x, 0, position.z]}>
              <mesh position={[0, 0.112, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.075, 0.10, 0.224, 32]} />
                <meshStandardMaterial color={index === 0 ? '#3b6687' : '#836442'} metalness={0.55} roughness={0.36} />
              </mesh>
              <mesh position={[0, 0.237, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.125, 0.125, 0.026, 32]} />
                <meshStandardMaterial color={index === 0 ? '#60a5fa' : '#fb923c'} metalness={0.35} roughness={0.4} />
              </mesh>
            </group>
          ))}
          <mesh ref={payloadRef} position={SOURCE_POSITION.toArray()} castShadow>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshStandardMaterial color="#fb923c" metalness={0.12} roughness={0.48} />
          </mesh>
        </>
      )}
    </>
  );
}

export default function PickBotCanvas({ controls, driveMode, payloadState }: AssemblyProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.4]}
      camera={{ position: [1.25, 0.98, 1.33], fov: 38, near: 0.01, far: 15 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
      aria-label="Interactive PickBot four-wheel mecanum rover and four-joint robotic arm"
    >
      <color attach="background" args={['#101d2b']} />
      <ambientLight intensity={1.5} />
      <hemisphereLight args={['#d7e9ff', '#253548', 1.2]} />
      <directionalLight position={[2, 4, 3]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-2, 2, -2]} intensity={1.4} color="#93c5fd" />
      <mesh position={[0, -0.009, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#16283c" roughness={0.93} metalness={0.03} />
      </mesh>
      <gridHelper args={[2, 20, '#476078', '#24384d']} position={[0, -0.007, 0]} />
      <ContactShadows position={[0, -0.006, 0]} opacity={0.28} scale={2} blur={2.5} far={1.4} resolution={256} />
      <Suspense fallback={<Html center><div className="whitespace-nowrap rounded-full bg-brand-navy/90 px-4 py-2 text-sm font-semibold text-white shadow-lg">Loading PickBot model…</div></Html>}>
        <RobotAssembly controls={controls} driveMode={driveMode} payloadState={payloadState} />
      </Suspense>
      <OrbitControls
        makeDefault
        target={[0, 0.33, 0]}
        enablePan={false}
        enableDamping
        minDistance={0.75}
        maxDistance={3.5}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />
    </Canvas>
  );
}
