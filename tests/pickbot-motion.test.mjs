import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';
import { Object3D, Quaternion, Vector3 } from 'three';
import {
  DEMO_STEPS,
  DRIVE_PATTERNS,
  DRIVE_PREVIEW_POSES,
  DROP_POINT,
  GLTF_AXLE_SPIN_SIGN,
  PHYSICAL_WHEEL_NODES,
  PICKUP_POINT,
  TOOL_TIP_OFFSET,
  samplePickPlace,
} from '../src/components/PickBot/demo.ts';

const modelBytes = gunzipSync(readFileSync(new URL('../public/models/pickbot-v3.glb.gz', import.meta.url)));
assert.equal(modelBytes.toString('utf8', 0, 4), 'glTF');
const jsonLength = modelBytes.readUInt32LE(12);
const gltf = JSON.parse(modelBytes.toString('utf8', 20, 20 + jsonLength));

// The runtime GLB hierarchy, rather than independent guessed link lengths.
const objects = gltf.nodes.map((node) => {
  const object = new Object3D();
  object.name = node.name ?? '';
  if (node.translation) object.position.fromArray(node.translation);
  if (node.rotation) object.quaternion.fromArray(node.rotation);
  if (node.scale) object.scale.fromArray(node.scale);
  return object;
});
for (const [index, node] of gltf.nodes.entries()) {
  for (const child of node.children ?? []) objects[index].add(objects[child]);
}
const root = new Object3D();
for (const index of gltf.scenes[gltf.scene ?? 0].nodes) root.add(objects[index]);
const find = (prefix) => {
  const object = objects.find((item) => item.name.startsWith(prefix));
  assert.ok(object, `Missing GLB node ${prefix}`);
  return object;
};
const joints = ['J1_Base_Yaw', 'J2_Shoulder_Pitch', 'J3_Elbow_Pitch', 'J4_Wrist_Pitch'].map(find);
const jointRests = joints.map((joint) => joint.quaternion.clone());
const tool = find('GRIPPER_TOOL_MOUNT');
const yAxis = new Vector3(0, 1, 0);
const zAxis = new Vector3(0, 0, 1);

function tipAt(controls) {
  for (let i = 0; i < 4; i++) {
    const value = [controls.base, controls.shoulder, controls.elbow, controls.wrist][i];
    joints[i].quaternion.copy(jointRests[i]).multiply(
      new Quaternion().setFromAxisAngle(i === 0 ? yAxis : zAxis, (i === 0 ? 1 : -1) * value * Math.PI / 180),
    );
  }
  root.updateMatrixWorld(true);
  return tool.localToWorld(new Vector3(...TOOL_TIP_OFFSET));
}

test('wheel identifiers map to actual FL/FR/RL/RR positions in +X-forward robot frame', () => {
  const positions = PHYSICAL_WHEEL_NODES.map((part) => {
    const wheel = find(`DRIVE_WHEEL_${part}`);
    root.updateMatrixWorld(true);
    return wheel.getWorldPosition(new Vector3());
  });
  const expected = [[0.221, -0.226], [0.221, 0.226], [-0.221, -0.226], [-0.221, 0.226]];
  positions.forEach((actual, i) => {
    assert.ok(Math.abs(actual.x - expected[i][0]) < 0.001);
    assert.ok(Math.abs(actual.z - expected[i][1]) < 0.001);
  });
});

test('all six wheel command patterns agree with model X-roller handedness', () => {
  // Physical FL/FR/RL/RR have (+,-,-,+) roller tilts at the contact patch.
  // Robot +Y-left is viewer -Z. Positive means forward-equivalent axle rotation.
  const wheels = [
    { x: 0.221, y: 0.226, handed: 1 },
    { x: 0.221, y: -0.226, handed: -1 },
    { x: -0.221, y: 0.226, handed: -1 },
    { x: -0.221, y: -0.226, handed: 1 },
  ];
  const maneuvers = {
    forward: [1, 0, 0], reverse: [-1, 0, 0],
    'strafe-left': [0, 1, 0], 'strafe-right': [0, -1, 0],
    'rotate-left': [0, 0, 1], 'rotate-right': [0, 0, -1],
  };
  for (const [mode, [vx, vy, yaw]] of Object.entries(maneuvers)) {
    const computed = wheels.map(({ x, y, handed }) => Math.sign(vx - yaw * y - handed * (vy + yaw * x)));
    assert.deepEqual(DRIVE_PATTERNS[mode], computed, `${mode} wheel direction mismatch`);
  }
});

test('viewer spin and chassis translation follow the source coordinate axes', () => {
  assert.equal(GLTF_AXLE_SPIN_SIGN, -1);
  assert.ok(DRIVE_PREVIEW_POSES.forward[0] > 0);
  assert.ok(DRIVE_PREVIEW_POSES.reverse[0] < 0);
  assert.ok(DRIVE_PREVIEW_POSES['strafe-left'][1] < 0);
  assert.ok(DRIVE_PREVIEW_POSES['strafe-right'][1] > 0);
  assert.ok(DRIVE_PREVIEW_POSES['rotate-left'][2] > 0);
  assert.ok(DRIVE_PREVIEW_POSES['rotate-right'][2] < 0);
});

test('gripper tip physically meets both table-height pickup and drop contact points', () => {
  const pick = tipAt(DEMO_STEPS.find((step) => step.label === 'Align').controls);
  const drop = tipAt(DEMO_STEPS.find((step) => step.label === 'Place').controls);
  assert.ok(pick.distanceTo(new Vector3(...PICKUP_POINT)) < 0.002, `Pickup error ${pick.distanceTo(new Vector3(...PICKUP_POINT))} m`);
  assert.ok(drop.distanceTo(new Vector3(...DROP_POINT)) < 0.002, `Drop error ${drop.distanceTo(new Vector3(...DROP_POINT))} m`);
  // The platform tops are at 0.25 m, with a 70 mm object centered at 0.284 m.
  assert.ok(Math.abs(PICKUP_POINT[1] - 0.25 - 0.035) < 0.002);
  assert.ok(Math.abs(DROP_POINT[1] - 0.25 - 0.035) < 0.002);
});

test('payload attaches only after closing and detaches only after opening at destination', () => {
  assert.equal(samplePickPlace(7999).payload, 'source');
  assert.equal(samplePickPlace(8000).payload, 'attached');
  assert.equal(samplePickPlace(8000).controls.grip, 0);
  assert.equal(samplePickPlace(20999).payload, 'attached');
  assert.equal(samplePickPlace(21000).payload, 'destination');
  assert.equal(samplePickPlace(21000).controls.grip, 100);
  assert.equal(samplePickPlace(24000).step.label, 'Complete');
});
