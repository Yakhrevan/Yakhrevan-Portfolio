export type ShowcaseId = 'pickbot' | 'navigation-lab' | 'robot-control-center';

export type EvidenceImage = {
  src: string;
  title: string;
  alt: string;
  mediaType: 'Virtual simulation still' | 'Illustrative interface diagram';
  context: string;
};

export type Showcase = {
  id: ShowcaseId;
  number: string;
  discipline: string;
  contribution: string;
  proof: string;
  boundary: string;
  source: string;
  testCommand: string;
  testPath: string;
  testCount: number;
  technologies: string[];
  recruiterSummary: string;
  verifiedBehavior: string;
  gallery: EvidenceImage[];
};

const media = (name: string) => `${import.meta.env.BASE_URL}projects/${name}`;

export const FEATURED_SHOWCASES: Showcase[] = [
  {
    id: 'pickbot', number: '01', discipline: 'Mobile manipulation',
    contribution: 'Designed the arm CAD, specified the four-wheel/four-joint configuration and reviewed the AI-assisted IK, grasp and drive demo.',
    proof: '8 passing kinematics + drive tests',
    boundary: 'Arm CAD supplied · Chassis illustrative · Hardware pending',
    source: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/tree/main/src/components/PickBot',
    testCommand: 'npm run test:pickbot-v6', testPath: 'tests/pickbot-v6.test.mjs', testCount: 8,
    technologies: ['Analytic IK', 'Mecanum kinematics', 'Four-joint arm', 'TypeScript', 'Three.js'],
    recruiterSummary: 'Coordinated the concept arm geometry, virtual target reachability, contact-gated pickup and four-wheel drive calculations.',
    verifiedBehavior: 'Deterministic tests cover reachable targets, rejection paths, virtual grasp contact and FL/FR/RL/RR calculations.',
    gallery: [
      { src: media('pickbot-sim-ready.webp'), title: 'Ready at pickup station', alt: 'Illustrative PickBot rover and arm at the ready station', mediaType: 'Virtual simulation still', context: 'Saved image from the illustrative virtual sequence; not a photograph of the assembled robot.' },
      { src: media('pickbot-sim-approach.webp'), title: 'Arm approaches target', alt: 'Illustrative PickBot four-joint arm approaching the payload', mediaType: 'Virtual simulation still', context: 'Concept arm positioning. Joint accuracy and collision geometry have not been physically calibrated.' },
      { src: media('pickbot-sim-pick.webp'), title: 'Virtual object pickup', alt: 'Illustrative PickBot arm closing at a virtual pickup station', mediaType: 'Virtual simulation still', context: 'The browser model gates attachment on target contact and gripper state; this is not a physical grasp test.' },
      { src: media('pickbot-sim-place.webp'), title: 'Virtual object placement', alt: 'Illustrative PickBot arm at the destination station', mediaType: 'Virtual simulation still', context: 'This frame belongs to a synthetic pick-and-place sequence, without measured payload or hardware repeatability.' },
    ],
  },
  {
    id: 'navigation-lab', number: '02', discipline: 'Autonomous navigation',
    contribution: 'Defined the goal-navigation, LiDAR and obstacle-replanning requirements and reviewed the AI-assisted simulation workflow.',
    proof: '10 passing navigation tests',
    boundary: 'Browser simulation · No Nav2 or Gazebo execution',
    source: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/tree/main/src/components/NavLab',
    testCommand: 'npm run test:nav', testPath: 'tests/navigationCore.test.mjs', testCount: 10,
    technologies: ['Footprint-aware A*', 'LiDAR raycasting', 'Differential drive', 'TypeScript', '2.5D world'],
    recruiterSummary: 'Defined and reviewed a repeatable navigation simulation with map editing, replanning, pose tracking and JSON mission evidence.',
    verifiedBehavior: 'Ten tests cover three map arrivals, dynamic replanning, range bounds, E-stop and deterministic speedup.',
    gallery: [
      { src: media('navigation-lab.svg'), title: 'Navigation lab interface concept', alt: 'Illustrative dashboard depicting a robot navigation route and telemetry', mediaType: 'Illustrative interface diagram', context: 'This is a designed preview, not a captured navigation run. Launch the live lab to see a real browser simulation and export its JSON evidence.' },
    ],
  },
  {
    id: 'robot-control-center', number: '03', discipline: 'Robot operations software',
    contribution: 'Specified the AMR task, telemetry, fault and E-stop workflows and reviewed the AI-assisted interactive control demo.',
    proof: '9 passing control-state tests',
    boundary: 'Browser simulation · No ROS 2 or hardware connection',
    source: 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/tree/main/src/components/ControlCenter',
    testCommand: 'npm run test:control', testPath: 'tests/controlCore.test.mjs', testCount: 9,
    technologies: ['Task-state reducer', 'Synthetic telemetry', 'Fault interlocks', 'TypeScript', 'Run export'],
    recruiterSummary: 'Specified an inspectable simulated operator workflow: dispatch, motion, queue state, faults and manual safe-stop recovery.',
    verifiedBehavior: 'Nine tests cover ordered dispatch, movement, pause, E-stop latch, fault acknowledgement and JSON evidence.',
    gallery: [
      { src: media('control-center.svg'), title: 'Control center interface concept', alt: 'Illustrative robot-control dashboard with schematic map and telemetry', mediaType: 'Illustrative interface diagram', context: 'This design preview is not a runtime screenshot or a real-robot dashboard. Open the live demo for simulated telemetry and task execution.' },
    ],
  },
];

export const SHOWCASE_BY_ID: Record<ShowcaseId, Showcase> = {
  pickbot: FEATURED_SHOWCASES[0],
  'navigation-lab': FEATURED_SHOWCASES[1],
  'robot-control-center': FEATURED_SHOWCASES[2],
};
