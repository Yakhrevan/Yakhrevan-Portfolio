/**
 * P6 Navigation Lab: deterministic, browser-local differential drive simulation.
 *
 * This is NOT an active ROS 2 / Nav2 / Gazebo connection. The topics in the UI
 * are educational analogues of ROS messages generated from this simulation.
 */
export const GRID_WIDTH = 24;
export const GRID_HEIGHT = 16;
export const ROBOT_RADIUS = 0.27;
export const WHEEL_BASE = 0.48;
export const WHEEL_RADIUS = 0.08;
export const LIDAR_MAX_RANGE = 6.4;
export const LIDAR_BEAMS = 60;
export const STEP_SECONDS = 0.08;

export type Scenario = 'warehouse' | 'aisles' | 'open';
export type LabStatus = 'ready' | 'navigating' | 'paused' | 'reached' | 'blocked' | 'estop';
export type InteractionMode = 'goal' | 'obstacle';
export type Point = { x: number; y: number };
export type Pose = Point & { theta: number };
export type Velocity = { linear: number; angular: number };
export type ScanBeam = { x: number; y: number; distance: number; hit: boolean };

export type LabState = {
  scenario: Scenario;
  status: LabStatus;
  interactionMode: InteractionMode;
  obstacles: Set<string>;
  robot: Pose;
  goal: Point;
  route: Point[];
  command: Velocity;
  simulationTime: number;
  distanceTraveled: number;
  routeRevisions: number;
  events: string[];
};

export type LabAction =
  | { type: 'tick' }
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'emergency-stop' }
  | { type: 'release-stop' }
  | { type: 'set-scenario'; scenario: Scenario }
  | { type: 'set-mode'; mode: InteractionMode }
  | { type: 'map-click'; cellX: number; cellY: number };

export const pointKey = (x: number, y: number) => `${x},${y}`;
export const clamp = (v: number, low: number, high: number) => Math.min(high, Math.max(low, v));
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
export const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

function addRectangle(cells: Set<string>, x1: number, y1: number, x2: number, y2: number) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) cells.add(pointKey(x, y));
  }
}

export function createObstacles(scenario: Scenario): Set<string> {
  const cells = new Set<string>();
  for (let x = 0; x < GRID_WIDTH; x++) {
    cells.add(pointKey(x, 0));
    cells.add(pointKey(x, GRID_HEIGHT - 1));
  }
  for (let y = 0; y < GRID_HEIGHT; y++) {
    cells.add(pointKey(0, y));
    cells.add(pointKey(GRID_WIDTH - 1, y));
  }

  if (scenario === 'warehouse') {
    for (const x of [5, 11, 17]) {
      addRectangle(cells, x, 3, x + 2, 6);
      addRectangle(cells, x, 9, x + 2, 12);
    }
  } else if (scenario === 'aisles') {
    addRectangle(cells, 5, 2, 6, 11);
    addRectangle(cells, 11, 4, 12, 13);
    addRectangle(cells, 17, 2, 18, 11);
    addRectangle(cells, 8, 7, 9, 8);
    addRectangle(cells, 14, 7, 15, 8);
  } else {
    addRectangle(cells, 6, 5, 8, 7);
    addRectangle(cells, 12, 10, 14, 12);
    addRectangle(cells, 17, 4, 18, 6);
  }
  return cells;
}

/** Circle-versus-grid collision keeps the robot body clear, not just its center. */
export function collides(point: Point, obstacles: Set<string>, radius = ROBOT_RADIUS): boolean {
  for (let cy = Math.floor(point.y - radius); cy <= Math.floor(point.y + radius); cy++) {
    for (let cx = Math.floor(point.x - radius); cx <= Math.floor(point.x + radius); cx++) {
      if (!obstacles.has(pointKey(cx, cy))) continue;
      const closestX = clamp(point.x, cx, cx + 1);
      const closestY = clamp(point.y, cy, cy + 1);
      if (Math.hypot(point.x - closestX, point.y - closestY) < radius) return true;
    }
  }
  return point.x - radius < 0 || point.x + radius > GRID_WIDTH ||
    point.y - radius < 0 || point.y + radius > GRID_HEIGHT;
}

function traversable(x: number, y: number, obstacles: Set<string>) {
  return x > 0 && y > 0 && x < GRID_WIDTH - 1 && y < GRID_HEIGHT - 1 &&
    !collides({ x: x + 0.5, y: y + 0.5 }, obstacles);
}

/** A* over 8-connected grid cells; diagonal corner-cutting is forbidden. */
export function findPath(from: Point, to: Point, obstacles: Set<string>): Point[] {
  const startX = Math.floor(from.x);
  const startY = Math.floor(from.y);
  const goalX = Math.floor(to.x);
  const goalY = Math.floor(to.y);
  if (!traversable(startX, startY, obstacles) || !traversable(goalX, goalY, obstacles)) return [];

  const startKey = pointKey(startX, startY);
  const goalKey = pointKey(goalX, goalY);
  const open = new Set([startKey]);
  const closed = new Set<string>();
  const previous = new Map<string, string>();
  const g = new Map<string, number>([[startKey, 0]]);
  const heuristic = (x: number, y: number) => Math.hypot(goalX - x, goalY - y);
  const f = new Map<string, number>([[startKey, heuristic(startX, startY)]]);
  const neighbors = [-1, 0, 1].flatMap((dx) => [-1, 0, 1]
    .filter((dy) => dx !== 0 || dy !== 0)
    .map((dy) => ({ dx, dy, cost: Math.hypot(dx, dy) })));

  while (open.size) {
    let current = '';
    let bestScore = Infinity;
    for (const candidate of open) {
      const score = f.get(candidate) ?? Infinity;
      if (score < bestScore) { bestScore = score; current = candidate; }
    }
    if (current === goalKey) {
      const cells: Point[] = [];
      let step = current;
      while (step !== startKey) {
        const [x, y] = step.split(',').map(Number);
        cells.push({ x: x + 0.5, y: y + 0.5 });
        step = previous.get(step)!;
      }
      return cells.reverse();
    }

    open.delete(current);
    closed.add(current);
    const [cx, cy] = current.split(',').map(Number);
    for (const { dx, dy, cost } of neighbors) {
      const nx = cx + dx;
      const ny = cy + dy;
      const neighborKey = pointKey(nx, ny);
      if (!traversable(nx, ny, obstacles) || closed.has(neighborKey)) continue;
      if (dx && dy && (!traversable(cx + dx, cy, obstacles) || !traversable(cx, cy + dy, obstacles))) continue;
      const candidateScore = (g.get(current) ?? Infinity) + cost;
      if (candidateScore < (g.get(neighborKey) ?? Infinity)) {
        previous.set(neighborKey, current);
        g.set(neighborKey, candidateScore);
        f.set(neighborKey, candidateScore + heuristic(nx, ny));
        open.add(neighborKey);
      }
    }
  }
  return [];
}

export function routeLength(pose: Point, route: Point[]): number {
  let total = 0;
  let last = pose;
  for (const next of route) { total += distance(last, next); last = next; }
  return total;
}

/** Discrete, collision-aware 360° range scan in metre units. */
export function simulateScan(robot: Pose, obstacles: Set<string>): ScanBeam[] {
  return Array.from({ length: LIDAR_BEAMS }, (_, index) => {
    const angle = robot.theta + (index / LIDAR_BEAMS) * Math.PI * 2;
    let measured = LIDAR_MAX_RANGE;
    let hit = false;
    for (let ray = 0.06; ray <= LIDAR_MAX_RANGE; ray += 0.06) {
      const sampleX = robot.x + Math.cos(angle) * ray;
      const sampleY = robot.y + Math.sin(angle) * ray;
      if (obstacles.has(pointKey(Math.floor(sampleX), Math.floor(sampleY))) ||
          sampleX < 0 || sampleY < 0 || sampleX >= GRID_WIDTH || sampleY >= GRID_HEIGHT) {
        measured = ray;
        hit = true;
        break;
      }
    }
    return {
      x: robot.x + Math.cos(angle) * measured,
      y: robot.y + Math.sin(angle) * measured,
      distance: measured,
      hit,
    };
  });
}

function note(state: LabState, message: string) {
  return [...state.events.slice(-5), message];
}

function navigateTo(state: LabState, goal: Point): LabState {
  const route = findPath(state.robot, goal, state.obstacles);
  const reached = distance(state.robot, goal) <= 0.32;
  const blocked = !reached && route.length === 0;
  return {
    ...state,
    goal,
    route,
    command: { linear: 0, angular: 0 },
    routeRevisions: state.routeRevisions + 1,
    status: state.status === 'estop' ? 'estop' : blocked ? 'blocked' : reached ? 'reached' : state.status === 'navigating' ? 'navigating' : 'ready',
    events: note(state, blocked ? 'Planner: no collision-free route available.' : `Planner: ${route.length} waypoints ready.`),
  };
}

export function createInitialState(scenario: Scenario = 'warehouse'): LabState {
  const obstacles = createObstacles(scenario);
  const robot = { x: 2.5, y: 2.5, theta: 0 };
  const goal = { x: 21.5, y: 13.5 };
  const route = findPath(robot, goal, obstacles);
  return {
    scenario,
    status: route.length ? 'ready' : 'blocked',
    interactionMode: 'goal',
    obstacles,
    robot,
    goal,
    route,
    command: { linear: 0, angular: 0 },
    simulationTime: 0,
    distanceTraveled: 0,
    routeRevisions: 1,
    events: ['Local simulation initialized.', `${route.length} waypoints planned.`, 'Select Run mission to start.'],
  };
}

export function navigationReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case 'start':
      if (state.status === 'estop' || state.status === 'reached' || state.status === 'blocked') return state;
      return { ...state, status: 'navigating', events: note(state, 'Controller: mission running.') };
    case 'pause':
      if (state.status !== 'navigating') return state;
      return { ...state, status: 'paused', command: { linear: 0, angular: 0 }, events: note(state, 'Controller: paused.') };
    case 'reset':
      return createInitialState(state.scenario);
    case 'emergency-stop':
      return { ...state, status: 'estop', command: { linear: 0, angular: 0 }, events: note(state, 'E-STOP: velocity forced to zero.') };
    case 'release-stop':
      if (state.status !== 'estop') return state;
      return { ...state, status: state.route.length ? 'paused' : 'blocked', events: note(state, 'E-STOP released. Manual resume required.') };
    case 'set-scenario':
      return createInitialState(action.scenario);
    case 'set-mode':
      return { ...state, interactionMode: action.mode };
    case 'map-click': {
      const { cellX, cellY } = action;
      if (cellX <= 0 || cellY <= 0 || cellX >= GRID_WIDTH - 1 || cellY >= GRID_HEIGHT - 1) return state;
      const cell = { x: cellX + 0.5, y: cellY + 0.5 };
      const key = pointKey(cellX, cellY);
      if (state.interactionMode === 'goal') {
        if (collides(cell, state.obstacles)) {
          return { ...state, events: note(state, 'Goal rejected: occupied cell.') };
        }
        return navigateTo(state, cell);
      }
      if (distance(state.robot, cell) < 1.1 || distance(state.goal, cell) < 0.7) {
        return { ...state, events: note(state, 'Keep-out: robot and goal cells protected.') };
      }
      const obstacles = new Set(state.obstacles);
      if (obstacles.has(key)) obstacles.delete(key);
      else obstacles.add(key);
      const withObstacle = { ...state, obstacles };
      const planned = navigateTo(withObstacle, state.goal);
      return { ...planned, events: note(planned, `Map updated at (${cellX}, ${cellY}).`) };
    }
    case 'tick': {
      if (state.status !== 'navigating') return state;
      if (distance(state.robot, state.goal) <= 0.32) {
        return { ...state, status: 'reached', route: [], command: { linear: 0, angular: 0 }, events: note(state, 'Goal reached within 0.32 m tolerance.') };
      }
      const route = state.route.filter((waypoint, index) => index !== 0 || distance(state.robot, waypoint) > 0.3);
      const waypoint = route[0] ?? state.goal;
      const bearing = Math.atan2(waypoint.y - state.robot.y, waypoint.x - state.robot.x);
      const error = wrapAngle(bearing - state.robot.theta);
      const angular = clamp(error * 2.5, -1.55, 1.55);
      const linear = Math.abs(error) > 1.05 ? 0 : 0.84 * Math.max(0, Math.cos(error));
      const theta = wrapAngle(state.robot.theta + angular * STEP_SECONDS);
      const next = {
        x: state.robot.x + linear * Math.cos(theta) * STEP_SECONDS,
        y: state.robot.y + linear * Math.sin(theta) * STEP_SECONDS,
        theta,
      };
      if (collides(next, state.obstacles)) {
        return { ...state, status: 'blocked', command: { linear: 0, angular: 0 }, events: note(state, 'Safety stop: footprint collision predicted.') };
      }
      return {
        ...state,
        robot: next,
        route,
        command: { linear, angular },
        simulationTime: state.simulationTime + STEP_SECONDS,
        distanceTraveled: state.distanceTraveled + distance(state.robot, next),
      };
    }
  }
}
