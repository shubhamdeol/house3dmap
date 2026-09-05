import * as THREE from 'three';
import { WALLS, WALL_T } from '../data/layout.js';

function alongAxis(w) {
  return Math.abs(w.x1 - w.x0) >= Math.abs(w.z1 - w.z0) ? 'x' : 'z';
}

function loHi(a, b) {
  return a < b ? [a, b] : [b, a];
}

function solidIntervals(a0, a1, openings) {
  const [lo, hi] = loHi(a0, a1);
  const ops = (openings || [])
    .map((o) => ({ s: Math.max(lo, Math.min(o.start, o.end)), e: Math.min(hi, Math.max(o.start, o.end)) }))
    .filter((o) => o.e > o.s)
    .sort((a, b) => a.s - b.s);
  const gaps = [];
  let cursor = lo;
  for (const o of ops) {
    if (o.s > cursor) gaps.push([cursor, o.s]);
    cursor = Math.max(cursor, o.e);
  }
  if (cursor < hi) gaps.push([cursor, hi]);
  return gaps;
}

function wallBox(mats, cx, cz, axis, len, h, y0) {
  const mat = h <= 1.85 ? mats.brick : mats.plaster;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(axis === 'x' ? len : WALL_T, h, axis === 'x' ? WALL_T : len),
    mat,
  );
  mesh.position.set(cx, y0 + h / 2, cz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function colliderFor(axis, a0, a1, other, y0, h) {
  const [lo, hi] = loHi(a0, a1);
  const half = WALL_T / 2;
  if (axis === 'x') {
    return { minX: lo, maxX: hi, minZ: other - half, maxZ: other + half, minY: y0, maxY: y0 + h };
  }
  return { minX: other - half, maxX: other + half, minZ: lo, maxZ: hi, minY: y0, maxY: y0 + h };
}

export function buildWalls(mats) {
  const group = new THREE.Group();
  const colliders = [];

  for (const w of WALLS) {
    const axis = alongAxis(w);
    const a0 = axis === 'x' ? w.x0 : w.z0;
    const a1 = axis === 'x' ? w.x1 : w.z1;
    const other = axis === 'x' ? w.z0 : w.x0;

    for (const [s, e] of solidIntervals(a0, a1, w.openings)) {
      const len = e - s;
      if (len < 0.02) continue;
      const mid = (s + e) / 2;
      const cx = axis === 'x' ? mid : other;
      const cz = axis === 'x' ? other : mid;
      group.add(wallBox(mats, cx, cz, axis, len, w.h, 0));
      colliders.push(colliderFor(axis, s, e, other, 0, w.h));
    }

    for (const o of w.openings || []) {
      const os = Math.min(o.start, o.end);
      const oe = Math.max(o.start, o.end);
      const mid = (os + oe) / 2;
      const len = oe - os;
      const cx = axis === 'x' ? mid : other;
      const cz = axis === 'x' ? other : mid;

      if (o.sill && o.sill > 0) {
        group.add(wallBox(mats, cx, cz, axis, len, o.sill, 0));
        colliders.push(colliderFor(axis, os, oe, other, 0, o.sill));
      }
      if (o.h < w.h - 0.02) {
        const lh = w.h - o.h;
        group.add(wallBox(mats, cx, cz, axis, len, lh, o.h));
      }
      if (o.type === 'window') {
        const gh = o.h - (o.sill || 0);
        const glass = new THREE.Mesh(
          new THREE.BoxGeometry(axis === 'x' ? len : 0.04, gh, axis === 'x' ? 0.04 : len),
          mats.glass,
        );
        glass.position.set(cx, (o.sill || 0) + gh / 2, cz);
        group.add(glass);
      }
      if (o.type === 'gate') {
        const postH = w.h;
        for (const a of [os, oe]) {
          const px = axis === 'x' ? a : other;
          const pz = axis === 'x' ? other : a;
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, postH, 0.3), mats.brick);
          post.position.set(px, postH / 2, pz);
          post.castShadow = true;
          group.add(post);
        }
      }
    }
  }

  return { group, colliders };
}
