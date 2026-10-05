const ASSET_BASE = import.meta.env.BASE_URL;

import { Project, SkillCategory, ExperienceItem, LabExperiment } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: "Yakhrevan S",
  title: "Mechatronics Engineer",
  tagline: "A small engineer, bigger tomorrow. | Think. Build. Repeat.",
  bio: "I am a Mechatronics Engineer passionate about exploring and learning in the fields of Robotics and Machine Learning. Throughout my journey, I have developed skills in areas such as CAN communication protocol with STM32, and have begun exploring exciting fields like AI assistant development and Robot Operating System (ROS). I am particularly focused on designing and building innovative robots that address real-world challenges, promote sustainability, and enhance the quality of human life. My commitment to continuous learning drives me to apply creative ideas and develop technologies that make a positive impact on both people and the environment.",
  location: "Coimbatore, India",
  status: "Junior Robotics Engineer @ Goat Robotics",
  socials: {
    github: "https://github.com/Yakhrevan",
    linkedin: "https://www.linkedin.com/in/yakhrevans",
    email: "yakhrevan18@gmail.com"
  }
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "morphobot",
    title: "Morphobot",
    subtitle: "Hybrid Rover-Drone Transformable Robot",
    category: "Robotics",
    description: "A transformable robot that switches between rover and drone modes for agriculture, search & rescue.",
    longDescription: "Designed a transformable robot with mechanical transformation via servo-actuated gear train. It utilizes 4 BLDC motors for flight and 2 BLDC for rover locomotion (36:1 tracked-wheel ratio). The ROS2 autonomous logic detects obstacles, transforms, flies over, lands, and resumes mapping. Built with 11 ROS2 nodes, EKF, RTABMAP, Gazebo simulation, STM32 bridge, and MAVROS with Zero Drag Nova flight controller.",
    tags: ["ROS2", "STM32", "MAVROS", "Gazebo", "RTABMAP", "Drone"],
    image: `${ASSET_BASE}/projects/morphobot.svg`,
    highlights: [
      "Mechanical transformation via servo-actuated gear train",
      "ROS2 autonomous logic for obstacle detection and mode switching",
      "Built 11 ROS2 nodes, EKF, RTABMAP, Gazebo simulation",
      "STM32 bridge, MAVROS with Zero Drag Nova flight controller"
    ],
    specs: [
      { label: "Framework", value: "ROS 2" },
      { label: "Flight Controller", value: "Zero Drag Nova" },
      { label: "Type", value: "Hybrid Rover/Drone" },
      { label: "Locomotion", value: "4 BLDC (Flight) / 2 BLDC (Rover)" }
    ],
    robotMood: "Excited",
    robotComment: "Rolling on the ground and flying over obstacles? No terrain can stop Morphobot!",
    githubUrl: "#",
    featured: true
  },
  {
    id: "autonomous-diff-robot",
    title: "Autonomous Two-Wheel Differential Robot",
    subtitle: "ROS2 + Nav2 autonomous navigation",
    category: "Robotics",
    description: "Developed differential drive robot with ROS2 Humble and Nav2 stack for autonomous navigation.",
    longDescription: "Built an autonomous differential drive robot using the ROS2 Humble framework and Nav2 stack. The system implements SLAM via slam toolbox, A* path planning, and costmap-based obstacle avoidance. It integrates wheel encoders, an IMU, and LiDAR for accurate state estimation and mapping.",
    tags: ["ROS2", "Nav2", "SLAM", "LiDAR", "IMU"],
    image: `${ASSET_BASE}/projects/obstacle-bot.svg`,
    highlights: [
      "Developed differential drive robot with ROS2 Humble and Nav2",
      "Implemented SLAM (slam toolbox) and A* path planning",
      "Costmap-based obstacle avoidance",
      "Integrated wheel encoders, IMU, and LiDAR"
    ],
    specs: [
      { label: "Framework", value: "ROS 2 Humble / Nav2" },
      { label: "Sensors", value: "LiDAR, IMU, Encoders" },
      { label: "Navigation", value: "SLAM Toolbox, A*" },
      { label: "Locomotion", value: "Differential Drive" }
    ],
    robotMood: "Focused",
    robotComment: "Mapping the environment point by point. Navigation engaged!",
    githubUrl: "#",
    featured: true
  },
  {
    id: "morphobot-gcs",
    title: "Morphobot Ground Station Website",
    subtitle: "WebSocket + WebRTC real-time control",
    category: "Web App",
    description: "Developed a real-time ground control website for Morphobot.",
    longDescription: "A ground control station web application built using HTML/CSS/JS for Morphobot. It uses WebSocket for bidirectional command sending (velocity, mode switch, servo control) and telemetry data display. It also integrates WebRTC for a low-latency video feed from the robot's onboard camera and provides real-time feedback of sensor data, battery status, and robot mode.",
    tags: ["HTML/CSS/JS", "WebSocket", "WebRTC", "Ground Control"],
    image: `${ASSET_BASE}/projects/default.svg`,
    highlights: [
      "Real-time ground control website (HTML/CSS/JS)",
      "WebSocket for bidirectional command sending and telemetry",
      "WebRTC integration for low-latency video feed",
      "Real-time feedback of sensor data and battery status"
    ],
    specs: [
      { label: "Tech Stack", value: "HTML/CSS/JS" },
      { label: "Communication", value: "WebSocket" },
      { label: "Video Stream", value: "WebRTC" },
      { label: "Type", value: "Ground Control Station" }
    ],
    robotMood: "Thinking",
    robotComment: "Real-time telemetry and low-latency video feed. I see what you see!",
    githubUrl: "#",
    featured: false
  },
  {
    id: "pickbot",
    title: "PickBot",
    subtitle: "Mobile Robotic Arm for Pick-and-Place",
    category: "Robotics",
    description: "6-DOF arm on Mecanum-wheel base for warehouse automation.",
    longDescription: "PickBot features a 6-DOF robotic arm mounted on a Mecanum-wheel base. It utilizes an ESP32 microcontroller with IR, temperature, and smoke sensors. The system is controlled via a custom React Native app over Bluetooth/Wi-Fi, aimed at warehouse automation tasks.",
    tags: ["ESP32", "6-DOF Arm", "Mecanum", "React Native", "Automation"],
    image: `${ASSET_BASE}/projects/pickbot.svg`,
    highlights: [
      "6-DOF robotic arm on Mecanum-wheel base",
      "Integrated ESP32, IR/temperature/smoke sensors",
      "Controlled via custom React Native app (Bluetooth/Wi-Fi)",
      "Designed for warehouse automation"
    ],
    specs: [
      { label: "Controller", value: "ESP32" },
      { label: "Locomotion", value: "Mecanum Wheels" },
      { label: "Manipulator", value: "6-DOF Arm" },
      { label: "Control Interface", value: "React Native App" }
    ],
    robotMood: "Excited",
    robotComment: "Grabbing objects and sliding laterally with mecanum wheels!",
    githubUrl: "#",
    featured: true
  },
  {
    id: "fleet-monitoring-app",
    title: "Fleet & Health Monitoring App",
    subtitle: "EV Telemetry + Team Management",
    category: "App Dev",
    description: "React Native app for EV fleet management, driver health, and EV telemetry.",
    longDescription: "A React Native application designed for EV fleet management. It features real-time GPS location tracking, driver health monitoring (heart rate/fatigue alerts), and EV telemetry (SOC, motor temp, speed). The app includes a team module with role-based task assignment (admin/member) and uses a Firebase/Firestore backend, integrating with STM32 CAN data via Bluetooth/Wi-Fi.",
    tags: ["React Native", "Firebase", "STM32", "CAN", "Telemetry"],
    image: `${ASSET_BASE}/projects/default.svg`,
    highlights: [
      "Real-time GPS location and driver health alerts",
      "EV telemetry display (SOC, motor temp, speed)",
      "Role-based task assignment module",
      "Integrates with STM32 CAN data via Bluetooth/Wi-Fi"
    ],
    specs: [
      { label: "Frontend", value: "React Native" },
      { label: "Backend", value: "Firebase/Firestore" },
      { label: "Hardware Sync", value: "STM32 CAN to Bluetooth/Wi-Fi" },
      { label: "Focus", value: "Fleet Management" }
    ],
    robotMood: "Focused",
    robotComment: "Monitoring vital stats and EV telemetry. Safety first!",
    githubUrl: "#",
    featured: false
  },
  {
    id: "smart-irrigation",
    title: "Smart Irrigation System Monitoring Website",
    subtitle: "SIH Project for precision agriculture",
    category: "Web App",
    description: "Web dashboard for precision agriculture monitoring (Smart India Hackathon).",
    longDescription: "Built a web dashboard for precision agriculture monitoring as part of Smart India Hackathon. It displays real-time soil moisture, temperature, humidity, and crop health indicators from field sensors. It is integrated with a LoRa/GSM gateway allowing remote actuation of water pumps. Developed using HTML/CSS/JS, Chart.js for visualization, and Firebase for real-time database sync.",
    tags: ["HTML/CSS/JS", "Chart.js", "Firebase", "LoRa", "Agriculture"],
    image: `${ASSET_BASE}/projects/default.svg`,
    highlights: [
      "Displays real-time soil moisture, temperature, humidity",
      "Integrated with LoRa/GSM gateway for remote actuation",
      "Created using HTML/CSS/JS and Chart.js",
      "Firebase for real-time database sync"
    ],
    specs: [
      { label: "Tech Stack", value: "HTML/CSS/JS, Chart.js" },
      { label: "Database", value: "Firebase" },
      { label: "Connectivity", value: "LoRa/GSM" },
      { label: "Domain", value: "Precision Agriculture" }
    ],
    robotMood: "Thinking",
    robotComment: "Keeping those plants perfectly hydrated with data-driven irrigation!",
    githubUrl: "#",
    featured: false
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: "Programming Languages",
    iconName: "Code",
    skills: [
      { name: "C++", level: 90, tagline: "High-performance & Robotics" },
      { name: "Python", level: 85, tagline: "Scripts, AI & ROS" },
      { name: "Embedded C", level: 90, tagline: "Microcontroller logic" },
      { name: "Java", level: 75, tagline: "Object-oriented systems" },
      { name: "HTML/CSS/JS", level: 80, tagline: "Web Development" }
    ]
  },
  {
    title: "Frameworks & Tools",
    iconName: "Cpu",
    skills: [
      { name: "ROS / ROS 2", level: 85, tagline: "Robot Operating System" },
      { name: "Nav2 & SLAM", level: 80, tagline: "Navigation & Mapping" },
      { name: "MAVROS", level: 75, tagline: "MAVLink Communication" },
      { name: "OpenCV", level: 75, tagline: "Computer Vision" },
      { name: "React Native", level: 80, tagline: "Mobile App Dev" },
      { name: "Docker", level: 75, tagline: "Containerization" },
      { name: "Git", level: 85, tagline: "Version Control" }
    ]
  },
  {
    title: "Embedded & Hardware",
    iconName: "Activity",
    skills: [
      { name: "STM32", level: 90, tagline: "Advanced ARM Control" },
      { name: "ESP32", level: 85, tagline: "IoT & Wireless" },
      { name: "Arduino / RPi", level: 85, tagline: "Prototyping & SBCs" },
      { name: "Zero Drag Nova", level: 75, tagline: "Flight Controllers" }
    ]
  },
  {
    title: "Communication Protocols",
    iconName: "Globe",
    skills: [
      { name: "CAN & UART", level: 90, tagline: "Vehicle & Serial comms" },
      { name: "I2C & SPI", level: 85, tagline: "Sensor integration" },
      { name: "WebSocket & WebRTC", level: 80, tagline: "Real-time web comms" },
      { name: "PWM & ADC", level: 95, tagline: "Actuators & Sensors" }
    ]
  },
  {
    title: "Design & CAD",
    iconName: "PenTool",
    skills: [
      { name: "SolidWorks", level: 85, tagline: "3D Mechanical Design" },
      { name: "AutoCAD", level: 80, tagline: "2D Drafting" },
      { name: "Blender", level: 70, tagline: "3D Modeling" }
    ]
  },
  {
    title: "Soft Skills",
    iconName: "Users",
    skills: [
      { name: "Team Leadership", level: 90, tagline: "Guiding projects" },
      { name: "Problem Solving", level: 95, tagline: "Analytical thinking" },
      { name: "Multi-tasking", level: 85, tagline: "Handling parallel tasks" }
    ]
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "exp-2026-junior",
    role: "Junior Robotics Engineer (Hardware Team)",
    company: "Goat Robotics",
    period: "April 2026 – Present",
    location: "Coimbatore, India",
    description: "Developing low-level hardware codes in C/C++ for advanced robotic components, integrating microcontrollers (STM32/ESP32) with system peripherals.",
    achievements: [
      "Implementing sensor fusion techniques (IMU, LiDAR, encoders) for improved state estimation.",
      "Focusing on custom motor development, precise PID tuning, and sensor integration.",
      "Validating and debugging communication protocols (CAN, I2C, SPI) with ROS2 stacks."
    ],
    technologies: ["STM32", "ESP32", "C/C++", "ROS 2", "CAN", "I2C", "SPI", "PID", "Sensor Fusion"]
  },
  {
    id: "exp-2025-intern",
    role: "ROS R&D Intern",
    company: "Goat Robotics",
    period: "Aug 2025 – Feb 2026",
    location: "Coimbatore, India",
    description: "Developed an Automated Guided Vehicle (AGV) for sorting applications in industrial environments.",
    achievements: [
      "Worked with STM32 boards, industrial sensors (IR, proximity, encoders), and actuators.",
      "Integrated ROS-based navigation and obstacle avoidance algorithms."
    ],
    technologies: ["STM32", "ROS", "AGV", "Sensors", "Navigation"]
  },
  {
    id: "exp-2023-solar-kart",
    role: "Dashboard Lead & Mentor – Solar Kart (Team ASTRA)",
    company: "Sri Krishna College of Engineering and Technology",
    period: "2023 – 2026",
    location: "Coimbatore, India",
    description: "Started as a Dashboard Team Member in 2023, then served as Dashboard Lead for 2024 and 2025, designing and innovating the dashboard for SEVC & BSVC. Transitioned to a Mentor role in 2025, guiding the team until finishing in 2026.",
    achievements: [
      "Won Design Evaluation and Autocross awards at BSVC 2024.",
      "Mentored the dashboard team for the 2025-2026 seasons."
    ],
    technologies: ["Dashboard Design", "Electric Vehicles", "Automotive", "Team Leadership"]
  },
  {
    id: "edu-2022-be",
    role: "B.E. Mechatronics Engineering",
    company: "Sri Krishna College of Engineering and Technology",
    period: "Expected May 2026",
    location: "Coimbatore, India",
    description: "CGPA: 8.06/10. Pursuing a comprehensive degree covering mechanical, electrical, and software engineering domains.",
    achievements: [
      "Workshops: Collaborative Robots with ROS, ROS Uncovered, Augmented Reality & VR",
      "Completed Mastering OpenCV on Udemy (human & helmet detection)",
      "Participant, Smart India Hackathon (SIH) 2024 – Drone Technology"
    ],
    technologies: ["Mechatronics", "Robotics", "ROS", "OpenCV", "AR/VR"]
  }
];

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "exp-lab-1",
    title: "Inverse Kinematics Visualizer",
    type: "Kinematics",
    description: "Interactive 3D joint coordinate simulation for multi-link manipulator arms.",
    status: "Active",
    interactiveAction: "Simulate Joints"
  },
  {
    id: "exp-lab-2",
    title: "LiDAR Point Cloud Mesh Generator",
    type: "Vision",
    description: "Simulated 2D depth projection into 3D voxel grids using custom Three.js shader materials.",
    status: "Stable",
    interactiveAction: "Run Point Cloud"
  },
  {
    id: "exp-lab-3",
    title: "PID Control Loop Tuner",
    type: "Simulation",
    description: "Interactive visualization of Proportional-Integral-Derivative tuning for stabilization.",
    status: "Experimental",
    interactiveAction: "Tune Parameters"
  }
];

export const projects = PROJECTS_DATA;
export const skillCategories = SKILLS_DATA;
export const experiences = EXPERIENCE_DATA;
export const labExperiments = LAB_EXPERIMENTS;

