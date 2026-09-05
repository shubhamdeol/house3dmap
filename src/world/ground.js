import * as THREE from 'three';
import { ROOMS, PLOT, mirrorX } from '../data/layout.js';

function rectMesh(r, y, mat) {
  const w = r.x1 - r.x0;
  const d = r.z1 - r.z0;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  m.rotation.x = -Math.PI / 2;
  m.position.set(r.x0 + w / 2, y, r.z0 + d / 2);
  m.receiveShadow = true;
  return m;
}

export function buildGround(mats) {
  const g = new THREE.Group();
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), mats.grass);
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(mirrorX(12), -0.04, 8);
  grass.receiveShadow = true;
  g.add(grass);

  const floorY = {
    concrete: mats.concrete,
    soil: mats.soil,
    gym: mats.gym,
    dirt: mats.soil,
    straw: mats.straw,
    tile: mats.tile,
    court: mats.court,
    asphalt: mats.asphalt,
    road: mats.asphalt,
  };

  for (const room of ROOMS) {
    const mat = floorY[room.floor] || mats.concrete;
    for (const r of room.rects) g.add(rectMesh(r, 0.01, mat));
  }

  const bay = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 5.2),
    new THREE.MeshStandardMaterial({ color: 0xcfc8b8, roughness: 0.85 }),
  );
  bay.rotation.x = -Math.PI / 2;
  bay.position.set(mirrorX(18), 0.02, 12.8);
  g.add(bay);

  const dashMat = new THREE.MeshStandardMaterial({ color: 0xe8d9a8 });
  for (let z = -1; z < 21; z += 3) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.4), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(mirrorX(PLOT.w + PLOT.roadW / 2), 0.03, z);
    g.add(dash);
  }
  return g;
}
