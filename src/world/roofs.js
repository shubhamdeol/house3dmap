import * as THREE from 'three';
import { ROOFS, POSTS, mirrorX } from '../data/layout.js';

export function buildRoofs(mats) {
  const g = new THREE.Group();
  for (const r of ROOFS) {
    const w = r.x1 - r.x0;
    const d = r.z1 - r.z0;
    if (r.type === 'gable') {
      const hw = w / 2;
      const rise = r.ridgeY - r.eaveY;
      const slopeLen = Math.hypot(hw, rise);
      const ang = Math.atan2(rise, hw);
      for (const side of [-1, 1]) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.08, d + 0.1), mats.tin);
        mesh.rotation.z = -side * ang;
        mesh.position.set(r.x0 + hw + side * (hw / 2), (r.eaveY + r.ridgeY) / 2, r.z0 + d / 2);
        mesh.castShadow = true;
        g.add(mesh);
      }
      continue;
    }
    const h = r.h || 0.1;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      r.type === 'tin' ? mats.tin : mats.slab,
    );
    mesh.position.set(r.x0 + w / 2, r.y + h / 2, r.z0 + d / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
  }
  for (const p of POSTS) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, p.h, 0.2), mats.wood);
    post.position.set(p.x, p.h / 2, p.z);
    post.castShadow = true;
    g.add(post);
  }
  return g;
}

export function addRoomLights(scene) {
  const spots = [
    [7.2, 2.75, 12.9],
    [13.3, 2.75, 3.6],
    [2.7, 2.75, 2.2],
    [8.0, 2.75, 2.2],
    [8.0, 2.9, 8.6],
    [1.8, 2.6, 7.2],
  ];
  for (const [x, y, z] of spots) {
    const l = new THREE.PointLight(0xffe6c2, 18, 9, 2);
    l.position.set(mirrorX(x), y, z);
    scene.add(l);
  }
}
