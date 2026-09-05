import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = new Map();

export function loadGltf(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      }),
    );
  }
  return cache.get(url);
}

export function fitToSize(obj, target, axis = 'xz') {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  let current = axis === 'y' ? size.y : Math.max(size.x, size.z);
  if (current < 1e-4) return obj;
  obj.scale.multiplyScalar(target / current);
  return obj;
}

export function groundAlign(obj) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  obj.position.y -= box.min.y;
  return obj;
}

export function centerAt(obj, x, z) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const c = box.getCenter(new THREE.Vector3());
  obj.position.x += x - c.x;
  obj.position.z += z - c.z;
  obj.updateMatrixWorld(true);
  const grounded = new THREE.Box3().setFromObject(obj);
  obj.position.y -= grounded.min.y;
  return obj;
}

export function enableShadows(obj) {
  obj.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
}

export function aabbOf(obj, extra = 0) {
  const b = new THREE.Box3().setFromObject(obj);
  return {
    minX: b.min.x - extra,
    maxX: b.max.x + extra,
    minZ: b.min.z - extra,
    maxZ: b.max.z + extra,
    label: obj.userData.label || '',
  };
}
