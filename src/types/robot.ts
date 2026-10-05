export type RobotState =
  | 'Idle'
  | 'Blink'
  | 'Happy'
  | 'Excited'
  | 'Curious'
  | 'Thinking'
  | 'Focused'
  | 'Confused'
  | 'Sad'
  | 'Sleepy'
  | 'Waving'
  | 'Walking'
  | 'Working'
  | 'Celebrating'
  | 'Error'
  | 'Wake Up';

export interface RobotStateConfig {
  state: RobotState;
  eyeShape: 'normal' | 'happy' | 'excited' | 'star' | 'squint' | 'thinking' | 'confused' | 'sad' | 'closed' | 'error' | 'wide';
  mouthExpression?: 'smile' | 'neutral' | 'open' | 'flat' | 'wave';
  bodyPose: {
    headRotation: [number, number, number]; // [x, y, z] in radians
    headPosition: [number, number, number];
    leftArmRotation: [number, number, number];
    rightArmRotation: [number, number, number];
    torsoRotation: [number, number, number];
    hoverOffset: number;
    floatSpeed: number;
  };
  lightColor: string;
  speechText: string;
}

export interface RobotCommand {
  command: string;
  description: string;
  action: (args?: string[]) => void;
}

export interface RobotControllerState {
  currentState: RobotState;
  previousState: RobotState;
  speed: number;
  isBlueprintMode: boolean;
  isConsoleOpen: boolean;
  reducedMotion: boolean;
  speechBubbleVisible: boolean;
  customMessage: string | null;
  targetSection: string | null;
  activeModelType: 'procedural' | 'gltf';
}
