import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { EYE, SPEED, SPRINT } from '../data/layout.js';

export function createControls(camera, canvas, overlay) {
  const controls = new PointerLockControls(camera, canvas);
  const keys = Object.create(null);

  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    controls.lock();
  });
  controls.addEventListener('lock', () => overlay.classList.add('hidden'));
  controls.addEventListener('unlock', () => overlay.classList.remove('hidden'));

  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });
  document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  function poll(dt) {
    if (!controls.isLocked && !overlay.classList.contains('hidden')) return { dx: 0, dz: 0 };
    const sprint = keys.ShiftLeft || keys.ShiftRight;
    const sp = (sprint ? SPRINT : SPEED) * dt;
    let forward = 0;
    let side = 0;
    if (keys.KeyW || keys.ArrowUp) forward += 1;
    if (keys.KeyS || keys.ArrowDown) forward -= 1;
    if (keys.KeyD || keys.ArrowRight) side += 1;
    if (keys.KeyA || keys.ArrowLeft) side -= 1;
    const len = Math.hypot(forward, side) || 1;
    forward = (forward / len) * sp;
    side = (side / len) * sp;
    const x0 = camera.position.x;
    const z0 = camera.position.z;
    controls.moveForward(forward);
    controls.moveRight(side);
    const dx = camera.position.x - x0;
    const dz = camera.position.z - z0;
    camera.position.x = x0;
    camera.position.z = z0;
    return { dx, dz };
  }

  return { controls, poll };
}

export function setSpawn(camera, spawn) {
  camera.position.set(spawn.x, spawn.y, spawn.z);
  camera.rotation.set(0, spawn.yaw, 0);
  camera.position.y = EYE;
}
