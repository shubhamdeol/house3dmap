import { RADIUS } from '../data/layout.js';

function overlap(nx, nz, c) {
  const minX = c.minX - RADIUS;
  const maxX = c.maxX + RADIUS;
  const minZ = c.minZ - RADIUS;
  const maxZ = c.maxZ + RADIUS;
  return nx > minX && nx < maxX && nz > minZ && nz < maxZ;
}

function resolveAxis(p, c, axis) {
  const min = (axis === 'x' ? c.minX : c.minZ) - RADIUS;
  const max = (axis === 'x' ? c.maxX : c.maxZ) + RADIUS;
  const v = axis === 'x' ? p.x : p.z;
  const left = v - min;
  const right = max - v;
  if (left < right) {
    if (axis === 'x') p.x = min;
    else p.z = min;
  } else if (axis === 'x') p.x = max;
  else p.z = max;
}

export function moveWithCollision(pos, dx, dz, colliders) {
  pos.x += dx;
  for (const c of colliders) {
    if (overlap(pos.x, pos.z, c)) resolveAxis(pos, c, 'x');
  }
  pos.z += dz;
  for (const c of colliders) {
    if (overlap(pos.x, pos.z, c)) resolveAxis(pos, c, 'z');
  }
}
