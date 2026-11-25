import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NODES, TASK_TEMPLATES, controlReducer, createControlState,
  exportControlRun, shortestRoute,
} from '../src/components/ControlCenter/controlCore.ts';

function dispatchUntilIdle(start, maxTicks = 700) {
  let state = controlReducer(start, { type: 'start' });
  for (let tick = 0; tick < maxTicks && state.mode === 'running'; tick++) {
    state = controlReducer(state, { type: 'tick' });
  }
  return state;
}

test('routing stays on known connected warehouse waypoints', () => {
  assert.deepEqual(shortestRoute('dock', 'dock'), []);
  const route = shortestRoute('dock', 'inspection');
  assert.equal(route.at(-1), 'inspection');
  assert.ok(route.length >= 3);
  assert.ok(route.every((node) => node in NODES));
});

test('starting the first job evolves actual simulated pose and eventually completes', () => {
  const initial = createControlState();
  const running = controlReducer(initial, { type: 'start' });
  assert.equal(running.active.id, 'JOB-101');
  assert.equal(running.queue.length, 1);
  const updated = controlReducer(running, { type: 'tick' });
  assert.ok(updated.pose.y < initial.pose.y);
  assert.ok(updated.totalDistance > 0);
  assert.ok(updated.battery < initial.battery);
  const done = dispatchUntilIdle(initial);
  assert.equal(done.mode, 'standby');
  assert.deepEqual(done.finished.map((task) => task.id), ['JOB-101']);
  assert.equal(done.atNode, 'inspection');
  assert.ok(done.time > 0);
  assert.ok(done.samples.length > 1);
});

test('queue preserves order and operator can append work', () => {
  let state = createControlState();
  state = controlReducer(state, { type: 'enqueue', kind: 'return' });
  assert.equal(state.queue[2].label, TASK_TEMPLATES.return.label);
  for (let index = 0; index < 3; index++) state = dispatchUntilIdle(state);
  assert.deepEqual(state.finished.map((task) => task.id).reverse(), ['JOB-101', 'JOB-102', 'JOB-103']);
  assert.equal(state.atNode, 'dock');
  assert.equal(state.queue.length, 0);
});

test('pause freezes simulated motion until explicitly resumed', () => {
  let state = controlReducer(createControlState(), { type: 'start' });
  state = controlReducer(state, { type: 'tick' });
  state = controlReducer(state, { type: 'pause' });
  assert.equal(state.mode, 'paused');
  const frozenPose = state.pose;
  const time = state.time;
  for (let index = 0; index < 15; index++) state = controlReducer(state, { type: 'tick' });
  assert.deepEqual(state.pose, frozenPose);
  assert.equal(state.time, time);
  state = controlReducer(state, { type: 'start' });
  assert.equal(state.mode, 'running');
  assert.notDeepEqual(controlReducer(state, { type: 'tick' }).pose, frozenPose);
});

test('E-stop latches, inhibits motion and never auto-resumes upon release', () => {
  let state = controlReducer(createControlState(), { type: 'start' });
  state = controlReducer(state, { type: 'tick' });
  state = controlReducer(state, { type: 'estop' });
  assert.equal(state.mode, 'estop');
  assert.equal(state.speed, 0);
  const frozen = state.pose;
  assert.equal(controlReducer(state, { type: 'start' }).mode, 'estop');
  for (let index = 0; index < 25; index++) state = controlReducer(state, { type: 'tick' });
  assert.deepEqual(state.pose, frozen);
  state = controlReducer(state, { type: 'release-estop' });
  assert.equal(state.mode, 'paused');
  assert.deepEqual(state.pose, frozen);
  state = controlReducer(state, { type: 'start' });
  assert.equal(state.mode, 'running');
});

test('synthetic encoder fault requires explicit acknowledgement then resume', () => {
  let state = controlReducer(createControlState(), { type: 'start' });
  state = controlReducer(state, { type: 'inject-fault' });
  assert.equal(state.mode, 'fault');
  assert.match(state.faultMessage, /encoder/i);
  assert.equal(controlReducer(state, { type: 'start' }).mode, 'fault');
  const frozen = state.pose;
  assert.deepEqual(controlReducer(state, { type: 'tick' }).pose, frozen);
  state = controlReducer(state, { type: 'ack-fault' });
  assert.equal(state.mode, 'paused');
  assert.equal(state.faultMessage, null);
  assert.equal(controlReducer(state, { type: 'start' }).mode, 'running');
});

test('operator failed-job state is reflected in exported evidence', () => {
  let state = controlReducer(createControlState(), { type: 'start' });
  state = controlReducer(state, { type: 'fail-task' });
  assert.equal(state.mode, 'standby');
  assert.equal(state.failed[0].id, 'JOB-101');
  const report = exportControlRun(state);
  assert.deepEqual(report.failedJobIds, ['JOB-101']);
  assert.deepEqual(report.queuedJobIds, ['JOB-102']);
  assert.match(report.evidence, /simulated run/i);
  assert.ok(report.recentEvents.some((event) => event.level === 'error'));
});

test('reset restores initial state, clearing errors and restoring default queue', () => {
  let state = controlReducer(createControlState(), { type: 'estop' });
  state = controlReducer(state, { type: 'enqueue', kind: 'return' });
  assert.deepEqual(controlReducer(state, { type: 'reset' }), createControlState());
});

test('queue capacity is enforced and idle mode does not advance time', () => {
  let state = createControlState();
  for (let index = 0; index < 12; index++) state = controlReducer(state, { type: 'enqueue', kind: 'return' });
  assert.equal(state.queue.length, 8);
  assert.equal(controlReducer(state, { type: 'tick' }).time, 0);
});
