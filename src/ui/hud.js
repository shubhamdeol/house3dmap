import * as THREE from 'three';
import { WALLS, PLOT, ROOMS, MIRROR_X } from '../data/layout.js';

export function drawMinimap(ctx, player) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillStyle = '#f1e6d0';
  ctx.fillRect(0, 0, w, h);
  const pad = 10;
  const sx = (w - pad * 2) / (PLOT.w + PLOT.roadW);
  const sz = (h - pad * 2) / PLOT.d;
  const s = Math.min(sx, sz);
  // Drawn in plan space (east right, north up) like the paper map.
  const planOf = (x) => pad + x * s;
  const xOf = (worldX) => planOf(MIRROR_X - worldX);
  const yOf = (z) => h - pad - z * s;

  ctx.fillStyle = '#9aa3a8';
  ctx.fillRect(planOf(19.4), yOf(PLOT.d), PLOT.roadW * s, PLOT.d * s);
  ctx.fillStyle = '#6e7378';
  for (const room of ROOMS) {
    if (room.name !== 'Parking') continue;
    for (const r of room.rects) {
      ctx.fillRect(xOf(r.x1), yOf(r.z1), (r.x1 - r.x0) * s, (r.z1 - r.z0) * s);
    }
  }
  ctx.fillStyle = '#3d6b3a';
  ctx.fillRect(planOf(0), yOf(17.1), 2.3 * s, 6.8 * s);
  ctx.strokeStyle = '#2a2118';
  ctx.lineWidth = 1.2;
  for (const wall of WALLS) {
    ctx.beginPath();
    ctx.moveTo(xOf(wall.x0), yOf(wall.z0));
    ctx.lineTo(xOf(wall.x1), yOf(wall.z1));
    ctx.stroke();
  }
  ctx.fillStyle = '#8b3a2a';
  ctx.beginPath();
  ctx.arc(xOf(player.x), yOf(player.z), 3.2, 0, Math.PI * 2);
  ctx.fill();
}

export function bindLookLabel(camera, scene, el) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(0, 0);
  return () => {
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(scene.children, true);
    for (const hit of hits) {
      if (hit.distance > 3) break;
      let o = hit.object;
      while (o && !o.userData.label) o = o.parent;
      if (o && o.userData.label) {
        el.textContent = o.userData.label;
        return;
      }
    }
    el.textContent = '';
  };
}
