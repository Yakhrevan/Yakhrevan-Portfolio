import { GRID_HEIGHT, GRID_WIDTH, type Point, type Pose, type ScanBeam } from './navigationCore';

/** Fixed orthographic isometric projection: illustration driven by live simulation state. */
export function projectWorld(point: Point, height = 0) {
  return { x: 440 + (point.x - point.y) * 13, y: 68 + (point.x + point.y) * 7 - height * 36 };
}

const polygon = (points: Point[]) => points.map((p) => `${p.x},${p.y}`).join(' ');

function Block({ cell }: { cell: string }) {
  const [x, y] = cell.split(',').map(Number);
  const h = x === 0 || y === 0 || x === GRID_WIDTH - 1 || y === GRID_HEIGHT - 1 ? 0.42 : 1.3;
  const a = projectWorld({ x, y }, h);
  const b = projectWorld({ x: x + 1, y }, h);
  const c = projectWorld({ x: x + 1, y: y + 1 }, h);
  const d = projectWorld({ x, y: y + 1 }, h);
  const a0 = projectWorld({ x, y });
  const b0 = projectWorld({ x: x + 1, y });
  const c0 = projectWorld({ x: x + 1, y: y + 1 });
  return (
    <g>
      <polygon points={polygon([b, c, c0, b0])} fill="#38556e" stroke="#152b40" strokeWidth="0.7" />
      <polygon points={polygon([c, d, projectWorld({ x, y: y + 1 }), c0])} fill="#22394f" stroke="#152b40" strokeWidth="0.7" />
      <polygon points={polygon([a, b, c, d])} fill={h > 1 ? '#637e93' : '#476980'} stroke="#89afc6" strokeWidth="0.8" />
      {h > 1 && <line x1={(a.x + b.x) / 2} y1={(a.y + b.y) / 2} x2={(d.x + c.x) / 2} y2={(d.y + c.y) / 2} stroke="#b8d2e1" strokeOpacity="0.35" />}
      {h > 1 && <line x1={a0.x} y1={a0.y} x2={a.x} y2={a.y} stroke="#162a42" strokeWidth="1" />}
    </g>
  );
}

interface Props {
  obstacles: Set<string>;
  robot: Pose;
  goal: Point;
  route: Point[];
  trajectory: Pose[];
  scan: ScanBeam[];
}

export function NavWorldView({ obstacles, robot, goal, route, trajectory, scan }: Props) {
  const floor = [
    projectWorld({ x: 0, y: 0 }),
    projectWorld({ x: GRID_WIDTH, y: 0 }),
    projectWorld({ x: GRID_WIDTH, y: GRID_HEIGHT }),
    projectWorld({ x: 0, y: GRID_HEIGHT }),
  ];
  const robotPos = projectWorld(robot, 0.23);
  const headingPoint = projectWorld({ x: robot.x + Math.cos(robot.theta) * 0.95, y: robot.y + Math.sin(robot.theta) * 0.95 }, 0.23);
  const path = [robot, ...route].map((p) => projectWorld(p, 0.07));
  const driven = trajectory.map((p) => projectWorld(p, 0.06));
  const target = projectWorld(goal, 0.07);
  const cells = [...obstacles].sort((a, b) => {
    const [ax, ay] = a.split(',').map(Number);
    const [bx, by] = b.split(',').map(Number);
    return ax + ay - bx - by;
  });

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#071625]">
      <svg viewBox="0 0 880 490" className="h-full w-full" role="img" aria-label="Live isometric warehouse simulation with 3D-like shelving, robot, goal, range rays and driven route. This is a 2.5D projection, not Gazebo physics.">
        <defs>
          <linearGradient id="nav-v7-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0a253d" /><stop offset="1" stopColor="#0a1829" /></linearGradient>
          <linearGradient id="nav-v7-floor" x1="0" y1="0" x2="0.5" y2="1"><stop stopColor="#1e3a4c" /><stop offset="1" stopColor="#10283b" /></linearGradient>
          <filter id="nav-v7-glow"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect width="880" height="490" fill="url(#nav-v7-sky)" />
        <text x="34" y="38" fontSize="14" fontWeight="800" letterSpacing="2" fill="#b8dce8">VIRTUAL WAREHOUSE // LIVE</text>
        <text x="34" y="56" fontSize="10" letterSpacing="1" fill="#6b9fb6">ISOMETRIC PROJECTION · NOT GAZEBO</text>
        <polygon points={polygon(floor)} fill="url(#nav-v7-floor)" stroke="#47738c" strokeWidth="2" />
        {Array.from({ length: GRID_WIDTH + 1 }, (_, x) => {
          const a = projectWorld({ x, y: 0 });
          const b = projectWorld({ x, y: GRID_HEIGHT });
          return <line key={`gx${x}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#548298" opacity="0.23" strokeWidth="0.8" />;
        })}
        {Array.from({ length: GRID_HEIGHT + 1 }, (_, y) => {
          const a = projectWorld({ x: 0, y });
          const b = projectWorld({ x: GRID_WIDTH, y });
          return <line key={`gy${y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#548298" opacity="0.23" strokeWidth="0.8" />;
        })}
        {driven.length > 1 && <polyline points={polygon(driven)} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />}
        {path.length > 1 && <polyline points={polygon(path)} fill="none" stroke="#35d6f4" strokeWidth="2.2" strokeDasharray="6 6" opacity="0.86" />}
        {scan.filter((_, i) => i % 3 === 0).map((beam, index) => {
          const end = projectWorld({ x: beam.x, y: beam.y }, 0.12);
          return <line key={index} x1={robotPos.x} y1={robotPos.y} x2={end.x} y2={end.y} stroke="#3bfcdb" strokeOpacity="0.11" strokeWidth="1" />;
        })}
        {cells.map((cell) => <Block key={cell} cell={cell} />)}
        <ellipse cx={target.x} cy={target.y + 7} rx="19" ry="10" fill="#34d399" opacity="0.22" filter="url(#nav-v7-glow)" />
        <ellipse cx={target.x} cy={target.y} rx="12" ry="6" fill="#34d399" opacity="0.25" stroke="#6ee7b7" strokeWidth="2" />
        <path d={`M${target.x},${target.y - 31}v27`} stroke="#6ee7b7" strokeWidth="2.5" strokeDasharray="4 3" />
        <circle cx={target.x} cy={target.y - 34} r="5" fill="#6ee7b7" />
        <g>
          <ellipse cx={robotPos.x} cy={robotPos.y + 11} rx="21" ry="11" fill="#fb923c" opacity="0.2" filter="url(#nav-v7-glow)" />
          <ellipse cx={robotPos.x} cy={robotPos.y + 7} rx="16" ry="8" fill="#081522" opacity="0.9" />
          <rect x={robotPos.x - 12} y={robotPos.y - 13} width="24" height="24" rx="5" fill="#fb923c" stroke="#ffdfb1" strokeWidth="2.2" />
          <circle cx={robotPos.x} cy={robotPos.y - 1} r="5" fill="#17293b" stroke="#ffe5bd" />
          <path d={`M${robotPos.x},${robotPos.y - 1}L${headingPoint.x},${headingPoint.y}`} stroke="#fff7ed" strokeWidth="3" strokeLinecap="round" />
          <circle cx={headingPoint.x} cy={headingPoint.y} r="3.4" fill="#fff7ed" />
        </g>
        <rect x="20" y="426" width="340" height="45" rx="9" fill="#07111e" fillOpacity="0.9" stroke="#3b536b" strokeWidth="1" />
        <circle cx="39" cy="442" r="5" fill="#fb923c"/><text x="51" y="446" fontSize="12" fill="#cbdfe9">Robot</text>
        <circle cx="128" cy="442" r="5" fill="#34d399"/><text x="140" y="446" fontSize="12" fill="#cbdfe9">Goal</text>
        <line x1="210" y1="442" x2="234" y2="442" stroke="#35d6f4" strokeWidth="2" strokeDasharray="5 4"/><text x="243" y="446" fontSize="12" fill="#cbdfe9">Planned</text>
        <line x1="39" y1="460" x2="61" y2="460" stroke="#fb923c" strokeWidth="2"/><text x="70" y="464" fontSize="10" fill="#9cb8cb">Driven trajectory</text>
      </svg>
      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-cyan-400/25 bg-[#091b2d]/80 px-2.5 py-1.5 font-mono text-[10px] text-cyan-200">LIVE FROM 2D NAV ENGINE</div>
    </div>
  );
}
