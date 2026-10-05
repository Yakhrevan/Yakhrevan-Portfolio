# 3D Model Folder

Place your GLB model file here:
`public/models/robot.glb`

The `RobotModel.tsx` loader automatically checks for `/models/robot.glb` on startup.
If present, it replaces the 3D procedural mascot model and binds skeletal animation clips matching state names (`Idle`, `Waving`, `Happy`, `Excited`, `Walking`, `Working`, etc.).
