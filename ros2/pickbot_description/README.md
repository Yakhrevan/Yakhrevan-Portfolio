# PickBot V6 ROS 2 Humble description (initial scaffold)

This package is a **simplified concept description**, not an exported production CAD assembly or a verified hardware driver. Coordinate system: +X forward, +Y left, +Z up; geometry and the 4 arm pivot positions reflect the portfolio GLB as closely as practical. Simple cylinders represent mecanum wheel envelopes, **not the real diagonal rollers/contact dynamics**. Joint limits and inertias are placeholders for visualization/planning only.

## RViz visualization

In an Ubuntu machine with ROS 2 Humble and `ros-humble-xacro`, `ros-humble-joint-state-publisher-gui`, `ros-humble-robot-state-publisher`, and `ros-humble-rviz2` installed:

```bash
mkdir -p ~/pickbot_ws/src
cp -r ros2/pickbot_description ~/pickbot_ws/src/
cd ~/pickbot_ws
source /opt/ros/humble/setup.bash
colcon build --symlink-install --packages-select pickbot_description
source install/setup.bash
ros2 launch pickbot_description display.launch.py
```

This should provide a visual robot and sliders for the four arm joints/wheels. RViz does not run physics. This launch has **not been run in this repository's browser CI**.

## ROS 2 control interface template

`config/ros2_controllers.yaml` maps `geometry_msgs/TwistStamped` body commands (`linear.x`, `linear.y`, `angular.z`) to the Humble `mecanum_drive_controller` and the four named wheel joints. The GLB-derived radius is 0.091 m and `Lx + Ly = 0.447 m`.

**Not connected yet:** This URDF intentionally has no `<ros2_control>` system hardware plugin. Supply and validate a `ros2_control` hardware or Gazebo simulation interface that exports each wheel's `velocity` command and state before starting a controller manager; do not connect unverified commands to physical motors. Motor polarities, wheel hand, speed/acceleration limits and encoder conversion require physical calibration.

ROS controller reference: https://control.ros.org/humble/doc/ros2_controllers/mecanum_drive_controller/doc/userdoc.html

## MoveIt 2 motion-planning handoff

`moveit/pickbot.srdf` defines the four-joint `pickbot_arm` semantic group and a home joint state. It is a **starting point**, not a complete MoveIt configuration or a recorded demo.

1. Open the ROS 2 Humble MoveIt Setup Assistant with the expanded `urdf/pickbot.urdf.xacro`.
2. Import/confirm `moveit/pickbot.srdf`, add a floating/fixed virtual joint if needed, self-collision matrix, kinematics solver, joint limits, and planning groups.
3. Generate a `pickbot_moveit_config` package, set up a fake/demo trajectory controller, then test joint-space motions in RViz before trajectory execution.
4. Only after validating actuator kinematics and collision pairs, integrate a real `ros2_control` arm controller and a planning scene with supported pick/place objects.

MoveIt docs: https://moveit.picknik.ai/main/doc/examples/setup_assistant/setup_assistant_tutorial.html

**Scope:** the website V6 offers executable browser IK, collision-envelope checks and open-loop mecanum kinematics. ROS 2 launch/config files are preparation for a subsequent Humble/MoveIt validation milestone, not a claim of a working physical or Gazebo robot.
