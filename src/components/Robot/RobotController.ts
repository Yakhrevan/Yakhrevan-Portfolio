import { RobotState, RobotStateConfig, RobotControllerState } from '../../types/robot';

export const ROBOT_STATE_CONFIGS: Record<RobotState, RobotStateConfig> = {
  Idle: {
    state: 'Idle',
    eyeShape: 'normal',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [0, 0, 0],
      headPosition: [0, 0, 0],
      leftArmRotation: [0.1, 0, 0.2],
      rightArmRotation: [0.1, 0, -0.2],
      torsoRotation: [0, 0, 0],
      hoverOffset: 0,
      floatSpeed: 2.0,
    },
    lightColor: '#00FFFF',
    speechText: "Hello! I'm Yakhrevan's robotics mascot assistant. Explore around!",
  },
  Blink: {
    state: 'Blink',
    eyeShape: 'closed',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [0, 0, 0],
      headPosition: [0, 0, 0],
      leftArmRotation: [0.1, 0, 0.2],
      rightArmRotation: [0.1, 0, -0.2],
      torsoRotation: [0, 0, 0],
      hoverOffset: 0,
      floatSpeed: 2.0,
    },
    lightColor: '#00FFFF',
    speechText: "*Blink blink*",
  },
  Happy: {
    state: 'Happy',
    eyeShape: 'happy',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [0.1, 0, 0.05],
      headPosition: [0, 0.1, 0],
      leftArmRotation: [-0.4, 0, 0.5],
      rightArmRotation: [-0.4, 0, -0.5],
      torsoRotation: [0, 0, 0],
      hoverOffset: 0.15,
      floatSpeed: 4.0,
    },
    lightColor: '#00FFFF',
    speechText: "Yay! Glad to see you here!",
  },
  Excited: {
    state: 'Excited',
    eyeShape: 'star',
    mouthExpression: 'open',
    bodyPose: {
      headRotation: [-0.15, 0, 0.1],
      headPosition: [0, 0.25, 0],
      leftArmRotation: [-1.2, 0, 0.6],
      rightArmRotation: [-1.2, 0, -0.6],
      torsoRotation: [0.1, 0, 0],
      hoverOffset: 0.3,
      floatSpeed: 6.0,
    },
    lightColor: '#00FFFF',
    speechText: "Super excited to show you what I've been building!",
  },
  Curious: {
    state: 'Curious',
    eyeShape: 'squint',
    mouthExpression: 'neutral',
    bodyPose: {
      headRotation: [0.1, 0.3, 0.2],
      headPosition: [0.1, 0, 0.2],
      leftArmRotation: [0.2, 0, 0.1],
      rightArmRotation: [-0.3, 0.3, -0.4],
      torsoRotation: [0, 0.2, 0],
      hoverOffset: 0.05,
      floatSpeed: 1.5,
    },
    lightColor: '#00FFFF',
    speechText: "Hmm? What does this component do?",
  },
  Thinking: {
    state: 'Thinking',
    eyeShape: 'thinking',
    mouthExpression: 'neutral',
    bodyPose: {
      headRotation: [-0.2, -0.2, -0.15],
      headPosition: [0, 0.05, 0],
      leftArmRotation: [0.5, -0.3, 0.4],
      rightArmRotation: [-0.1, 0, -0.2],
      torsoRotation: [-0.05, -0.1, 0],
      hoverOffset: 0.02,
      floatSpeed: 1.2,
    },
    lightColor: '#00FFFF',
    speechText: "Hmm, let me think about that for a moment...",
  },
  Focused: {
    state: 'Focused',
    eyeShape: 'wide',
    mouthExpression: 'flat',
    bodyPose: {
      headRotation: [0.2, 0, 0],
      headPosition: [0, -0.05, 0.15],
      leftArmRotation: [-0.2, 0, 0.2],
      rightArmRotation: [-0.2, 0, -0.2],
      torsoRotation: [0.1, 0, 0],
      hoverOffset: 0,
      floatSpeed: 1.0,
    },
    lightColor: '#00FFFF',
    speechText: "Deep in focus mode — working on something cool!",
  },
  Confused: {
    state: 'Confused',
    eyeShape: 'confused',
    mouthExpression: 'flat',
    bodyPose: {
      headRotation: [0, 0, -0.35],
      headPosition: [-0.05, 0, 0],
      leftArmRotation: [0.4, 0, 0.3],
      rightArmRotation: [0.1, 0, -0.5],
      torsoRotation: [0, 0, -0.1],
      hoverOffset: 0.04,
      floatSpeed: 2.5,
    },
    lightColor: '#00FFFF',
    speechText: "Wait... something doesn't seem right here?",
  },
  Sad: {
    state: 'Sad',
    eyeShape: 'sad',
    mouthExpression: 'flat',
    bodyPose: {
      headRotation: [0.35, 0, 0],
      headPosition: [0, -0.2, 0],
      leftArmRotation: [0.1, 0, 0.1],
      rightArmRotation: [0.1, 0, -0.1],
      torsoRotation: [0.15, 0, 0],
      hoverOffset: -0.1,
      floatSpeed: 0.8,
    },
    lightColor: '#64748B',
    speechText: "Aww... Battery running low...",
  },
  Sleepy: {
    state: 'Sleepy',
    eyeShape: 'closed',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [0.4, 0, 0.1],
      headPosition: [0, -0.25, 0],
      leftArmRotation: [0.05, 0, 0.05],
      rightArmRotation: [0.05, 0, -0.05],
      torsoRotation: [0.2, 0, 0],
      hoverOffset: -0.15,
      floatSpeed: 0.5,
    },
    lightColor: '#1E293B',
    speechText: "Zzz... dreaming of autonomous electric sheep... Zzz...",
  },
  Waving: {
    state: 'Waving',
    eyeShape: 'happy',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [-0.1, 0.1, 0.1],
      headPosition: [0, 0.1, 0],
      leftArmRotation: [-1.8, 0, 0.3], // High waving hand
      rightArmRotation: [0.1, 0, -0.2],
      torsoRotation: [0, 0.1, 0],
      hoverOffset: 0.1,
      floatSpeed: 3.0,
    },
    lightColor: '#00FFFF',
    speechText: "Hey there! Welcome to Yakhrevan's portfolio!",
  },
  Walking: {
    state: 'Walking',
    eyeShape: 'normal',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [0.05, 0, 0],
      headPosition: [0, 0.05, 0],
      leftArmRotation: [-0.5, 0, 0.2],
      rightArmRotation: [0.5, 0, -0.2],
      torsoRotation: [0, 0.05, 0],
      hoverOffset: 0.05,
      floatSpeed: 4.5,
    },
    lightColor: '#00FFFF',
    speechText: "On my way to check out the next section!",
  },
  Working: {
    state: 'Working',
    eyeShape: 'focused' as any,
    mouthExpression: 'neutral',
    bodyPose: {
      headRotation: [0.25, -0.1, 0],
      headPosition: [0, -0.05, 0.1],
      leftArmRotation: [-0.8, 0.4, 0.2],
      rightArmRotation: [-0.8, -0.4, -0.2],
      torsoRotation: [0.1, 0, 0],
      hoverOffset: 0.05,
      floatSpeed: 3.5,
    },
    lightColor: '#00FFFF',
    speechText: "Hard at work on the next project!",
  },
  Celebrating: {
    state: 'Celebrating',
    eyeShape: 'star',
    mouthExpression: 'open',
    bodyPose: {
      headRotation: [-0.2, 0, 0],
      headPosition: [0, 0.3, 0],
      leftArmRotation: [-2.2, 0, 0.5],
      rightArmRotation: [-2.2, 0, -0.5],
      torsoRotation: [0, 0, 0],
      hoverOffset: 0.35,
      floatSpeed: 7.0,
    },
    lightColor: '#00FFFF',
    speechText: "Mission Accomplished! All tests passed 100%!",
  },
  Error: {
    state: 'Error',
    eyeShape: 'error',
    mouthExpression: 'flat',
    bodyPose: {
      headRotation: [0.1, 0.1, 0.2],
      headPosition: [0, -0.05, 0],
      leftArmRotation: [0.6, 0, 0.6],
      rightArmRotation: [0.6, 0, -0.6],
      torsoRotation: [0.1, 0, 0],
      hoverOffset: 0,
      floatSpeed: 8.0,
    },
    lightColor: '#EF4444',
    speechText: "Oops! Something went wrong — let me fix that!",
  },
  'Wake Up': {
    state: 'Wake Up',
    eyeShape: 'wide',
    mouthExpression: 'smile',
    bodyPose: {
      headRotation: [-0.2, 0, 0],
      headPosition: [0, 0.2, 0],
      leftArmRotation: [-1.4, 0, 0.4],
      rightArmRotation: [-1.4, 0, -0.4],
      torsoRotation: [-0.1, 0, 0],
      hoverOffset: 0.2,
      floatSpeed: 4.0,
    },
    lightColor: '#00FFFF',
    speechText: "Good morning! Ready to explore the portfolio!",
  },
  Alert: {
    state: 'Alert',
    eyeShape: 'wide',
    mouthExpression: 'open',
    bodyPose: {
      headRotation: [0.1, 0, 0],
      headPosition: [0, 0.1, 0.1],
      leftArmRotation: [-0.3, 0, 0.1],
      rightArmRotation: [-0.3, 0, -0.1],
      torsoRotation: [0, 0, 0],
      hoverOffset: 0.1,
      floatSpeed: 5.0,
    },
    lightColor: '#F59E0B',
    speechText: "Alert mode activated!",
  },
};

type Listener = (state: RobotControllerState) => void;

class RobotControllerEngine {
  private state: RobotControllerState = {
    currentState: 'Idle',
    previousState: 'Idle',
    speed: 1.0,
    isBlueprintMode: false,
    isConsoleOpen: false,
    reducedMotion: false,
    speechBubbleVisible: true,
    customMessage: null,
    targetSection: 'home',
    activeModelType: 'procedural',
  };

  private listeners: Set<Listener> = new Set();
  private autoReturnTimer: number | null = null;

  constructor() {
    this.checkReducedMotionPreference();
    this.startBlinkLoop();
  }

  private checkReducedMotionPreference() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.state.reducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.state.reducedMotion = e.matches;
        this.notify();
      });
    }
  }

  private startBlinkLoop() {
    if (typeof window === 'undefined') return;
    const scheduleNextBlink = () => {
      const nextTime = Math.random() * 4000 + 3000; // Blink every 3-7s
      window.setTimeout(() => {
        if (this.state.currentState === 'Idle') {
          this.setState('Blink', 400); // 400ms blink duration
        }
        scheduleNextBlink();
      }, nextTime);
    };
    scheduleNextBlink();
  }

  public getState(): RobotControllerState {
    return { ...this.state };
  }

  public getConfig(): RobotStateConfig {
    return ROBOT_STATE_CONFIGS[this.state.currentState] || ROBOT_STATE_CONFIGS.Idle;
  }

  public setState(newState: RobotState, durationMs?: number, customMessage?: string) {
    if (this.autoReturnTimer) {
      clearTimeout(this.autoReturnTimer);
      this.autoReturnTimer = null;
    }

    const previous = this.state.currentState;
    this.state.previousState = previous;
    this.state.currentState = newState;
    if (customMessage !== undefined) {
      this.state.customMessage = customMessage;
    } else {
      this.state.customMessage = null;
    }

    this.notify();

    if (durationMs && durationMs > 0) {
      this.autoReturnTimer = window.setTimeout(() => {
        this.state.currentState = 'Idle';
        this.state.customMessage = null;
        this.notify();
      }, durationMs);
    }
  }

  public triggerWave() {
    this.setState('Waving', 3500, "Hi there! Welcome to my robotics space!");
  }

  public triggerHappy() {
    this.setState('Happy', 3000);
  }

  public triggerExcited() {
    this.setState('Excited', 3500);
  }

  public setBlueprintMode(enabled: boolean) {
    this.state.isBlueprintMode = enabled;
    this.notify();
  }

  public toggleBlueprintMode() {
    this.state.isBlueprintMode = !this.state.isBlueprintMode;
    this.notify();
  }

  public setConsoleOpen(open: boolean) {
    this.state.isConsoleOpen = open;
    this.notify();
  }

  public toggleConsole() {
    this.state.isConsoleOpen = !this.state.isConsoleOpen;
    this.notify();
  }

  public setSpeed(speed: number) {
    this.state.speed = Math.max(0.2, Math.min(3.0, speed));
    this.notify();
  }

  public setSpeechBubbleVisible(visible: boolean) {
    this.state.speechBubbleVisible = visible;
    this.notify();
  }

  public setTargetSection(section: string) {
    this.state.targetSection = section;
    this.notify();
  }

  public setModelType(type: 'procedural' | 'gltf') {
    this.state.activeModelType = type;
    this.notify();
  }

  public executeCommand(cmdString: string): string {
    const trimmed = cmdString.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const cmd = parts[0];

    switch (cmd) {
      case 'help':
        return 'Available commands: wave, mood [idle|happy|excited|curious|thinking|focused|confused|sad|sleepy|walking|working|celebrating|error|wakeup], blueprint, speed [0.5-2.0], clear, status';
      
      case 'wave':
        this.triggerWave();
        return 'Robot triggered: Waving animation!';
      
      case 'mood': {
        const moodName = parts[1];
        if (!moodName) return 'Usage: mood <name> (e.g. mood excited)';
        const capitalized = (moodName.charAt(0).toUpperCase() + moodName.slice(1)) as RobotState;
        if (ROBOT_STATE_CONFIGS[capitalized]) {
          this.setState(capitalized, 4000);
          return `Robot mood changed to: ${capitalized}`;
        }
        return `Unknown mood: ${moodName}. Type help for valid states.`;
      }

      case 'blueprint':
        this.toggleBlueprintMode();
        return `Blueprint wireframe mode ${this.state.isBlueprintMode ? 'ENABLED' : 'DISABLED'}`;

      case 'speed': {
        const val = parseFloat(parts[1]);
        if (!isNaN(val)) {
          this.setSpeed(val);
          return `Animation speed updated to ${val}x`;
        }
        return 'Usage: speed <number> (e.g. speed 1.5)';
      }

      case 'status':
        return `Robot Engine Status: State=${this.state.currentState}, Blueprint=${this.state.isBlueprintMode}, Speed=${this.state.speed}x, Model=${this.state.activeModelType}`;

      default:
        return `Command not recognized: "${cmd}". Type "help" for available commands.`;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }
}

export const robotController = new RobotControllerEngine();
