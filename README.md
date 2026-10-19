# Yakhrevan — Robotics & Mechatronics Portfolio

<div align="center">

[![Deploy Portfolio](https://github.com/Yakhrevan/Yakhrevan-Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Yakhrevan/Yakhrevan-Portfolio/actions/workflows/deploy.yml)
[![ROS 2](https://img.shields.io/badge/ROS%202-Robotics-1F6FEB?style=for-the-badge&logo=ros&logoColor=white)](https://www.ros.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![C++](https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)](https://isocpp.org/)
[![Embedded](https://img.shields.io/badge/Embedded-STM32%20%7C%20ESP32-0F766E?style=for-the-badge)](https://www.st.com/)

</div>

An interactive portfolio for **Yakhrevan, a Junior Robotics Engineer with a Mechatronics background**. The site presents robotics projects, technical interests, engineering experience, and an interactive 3D robot lab.

**Live website:** https://yakhrevan.github.io/Yakhrevan-Portfolio/  
**Source repository:** https://github.com/Yakhrevan/Yakhrevan-Portfolio

---

## Overview

The portfolio combines a robotics-focused project showcase with an animated robot companion. Its visual direction uses a clean white/off-white base, blue and sky-blue highlights, orange accents, dark navy text, responsive layouts, and interface animation.

The website is built with:
- React 18
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- Framer Motion
- Tailwind CSS
- Lucide React icons

## Portfolio Experience

The application is organized into these main sections:

1. **Splash screen** — introductory loading experience.
2. **Hero** — personal introduction and primary navigation into the portfolio.
3. **About** — engineering background and interests.
4. **Skills** — technical areas and tools.
5. **Experience** — professional experience section.
6. **Projects** — project cards with detailed project views.
7. **Robot Lab** — interactive 3D robot experience.
8. **Contact** — professional contact links.
9. **Footer** — navigation and profile details.

The application also includes responsive navigation and a scroll-aware robot companion.

## Interactive Robot System

The robot is a central part of the portfolio rather than a static decoration.

The repository includes robot components for:
- 3D scene rendering and lighting
- Robot model display
- Procedural rendering fallback
- GLTF/GLB model loading
- Robot expressions and animation control
- Interactive robot controls and speech elements
- A dedicated Robot Lab experience

The documented robot controller supports 16 named states: Idle, Blink, Happy, Excited, Curious, Thinking, Focused, Confused, Sad, Sleepy, Waving, Walking, Working, Celebrating, Error, and Wake Up.

**Model note:** the repository includes a public/models/robot.glb asset path. Animation availability depends on the model's embedded clips and the controller/model integration; not every named state should be assumed to be a skeletal animation clip.

## Project Showcase

The portfolio emphasizes robotics and mechatronics, with software projects presented alongside the systems they are intended to support. Core areas include ROS 2, embedded integration, mobile-robot navigation concepts, sensor interfaces, and engineering visualization.

The portfolio's project data includes the following engineering themes:

### Morphobot — Hybrid Rover/Drone Concept
A transformable robotics concept exploring ground and aerial mobility, ROS 2-based autonomy, embedded-controller integration, and simulation/perception/navigation technologies.

### Autonomous Differential-Drive Robot
A mobile-robot project centered on ROS 2 Humble, Nav2, mapping/navigation concepts, obstacle avoidance, and integration of wheel encoders, IMU, and LiDAR.

### PickBot — Mecanum Mobile Robot with Arm
A mobile manipulation concept combining a mecanum-wheel base, a multi-degree-of-freedom arm, ESP32 control, and environmental sensors.

### Morphobot Ground Station
A web-based ground-control interface concept for commands and telemetry, with WebSocket communication and a WebRTC video-streaming path described in the project data.

### EV Fleet and Health Monitoring
A React Native application concept for fleet telemetry, GPS information, task management, and integration with STM32 CAN data.

### Smart Irrigation Monitoring
A web-dashboard project for precision-agriculture monitoring.

Project descriptions in the portfolio communicate the intended scope and technologies. Check each project's implementation and validation status before interpreting every listed feature as production-complete.

## Repository Structure

The source code is organized by interface components, page sections, data, and types. The main application composes the splash screen, navigation, scroll companion, portfolio sections, project-detail view, and footer.

    Yakhrevan-Portfolio/
    ├── .github/
    │   └── workflows/
    │       └── deploy.yml
    ├── public/
    │   ├── brand/
    │   ├── models/
    │   ├── projects/
    │   └── ...
    ├── src/
    │   ├── components/
    │   │   ├── Robot/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── ...
    │   ├── pages/
    │   ├── sections/
    │   ├── data/
    │   │   └── portfolioData.ts
    │   ├── types/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.ts

## Run Locally

### Requirements
- Node.js 20 recommended (the GitHub Actions workflow uses Node.js 20)
- npm
- Git

### Setup

    git clone https://github.com/Yakhrevan/Yakhrevan-Portfolio.git
    cd Yakhrevan-Portfolio
    npm ci
    npm run dev

Vite prints the local development URL in the terminal.

### Quality checks

    npm run lint
    npm run build
    npm run preview

- **npm run lint** runs TypeScript's no-emit check.
- **npm run build** runs the TypeScript check and creates the production build.
- **npm run preview** serves the built output locally for inspection.

## Deployment

The repository includes a GitHub Actions workflow at .github/workflows/deploy.yml that:
1. Runs on pushes to main or manual dispatch.
2. Installs dependencies using npm ci.
3. Runs npm run build.
4. Uploads the dist directory as the Pages artifact.
5. Deploys the artifact to GitHub Pages.

Live site: https://yakhrevan.github.io/Yakhrevan-Portfolio/

## Engineering Notes

### Robotics technology map

| Area | Technologies represented in project work or study |
|---|---|
| Robotics middleware | ROS 2 Humble, TF2, URDF/Xacro, Nav2 concepts |
| Navigation and perception | SLAM concepts, LiDAR, IMU, wheel encoders, obstacle avoidance |
| Embedded integration | STM32, ESP32, C/C++, CAN, UART, SPI, I²C |
| Development environment | Ubuntu/Linux, Docker, Git, CMake, colcon |
| Visualization and interfaces | RViz, Gazebo, React, TypeScript, Three.js |

These labels describe the technologies associated with the projects and ongoing study; they are not a claim that every subsystem is complete or hardware-validated.


- Keep project descriptions aligned with the actual implementation status.
- Avoid publishing private credentials, tokens, or personal data in source files.
- Test the build and the live site after changes.
- Verify asset paths, especially model and image URLs, on the deployed GitHub Pages URL.
- Check responsive navigation, robot loading, animation controls, project detail views, and contact links on desktop and mobile.
- Prefer targeted changes that preserve working portfolio functionality.

## Author

**Yakhrevan S**  
Junior Robotics Engineer · Mechatronics · ROS 2 · Embedded Systems

- GitHub: https://github.com/Yakhrevan
- LinkedIn: https://www.linkedin.com/in/yakhrevans
- Portfolio: https://yakhrevan.github.io/Yakhrevan-Portfolio/

---

*Always learning. Always building. Think. Build. Repeat.*
