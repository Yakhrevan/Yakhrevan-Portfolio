import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GRID_HEIGHT, GRID_WIDTH, LIDAR_BEAMS, LIDAR_MAX_RANGE,
  collides, createInitialState, createObstacles, distance, findPath,
  navigationReducer, pointKey, simulateScan, summarizeMission,
} from '../src/components/NavLab/navigationCore.ts';

function runUntilTerminal(initial, maxTicks = 1200) {
  let state = navigationReducer(initial, { type: 'start' });
  for (let tick = 0; tick < maxTicks && state.status === 'navigating'; tick++) {
    state = navigationReducer(state, { type: 'tick' });
    assert.equal(collides(state.robot, state.obstacles), false, `collision at tick ${tick}`);
  }
  return state;
}

test('all three maps produce collision-free routes and reach goals', () => {
  for (const scenario of ['warehouse', 'aisles', 'open']) {
    const initial = createInitialState(scenario);
    assert.ok(initial.route.length > 0, `${scenario} should have a route`);
    const result = runUntilTerminal(initial);
    assert.equal(result.status, 'reached', `${scenario} should reach its goal`);
    assert.ok(distance(result.robot, result.goal) <= 0.32);
    assert.ok(result.distanceTraveled > 0 && result.simulationTime > 0);
    assert.deepEqual(result.command, { linear: 0, angular: 0 });
  }
});

test('A* rejects blocked destinations and never cuts a diagonal corner', () => {
  const obstacles = createObstacles('open');
  assert.deepEqual(findPath({ x: 2.5, y: 2.5 }, { x: 6.5, y: 5.5 }, obstacles), []);
  obstacles.add(pointKey(3, 2));
  obstacles.add(pointKey(2, 3));
  const safeDetour = findPath({ x: 2.5, y: 2.5 }, { x: 3.5, y: 3.5 }, obstacles);
  assert.ok(safeDetour.length > 1, 'planner must detour instead of crossing the blocked diagonal');
  assert.notDeepEqual(safeDetour[0], { x: 3.5, y: 3.5 });
});

test('adding a dynamic obstacle revises the path and still reaches the goal', () => {
  let state = createInitialState('warehouse');
  const target = state.route[4];
  assert.ok(target, 'waypoint exists');
  state = navigationReducer(state, { type: 'set-mode', mode: 'obstacle' });
  state = navigationReducer(state, { type: 'map-click', cellX: Math.floor(target.x), cellY: Math.floor(target.y) });
  assert.equal(state.obstacles.has(pointKey(Math.floor(target.x), Math.floor(target.y))), true);
  assert.equal(state.routeRevisions, 2);
  assert.ok(state.route.length > 0);
  assert.ok(!state.route.some((point) => Math.floor(point.x) === Math.floor(target.x) && Math.floor(point.y) === Math.floor(target.y)));
  assert.equal(runUntilTerminal(state).status, 'reached');
});

test('E-stop zeros drive command and freezes pose until manual release', () => {
  let state = navigationReducer(createInitialState(), { type: 'start' });
  for (let i = 0; i < 30; i++) state = navigationReducer(state, { type: 'tick' });
  assert.ok(state.command.linear > 0 || state.command.angular !== 0);
  state = navigationReducer(state, { type: 'emergency-stop' });
  assert.equal(state.status, 'estop');
  assert.deepEqual(state.command, { linear: 0, angular: 0 });
  const frozenPose = { ...state.robot };
  for (let i = 0; i < 15; i++) state = navigationReducer(state, { type: 'tick' });
  assert.deepEqual(state.robot, frozenPose);
  assert.equal(navigationReducer(state, { type: 'start' }).status, 'estop');
  state = navigationReducer(state, { type: 'release-stop' });
  assert.equal(state.status, 'paused');
  assert.equal(navigationReducer(state, { type: 'start' }).status, 'navigating');
});

test('setting a free-cell goal works, but occupied cells are rejected', () => {
  let state = navigationReducer(createInitialState(), { type: 'start' });
  state = navigationReducer(state, { type: 'map-click', cellX: 2, cellY: 12 });
  assert.deepEqual(state.goal, { x: 2.5, y: 12.5 });
  assert.equal(state.status, 'navigating');
  const revision = state.routeRevisions;
  state = navigationReducer(state, { type: 'map-click', cellX: 5, cellY: 4 });
  assert.equal(state.routeRevisions, revision);
  assert.deepEqual(state.goal, { x: 2.5, y: 12.5 });
});

test('simulated LiDAR generates bounded finite range returns', () => {
  const state = createInitialState();
  const scan = simulateScan(state.robot, state.obstacles);
  assert.equal(scan.length, LIDAR_BEAMS);
  assert.ok(scan.some((beam) => beam.hit));
  for (const beam of scan) {
    assert.ok(beam.distance > 0 && beam.distance <= LIDAR_MAX_RANGE);
    assert.ok(Number.isFinite(beam.x) && Number.isFinite(beam.y));
  }
});

test('boundary walls and footprint prevent invalid motion', () => {
  const state = createInitialState();
  assert.ok(state.obstacles.has(pointKey(0, 6)));
  assert.ok(state.obstacles.has(pointKey(GRID_WIDTH - 1, GRID_HEIGHT - 1)));
  assert.equal(collides({ x: 0.1, y: 8 }, state.obstacles), true);
  assert.equal(collides(state.robot, state.obstacles), false);
});

test('mission report contains real simulated route and repeatable outcome evidence', () => {
  const outcome = runUntilTerminal(createInitialState('warehouse'));
  const report = summarizeMission(outcome);
  assert.equal(report.status, 'reached');
  assert.equal(report.scenario, 'warehouse');
  assert.match(report.engine, /not ROS 2 or Gazebo/);
  assert.equal(report.collisionFree, true);
  assert.ok(report.trajectory.length > 10);
  assert.ok(report.averageSpeedMps > 0 && report.averageSpeedMps < 0.85);
  assert.ok(report.goalErrorMeters <= 0.32);
  assert.equal(report.distanceMeters, outcome.distanceTraveled);
  assert.equal(report.simulatedSeconds, outcome.simulationTime);
  assert.equal(report.replans, 0);
  assert.deepEqual(report.finalPose, outcome.robot);
  assert.deepEqual(report.trajectory[0], createInitialState().robot);
});

test('trajectory resets with scenario and remains frozen during emergency stop', () => {
  let state = navigationReducer(createInitialState(), { type: 'start' });
  for (let i = 0; i < 44; i++) state = navigationReducer(state, { type: 'tick' });
  assert.ok(state.trajectory.length > 1);
  const frozen = navigationReducer(state, { type: 'emergency-stop' });
  assert.deepEqual(navigationReducer(frozen, { type: 'tick' }).trajectory, frozen.trajectory);
  assert.equal(summarizeMission(frozen).status, 'estop');
  const reset = navigationReducer(frozen, { type: 'set-scenario', scenario: 'open' });
  assert.equal(reset.simulationTime, 0);
  assert.equal(reset.trajectory.length, 1);
  assert.equal(reset.routeRevisions, 1);
});

test('multiple accelerated ticks produce the same deterministic result as real-time ticks', () => {
  const initial = navigationReducer(createInitialState('aisles'), { type: 'start' });
  let normal = initial;
  let accelerated = initial;
  for (let t = 0; t < 200; t++) normal = navigationReducer(normal, { type: 'tick' });
  for (let chunk = 0; chunk < 20; chunk++) {
    for (let t = 0; t < 10; t++) accelerated = navigationReducer(accelerated, { type: 'tick' });
  }
  assert.deepEqual(accelerated.robot, normal.robot);
  assert.deepEqual(accelerated.trajectory, normal.trajectory);
  assert.equal(accelerated.simulationTime, normal.simulationTime);
});
