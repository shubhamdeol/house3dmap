export const PLOT = { w: 19.4, d: 18.9, roadW: 6 };
export const WALL_T = 0.2;
export const EYE = 1.7;
export const SPEED = 3;
export const SPRINT = 5;
export const RADIUS = 0.3;

// Everything below is authored in plan coordinates: x runs east, z runs north,
// matching the paper map. World space mirrors x (see mirrorX) so that the layout
// reads the same way round as the drawing when seen from above.
const SPAWN_PLAN = { x: 22, y: EYE, z: 8.75, yaw: Math.PI / 2 };

const WALLS_PLAN = [
  { id: 'W1a', x0: 0, z0: 0, x1: 16.2, z1: 0, h: 3 },
  { id: 'W1b', x0: 16.2, z0: 0, x1: 19.4, z1: 0, h: 1.8 },
  { id: 'W2a', x0: 0, z0: 0, x1: 0, z1: 10.3, h: 3 },
  { id: 'W2b', x0: 0, z0: 10.3, x1: 0, z1: 18.9, h: 2.1 },
  { id: 'W3', x0: 0, z0: 18.9, x1: 3.6, z1: 18.9, h: 2.1 },
  { id: 'W4', x0: 3.6, z0: 18.9, x1: 3.6, z1: 15.5, h: 2.1 },
  { id: 'W5', x0: 3.6, z0: 15.5, x1: 12.1, z1: 15.5, h: 3 },
  { id: 'W6', x0: 12.1, z0: 15.5, x1: 19.4, z1: 15.5, h: 1.8 },
  {
    id: 'W7',
    x0: 19.4,
    z0: 15.5,
    x1: 19.4,
    z1: 0,
    h: 1.2,
    openings: [{ start: 7.2, end: 10.3, h: 1.2, type: 'gap' }],
  },
  {
    id: 'W8',
    x0: 0,
    z0: 17.1,
    x1: 3.6,
    z1: 17.1,
    h: 2.1,
    openings: [{ start: 1.35, end: 2.25, h: 2.0, type: 'door' }],
  },
  // No wall between the tin shed and the garden — the tractor area opens
  // straight into the garden.
  {
    id: 'W10',
    x0: 3.6,
    z0: 10.3,
    x1: 3.6,
    z1: 15.5,
    h: 3,
    openings: [{ start: 10.9, end: 14.9, h: 2.4, type: 'shutter' }],
  },
  {
    id: 'W11',
    x0: 3.6,
    z0: 10.3,
    x1: 12.1,
    z1: 10.3,
    h: 3,
    openings: [{ start: 5.6, end: 9.2, h: 2.4, type: 'slider' }],
  },
  { id: 'W12', x0: 12.1, z0: 10.3, x1: 12.1, z1: 15.5, h: 3 },
  { id: 'W13', x0: 12.1, z0: 10.3, x1: 16.2, z1: 10.3, h: 3 },
  {
    id: 'W14',
    x0: 16.2,
    z0: 10.3,
    x1: 16.2,
    z1: 7.2,
    h: 3,
    openings: [{ start: 7.2, end: 10.3, h: 2.4, type: 'gate' }],
  },
  {
    id: 'W15',
    x0: 16.2,
    z0: 7.2,
    x1: 16.2,
    z1: 0,
    h: 3,
    openings: [{ start: 3.0, end: 4.2, h: 2.1, type: 'window', sill: 0.9 }],
  },
  {
    id: 'W16',
    x0: 10.5,
    z0: 7.2,
    x1: 16.2,
    z1: 7.2,
    h: 3,
    openings: [{ start: 11.2, end: 12.2, h: 2.1, type: 'door' }],
  },
  { id: 'W17', x0: 10.5, z0: 7.2, x1: 10.5, z1: 0, h: 3 },
  {
    id: 'W18',
    x0: 0,
    z0: 4.4,
    x1: 10.5,
    z1: 4.4,
    h: 3,
    openings: [
      { start: 4.1, end: 5.3, h: 2.1, type: 'door' },
      { start: 9.0, end: 10.3, h: 2.1, type: 'door' },
    ],
  },
  { id: 'W19', x0: 5.5, z0: 0, x1: 5.5, z1: 4.4, h: 3 },
];

const ROOMS_PLAN = [
  { name: 'Waste Area', floor: 'concrete', rects: [{ x0: 0, z0: 17.1, x1: 3.6, z1: 18.9 }] },
  {
    name: 'Garden',
    floor: 'soil',
    rects: [{ x0: 0, z0: 10.3, x1: 2.3, z1: 17.1 }],
  },
  {
    name: 'Garden apron',
    floor: 'concrete',
    rects: [{ x0: 2.3, z0: 10.3, x1: 3.6, z1: 17.1 }],
  },
  {
    name: 'Gym & indoor garage',
    floor: 'gym',
    rects: [{ x0: 3.6, z0: 10.3, x1: 12.1, z1: 15.5 }],
  },
  {
    name: 'Tin shed',
    floor: 'dirt',
    rects: [{ x0: 0, z0: 4.4, x1: 3.6, z1: 10.3 }],
  },
  {
    name: 'Animal food storage',
    floor: 'concrete',
    rects: [{ x0: 0, z0: 0, x1: 5.5, z1: 4.4 }],
  },
  {
    name: 'Cows & buffalo',
    floor: 'straw',
    rects: [{ x0: 5.5, z0: 0, x1: 10.5, z1: 4.4 }],
  },
  {
    name: 'House',
    floor: 'tile',
    rects: [{ x0: 10.5, z0: 0, x1: 16.2, z1: 7.2 }],
  },
  {
    name: 'Courtyard',
    floor: 'court',
    rects: [
      { x0: 3.6, z0: 7.2, x1: 16.2, z1: 10.3 },
      { x0: 3.6, z0: 4.4, x1: 10.5, z1: 7.2 },
    ],
  },
  {
    name: 'Parking',
    floor: 'asphalt',
    rects: [
      { x0: 12.1, z0: 10.3, x1: 19.4, z1: 15.5 },
      { x0: 16.2, z0: 0, x1: 19.4, z1: 10.3 },
    ],
  },
  {
    name: 'Public road',
    floor: 'road',
    rects: [{ x0: 19.4, z0: -2, x1: 25.4, z1: 22 }],
  },
];

const ROOFS_PLAN = [
  { type: 'slab', x0: 3.6, z0: 10.3, x1: 12.1, z1: 15.5, y: 3.0, h: 0.15, mat: 'slab' },
  { type: 'slab', x0: 0, z0: 0, x1: 5.5, z1: 4.4, y: 3.0, h: 0.15, mat: 'slab' },
  { type: 'slab', x0: 5.5, z0: 0, x1: 10.5, z1: 4.4, y: 3.0, h: 0.15, mat: 'slab' },
  { type: 'slab', x0: 10.5, z0: 0, x1: 16.2, z1: 7.2, y: 3.0, h: 0.15, mat: 'slab' },
  { type: 'tin', x0: 3.6, z0: 7.2, x1: 16.2, z1: 10.3, y: 3.2, h: 0.08 },
  { type: 'tin', x0: 3.6, z0: 4.4, x1: 10.5, z1: 7.2, y: 3.2, h: 0.08 },
  { type: 'tin', x0: 0, z0: 4.4, x1: 3.6, z1: 10.3, y: 3.05, h: 0.1 },
];

const POSTS_PLAN = [
  { x: 3.6, z: 4.4, h: 3.2 },
  { x: 3.6, z: 7.35, h: 3.2 },
  { x: 3.6, z: 10.3, h: 3.2 },
];

const FURNITURE_PLAN = [
  { id: 'bed', model: 'bedDouble', x: 11.6, z: 1.2, yaw: 90, fit: 2.0, label: 'Double bed', collide: true },
  { id: 'wardrobe', model: 'bookcaseClosedWide', x: 10.85, z: 3.4, yaw: 90, fit: 1.2, label: 'Wardrobe', collide: true },
  { id: 'table', model: 'table', x: 13.4, z: 3.4, yaw: 0, fit: 1.4, label: 'Dining table', collide: true },
  { id: 'c1', model: 'chair', x: 12.6, z: 3.4, yaw: 90, fit: 0.5, label: 'Chair', collide: true },
  { id: 'c2', model: 'chair', x: 14.2, z: 3.4, yaw: -90, fit: 0.5, label: 'Chair', collide: true },
  { id: 'c3', model: 'chair', x: 13.4, z: 2.7, yaw: 0, fit: 0.5, label: 'Chair', collide: true },
  { id: 'c4', model: 'chair', x: 13.4, z: 4.1, yaw: 180, fit: 0.5, label: 'Chair', collide: true },
  { id: 'sofa', model: 'loungeSofa', x: 15.7, z: 5.8, yaw: -90, fit: 2.0, label: 'Sofa', collide: true },
  { id: 'tvstand', model: 'cabinetTelevision', x: 10.9, z: 5.8, yaw: 90, fit: 1.2, label: 'TV cabinet', collide: true },
  { id: 'tv', model: 'televisionModern', x: 10.95, z: 5.8, yaw: 90, fit: 1.0, label: 'Television', collide: false, y: 0.55 },
  { id: 'cab1', model: 'kitchenCabinet', x: 13.6, z: 0.35, yaw: 0, fit: 0.7, label: 'Kitchen cabinet', collide: true },
  { id: 'sink', model: 'kitchenSink', x: 14.3, z: 0.35, yaw: 0, fit: 0.7, label: 'Kitchen sink', collide: true },
  { id: 'cab2', model: 'kitchenCabinetDrawer', x: 15.0, z: 0.35, yaw: 0, fit: 0.7, label: 'Kitchen cabinet', collide: true },
  { id: 'fridge', model: 'kitchenFridge', x: 15.8, z: 0.4, yaw: 0, fit: 0.7, label: 'Fridge', collide: true },
  { id: 'rug', model: 'rugRectangle', x: 14.6, z: 5.6, yaw: 0, fit: 2.0, label: 'Rug', collide: false },
  { id: 'plant', model: 'pottedPlant', x: 15.6, z: 1.2, yaw: 0, fit: 0.4, label: 'Plant', collide: true },
  { id: 'tree1', model: 'tree_default', x: 1.0, z: 11.5, yaw: 0, fit: 3.0, fitAxis: 'y', label: 'Tree', collide: true, collideR: 0.25 },
  { id: 'tree2', model: 'tree_tall', x: 1.0, z: 16.0, yaw: 20, fit: 3.0, fitAxis: 'y', label: 'Tree', collide: true, collideR: 0.25 },
  { id: 'bush1', model: 'plant_bush', x: 1.8, z: 13.0, yaw: 0, fit: 0.9, label: 'Bush', collide: false },
  { id: 'bush2', model: 'plant_bush', x: 0.6, z: 14.2, yaw: 40, fit: 0.8, label: 'Bush', collide: false },
];

const FLOWERS_PLAN = [];
for (let z = 12.5; z <= 15.5; z += 0.5) {
  FLOWERS_PLAN.push({
    model: ((z * 2) % 1) < 0.5 ? 'flower_redA' : 'flower_purpleA',
    x: 1.2,
    z,
    yaw: z * 40,
    fit: 0.35,
    label: 'Flower',
    collide: false,
  });
}

export const MIRROR_X = PLOT.w;
export const mirrorX = (x) => MIRROR_X - x;

const mirrorRect = (r) => ({ ...r, x0: mirrorX(r.x1), x1: mirrorX(r.x0) });

function mirrorWall(w) {
  const horizontal = Math.abs(w.x1 - w.x0) >= Math.abs(w.z1 - w.z0);
  return {
    ...w,
    x0: mirrorX(w.x0),
    x1: mirrorX(w.x1),
    openings: w.openings?.map((o) =>
      horizontal ? { ...o, start: mirrorX(o.end), end: mirrorX(o.start) } : { ...o },
    ),
  };
}

const mirrorProp = (p) => ({ ...p, x: mirrorX(p.x), yaw: -(p.yaw || 0) });

export const SPAWN = { ...SPAWN_PLAN, x: mirrorX(SPAWN_PLAN.x), yaw: -SPAWN_PLAN.yaw };
export const WALLS = WALLS_PLAN.map(mirrorWall);
export const ROOMS = ROOMS_PLAN.map((room) => ({ ...room, rects: room.rects.map(mirrorRect) }));
export const ROOFS = ROOFS_PLAN.map(mirrorRect);
export const POSTS = POSTS_PLAN.map((p) => ({ ...p, x: mirrorX(p.x) }));
export const FURNITURE = FURNITURE_PLAN.map(mirrorProp);
export const FLOWERS = FLOWERS_PLAN.map(mirrorProp);

export function roomAt(x, z) {
  for (const room of ROOMS) {
    for (const r of room.rects) {
      if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return room.name;
    }
  }
  return 'Outside';
}
