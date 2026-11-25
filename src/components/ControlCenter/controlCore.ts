/**
 * Browser-local, deterministic teaching model for an AMR operator console.
 * No sensor, ROS 2 process, robot, or cloud endpoint is connected.
 */
export const TICK_SECONDS = 0.2;
export const CRUISE_SPEED = 0.9; // schematic metres per simulated second

export type RobotMode = 'standby' | 'running' | 'paused' | 'fault' | 'estop';
export type TaskKind = 'inspect' | 'dispatch' | 'return';
export type NodeId = 'dock' | 'west' | 'northwest' | 'north' | 'inspection' | 'east' | 'dispatch' | 'center';

export interface Point { x: number; y: number }
export interface Pose extends Point { theta: number }
export interface Task { id: string; kind: TaskKind; label: string; destination: NodeId }
export interface EventLog { id: number; time: number; level: 'info' | 'success' | 'warning' | 'error'; message: string }
export interface TelemetrySample { time: number; battery: number; speed: number }

export const NODES: Record<NodeId, Point> = {
  dock: { x: 1.2, y: 6.5 }, west: { x: 1.2, y: 4.2 },
  northwest: { x: 1.2, y: 2.0 }, north: { x: 5.5, y: 2.0 },
  inspection: { x: 10.6, y: 2.0 }, east: { x: 10.6, y: 4.2 },
  dispatch: { x: 10.6, y: 6.5 }, center: { x: 5.5, y: 4.2 },
};

const ADJACENT: Record<NodeId, NodeId[]> = {
  dock: ['west'], west: ['dock', 'northwest', 'center'],
  northwest: ['west', 'north'], north: ['northwest', 'inspection', 'center'],
  inspection: ['north', 'east'], east: ['inspection', 'dispatch', 'center'],
  dispatch: ['east'], center: ['west', 'north', 'east'],
};

export const TASK_TEMPLATES: Record<TaskKind, { label: string; destination: NodeId }> = {
  inspect: { label: 'Inbound tote → Quality inspection', destination: 'inspection' },
  dispatch: { label: 'Transfer tote → Dispatch station', destination: 'dispatch' },
  return: { label: 'Return AMR → Loading dock', destination: 'dock' },
};

export function shortestRoute(start: NodeId, destination: NodeId): NodeId[] {
  if (start === destination) return [];
  const pending: NodeId[] = [start];
  const parent = new Map<NodeId, NodeId | null>([[start, null]]);
  for (let index = 0; index < pending.length; index++) {
    const node = pending[index];
    for (const neighbor of ADJACENT[node]) {
      if (parent.has(neighbor)) continue;
      parent.set(neighbor, node);
      pending.push(neighbor);
    }
  }
  const route: NodeId[] = [];
  let cursor: NodeId | null | undefined = destination;
  while (cursor && cursor !== start) {
    route.unshift(cursor);
    cursor = parent.get(cursor);
  }
  return cursor === start ? route : [];
}

export const lengthBetween = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export interface ControlState {
  mode: RobotMode;
  pose: Pose;
  atNode: NodeId;
  battery: number;
  speed: number;
  totalDistance: number;
  time: number;
  queue: Task[];
  active: Task | null;
  finished: Task[];
  failed: Task[];
  remainingRoute: NodeId[];
  initialTaskDistance: number;
  taskDistance: number;
  logs: EventLog[];
  nextId: number;
  nextEventId: number;
  faultMessage: string | null;
  samples: TelemetrySample[];
}

export type ControlAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'tick' }
  | { type: 'enqueue'; kind: TaskKind }
  | { type: 'estop' }
  | { type: 'release-estop' }
  | { type: 'inject-fault' }
  | { type: 'ack-fault' }
  | { type: 'fail-task' }
  | { type: 'reset' };

function addLog(state: ControlState, level: EventLog['level'], message: string): ControlState {
  return {
    ...state,
    nextEventId: state.nextEventId + 1,
    logs: [{ id: state.nextEventId, time: state.time, level, message }, ...state.logs].slice(0, 40),
  };
}

function makeTask(kind: TaskKind, id: number): Task {
  return { ...TASK_TEMPLATES[kind], kind, id: `JOB-${String(id).padStart(3, '0')}` };
}

function routeDistance(start: Point, route: NodeId[]): number {
  let total = 0;
  let last: Point = start;
  for (const node of route) {
    const next = NODES[node];
    total += lengthBetween(last, next);
    last = next;
  }
  return total;
}

export function createControlState(): ControlState {
  return {
    mode: 'standby', pose: { ...NODES.dock, theta: -Math.PI / 2 }, atNode: 'dock',
    battery: 82, speed: 0, totalDistance: 0, time: 0,
    queue: [makeTask('inspect', 101), makeTask('dispatch', 102)],
    active: null, finished: [], failed: [], remainingRoute: [],
    initialTaskDistance: 0, taskDistance: 0,
    logs: [{ id: 1, time: 0, level: 'info', message: 'Local simulator initialized. No robot connected.' }],
    nextId: 103, nextEventId: 2, faultMessage: null,
    samples: [{ time: 0, battery: 82, speed: 0 }],
  };
}

function startNextTask(state: ControlState): ControlState {
  if (state.active) return addLog({ ...state, mode: 'running' }, 'info', `${state.active.id} resumed.`);
  if (!state.queue.length) return addLog({ ...state, mode: 'standby' }, 'warning', 'Task queue is empty.');
  const [task, ...queue] = state.queue;
  const route = shortestRoute(state.atNode, task.destination);
  return addLog({
    ...state, mode: 'running', active: task, queue,
    remainingRoute: route, initialTaskDistance: routeDistance(state.pose, route), taskDistance: 0,
  }, 'info', `${task.id} started · ${task.label}`);
}

function nextSample(state: ControlState): TelemetrySample[] {
  return [...state.samples, { time: state.time, battery: state.battery, speed: state.speed }].slice(-90);
}

export function controlReducer(state: ControlState, action: ControlAction): ControlState {
  switch (action.type) {
    case 'reset': return createControlState();
    case 'enqueue': {
      if (state.queue.length >= 8) return addLog(state, 'warning', 'Queue capacity reached (8 pending jobs).');
      const task = makeTask(action.kind, state.nextId);
      return addLog({ ...state, nextId: state.nextId + 1, queue: [...state.queue, task] }, 'info', `${task.id} added to queue.`);
    }
    case 'start': {
      if (state.mode === 'estop' || state.mode === 'fault' || state.mode === 'running') return state;
      if (state.battery < 10) return addLog(state, 'warning', 'Battery too low to dispatch.');
      return startNextTask(state);
    }
    case 'pause':
      return state.mode === 'running' ? addLog({ ...state, mode: 'paused', speed: 0 }, 'warning', 'Operator paused the active job.') : state;
    case 'estop':
      return state.mode === 'estop' ? state : addLog({ ...state, mode: 'estop', speed: 0 }, 'error', 'EMERGENCY STOP engaged. Motion inhibited.');
    case 'release-estop':
      return state.mode === 'estop'
        ? addLog({ ...state, mode: state.faultMessage ? 'fault' : state.active ? 'paused' : 'standby', speed: 0 }, 'warning', 'E-stop released manually. Resume requires operator action.')
        : state;
    case 'inject-fault':
      return state.mode === 'estop' || state.mode === 'fault' ? state : addLog({ ...state, mode: 'fault', speed: 0, faultMessage: 'Synthetic encoder timeout' }, 'error', 'FAULT: synthetic encoder timeout. Job stopped.');
    case 'ack-fault':
      return state.mode === 'fault'
        ? addLog({ ...state, mode: state.active ? 'paused' : 'standby', speed: 0, faultMessage: null }, 'info', 'Fault acknowledged. Motion remains stopped.')
        : state;
    case 'fail-task':
      if (!state.active || state.mode === 'estop') return state;
      return addLog({ ...state, failed: [state.active, ...state.failed], active: null, mode: 'standby', speed: 0, remainingRoute: [], initialTaskDistance: 0, taskDistance: 0 }, 'error', `${state.active.id} marked failed by operator.`);
    case 'tick': {
      if (state.mode !== 'running' || !state.active) return state;
      const targetId = state.remainingRoute[0];
      if (!targetId) {
        const finished = addLog({ ...state, mode: 'standby', active: null, speed: 0, finished: [state.active, ...state.finished], taskDistance: state.initialTaskDistance }, 'success', `${state.active.id} completed at destination.`);
        return { ...finished, samples: nextSample(finished) };
      }
      const target = NODES[targetId];
      const distance = lengthBetween(state.pose, target);
      const step = Math.min(distance, CRUISE_SPEED * TICK_SECONDS);
      const heading = Math.atan2(target.y - state.pose.y, target.x - state.pose.x);
      const reachedNode = distance <= step + 1e-8;
      const pose: Pose = {
        x: reachedNode ? target.x : state.pose.x + Math.cos(heading) * step,
        y: reachedNode ? target.y : state.pose.y + Math.sin(heading) * step,
        theta: heading,
      };
      const updated: ControlState = {
        ...state, pose, atNode: reachedNode ? targetId : state.atNode,
        remainingRoute: reachedNode ? state.remainingRoute.slice(1) : state.remainingRoute,
        totalDistance: state.totalDistance + step, taskDistance: state.taskDistance + step,
        time: state.time + TICK_SECONDS, speed: step / TICK_SECONDS,
        battery: Math.max(0, state.battery - 0.008),
      };
      if (!updated.remainingRoute.length) {
        const completed = addLog({
          ...updated, mode: 'standby', speed: 0, active: null,
          finished: [state.active, ...updated.finished],
          taskDistance: updated.initialTaskDistance,
        }, 'success', `${state.active.id} completed at ${targetId}.`);
        return { ...completed, samples: nextSample(completed) };
      }
      return { ...updated, samples: nextSample(updated) };
    }
  }
}

export function exportControlRun(state: ControlState) {
  return {
    evidence: 'independent browser-local simulated run, not hardware/ROS data',
    clockSeconds: Number(state.time.toFixed(2)),
    mode: state.mode,
    robot: { id: 'AMR-01', batteryPercent: Number(state.battery.toFixed(2)), pose: state.pose, distanceMeters: Number(state.totalDistance.toFixed(2)) },
    activeJob: state.active?.id ?? null,
    queuedJobIds: state.queue.map((task) => task.id),
    completedJobIds: state.finished.map((task) => task.id),
    failedJobIds: state.failed.map((task) => task.id),
    recentEvents: state.logs.slice(0, 25),
    sampleCount: state.samples.length,
  };
}
