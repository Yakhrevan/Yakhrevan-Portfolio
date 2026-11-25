# Robotics portfolio development roadmap

Last updated: 2026-11-26. This document distinguishes published browser simulations from future ROS/real-robot integrations. PickBot is deferred by user request.

| Priority | Workstream | Current verified deliverable | Next acceptance milestone |
| --- | --- | --- | --- |
| P1 | Autonomous Navigation Simulation | P6 live A*, LiDAR, differential drive, editable maps, 2.5D world projection, ROS-topic analogues, JSON mission outcomes, deterministic tests | Independent ROS 2 Humble + Gazebo Fortress runtime validation with recorded launch, odom, scan, goal and collision result evidence. Do not claim Nav2/SLAM until integrated and tested. |
| P2 | Robot Control Center Dashboard | Browser-local interactive demo: AMR waypoint travel, simulated battery/odometry, task queue, E-stop latch, fault logs, run export, reducer tests; Canva editable design | Define and test an authenticated, rate-limited ROS 2 telemetry/control bridge on an isolated simulation before considering real hardware. The public demo currently has no backend. |
| P3 | Professional Engineering Case Studies | Published common Problem → Architecture → Implementation → Testing → Results for PickBot, P6 and P2; browser diagrams, test/source links, evidence table, reproducible case-study index and eight-page Canva presentation | Extend evidence with real ROS/Gazebo logs or physical measurements only when available, with dates/setup. No hardware-tested statuses are currently claimed. |
| P4 | Recruiter-Ready Portfolio | Existing featured projects, bio, contact and CV navigation | Review three featured engineering projects, individual contributions, direct CV download, contact CTA, responsive performance and image load. No invented metrics or employer results. |
| P5 | Fleet Management Case Study | Planned, not implemented | Independent synthetic multi-robot allocation/recovery simulator and interactive architecture; no private company repositories, job information, protocols or secrets copied into public GitHub. |

## Evidence standard

- **Concept:** architecture, mockups or unverified specifications only.
- **Simulation-tested:** reproducible browser or ROS/Gazebo execution with tests/screenshots and explicit assumptions.
- **Hardware-tested:** actual robot measurements or recordings with setup and conditions documented. Never infer this from a simulation.

## P2 Robot Control Center demo

The Control Center is an independent one-robot operator-interface simulation. `controlCore.ts` owns the dispatch queue, discrete waypoints, battery estimates, simulated odometry, fault log and safety state. In-browser controls can enqueue tasks, start/pause/resume, inject and acknowledge a synthetic encoder timeout, mark a job failed, latch and manually reset E-stop, reset the session, and export a JSON result. `npm run test:control` verifies these transitions. The schematic warehouse has no physical collision model and the derived velocity/battery values are not calibrated measurements. All ROS-style topic names are interface proposals, not an operational ROS 2 network. Editable Canva design: https://canva.link/4c0ha93p9ss414j.

**P2 review checklist:** task completes with movement; E-stop and fault immediately inhibit motion; release never auto-resumes; queue order is preserved; test suite and production build pass; deployed page is accessible on mobile and desktop.

## P6 web simulator specification

The browser simulation evolves a robot state at a fixed 0.08 s timestep. 5× and 10× modes run more fixed steps per wall-clock interval; they do not interpolate a prerecorded route. The world view is an orthographic 2.5D projection of that same state (not a Gazebo physics engine). `navigation-*.json` includes scenario, terminal status, simulated duration, distance, goal error, velocity average, replans, collision-free status at the final pose, trajectory samples and recent event messages.

### P1 external ROS milestone (requires ROS-capable machine)

1. Create separate independent navigation robot description and a configured ROS 2 Humble workspace; do not reuse PickBot or employer hardware as a measured source.
2. Validate robot frames, wheel joints, sensor transforms and Gazebo Fortress physics/contact against a simple world.
3. Add and test `ros2_control` wheel/odometry interfaces, `LaserScan`, and safe topic synchronization. Keep motors simulated.
4. Configure mapping/localization and Nav2 costmaps/planners, verify safe arrival with obstacles in at least three scenarios, and record telemetry/results.
5. Publish only independently created source/assets and verifiable public evidence to this portfolio.
