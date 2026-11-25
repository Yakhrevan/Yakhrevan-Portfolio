import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
import { Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { PickBotControls } from './PickBotInteractive';

const MODEL_URL = `${import.meta.env.BASE_URL}models/pickbot-v3.glb.gz`;
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

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

function RobotAssembly({ controls, spinning }: { controls: PickBotControls; spinning: boolean }) {
  const original = useCompressedModel();
  if (!original) {
    return <Html center><div className="whitespace-nowrap rounded-full bg-brand-navy/90 px-4 py-2 text-sm font-semibold text-white shadow-lg">Loading PickBot model…</div></Html>;
  }
  return <LoadedRobot original={original} controls={controls} spinning={spinning} />;
}

function LoadedRobot({ original, controls, spinning }: { original: Object3D; controls: PickBotControls; spinning: boolean }) {
  const scene = useMemo(() => original.clone(true), [original]);
  const wheelPhase = useRef(0);

  const parts = useMemo(() => {
    const joints = Object.fromEntries(
      (Object.entries(JOINT_PREFIXES) as [JointKey, string][]).map(([key, prefix]) => [
        key,
        getNamedNode(scene, prefix),
      ]),
    ) as Record<JointKey, Object3D | undefined>;

    const wheels = ['FRONT_L', 'FRONT_R', 'REAR_L', 'REAR_R']
      .map((position) => getNamedNode(scene, `DRIVE_WHEEL_${position}`))
      .filter((node): node is Object3D => Boolean(node));

    const leftFinger = getNamedNode(scene, 'GRIPPER_FINGER_L');
    const rightFinger = getNamedNode(scene, 'GRIPPER_FINGER_R');
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
      leftFinger,
      rightFinger,
      leftFingerRest: leftFinger?.position.z ?? 0,
      rightFingerRest: rightFinger?.position.z ?? 0,
    };
  }, [scene]);

  useEffect(() => {
    (Object.keys(JOINT_PREFIXES) as JointKey[]).forEach((joint) => {
      const node = parts.joints[joint];
      const rest = parts.jointRest[joint];
      if (!node || !rest) return;

      // Blender's Z-up axes are remapped by glTF's Y-up export.
      // In the exported GLB: J1 yaw is local Y, J2-J4 pitch are local Z.
      const axis = joint === 'base' ? Y_AXIS : Z_AXIS;
      node.quaternion.copy(rest).multiply(
        new Quaternion().setFromAxisAngle(axis, (controls[joint] * Math.PI) / 180),
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
    if (spinning) wheelPhase.current += Math.min(delta, 0.05) * 3.2;
    parts.wheels.forEach((wheel, index) => {
      // Wheel axle is local Z after the Blender -> glTF axis conversion.
      wheel.quaternion.copy(parts.wheelRest[index]).multiply(
        new Quaternion().setFromAxisAngle(Z_AXIS, wheelPhase.current),
      );
    });
  });

  return <primitive object={scene} />;
}

export default function PickBotCanvas({ controls, spinning }: {
  controls: PickBotControls;
  spinning: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
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
        <RobotAssembly controls={controls} spinning={spinning} />
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
