import React, { useEffect, Suspense } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { RobotStateConfig } from '../../types/robot';
import { robotController } from './RobotController';

interface RobotModelProps {
  config: RobotStateConfig;
  speed: number;
  isBlueprintMode: boolean;
  reducedMotion: boolean;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: () => void;
}

/**
 * GLTF Loader Component for external /models/robot.glb
 */
// Maps each engine RobotState to the real clip name baked into Yakhrevan_Robot.glb (Mixamo rig).
// Falls back gracefully if a clip is missing from the file.
const STATE_TO_CLIP: Record<string, string> = {
  Idle: 'Idle_15',
  Blink: 'Idle_15',
  Happy: 'Bubble_Dance',
  Excited: 'Bubble_Dance',
  Curious: 'CrouchLookAroundBow',
  Thinking: 'Mirror_Viewing',
  Focused: 'Idle_15',
  Confused: 'CrouchLookAroundBow',
  Sad: 'Dozing_Elderly',
  Sleepy: 'Dozing_Elderly',
  Waving: 'Big_Wave_Hello',
  Walking: 'Walking',
  Working: 'Talk_with_Left_Hand_on_Hip',
  Celebrating: 'Bubble_Dance',
  Error: 'Alert',
  'Wake Up': 'Wake_Up_and_Look_Up',
};
const ONE_SHOT_CLIPS = new Set(['Big_Wave_Hello', 'Wake_Up_and_Look_Up', 'Alert']);

const GLTFModelWrapper: React.FC<RobotModelProps & { modelUrl: string }> = ({
  modelUrl,
  config,
  speed,
  isBlueprintMode,
  reducedMotion,
  onPointerOver,
  onPointerOut,
  onClick,
}) => {
  const { scene, animations } = useGLTF(modelUrl);
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { ref, actions, mixer } = useAnimations(animations);

  useEffect(() => {
    // Prefer the mapped real clip name; fall back to a loose match, then Idle.
    const wanted = STATE_TO_CLIP[config.state];
    const actionName =
      (wanted && actions[wanted] ? wanted : undefined) ??
      Object.keys(actions).find((key) => key.toLowerCase().includes(config.state.toLowerCase())) ??
      STATE_TO_CLIP.Idle;

    if (actionName && actions[actionName]) {
      // Fade out all current actions
      Object.values(actions).forEach((act) => act?.fadeOut(0.3));

      // Play target animation clip
      const currentAction = actions[actionName];
      if (currentAction) {
        const animSpeed = reducedMotion ? 0 : speed;
        const loopOnce = ONE_SHOT_CLIPS.has(actionName);
        currentAction.reset().setEffectiveTimeScale(animSpeed).setLoop(loopOnce ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
        currentAction.clampWhenFinished = loopOnce;
        currentAction.fadeIn(0.3).play();
      }
    }
    return () => { mixer.stopAllAction(); };
  }, [config.state, actions, speed, reducedMotion, mixer]);

  // Update blueprint wireframe mode on materials if enabled
  useEffect(() => {
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material.wireframe = isBlueprintMode;
      }
    });
  }, [clone, isBlueprintMode]);

  return (
    <primitive
      ref={ref}
      object={clone}
      scale={1.0}
      position={[0, -1.0, 0]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  );
};

export const RobotModel: React.FC<RobotModelProps> = (props) => {
  const modelPath = `${import.meta.env.BASE_URL}models/robot.glb`;

  useEffect(() => {
    robotController.setModelType('gltf');
  }, []);

  return (
    <Suspense fallback={null}>
      <GLTFModelWrapper modelUrl={modelPath} {...props} />
    </Suspense>
  );
};
