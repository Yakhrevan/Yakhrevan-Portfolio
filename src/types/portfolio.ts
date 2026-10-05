export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Robotics' | 'Computer Vision' | 'Embedded' | 'AI' | string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  highlights: string[];
  specs: {
    label: string;
    value: string;
  }[];
  robotMood: import('./robot').RobotState;
  robotComment: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // For possible future use, or 0 if not used
    icon?: string;
    tagline: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface LabExperiment {
  id: string;
  title: string;
  type: 'Simulation' | 'Kinematics' | 'Vision' | 'Telemetry';
  description: string;
  status: 'Active' | 'Stable' | 'Experimental';
  interactiveAction: string;
}
