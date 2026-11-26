# Robotics engineering case studies — evidence index

**Author:** Yakhrevan S · **Scope:** independent, public portfolio demonstrations · **Verified:** 2026-11-26.

Each portfolio project page now includes a common five-part study: **Problem → Architecture → Implementation → Testing → Results**, plus claim-level evidence and outstanding validation work. These are engineering communication assets, not hardware qualification reports. No private employer code, protocols, telemetry or specifications were used.

An independent, eight-page editable Canva presentation is available at https://www.canva.com/d/epHLpVJfvFrEnJF. Its original import source is [`canva-case-studies-source.html`](canva-case-studies-source.html); diagrams and project values are illustrative or evidence-labeled, never presented as real-robot photos.

## V8 interactive evidence showcase

The homepage now retains all three featured live-demo entry points while also offering a non-WebGL **Preview project evidence** panel for each. Visitors can inspect labeled media or switch to a recruiter summary covering the owner's specific contribution, reproducible software results, technology stack, validation boundary, public implementation/test links and original CV download.

The same media-gallery, status-badge and recruiter-summary components are reused at the top of each existing five-part engineering case study. Existing chapters, architecture diagrams, test checks and claim/evidence tables remain in place. PickBot gallery media consists of virtual concept stills; P6 and P2 only have authored illustration previews, **not recorded runtime screenshots**. Genuine runtime behavior must be observed in the browser demos or their JSON exports. Hardware-testing status remains **unverified** for all three.

## Evidence labels

| Label | Meaning | Example |
| --- | --- | --- |
| Source-backed | Public code or supplied geometry can be inspected, but source alone doesn't prove it was physically built. | PickBot selected STL arm components. |
| Simulation-tested | An identified and reproducible software test or browser demonstration runs against synthetic/model data. | P6 route and collision tests; P2 E-stop reducer tests. |
| Concept / Pending | An illustrative model, integration plan, or unverified technical assumption. | PickBot chassis dimensions; ROS/MoveIt execution. |
| Hardware-tested | Requires recorded real-world test setup, methods, measurements and failure context. | **Not claimed for these three portfolio demos.** |

## 1. PickBot — mobile manipulation

**Problem:** demonstrate how a four-mecanum-wheel base, four-joint arm and gripper might execute targeted pickup and transport before the complete robot is calibrated.

**Architecture:** target/joystick input → analytic IK and mecanum equations → geometry/contact checks → virtual joints, wheel states and open-loop trajectory.

**Implementation:** `src/components/PickBot/` integrates selected original arm-part STL assets with illustrative chassis/wheel concept geometry, drag-to-target IK, contact-gated virtual grasp, and FL/FR/RL/RR RPM calculation.

**Testing:** `npm run test:pickbot-v6` → **8/8 passed**. Includes reachable/unreachable targets, invalid target and overlap rejection, contact gates, wheel polarity/RPM and integrated trajectory. Test file: `tests/pickbot-v6.test.mjs`.

**Results:** the browser model can demonstrate the designed motion logic under its concept parameters. It cannot prove physical gripper force, arm repeatability, calibrated motor directions or the quality of full robot geometry. ROS 2 Humble / MoveIt scaffolds exist, but execution has not been demonstrated.

**Next acceptance:** independently measure joint geometry, wheel orientation and contact forces, then record a real pick-and-place validation sequence.

## 2. Autonomous Navigation P6

**Problem:** make planning, sensing and collision-checked motion demonstrable, rather than merely drawing a planned route.

**Architecture:** occupancy grid/goal → footprint-aware A* → differential-drive controller → synthetic pose/LiDAR → mission event log and JSON export.

**Implementation:** `src/components/NavLab/` contains 8-connected A* with corner-cut checks, dynamic obstacle editing, fixed-step robot state integration, 60 raycast LiDAR beams and 2.5D projection of the same state.

**Testing:** `npm run test:nav` → **10/10 passed**. Includes successful arrivals on three preset maps, dynamic replanning, ray limits, E-stop, footprint boundaries and deterministic acceleration. Test file: `tests/navigationCore.test.mjs`.

**Results:** one observed browser warehouse run traversed **26.37 m** in **32.2 simulated seconds** with **0.32 m** goal error. This is a single example, not a guaranteed bound or hardware benchmark. P6 does not execute ROS 2, Nav2, SLAM, Gazebo or real LiDAR.

**Next acceptance:** Gazebo/ROS 2 Humble robot frames, simulated sensor/odometry messages and collision-safe Nav2 runs with captured logs and results.

## 3. Robot Control Center P2

**Problem:** make a control dashboard actionable with deterministic, safe-to-test task/state changes rather than just rendering attractive synthetic metrics.

**Architecture:** operator dispatch and safety controls → single local TypeScript reducer → schematic waypoint movement → synthetic telemetry/logs → JSON evidence.

**Implementation:** `src/components/ControlCenter/` has queued jobs, simulated velocity, pose, distance and battery, user-visible progress, fault injection, failure marking, a latched E-stop and manual recovery. It has no backend connection.

**Testing:** `npm run test:control` → **9/9 passed**. Includes queue order, movement, paused-state freeze, E-stop release, fault acknowledgement, fail-task export and reset. Test file: `tests/controlCore.test.mjs`.

**Results:** the live UI was exercised with AMR motion, E-stop engagement and zero simulated velocity, and a manual release to paused. This tests software state-machine behavior, **not** a certified emergency-stop circuit, ROS 2 communication or calibrated sensors.

**Next acceptance:** authenticated and permission-scoped ROS 2 data bridge, stale-telemetry handling, offline/fault recovery in an isolated ROS simulation; independent physical safety validation before real commands.

## Reproducing the engineering evidence

With Node.js 22.6+ (Node 24 recommended), from repository root:

```bash
npm ci
npm run test:pickbot-v6
npm run test:nav
npm run test:control
npm run build
```

The deployment's GitHub Actions build validates TypeScript and bundling; the three model regression suites are run separately. Simulation JSON exports are produced on demand in the corresponding browser project pages. Inaccessible physical or external ROS behavior is never inferred from browser results.

## Next project workstreams

1. **P4 — Recruiter-ready portfolio:** project-level individual contributions and highlights, a clean top-three project story, direct downloadable CV, contact CTA, mobile performance and claim consistency.
2. **P5 — Independent fleet management demo:** synthetic multi-AMR task allocation, state transitions and fault recovery, without any employer-private implementation.
