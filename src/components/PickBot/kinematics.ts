import type { PickBotControls } from './demo';

/**
 * PickBot V6 concept-model kinematics, in glTF Y-up metres.
 * Derived from the V3 GLB joint hierarchy and validated against known tool-tip
 * contacts. Limits are UI simulation limits, NOT hardware calibration data.
 */
export type Position3 = { x: number; y: number; z: number };
export type Twist2 = { vx: number; vy: number; omega: number };
export type DrivePose = { x: number; y: number; theta: number };
export type WheelSpeeds = [number, number, number, number]; // FL FR RL RR
export type IKResult =
  | { ok: true; controls: PickBotControls; tip: Position3; error: number }
  | { ok: false; reason: string };

export const ARM = {
  baseX: 0.027,
  shoulderOffset: 0.016,
  shoulderHeight: 0.453,
  upper: 0.151,
  forearm: 0.151,
  wristAndTool: 0.146 + 0.065,
  shoulderRest: 61,
  elbowRest: -44,
  wristRest: 24,
  nominalToolPitch: -19,
  objectHeight: 0.284,
  objectSize: 0.070,
  contactTolerance: 0.018,
} as const;

export const JOINT_LIMITS = {
  base: [-140, 140],
  shoulder: [-35, 100],
  elbow: [-90, 90],
  wrist: [-90, 90],
} as const;

export const MECANUM = {
  frontX: 0.221,
  rearX: -0.221,
  leftY: 0.226,
  rightY: -0.226,
  effectiveRadius: 0.091, // roller envelope from V3 authoring model; illustrative
  maxLinear: 0.45,
  maxAngular: 1.20,
} as const;

const toRad = (degrees: number) => degrees * Math.PI / 180;
const toDeg = (radians: number) => radians * 180 / Math.PI;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const distance3 = (a: Position3, b: Position3) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
export const ZERO_TWIST: Twist2 = { vx: 0, vy: 0, omega: 0 };
export const ZERO_DRIVE_POSE: DrivePose = { x: 0, y: 0, theta: 0 };

/** Reconstruct calibrated arm pivots without fetching the GLB. */
export function armPoints(controls: PickBotControls): Position3[] {
  const a1 = toRad(ARM.shoulderRest - controls.shoulder);
  const a2 = a1 + toRad(ARM.elbowRest - controls.elbow);
  const a3 = a2 + toRad(ARM.wristRest - controls.wrist);
  const yaw = toRad(controls.base);
  const point = (radius: number, height: number): Position3 => ({
    x: ARM.baseX + radius * Math.cos(yaw),
    y: height,
    z: -radius * Math.sin(yaw),
  });
  let radius = ARM.shoulderOffset;
  let height = ARM.shoulderHeight;
  const shoulder = point(radius, height);
  radius += ARM.upper * Math.cos(a1);
  height += ARM.upper * Math.sin(a1);
  const elbow = point(radius, height);
  radius += ARM.forearm * Math.cos(a2);
  height += ARM.forearm * Math.sin(a2);
  const wrist = point(radius, height);
  radius += ARM.wristAndTool * Math.cos(a3);
  height += ARM.wristAndTool * Math.sin(a3);
  return [shoulder, elbow, wrist, point(radius, height)];
}

export function toolTip(controls: PickBotControls): Position3 {
  return armPoints(controls)[3];
}

export function withinJointLimits(controls: PickBotControls): boolean {
  return (Object.keys(JOINT_LIMITS) as (keyof typeof JOINT_LIMITS)[])
    .every((joint) => controls[joint] >= JOINT_LIMITS[joint][0] - 1e-7 && controls[joint] <= JOINT_LIMITS[joint][1] + 1e-7);
}

/**
 * Conservative chassis envelope test: catches links passing through the main
 * rover deck. This is *not* a comprehensive mesh-vs-mesh physics engine.
 */
export function intersectsChassis(controls: PickBotControls): boolean {
  const points = armPoints(controls);
  for (let segment = 1; segment < points.length - 1; segment++) {
    const from = points[segment];
    const to = points[segment + 1];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      const z = from.z + (to.z - from.z) * t;
      // Top of model chassis/deck ~ 0.27 m; arm's central mounting column exempt.
      if (y < 0.275 && y > 0.035 && Math.abs(x) < 0.26 && Math.abs(z) < 0.19) return true;
    }
  }
  return false;
}

/** Axis-aligned virtual 70 mm payload vs floor and simplified rover deck. */
export function objectIntersectsEnvironment(target: Position3): boolean {
  if (![target.x, target.y, target.z].every(Number.isFinite)) return true;
  const halfBlock = ARM.objectSize / 2;
  if (target.y - halfBlock < 0) return true;
  return target.y - halfBlock < 0.25 && target.y + halfBlock > 0.12 &&
    Math.abs(target.x) < 0.215 + halfBlock && Math.abs(target.z) < 0.175 + halfBlock;
}

/** Analytic yaw + two-link IK, sweeping tool pitch to satisfy J2-J4 limits. */
export function solveIK(target: Position3, previous?: PickBotControls): IKResult {
  if (![target.x, target.y, target.z].every(Number.isFinite)) return { ok: false, reason: 'Invalid target coordinates.' };
  if (target.y - ARM.objectSize / 2 < 0) return { ok: false, reason: 'Target block intersects the ground plane.' };
  if (target.y > 0.95) return { ok: false, reason: 'Target is above the simulated arm workspace.' };
  if (objectIntersectsEnvironment(target)) return { ok: false, reason: 'Collision: virtual block overlaps the rover chassis envelope.' };
  const dx = target.x - ARM.baseX;
  const radius = Math.hypot(dx, target.z);
  if (radius < 0.09) return { ok: false, reason: 'Target overlaps the arm pedestal / rover body.' };

  const base = toDeg(Math.atan2(-target.z, dx));
  if (base < JOINT_LIMITS.base[0] || base > JOINT_LIMITS.base[1]) {
    return { ok: false, reason: 'Target is behind the J1 base-yaw limit.' };
  }
  const radial = radius - ARM.shoulderOffset;
  const vertical = target.y - ARM.shoulderHeight;
  const seed = previous ?? { base: 0, shoulder: 60, elbow: 0, wrist: 0, grip: 100 };
  let best: Extract<IKResult, { ok: true }> | null = null;
  let bestCost = Infinity;
  let hadGeometricSolution = false;
  let hadJointSolution = false;

  // Include the V5 calibrated contact pitch exactly, then nearby alternatives.
  const toolAngles = [ARM.nominalToolPitch, ...Array.from({ length: 29 }, (_, i) => -70 + i * 5)];
  for (const toolAngle of toolAngles) {
    const alpha3 = toRad(toolAngle);
    const wx = radial - ARM.wristAndTool * Math.cos(alpha3);
    const wy = vertical - ARM.wristAndTool * Math.sin(alpha3);
    const d = (wx * wx + wy * wy - ARM.upper ** 2 - ARM.forearm ** 2) / (2 * ARM.upper * ARM.forearm);
    if (d < -1 - 1e-6 || d > 1 + 1e-6) continue;
    hadGeometricSolution = true;
    for (const sign of [-1, 1]) {
      const bend = sign * Math.acos(clamp(d, -1, 1));
      const alpha1 = Math.atan2(wy, wx) - Math.atan2(ARM.forearm * Math.sin(bend), ARM.upper + ARM.forearm * Math.cos(bend));
      const alpha2 = alpha1 + bend;
      const candidate: PickBotControls = {
        base,
        shoulder: ARM.shoulderRest - toDeg(alpha1),
        elbow: ARM.elbowRest - toDeg(bend),
        wrist: ARM.wristRest + toDeg(alpha2) - toolAngle,
        grip: seed.grip,
      };
      if (!withinJointLimits(candidate)) continue;
      hadJointSolution = true;
      if (intersectsChassis(candidate)) continue;
      const tip = toolTip(candidate);
      const error = distance3(tip, target);
      if (error > 0.003) continue;
      const cost = Math.abs(toolAngle - ARM.nominalToolPitch) * 0.85 +
        Math.abs(candidate.shoulder - seed.shoulder) * 0.22 +
        Math.abs(candidate.elbow - seed.elbow) * 0.16 +
        Math.abs(candidate.wrist - seed.wrist) * 0.10;
      if (cost < bestCost) {
        bestCost = cost;
        best = { ok: true, controls: candidate, tip, error };
      }
    }
  }
  if (best) return best;
  if (hadJointSolution) return { ok: false, reason: 'Collision: arm enters the rover chassis envelope.' };
  if (hadGeometricSolution) return { ok: false, reason: 'Position requires an angle outside the illustrated joint limits.' };
  return { ok: false, reason: 'Unreachable: target is beyond the arm workspace.' };
}

export function graspContact(controls: PickBotControls, objectPosition: Position3) {
  if (!withinJointLimits(controls)) return { contact: false, reason: 'Joint limit violated.' };
  if (intersectsChassis(controls)) return { contact: false, reason: 'Collision envelope violated.' };
  const error = distance3(toolTip(controls), objectPosition);
  if (error > ARM.contactTolerance) return { contact: false, reason: `Gripper is ${(error * 1000).toFixed(0)} mm away from the block.` };
  if (controls.grip > 20) return { contact: false, reason: 'Close gripper fingers before attachment.' };
  return { contact: true, reason: 'Contact validated; virtual payload can attach.' };
}

/** ROS 2 geometry_msgs/Twist frame convention: x forward, y left, z angular. */
export function mecanumWheelRadPerSec({ vx, vy, omega }: Twist2): WheelSpeeds {
  const arm = MECANUM.frontX + MECANUM.leftY;
  const radius = MECANUM.effectiveRadius;
  return [
    (vx - vy - arm * omega) / radius,
    (vx + vy + arm * omega) / radius,
    (vx + vy - arm * omega) / radius,
    (vx - vy + arm * omega) / radius,
  ];
}

export function mecanumWheelRpm(twist: Twist2): WheelSpeeds {
  return mecanumWheelRadPerSec(twist).map((velocity) => velocity * 60 / (2 * Math.PI)) as WheelSpeeds;
}

export function integrateMecanum(pose: DrivePose, command: Twist2, seconds: number): DrivePose {
  const dt = clamp(seconds, 0, 0.1);
  const midYaw = pose.theta + command.omega * dt / 2;
  return {
    x: pose.x + (command.vx * Math.cos(midYaw) - command.vy * Math.sin(midYaw)) * dt,
    y: pose.y + (command.vx * Math.sin(midYaw) + command.vy * Math.cos(midYaw)) * dt,
    theta: Math.atan2(Math.sin(pose.theta + command.omega * dt), Math.cos(pose.theta + command.omega * dt)),
  };
}
