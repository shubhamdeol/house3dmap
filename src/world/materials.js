import * as THREE from 'three';

const loader = new THREE.TextureLoader();

function tex(path, repeatX, repeatZ) {
  const t = loader.load(import.meta.env.BASE_URL + path);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatZ);
  t.anisotropy = 8;
  return t;
}

export function createMaterials() {
  const grass = new THREE.MeshStandardMaterial({
    map: tex('textures/aerial_grass_rock/aerial_grass_rock_diff_1k.jpg', 40, 40),
    roughness: 0.95,
  });
  const asphalt = new THREE.MeshStandardMaterial({
    map: tex('textures/asphalt_02/asphalt_02_diff_1k.jpg', 8, 8),
    roughness: 0.9,
  });
  const brick = new THREE.MeshStandardMaterial({
    map: tex('textures/red_brick_03/red_brick_03_diff_1k.jpg', 2, 1.2),
    roughness: 0.85,
  });
  const plaster = new THREE.MeshStandardMaterial({
    map: tex('textures/painted_plaster_wall/painted_plaster_wall_diff_1k.jpg', 2, 1.2),
    color: 0xf0e6d4,
    roughness: 0.8,
  });
  const concrete = new THREE.MeshStandardMaterial({
    map: tex('textures/concrete_floor_worn_001/concrete_floor_worn_001_diff_1k.jpg', 4, 4),
    roughness: 0.92,
  });
  const tin = new THREE.MeshStandardMaterial({
    map: tex('textures/corrugated_iron_02/corrugated_iron_02_diff_1k.jpg', 6, 4),
    metalness: 0.55,
    roughness: 0.4,
  });
  const soil = new THREE.MeshStandardMaterial({
    map: tex('textures/brown_mud_leaves_01/brown_mud_leaves_01_diff_1k.jpg', 3, 6),
    roughness: 1,
  });
  const wood = new THREE.MeshStandardMaterial({
    map: tex('textures/wood_planks/wood_planks_diff_1k.jpg', 2, 2),
    roughness: 0.85,
  });
  const tile = new THREE.MeshStandardMaterial({ color: 0xd8c4a8, roughness: 0.55 });
  const gym = new THREE.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.9 });
  const straw = new THREE.MeshStandardMaterial({ color: 0xc4a15a, roughness: 1 });
  const court = new THREE.MeshStandardMaterial({ color: 0xb7b1a4, roughness: 0.88 });
  const slab = new THREE.MeshStandardMaterial({ color: 0x8d867c, roughness: 0.7 });
  const kerb = new THREE.MeshStandardMaterial({ color: 0x6e6a64, roughness: 0.8 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x9ec9d8,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0.1,
  });
  return {
    grass, asphalt, brick, plaster, concrete, tin, soil, wood, tile, gym, straw, court, slab, kerb, glass,
  };
}
