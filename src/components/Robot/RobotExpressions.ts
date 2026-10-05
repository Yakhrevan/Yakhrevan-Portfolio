import * as THREE from 'three';

export type EyeShape =
  | 'normal'
  | 'happy'
  | 'excited'
  | 'star'
  | 'squint'
  | 'thinking'
  | 'confused'
  | 'sad'
  | 'closed'
  | 'error'
  | 'wide'
  | 'love'
  | 'angry';

export function createRobotFaceTexture(
  shape: EyeShape = 'normal',
  primaryColor: string = '#00FFFF', // Cyan glow default
  accentColor: string = '#F43F5E'  // Blush / error default
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackCanvas = document.createElement('canvas');
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // Clear — deep dark gray/black faceplate
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background visor (dark gray)
  ctx.fillStyle = '#111827';
  roundRect(ctx, 10, 10, canvas.width - 20, canvas.height - 20, 100);
  ctx.fill();

  // Very subtle inner glow
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
  ctx.lineWidth = 4;
  roundRect(ctx, 14, 14, canvas.width - 28, canvas.height - 28, 96);
  ctx.stroke();

  // Eye positions — large and wide set
  const leftEyeCenter = { x: 280, y: 220 };
  const rightEyeCenter = { x: 744, y: 220 };
  const eyeRadius = 90;

  // Set colors
  const eyeColor = shape === 'error' ? '#EF4444' : primaryColor;

  ctx.shadowBlur = 40;
  ctx.shadowColor = eyeColor;
  ctx.fillStyle = eyeColor;
  ctx.strokeStyle = eyeColor;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const drawEye = (cx: number, cy: number, isRight: boolean) => {
    switch (shape) {
      case 'happy': {
        // High happy arc
        ctx.beginPath();
        ctx.arc(cx, cy + 30, eyeRadius * 0.6, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        break;
      }
      case 'excited':
      case 'star': {
        // Wide angle brackets > <
        ctx.beginPath();
        if (!isRight) {
          ctx.moveTo(cx - 30, cy - 40);
          ctx.lineTo(cx + 40, cy);
          ctx.lineTo(cx - 30, cy + 40);
        } else {
          ctx.moveTo(cx + 30, cy - 40);
          ctx.lineTo(cx - 40, cy);
          ctx.lineTo(cx + 30, cy + 40);
        }
        ctx.stroke();
        break;
      }
      case 'love': {
        // Glowing heart shapes
        ctx.save();
        ctx.translate(cx, cy + 10);
        ctx.fillStyle = '#F43F5E';
        ctx.shadowColor = '#F43F5E';
        ctx.beginPath();
        const s = eyeRadius * 0.022;
        ctx.moveTo(0, s * 25);
        ctx.bezierCurveTo(-s * 50, -s * 15, -s * 25, -s * 50, 0, -s * 18);
        ctx.bezierCurveTo(s * 25, -s * 50, s * 50, -s * 15, 0, s * 25);
        ctx.fill();
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.restore();
        break;
      }
      case 'angry': {
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10, eyeRadius * 0.5, eyeRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 18;
        ctx.beginPath();
        if (!isRight) {
          ctx.moveTo(cx - eyeRadius * 0.7, cy - eyeRadius * 0.4);
          ctx.lineTo(cx + eyeRadius * 0.5, cy - eyeRadius * 0.8);
        } else {
          ctx.moveTo(cx + eyeRadius * 0.7, cy - eyeRadius * 0.4);
          ctx.lineTo(cx - eyeRadius * 0.5, cy - eyeRadius * 0.8);
        }
        ctx.stroke();
        break;
      }
      case 'squint': {
        ctx.beginPath();
        ctx.ellipse(cx, cy, eyeRadius * 0.6, eyeRadius * 0.3, isRight ? -0.1 : 0.1, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'thinking':
      case 'confused': {
        // Question mark shape for thinking/curious
        if (!isRight) {
          ctx.beginPath();
          ctx.arc(cx, cy + 20, eyeRadius * 0.5, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        } else {
          // Question mark outline
          ctx.lineWidth = 16;
          ctx.beginPath();
          ctx.arc(cx, cy - 20, 30, Math.PI, Math.PI * 2.5);
          ctx.lineTo(cx, cy + 20);
          ctx.stroke();
          // Dot
          ctx.beginPath();
          ctx.arc(cx, cy + 50, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'sad': {
        ctx.beginPath();
        ctx.arc(cx, cy - 30, eyeRadius * 0.5, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
        break;
      }
      case 'closed': {
        // Horizontal sleep curve
        ctx.beginPath();
        ctx.arc(cx, cy - 20, eyeRadius * 0.5, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
        // Add Zzz if closed
        if (shape === 'closed' && isRight) {
          ctx.shadowBlur = 20;
          ctx.font = 'bold 40px monospace';
          ctx.fillStyle = eyeColor;
          ctx.fillText('Z', cx + 40, cy - 80);
          ctx.font = 'bold 30px monospace';
          ctx.fillText('z', cx + 80, cy - 110);
          ctx.font = 'bold 20px monospace';
          ctx.fillText('z', cx + 110, cy - 130);
        }
        break;
      }
      case 'error': {
        ctx.beginPath();
        ctx.moveTo(cx - eyeRadius * 0.5, cy - eyeRadius * 0.5);
        ctx.lineTo(cx + eyeRadius * 0.5, cy + eyeRadius * 0.5);
        ctx.moveTo(cx + eyeRadius * 0.5, cy - eyeRadius * 0.5);
        ctx.lineTo(cx - eyeRadius * 0.5, cy + eyeRadius * 0.5);
        ctx.stroke();
        break;
      }
      case 'wide': {
        ctx.beginPath();
        ctx.ellipse(cx, cy, eyeRadius * 0.7, eyeRadius * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx - eyeRadius * 0.2, cy - eyeRadius * 0.2, eyeRadius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 40;
        ctx.fillStyle = eyeColor;
        break;
      }
      case 'normal':
      default: {
        // Standard high-tech arc matching the reference image
        ctx.beginPath();
        ctx.arc(cx, cy + 20, eyeRadius * 0.5, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        break;
      }
    }
  };

  drawEye(leftEyeCenter.x, leftEyeCenter.y, false);
  drawEye(rightEyeCenter.x, rightEyeCenter.y, true);

  // Draw red blush marks (///) under eyes
  const drawBlush = (cx: number, cy: number, isRight: boolean) => {
    ctx.shadowBlur = 15;
    ctx.shadowColor = accentColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    
    ctx.save();
    ctx.translate(cx + (isRight ? 20 : -20), cy + 80);
    ctx.rotate(isRight ? -0.1 : 0.1);
    
    for(let i=0; i<3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 12 - 12, -8);
      ctx.lineTo(i * 12 - 16, 8);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawBlush(leftEyeCenter.x, leftEyeCenter.y, false);
  drawBlush(rightEyeCenter.x, rightEyeCenter.y, true);

  // No mouth for this design (the reference robot has no visible mouth, only eyes and blush)

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Helper: rounded rectangle path
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
