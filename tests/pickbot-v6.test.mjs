import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ARM, MECANUM, armPoints, distance3, graspContact, integrateMecanum,
  intersectsChassis, mecanumWheelRadPerSec, mecanumWheelRpm,
  solveIK, toolTip, withinJointLimits,
} from '../src/components/PickBot/kinematics.ts';
import { DRIVE_PATTERNS, DROP_POINT, PICKUP_POINT } from '../src/components/PickBot/demo.ts';

const pickup = { x: PICKUP_POINT[0], y: PICKUP_POINT[1], z: PICKUP_POINT[2] };
const drop = { x: DROP_POINT[0], y: DROP_POINT[1], z: DROP_POINT[2] };
const contactPose = { base: 0, shoulder: 60, elbow: 0, wrist: 0, grip: 0 };
const atMost = (actual, expected, error, message) => assert.ok(Math.abs(actual - expected) <= error, `${message}: ${actual} differs from ${expected}`);

test('FK reproduces measured V3 concept contact at pickup and +85 deg drop', () => {
  assert.equal(armPoints(contactPose).length, 4);
  atMost(distance3(toolTip(contactPose), pickup), 0, 0.002, 'pickup tool error');
  atMost(distance3(toolTip({ ...contactPose, base: 85 }), drop), 0, 0.002, 'drop tool error');
});

test('inverse kinematics solves both stations and arbitrary reachable target', () => {
  for (const target of [pickup, drop, { x: 0.3, y: 0.284, z: -0.12 }, { x: 0.4, y: 0.284, z: 0.1 }]) {
    const result = solveIK(target);
    assert.equal(result.ok, true, result.ok ? undefined : result.reason);
    assert.ok(withinJointLimits(result.controls));
    assert.equal(intersectsChassis(result.controls), false);
    assert.ok(distance3(toolTip(result.controls), target) < 0.003);
  }
});

test('IK rejects NaN, ground collision, chassis/arm overlap and out-of-reach targets', () => {
  for (const target of [
    { x: NaN, y: 0.284, z: 0 },
    { x: 0.5, y: 0.01, z: 0 },
    { x: 0, y: 0.284, z: 0 },
    { x: 1.1, y: 0.284, z: 0 },
    { x: -0.5, y: 0.284, z: 0 },
  ]) assert.equal(solveIK(target).ok, false, JSON.stringify(target));
});

test('pickup is blocked for open gripper, distant object and limit violations', () => {
  assert.equal(graspContact({ ...contactPose, grip: 100 }, pickup).contact, false);
  assert.equal(graspContact(contactPose, { x: pickup.x + 0.08, y: pickup.y, z: pickup.z }).contact, false);
  assert.equal(graspContact({ ...contactPose, shoulder: 120 }, pickup).contact, false);
  assert.equal(graspContact(contactPose, pickup).contact, true);
  assert.ok(ARM.contactTolerance < ARM.objectSize / 2);
});

test('FL/FR/RL/RR mecanum wheel polarities match established V5 drive patterns', () => {
  const twists = {
    stop: { vx: 0, vy: 0, omega: 0 },
    forward: { vx: 0.24, vy: 0, omega: 0 },
    reverse: { vx: -0.24, vy: 0, omega: 0 },
    'strafe-left': { vx: 0, vy: 0.24, omega: 0 },
    'strafe-right': { vx: 0, vy: -0.24, omega: 0 },
    'rotate-left': { vx: 0, vy: 0, omega: 0.75 },
    'rotate-right': { vx: 0, vy: 0, omega: -0.75 },
  };
  for (const [mode, twist] of Object.entries(twists)) {
    const speeds = mecanumWheelRadPerSec(twist);
    assert.deepEqual(speeds.map((v) => Math.sign(v)), DRIVE_PATTERNS[mode], mode);
  }
});

test('mecanum wheel RPM conversion uses GLB radius and half-wheelbase sum', () => {
  const linear = 0.273;
  const expected = linear / MECANUM.effectiveRadius * 60 / (2 * Math.PI);
  for (const rpm of mecanumWheelRpm({ vx: linear, vy: 0, omega: 0 })) atMost(rpm, expected, 1e-10, 'forward rpm');
  const omega = 0.6;
  const speeds = mecanumWheelRadPerSec({ vx: 0, vy: 0, omega });
  atMost(speeds[0], -(MECANUM.frontX + MECANUM.leftY) * omega / MECANUM.effectiveRadius, 1e-10, 'FL yaw speed');
  atMost(speeds[1], -speeds[0], 1e-10, 'FR yaw speed');
});

test('odometry translates forward/sideways and integrates yaw in world coordinates', () => {
  const start = { x: 0, y: 0, theta: 0 };
  const forward = integrateMecanum(start, { vx: 0.2, vy: 0, omega: 0 }, 0.1);
  atMost(forward.x, 0.02, 1e-10, 'forward x');
  assert.equal(forward.y, 0);
  const left = integrateMecanum(start, { vx: 0, vy: 0.2, omega: 0 }, 0.1);
  atMost(left.y, 0.02, 1e-10, 'lateral y');
  const yawed = integrateMecanum(start, { vx: 0, vy: 0, omega: 1 }, 0.1);
  atMost(yawed.theta, 0.1, 1e-10, 'yaw angle');
  const afterTurning = integrateMecanum({ x: 0, y: 0, theta: Math.PI / 2 }, { vx: 0.2, vy: 0, omega: 0 }, 0.1);
  atMost(afterTurning.y, 0.02, 1e-10, 'rotated heading');
});
