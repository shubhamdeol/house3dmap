import * as THREE from 'three';
import { FURNITURE, FLOWERS } from '../data/layout.js';
import { loadGltf, fitToSize, centerAt, enableShadows, aabbOf } from './loaders.js';
import { createFallbackCar, createFallbackTractor } from './props.js';

const MODELS = `${import.meta.env.BASE_URL}models/kenney`;
const FURN_BASE = `${MODELS}/furniture-kit`;
const NAT_BASE = `${MODELS}/nature-kit`;
const CAR_BASE = `${MODELS}/car-kit`;

function pathFor(name) {
  if (['sedan', 'tractor'].includes(name)) return `${CAR_BASE}/${name}.glb`;
  if (name.startsWith('tree') || name.startsWith('plant') || name.startsWith('flower') || name === 'grass') {
    return `${NAT_BASE}/${name}.glb`;
  }
  return `${FURN_BASE}/${name}.glb`;
}

async function placeModel(spec) {
  const gltf = await loadGltf(pathFor(spec.model));
  const root = gltf.scene.clone(true);
  enableShadows(root);
  fitToSize(root, spec.fit, spec.fitAxis || 'xz');
  root.rotation.y = THREE.MathUtils.degToRad(spec.yaw || 0);
  centerAt(root, spec.x, spec.z);
  if (spec.y) root.position.y += spec.y;
  root.userData.label = spec.label;
  root.updateMatrixWorld(true);
  let collider = null;
  if (spec.collide) {
    if (spec.collideR) {
      collider = {
        minX: spec.x - spec.collideR,
        maxX: spec.x + spec.collideR,
        minZ: spec.z - spec.collideR,
        maxZ: spec.z + spec.collideR,
        label: spec.label,
      };
    } else collider = aabbOf(root);
  }
  return { object: root, collider };
}

async function loadVehicle(kind) {
  const object = kind === 'sedan' ? createFallbackCar() : createFallbackTractor();
  object.updateMatrixWorld(true);
  return { object, collider: aabbOf(object) };
}

export async function placeAssets(scene) {
  const colliders = [];
  const jobs = [...FURNITURE, ...FLOWERS].map(async (spec) => {
    try {
      const { object, collider } = await placeModel(spec);
      scene.add(object);
      if (collider) colliders.push(collider);
    } catch (err) {
      console.warn('skip', spec.model, err);
    }
  });
  await Promise.all(jobs);
  for (const kind of ['sedan', 'tractor']) {
    const { object, collider } = await loadVehicle(kind);
    scene.add(object);
    colliders.push(collider);
  }
  return colliders;
}
