# Robotics portfolio development roadmap

Last updated: 2026-11-26. This document distinguishes published browser simulations from future ROS/real-robot integrations. PickBot is deferred by user request.

| Priority | Workstream | Current verified deliverable | Next acceptance milestone |
| --- | --- | --- | --- |
| P1 | Autonomous Navigation Simulation | P6 live A*, LiDAR, differential drive, editable maps, 2.5D world projection, ROS-topic analogues, JSON mission outcomes, deterministic tests | Independent ROS 2 Humble + Gazebo Fortress runtime validation with recorded launch, odom, scan, goal and collision result evidence. Do not claim Nav2/SLAM until integrated and tested. |
| P2 | Robot Control Center Dashboard | Planned, not implemented | Local simulated battery, robot state, telemetry, task queue, emergency stop, error log and visible offline/simulation badges; backend adapter only after secure ROS 2 bridge exists. |
| P3 | Professional Engineering Case Studies | PickBot engineering case study exists; P6 has tests and run evidence | Consistent Problem → Architecture → Implementation → Testing → Results for top projects. Mark each claim Concept, Simulation-tested or Hardware-tested and use screenshots/diagrams as evidence. |
| P4 | Recruiter-Ready Portfolio | Existing featured projects, bio, contact and CV navigation | Review three featured engineering projects, individual contributions, direct CV download, contact CTA, responsive performance and image load. No invented metrics or employer results. |
| P5 | Fleet Management Case Study | Planned, not implemented | Independent synthetic multi-robot allocation/recovery simulator and interactive architecture; no private company repositories, job information, protocols or secrets copied into public GitHub. |

## Evidence standard

- **Concept:** architecture, mockups or unverified specifications only.
- **Simulation-tested:** reproducible browser or ROS/Gazebo execution with tests/screenshots and explicit assumptions.
- **Hardware-tested:** actual robot measurements or recordings with setup and conditions documented. Never infer this from a simulation.

## P6 web simulator specification

The browser simulation evolves a robot state at a fixed 0.08 s timestep. 5× and 10× modes run more fixed steps per wall-clock interval; they do not interpolate a prerecorded route. The world view is an orthographic 2.5D projection of that same state (not a Gazebo physics engine). `navigation-*.json` includes scenario, terminal status, simulated duration, distance, goal error, velocity average, replans, collision-free status at the final pose, trajectory samples and recent event messages.

### P1 external ROS milestone (requires ROS-capable machine)

1. Create separate independent navigation robot description and a configured ROS 2 Humble workspace; do not reuse PickBot or employer hardware as a measured source.
2. Validate robot frames, wheel joints, sensor transforms and Gazebo Fortress physics/contact against a simple world.
3. Add and test `ros2_control` wheel/odometry interfaces, `LaserScan`, and safe topic synchronization. Keep motors simulated.
4. Configure mapping/localization and Nav2 costmaps/planners, verify safe arrival with obstacles in at least three scenarios, and record telemetry/results.
5. Publish only independently created source/assets and verifiable public evidence to this portfolio.
