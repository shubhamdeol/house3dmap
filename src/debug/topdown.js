import * as THREE from 'three';
import { PLOT } from '../data/layout.js';

export function createTopdown(camera, renderer) {
  const cam = new THREE.OrthographicCamera(-16, 16, 14, -14, 0.1, 80);
  const cx = PLOT.w - (PLOT.w + PLOT.roadW) / 2;
  cam.position.set(cx, 40, PLOT.d / 2);
  cam.up.set(0, 0, 1);
  cam.lookAt(cx, 0, PLOT.d / 2);
  let on = false;
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyT') on = !on;
  });
  return {
    toggle() {
      on = !on;
      return on;
    },
    render(scene) {
      if (!on) return false;
      renderer.render(scene, cam);
      return true;
    },
  };
}
