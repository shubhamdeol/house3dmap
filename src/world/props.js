import * as THREE from 'three';
import { MIRROR_X } from '../data/layout.js';

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
function cyl(rTop, rBot, h, mat, x, y, z, segs = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segs), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
function label(group, name) { group.userData.label = name; return group; }
function aabbFromObject(obj, extra = 0) {
  const b = new THREE.Box3().setFromObject(obj);
  return { minX: b.min.x - extra, maxX: b.max.x + extra, minZ: b.min.z - extra, maxZ: b.max.z + extra, label: obj.userData.label || '' };
}

const M = {
  steel: new THREE.MeshStandardMaterial({ color: 0x9aa4ad, metalness: 0.6, roughness: 0.4 }),
  blackSteel: new THREE.MeshStandardMaterial({ color: 0x1c1f22, metalness: 0.5, roughness: 0.55 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 }),
  redPaint: new THREE.MeshStandardMaterial({ color: 0xb3261e, metalness: 0.3, roughness: 0.35 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xdfe4e8, metalness: 0.9, roughness: 0.15 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.8 }),
  hay: new THREE.MeshStandardMaterial({ color: 0xd9b84a, roughness: 0.9 }),
  sack: new THREE.MeshStandardMaterial({ color: 0xb99a6b, roughness: 0.95 }),
  rust: new THREE.MeshStandardMaterial({ color: 0x7a4a2b, metalness: 0.2, roughness: 0.85 }),
  greenBin: new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 }),
  darkCow: new THREE.MeshStandardMaterial({ color: 0x4b3226, roughness: 0.9 }),
  creamCow: new THREE.MeshStandardMaterial({ color: 0xe6d9bd, roughness: 0.9 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xbfe3ee, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.3 }),
  tin: new THREE.MeshStandardMaterial({ color: 0xa8b0b6, metalness: 0.7, roughness: 0.45 }),
  compost: new THREE.MeshStandardMaterial({ color: 0x3d2b1a, roughness: 1.0 }),
};
const buffaloHide = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.95 });

const rad = (d) => THREE.MathUtils.degToRad(d);

// Props are authored in plan coordinates; place() mirrors x so the compound
// reads the same way round as the drawing.
function place(obj, x, z, yaw = 0) {
  obj.position.set(MIRROR_X - x, obj.position.y, z);
  obj.rotation.y = rad(-yaw);
  obj.scale.x = -1;
  return obj;
}

function grp(x, z, yaw, name) {
  return label(place(new THREE.Group(), x, z, yaw), name);
}

function doorInteraction(object, collider, apply, range = 2.3) {
  let progress = 0; // 0 = open, 1 = closed
  let target = 0;
  collider.active = false;
  return {
    object,
    collider,
    range,
    get isOpen() { return target === 0; },
    toggle() {
      target = target === 0 ? 1 : 0;
      // Release the doorway as soon as opening begins.
      if (target === 0) collider.active = false;
    },
    update(dt) {
      const step = Math.min(1, dt * 6);
      progress += (target - progress) * step;
      if (Math.abs(target - progress) < 0.002) progress = target;
      apply(progress);
      // Block passage only when the door is almost fully closed.
      collider.active = target === 1 && progress > 0.82;
    },
  };
}

function buildTreadmill() {
  const g = grp(4.7, 14.9, 90, 'Treadmill');
  g.add(box(0.85, 0.1, 2.0, M.steel, 0, 0.12, 0));
  g.add(box(0.7, 0.06, 1.7, M.rubber, 0, 0.2, 0.05));
  g.add(box(0.85, 0.28, 0.35, M.blackSteel, 0, 0.22, -0.85));
  g.add(box(0.05, 0.05, 1.1, M.chrome, -0.38, 0.55, 0.1));
  g.add(box(0.05, 0.05, 1.1, M.chrome, 0.38, 0.55, 0.1));
  g.add(box(0.05, 1.15, 0.05, M.steel, -0.38, 0.65, -0.72));
  g.add(box(0.05, 1.15, 0.05, M.steel, 0.38, 0.65, -0.72));
  const con = box(0.75, 0.22, 0.1, M.blackSteel, 0, 1.28, -0.75);
  con.rotation.x = -0.35; g.add(con);
  return g;
}

function buildBench() {
  const g = grp(6.3, 12.8, 0, 'Adjustable Bench Press');
  g.add(box(0.4, 0.07, 1.15, M.rubber, 0, 0.45, 0.15));
  g.add(box(0.35, 0.4, 0.06, M.steel, 0, 0.22, 0.55));
  g.add(box(0.35, 0.4, 0.06, M.steel, 0, 0.22, -0.25));
  g.add(box(0.07, 1.0, 0.07, M.steel, -0.45, 0.5, -0.55));
  g.add(box(0.07, 1.0, 0.07, M.steel, 0.45, 0.5, -0.55));
  g.add(box(1.0, 0.06, 0.08, M.steel, 0, 0.96, -0.55));
  const bar = cyl(0.016, 0.016, 1.7, M.chrome, 0, 1.02, -0.55);
  bar.rotation.z = Math.PI / 2; g.add(bar);
  for (const sx of [-1, 1]) {
    const p1 = cyl(0.17, 0.17, 0.06, M.blackSteel, sx * 0.74, 1.02, -0.55);
    const p2 = cyl(0.13, 0.13, 0.05, M.blackSteel, sx * 0.65, 1.02, -0.55);
    p1.rotation.z = Math.PI / 2; p2.rotation.z = Math.PI / 2;
    g.add(p1); g.add(p2);
  }
  return g;
}

function buildDumbbellRack() {
  const g = grp(10.65, 15.15, 180, 'Dumbbell Rack');
  g.add(box(0.06, 0.75, 0.45, M.steel, -0.8, 0.375, 0));
  g.add(box(0.06, 0.75, 0.45, M.steel, 0.8, 0.375, 0));
  g.add(box(1.65, 0.05, 0.4, M.steel, 0, 0.4, 0));
  g.add(box(1.65, 0.05, 0.4, M.steel, 0, 0.72, 0));
  for (let i = 0; i < 6; i++) {
    const x = -0.55 + (i % 3) * 0.55, y = i < 3 ? 0.5 : 0.82;
    const h = cyl(0.02, 0.02, 0.3, M.chrome, x, y, 0);
    h.rotation.z = Math.PI / 2; g.add(h);
    g.add(box(0.09, 0.12, 0.12, M.rubber, x - 0.17, y, 0));
    g.add(box(0.09, 0.12, 0.12, M.rubber, x + 0.17, y, 0));
  }
  return g;
}

function buildPullupBar() {
  const g = grp(11.65, 13.8, 0, 'Pull-up Bar');
  const bar = cyl(0.015, 0.015, 1.0, M.chrome, 0, 2.2, 0);
  bar.rotation.x = Math.PI / 2; g.add(bar);
  g.add(box(0.35, 0.05, 0.05, M.blackSteel, 0.175, 2.2, -0.4));
  g.add(box(0.35, 0.05, 0.05, M.blackSteel, 0.175, 2.2, 0.4));
  return g;
}

function buildFeedTrough() {
  const g = grp(8.0, 0.45, 0, 'Feed Trough');
  g.add(box(4.4, 0.08, 0.5, M.wood, 0, 0.1, 0));
  const s1 = box(4.4, 0.42, 0.06, M.wood, 0, 0.32, -0.27); s1.rotation.x = 0.18; g.add(s1);
  const s2 = box(4.4, 0.42, 0.06, M.wood, 0, 0.32, 0.27); s2.rotation.x = -0.18; g.add(s2);
  g.add(box(0.06, 0.45, 0.6, M.wood, -2.17, 0.3, 0));
  g.add(box(0.06, 0.45, 0.6, M.wood, 2.17, 0.3, 0));
  g.add(box(4.2, 0.12, 0.36, M.hay, 0, 0.32, 0));
  return g;
}

function buildHayStack(x, z) {
  const g = grp(x, z, 0, 'Hay Stack');
  const layers = [[3, 2], [3, 2], [2, 2]];
  layers.forEach(([nx, nz], li) => {
    for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) {
      const b = box(0.78, 0.48, 0.58, M.hay, (i - (nx - 1) / 2) * 0.8, 0.25 + li * 0.5, (k - (nz - 1) / 2) * 0.6);
      b.rotation.y = (li + i + k) % 2 ? 0.04 : -0.04;
      g.add(b);
    }
  });
  return g;
}

function buildFeedSacks() {
  const g = grp(4.5, 1.0, 0, 'Feed Sacks');
  const pos = [[-0.5, 0.35, -0.25], [0, 0.35, -0.25], [0.5, 0.35, -0.25], [-0.25, 0.35, 0.3], [0.25, 0.35, 0.3], [0, 1.05, -0.25]];
  pos.forEach(([x, y, z], i) => {
    const s = box(0.45, 0.7, 0.35, M.sack, x, y, z);
    s.rotation.y = (i % 2 ? 1 : -1) * 0.08;
    g.add(s);
  });
  return g;
}

function buildChaffCutter() {
  const g = grp(3.0, 3.4, -90, 'Chaff Cutter');
  g.add(box(0.5, 0.15, 0.45, M.blackSteel, 0, 0.075, 0));
  g.add(box(0.7, 0.7, 0.55, M.redPaint, 0, 0.45, 0));
  const wheel = cyl(0.32, 0.32, 0.07, M.blackSteel, 0.42, 0.55, 0);
  wheel.rotation.z = Math.PI / 2; g.add(wheel);
  const hub = cyl(0.05, 0.05, 0.12, M.chrome, 0.42, 0.55, 0);
  hub.rotation.z = Math.PI / 2; g.add(hub);
  const hopper = box(0.45, 0.5, 0.4, M.tin, 0, 1.05, 0);
  hopper.rotation.x = -0.25; g.add(hopper);
  g.add(box(0.5, 0.06, 0.5, M.rust, 0, 0.82, 0));
  return g;
}

function buildWasteBin(x, z) {
  const g = grp(x, z, 0, 'Waste Bin');
  g.add(cyl(0.3, 0.27, 0.9, M.greenBin, 0, 0.45, 0, 16));
  g.add(cyl(0.32, 0.32, 0.06, M.blackSteel, 0, 0.92, 0, 16));
  return g;
}

function buildCompost() {
  const g = grp(2.8, 18.0, 0, 'Compost Heap');
  const s = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 10), M.compost);
  s.scale.set(1, 0.375, 1); s.position.y = 0.26;
  s.castShadow = true; s.receiveShadow = true;
  g.add(s);
  return g;
}

function buildSliderPanel() {
  const g = grp(8.3, 10.3, 0, 'Sliding Door');
  const leaf = () => {
    const panel = new THREE.Group();
    panel.add(box(1.8, 2.4, 0.05, M.glass, 0, 1.2, 0));
    panel.add(box(1.84, 0.06, 0.07, M.steel, 0, 0.05, 0));
    panel.add(box(1.84, 0.06, 0.07, M.steel, 0, 2.37, 0));
    panel.add(box(0.06, 2.4, 0.07, M.steel, -0.9, 1.2, 0));
    panel.add(box(0.06, 2.4, 0.07, M.steel, 0.9, 1.2, 0));
    return panel;
  };
  const fixed = leaf();
  const moving = leaf();
  // The moving leaf runs on the second rail, avoiding coplanar glass flicker.
  moving.position.z = 0.06;
  g.add(fixed, moving);
  g.updateMatrixWorld(true);
  const fixedCollider = aabbFromObject(fixed);
  fixedCollider.label = 'Sliding Door';
  moving.position.x = -1.8;
  g.updateMatrixWorld(true);
  const collider = aabbFromObject(moving);
  collider.label = 'Sliding Door';
  moving.position.x = 0;
  g.updateMatrixWorld(true);
  return {
    object: g,
    interaction: doorInteraction(g, collider, (p) => {
      moving.position.x = -p * 1.8;
    }, 2.7),
    staticCollider: fixedCollider,
  };
}

function buildShutterDrum() {
  const g = grp(3.6, 12.9, 0, 'Sliding Shutter');
  const d = cyl(0.12, 0.12, 4.0, M.tin, 0, 2.55, 0, 16);
  d.rotation.x = Math.PI / 2; g.add(d);
  g.add(box(0.3, 0.3, 0.1, M.steel, 0, 2.55, -2.0));
  g.add(box(0.3, 0.3, 0.1, M.steel, 0, 2.55, 2.0));
  const panel = box(0.08, 2.4, 4.0, M.tin, 0, 3.8, 0);
  g.add(panel);
  panel.position.y = 1.2;
  g.updateMatrixWorld(true);
  const collider = aabbFromObject(panel);
  collider.label = 'Sliding Shutter';
  panel.position.y = 3.8;
  g.updateMatrixWorld(true);
  return {
    object: g,
    interaction: doorInteraction(g, collider, (p) => {
      panel.position.y = 3.8 - p * 2.6;
    }, 3.1),
  };
}

function buildGateLeaf(hx, hz, dir, yaw) {
  const g = grp(hx, hz, yaw, 'Main Gate');
  const zc = dir * 0.75;
  g.add(box(0.05, 0.07, 1.5, M.steel, 0, 0.12, zc));
  g.add(box(0.05, 0.07, 1.5, M.steel, 0, 2.12, zc));
  g.add(box(0.05, 2.2, 0.06, M.steel, 0, 1.1, dir * 0.03));
  g.add(box(0.05, 2.2, 0.06, M.steel, 0, 1.1, dir * 1.47));
  for (let i = 1; i < 5; i++) g.add(box(0.04, 2.0, 0.04, M.steel, 0, 1.1, dir * i * 0.3));
  return g;
}

function buildDoor(hx, hz, w, h, yaw) {
  const g = grp(hx, hz, yaw, 'Door');
  const pivot = new THREE.Group();
  g.add(pivot);
  pivot.add(box(w, h, 0.04, M.wood, w / 2, h / 2, 0));
  pivot.add(box(w - 0.1, 0.06, 0.05, M.wood, w / 2, h - 0.08, 0.01));
  pivot.add(box(0.05, 0.05, 0.1, M.chrome, w - 0.12, 1.0, 0.04));
  pivot.rotation.y = Math.PI / 2;
  g.updateMatrixWorld(true);
  const collider = aabbFromObject(g);
  pivot.rotation.y = 0;
  g.updateMatrixWorld(true);
  return {
    object: g,
    interaction: doorInteraction(g, collider, (p) => {
      pivot.rotation.y = p * Math.PI / 2;
    }),
  };
}

export function createLowPolyAnimal(kind) {
  const buff = kind === 'buffalo';
  const mat = kind === 'cow2' ? M.creamCow : buff ? buffaloHide : M.darkCow;
  const bw = buff ? 0.85 : 0.68, bh = buff ? 0.85 : 0.72, bl = buff ? 1.7 : 1.35, by = buff ? 1.02 : 0.92;
  const g = new THREE.Group();
  g.add(box(bw, bh, bl, mat, 0, by, 0));
  const hz = bl / 2 + 0.25, hy = by + 0.35;
  g.add(box(buff ? 0.42 : 0.34, buff ? 0.45 : 0.4, buff ? 0.5 : 0.42, mat, 0, hy, hz));
  g.add(box(buff ? 0.3 : 0.24, 0.22, 0.22, mat, 0, hy - 0.12, hz + (buff ? 0.3 : 0.26)));
  const legH = by - bh / 2;
  for (const sx of [-1, 1]) for (const sz of [-1, 1])
    g.add(box(buff ? 0.17 : 0.13, legH, buff ? 0.17 : 0.13, mat, sx * (bw / 2 - 0.12), legH / 2, sz * (bl / 2 - 0.18)));
  for (const sx of [-1, 1]) {
    const horn = cyl(0.005, 0.035, buff ? 0.42 : 0.22, M.creamCow, sx * (buff ? 0.3 : 0.2), hy + (buff ? 0.3 : 0.26), hz - 0.05);
    horn.rotation.z = sx * (buff ? 1.1 : 0.5);
    if (buff) horn.rotation.x = -0.3;
    g.add(horn);
    g.add(box(0.16, 0.08, 0.05, mat, sx * ((buff ? 0.42 : 0.34) / 2 + 0.06), hy + 0.08, hz));
  }
  const tail = box(0.05, 0.5, 0.05, mat, 0, by + 0.05, -bl / 2 - 0.02);
  tail.rotation.x = 0.2; g.add(tail);
  if (!buff) g.add(box(0.22, 0.14, 0.22, M.creamCow, 0, by - bh / 2 - 0.05, -bl / 2 + 0.25));
  return label(g, buff ? 'Buffalo' : 'Cow');
}

export function createFallbackCar() {
  const g = new THREE.Group();
  g.add(box(1.6, 0.4, 3.5, M.redPaint, 0, 0.5, 0));
  g.add(box(1.44, 0.34, 1.75, M.redPaint, 0, 0.87, -0.25));
  g.add(box(1.48, 0.2, 1.62, M.glass, 0, 0.89, -0.25));
  g.add(box(1.64, 0.1, 0.14, M.chrome, 0, 0.38, 1.73));
  g.add(box(1.64, 0.1, 0.14, M.chrome, 0, 0.38, -1.73));
  g.add(box(0.28, 0.1, 0.06, M.tin, -0.52, 0.56, 1.74));
  g.add(box(0.28, 0.1, 0.06, M.tin, 0.52, 0.56, 1.74));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const w = cyl(0.29, 0.29, 0.22, M.rubber, sx * 0.73, 0.29, sz * 1.15, 16);
    w.rotation.z = Math.PI / 2; g.add(w);
    const hub = cyl(0.13, 0.13, 0.24, M.chrome, sx * 0.73, 0.29, sz * 1.15, 12);
    hub.rotation.z = Math.PI / 2; g.add(hub);
  }
  // Parked along the slider side so the north half of the gym stays clear.
  place(g, 8.6, 12.3, 0);
  return label(g, 'Car');
}

export function createFallbackTractor() {
  const g = new THREE.Group();
  g.add(box(0.9, 0.25, 2.6, M.blackSteel, 0, 0.75, 0));
  g.add(box(0.85, 0.65, 1.1, M.redPaint, 0, 1.15, 0.75));
  g.add(box(0.7, 0.45, 0.9, M.redPaint, 0, 1.05, -0.55));
  g.add(box(0.45, 0.08, 0.45, M.rubber, 0, 1.35, -0.75));
  g.add(box(0.45, 0.45, 0.08, M.rubber, 0, 1.6, -0.98));
  g.add(cyl(0.045, 0.045, 0.8, M.blackSteel, 0.25, 1.85, 0.95));
  const wheel = cyl(0.16, 0.16, 0.03, M.rubber, 0, 1.5, -0.3);
  wheel.rotation.x = 0.9; g.add(wheel);
  const col = box(0.05, 0.4, 0.05, M.blackSteel, 0, 1.3, -0.22);
  col.rotation.x = 0.5; g.add(col);
  for (const sx of [-1, 1]) {
    const rw = cyl(0.55, 0.55, 0.3, M.rubber, sx * 0.78, 0.55, -0.65, 16);
    rw.rotation.z = Math.PI / 2; g.add(rw);
    const fw = cyl(0.34, 0.34, 0.22, M.rubber, sx * 0.7, 0.34, 1.05, 16);
    fw.rotation.z = Math.PI / 2; g.add(fw);
    g.add(box(0.32, 0.08, 1.1, M.redPaint, sx * 0.78, 1.14, -0.65));
  }
  g.add(box(0.2, 0.1, 0.06, M.tin, -0.28, 1.25, 1.32));
  g.add(box(0.2, 0.1, 0.06, M.tin, 0.28, 1.25, 1.32));
  place(g, 1.8, 6.3, 0);
  return label(g, 'Tractor');
}

export function createProceduralProps() {
  const groups = [], colliders = [], interactions = [];
  const add = (g, collide) => {
    groups.push(g);
    if (collide) { g.updateMatrixWorld(true); colliders.push(aabbFromObject(g)); }
    return g;
  };
  const addDoor = ({ object, interaction, staticCollider }) => {
    groups.push(object);
    if (staticCollider) colliders.push(staticCollider);
    colliders.push(interaction.collider);
    interactions.push(interaction);
  };

  add(buildTreadmill(), true);
  add(buildBench(), true);
  add(buildDumbbellRack(), true);
  add(buildPullupBar(), false);
  add(buildFeedTrough(), true);
  add(buildHayStack(1.3, 1.1), true);
  add(buildHayStack(1.3, 3.2), true);
  add(buildFeedSacks(), true);
  add(buildChaffCutter(), true);
  add(buildWasteBin(0.6, 18.4), true);
  add(buildWasteBin(1.3, 18.4), true);
  add(buildCompost(), true);
  addDoor(buildSliderPanel());
  addDoor(buildShutterDrum());
  add(buildGateLeaf(16.2, 7.2, 1, 90), true);
  add(buildGateLeaf(16.2, 10.3, -1, -90), true);
  addDoor(buildDoor(1.35, 17.1, 0.9, 2.0, 90));
  addDoor(buildDoor(11.2, 7.2, 1.0, 2.1, -90));
  addDoor(buildDoor(4.1, 4.4, 1.2, 2.1, -90));
  addDoor(buildDoor(9.0, 4.4, 1.3, 2.1, -90));

  add(place(createLowPolyAnimal('cow'), 6.6, 1.9, 180), true);
  add(place(createLowPolyAnimal('cow2'), 8.0, 1.9, 180), true);
  add(place(createLowPolyAnimal('buffalo'), 9.4, 1.9, 180), true);

  return { groups, colliders, interactions };
}
