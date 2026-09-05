import * as THREE from 'three';
import { SPAWN, roomAt, EYE, mirrorX } from './data/layout.js';
import { createMaterials } from './world/materials.js';
import { buildWalls } from './world/walls.js';
import { buildGround } from './world/ground.js';
import { buildRoofs, addRoomLights } from './world/roofs.js';
import { createProceduralProps } from './world/props.js';
import { placeAssets } from './world/placements.js';
import { createControls, setSpawn } from './player/controls.js';
import { moveWithCollision } from './player/collision.js';
import { drawMinimap, bindLookLabel } from './ui/hud.js';
import { createTopdown } from './debug/topdown.js';

const canvas = document.getElementById('c');
const overlay = document.getElementById('overlay');
const roomEl = document.getElementById('room');
const lookEl = document.getElementById('look');
const mini = document.getElementById('mini');
const mctx = mini.getContext('2d');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fb7d6);
scene.fog = new THREE.Fog(0x8fb7d6, 28, 70);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.08, 120);
setSpawn(camera, SPAWN);

const hemi = new THREE.HemisphereLight(0xd7e8ff, 0x6b5a40, 1.15);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1d6, 1.35);
sun.position.set(mirrorX(18), 22, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -28;
sun.shadow.camera.right = 22;
sun.shadow.camera.top = 24;
sun.shadow.camera.bottom = -16;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 60;
scene.add(sun);

const mats = createMaterials();
scene.add(buildGround(mats));
const walls = buildWalls(mats);
scene.add(walls.group);
scene.add(buildRoofs(mats));
addRoomLights(scene);

const props = createProceduralProps();
for (const g of props.groups) scene.add(g);

const colliders = [...walls.colliders, ...props.colliders];
const { poll } = createControls(camera, canvas, overlay);
const topdown = createTopdown(camera, renderer);
const updateLook = bindLookLabel(camera, scene, lookEl);

placeAssets(scene).then((extra) => colliders.push(...extra));
window.__teleport = (x, z, yaw) => {
  camera.position.x = x;
  camera.position.z = z;
  if (yaw != null) camera.rotation.y = yaw;
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const { dx, dz } = poll(dt);
  moveWithCollision(camera.position, dx, dz, colliders);
  camera.position.y = EYE;
  roomEl.textContent = roomAt(camera.position.x, camera.position.z);
  updateLook();
  drawMinimap(mctx, camera.position);
  if (!topdown.render(scene)) renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
