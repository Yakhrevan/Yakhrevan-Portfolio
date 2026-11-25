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

/** Wheel order: front-left, front-right, rear-left, rear-right. Illustrative X-pattern. */
export const DRIVE_PATTERNS: Record<DriveMode, [number, number, number, number]> = {
  stop: [0, 0, 0, 0],
  forward: [1, 1, 1, 1],
  reverse: [-1, -1, -1, -1],
  'strafe-left': [-1, 1, 1, -1],
  'strafe-right': [1, -1, -1, 1],
  'rotate-left': [-1, 1, -1, 1],
  'rotate-right': [1, -1, 1, -1],
};

export const DRIVE_CHOICES: { mode: Exclude<DriveMode, 'stop'>; label: string }[] = [
  { mode: 'forward', label: 'Forward' },
  { mode: 'reverse', label: 'Reverse' },
  { mode: 'strafe-left', label: 'Strafe left' },
  { mode: 'strafe-right', label: 'Strafe right' },
  { mode: 'rotate-left', label: 'Rotate left' },
  { mode: 'rotate-right', label: 'Rotate right' },
];

export type PayloadState = 'hidden' | 'source' | 'attached' | 'destination';

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
    description: 'Open the virtual gripper before approaching the object.',
    controls: { ...HOME_POSE, grip: 100 },
    payload: 'source',
  },
  {
    at: 3,
    label: 'Approach',
    description: 'Move shoulder and elbow toward the illustrated pick position.',
    controls: { base: 0, shoulder: -30, elbow: 26, wrist: -12, grip: 100 },
    payload: 'source',
  },
  {
    at: 6,
    label: 'Grasp',
    description: 'Close the gripper and attach the virtual payload.',
    controls: { base: 0, shoulder: -30, elbow: 26, wrist: -12, grip: 0 },
    payload: 'attached',
  },
  {
    at: 10,
    label: 'Lift',
    description: 'Raise the payload using the shoulder and elbow joints.',
    controls: { base: 0, shoulder: 5, elbow: 10, wrist: -5, grip: 0 },
    payload: 'attached',
  },
  {
    at: 14,
    label: 'Transfer',
    description: 'Rotate the base toward the illustrated drop zone.',
    controls: { base: 85, shoulder: 5, elbow: 10, wrist: -5, grip: 0 },
    payload: 'attached',
  },
  {
    at: 18,
    label: 'Lower',
    description: 'Lower the payload near the destination marker.',
    controls: { base: 85, shoulder: -28, elbow: 23, wrist: -12, grip: 0 },
    payload: 'attached',
  },
  {
    at: 21,
    label: 'Release',
    description: 'Open the gripper and place the virtual payload.',
    controls: { base: 85, shoulder: -28, elbow: 23, wrist: -12, grip: 100 },
    payload: 'destination',
  },
  {
    at: 24,
    label: 'Complete',
    description: 'Return the arm to the display pose. Simulation complete.',
    controls: { ...HOME_POSE },
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
