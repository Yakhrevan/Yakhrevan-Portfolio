import { useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

export type ClipName =
  | 'Idle_15' | 'Big_Wave_Hello' | 'Walking' | 'Running' | 'Bubble_Dance'
  | 'Wake_Up_and_Look_Up' | 'Dozing_Elderly' | 'Talk_with_Left_Hand_on_Hip'
  | 'Mirror_Viewing' | 'Alert' | 'Dead' | 'CrouchLookAroundBow';

interface Props {
  clip?: ClipName;
  loop?: boolean;
  onFinished?: () => void;
  scale?: number;
  position?: [number, number, number];
}

/** Renders /models/robot.glb and plays one Mixamo clip by name. */
export function RobotModel({ clip = 'Idle_15', loop = true, onFinished, scale = 1, position = [0, 0, 0] }: Props) {
  const { scene, animations } = useGLTF('/models/robot.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { ref, actions, mixer } = useAnimations(animations, clone);

  useEffect(() => {
    const action = actions[clip];
    if (!action) return;
    action.reset().fadeIn(0.3).play();
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    action.clampWhenFinished = !loop;
    const onDone = () => onFinished?.();
    if (!loop) mixer.addEventListener('finished', onDone);
    return () => {
      action.fadeOut(0.25);
      if (!loop) mixer.removeEventListener('finished', onDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip, loop, actions, mixer]);

  return <primitive ref={ref} object={clone} scale={scale} position={position} />;
}
useGLTF.preload('/models/robot.glb');
