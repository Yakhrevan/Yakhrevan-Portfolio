/** Visual-only demonstration data. These are not measured robot joint limits or an IK solution. */
export interface PickBotControls {
  base: number;
  shoulder: number;
  elbow: number;
  wrist: number;
  grip: number;
}

export const HOME_POSE: PickBotControls = {
  base: 0,
  shoulder: 0,
  elbow: 0,
  wrist: 0,
  grip: 0,
};

export type DriveMode =
  | 'stop'
  | 'forward'
  | 'reverse'
  | 'strafe-left'
  | 'strafe-right'
  | 'rotate-left'
  | 'rotate-right';

/** V3 GLB's wheel L/R suffixes are reversed relative to +Y-left robot coordinates. */
export const PHYSICAL_WHEEL_NODES = ['FRONT_R', 'FRONT_L', 'REAR_R', 'REAR_L'] as const;

/** Tool-tip contacts from the V3 GLB, converted to three.js Y-up coordinates. */
export const TOOL_TIP_OFFSET = [0.065, 0, 0] as const;
export const PICKUP_POINT = [0.5039, 0.2840, 0] as const;
export const DROP_POINT = [0.0686, 0.2840, -0.4751] as const;

/**
 * Robot frame: +X forward, +Y left, +Z up (Blender source model).
 * Values are forward-equivalent wheel speeds, in physical FL, FR, RL, RR order.
 * Roller handedness was verified against build_pickbot_v3.py's X pattern.
 */
export const DRIVE_PATTERNS: Record<DriveMode, [number, number, number, number]> = {
  stop: [0, 0, 0, 0],
  forward: [1, 1, 1, 1],
  reverse: [-1, -1, -1, -1],
  'strafe-left': [-1, 1, 1, -1],
  'strafe-right': [1, -1, -1, 1],
  'rotate-left': [-1, 1, -1, 1],
  'rotate-right': [1, -1, 1, -1],
};

/** Bounded GLB-space direction demonstrations: [forward X, lateral Z, yaw Y]. */
export const DRIVE_PREVIEW_POSES: Record<DriveMode, [number, number, number]> = {
  stop: [0, 0, 0],
  forward: [0.11, 0, 0],
  reverse: [-0.11, 0, 0],
  'strafe-left': [0, -0.11, 0],
  'strafe-right': [0, 0.11, 0],
  'rotate-left': [0, 0, 0.18],
  'rotate-right': [0, 0, -0.18],
};

/** Source Blender +local-Y wheel spin = glTF -local-Z wheel spin. */
export const GLTF_AXLE_SPIN_SIGN = -1;

export const DRIVE_CHOICES: { mode: Exclude<DriveMode, 'stop'>; label: string }[] = [
  { mode: 'forward', label: 'Forward' },
  { mode: 'reverse', label: 'Reverse' },
  { mode: 'strafe-left', label: 'Strafe left' },
  { mode: 'strafe-right', label: 'Strafe right' },
  { mode: 'rotate-left', label: 'Rotate left' },
  { mode: 'rotate-right', label: 'Rotate right' },
];

export type PayloadState = 'hidden' | 'source' | 'target' | 'attached' | 'destination';

export interface DemoStep {
  at: number;
  label: string;
  description: string;
  controls: PickBotControls;
  payload: Exclude<PayloadState, 'hidden'>;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    at: 0,
    label: 'Ready',
    description: 'Open the gripper; the orange block is resting on the pickup station.',
    controls: { base: 0, shoulder: 15, elbow: -15, wrist: 15, grip: 100 },
    payload: 'source',
  },
  {
    at: 3,
    label: 'Approach',
    description: 'Move the open tool above the block without attaching it.',
    controls: { base: 0, shoulder: 42, elbow: 15, wrist: -15, grip: 100 },
    payload: 'source',
  },
  {
    at: 6,
    label: 'Align',
    description: 'Lower the gripper to the calibrated pickup contact point.',
    controls: { base: 0, shoulder: 60, elbow: 0, wrist: 0, grip: 100 },
    payload: 'source',
  },
  {
    at: 8,
    label: 'Grasp',
    description: 'Close the fingers around the block before it follows the tool.',
    controls: { base: 0, shoulder: 60, elbow: 0, wrist: 0, grip: 0 },
    payload: 'attached',
  },
  {
    at: 11,
    label: 'Lift',
    description: 'Lift the gripped block clear of the pickup station.',
    controls: { base: 0, shoulder: 35, elbow: -18, wrist: 20, grip: 0 },
    payload: 'attached',
  },
  {
    at: 15,
    label: 'Transfer',
    description: 'Yaw the arm 85° toward the drop station while holding the block above it.',
    controls: { base: 85, shoulder: 35, elbow: -18, wrist: 20, grip: 0 },
    payload: 'attached',
  },
  {
    at: 18,
    label: 'Place',
    description: 'Lower the block until its underside meets the drop station.',
    controls: { base: 85, shoulder: 60, elbow: 0, wrist: 0, grip: 0 },
    payload: 'attached',
  },
  {
    at: 21,
    label: 'Release',
    description: 'Open the fingers and leave the block resting at the destination.',
    controls: { base: 85, shoulder: 60, elbow: 0, wrist: 0, grip: 100 },
    payload: 'destination',
  },
  {
    at: 24,
    label: 'Complete',
    description: 'Retract the empty arm. The transferred block remains on the drop station.',
    controls: { base: 85, shoulder: 15, elbow: -15, wrist: 15, grip: 100 },
    payload: 'destination',
  },
];

export const DEMO_DURATION_MS = DEMO_STEPS[DEMO_STEPS.length - 1].at * 1000;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function samplePickPlace(elapsedMs: number) {
  const elapsed = clamp(elapsedMs, 0, DEMO_DURATION_MS) / 1000;
  let index = 0;
  while (index < DEMO_STEPS.length - 1 && DEMO_STEPS[index + 1].at <= elapsed) index++;

  const current = DEMO_STEPS[index];
  const next = DEMO_STEPS[Math.min(index + 1, DEMO_STEPS.length - 1)];
  const fraction = next.at === current.at ? 0 : clamp((elapsed - current.at) / (next.at - current.at), 0, 1);
  const smooth = fraction * fraction * (3 - 2 * fraction);
  const controls = (Object.keys(HOME_POSE) as (keyof PickBotControls)[]).reduce(
    (pose, key) => ({ ...pose, [key]: current.controls[key] + (next.controls[key] - current.controls[key]) * smooth }),
    { ...HOME_POSE },
  );

  return {
    controls,
    step: current,
    stepIndex: index,
    payload: current.payload,
    progress: (clamp(elapsedMs, 0, DEMO_DURATION_MS) / DEMO_DURATION_MS) * 100,
  };
}
