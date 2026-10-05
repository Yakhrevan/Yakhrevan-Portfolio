# Yakhrevan Robotics Portfolio - Phase 1 & Phase 2

Interactive portfolio website for **Yakhrevan**, a senior Robotics Engineer. Built with React 18, TypeScript, Vite, Three.js, React Three Fiber, Drei, Framer Motion, and Tailwind CSS.

---

## 🎨 Design System & Palette

- **Background**: Crisp White (`#FFFFFF`) / Soft Off-White (`#F8FAFC`)
- **Primary Color**: Normal Blue (`#2563EB`)
- **Highlights**: Sky Blue (`#38BDF8`)
- **Accent**: Vivid Orange (`#F97316`)
- **Text & Core**: Navy / Dark Slate (`#0F172A`)
- **Visual Style**: Futuristic, glassmorphism, clean typography, responsive layout, micro-animations.

---

## 🤖 Robot Mascot & 3D Animation Engine

Original cute robot mascot designed specifically for Yakhrevan:
- White outer shell enamel
- Angular horn-inspired face silhouette based on logo reference
- Dynamic digital expressive LED eye screen canvas
- Normal blue outfit armor
- Navy & sky blue mechanical details
- Orange accent power rings & core
- Floating small mechanical hands & feet

### 16 Animation States Supported
1. `Idle`
2. `Blink`
3. `Happy`
4. `Excited`
5. `Curious`
6. `Thinking`
7. `Focused`
8. `Confused`
9. `Sad`
10. `Sleepy`
11. `Waving`
12. `Walking`
13. `Working`
14. `Celebrating`
15. `Error`
16. `Wake Up`

---

## 📁 Directory Architecture

```
yakhrevan-portfolio/
├── public/
│   ├── models/
│   │   └── robot.glb          # Optional custom GLB 3D model path
│   ├── textures/
│   └── animations/
├── src/
│   ├── components/
│   │   └── Robot/
│   │       ├── ProceduralRobot.tsx     # High-fidelity procedural 3D fallback
│   │       ├── RobotCanvas.tsx         # R3F Canvas, lighting, shadows & controls
│   │       ├── RobotCommandConsole.tsx # Interactive scifi CLI terminal
│   │       ├── RobotController.ts      # 16-state animation engine & subscriber
│   │       ├── RobotExpressions.ts     # Dynamic LED eye texture canvas generator
│   │       ├── RobotModel.tsx          # Dual GLTF loader / fallback pipeline
│   │       ├── RobotPlaygroundOverlay.tsx # Interactive 16-state trigger panel
│   │       └── RobotSpeechBubble.tsx   # Glassmorphism typewriter speech dialog
│   ├── hooks/
│   │   └── useRobot.ts                 # React hook for robot state & actions
│   ├── data/
│   │   └── portfolioData.ts            # Project, skill, and lab data
│   ├── types/
│   │   ├── portfolio.ts
│   │   └── robot.ts
│   ├── App.tsx                         # Main Phase 1 & Phase 2 Application
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🛠️ Installation & Setup Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```

### 3. Build Production Bundle
```bash
npm run build
```

---

## 📥 Asset Integration Instructions (GLB 3D Model)

The application features a **Dual-Renderer Pipeline**:

1. **Procedural 3D Robot Mascot (Default)**: Out-of-the-box working 3D procedural model with horn-inspired helmet silhouette, blue armor, orange core, and LED eyes canvas. No external assets required to run immediately.
2. **External GLB Model Loader**:
   - To integrate your custom rigged `.glb` model, place your 3D model file at:
     ```
     public/models/robot.glb
     ```
   - Name your animation clips inside your 3D software (Blender/Maya) matching the state names (`Idle`, `Waving`, `Happy`, `Excited`, `Walking`, `Working`, etc.).
   - The `RobotModel` component will automatically detect `public/models/robot.glb` and bind the skeletal animations!

---

## ✅ Phase Verification Checklist

- [x] Phase 1: Vite + React + TypeScript setup, Tailwind CSS color token configuration, R3F & Drei setup.
- [x] Phase 2: Robot mascot 3D mesh, 16-state animation engine, LED expression canvas texture generator, speech bubble, CLI command console, blueprint wireframe mode, dual GLTF/Procedural renderer.
