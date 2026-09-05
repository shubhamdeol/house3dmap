import * as THREE from 'three';

const LOOK_SENS = 0.0042; // radians per pixel dragged
const PITCH_LIMIT = Math.PI / 2 - 0.05;
const STICK_R = 54; // max thumbstick deflection in pixels

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Floating thumbstick on the left half, drag-to-look on the right half —
// two fingers work at once because each pointer is tracked by id.
export function createTouchControls(camera, ui) {
  const { pad, knob, runBtn } = ui;
  const axes = { forward: 0, side: 0, sprint: false };
  const euler = new THREE.Euler(0, 0, 0, 'YXZ');

  let moveId = null;
  let lookId = null;
  let runLock = false;
  let base = { x: 0, y: 0 };
  let lastLook = { x: 0, y: 0 };

  const setKnob = (dx, dy) => {
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const releaseStick = () => {
    moveId = null;
    axes.forward = 0;
    axes.side = 0;
    axes.sprint = false;
    pad.classList.remove('on');
    setKnob(0, 0);
  };

  function onDown(e) {
    if (e.pointerType !== 'touch') return;
    const leftHalf = e.clientX < window.innerWidth * 0.45;
    if (leftHalf && moveId === null) {
      moveId = e.pointerId;
      base = { x: e.clientX, y: e.clientY };
      pad.style.left = `${base.x}px`;
      pad.style.top = `${base.y}px`;
      pad.classList.add('on');
      setKnob(0, 0);
    } else if (lookId === null) {
      lookId = e.pointerId;
      lastLook = { x: e.clientX, y: e.clientY };
    }
  }

  function onMove(e) {
    if (e.pointerType !== 'touch') return;
    if (e.pointerId === moveId) {
      let dx = e.clientX - base.x;
      let dy = e.clientY - base.y;
      const d = Math.hypot(dx, dy);
      if (d > STICK_R) {
        dx = (dx / d) * STICK_R;
        dy = (dy / d) * STICK_R;
      }
      setKnob(dx, dy);
      axes.side = dx / STICK_R;
      axes.forward = -dy / STICK_R;
      // Pushing the stick to the rim breaks into a run, as does the RUN latch.
      axes.sprint = runLock || d > STICK_R * 0.92;
    } else if (e.pointerId === lookId) {
      const dx = e.clientX - lastLook.x;
      const dy = e.clientY - lastLook.y;
      lastLook = { x: e.clientX, y: e.clientY };
      euler.setFromQuaternion(camera.quaternion);
      euler.y -= dx * LOOK_SENS;
      euler.x = clamp(euler.x - dy * LOOK_SENS, -PITCH_LIMIT, PITCH_LIMIT);
      euler.z = 0;
      camera.quaternion.setFromEuler(euler);
    }
  }

  function onUp(e) {
    if (e.pointerId === moveId) releaseStick();
    if (e.pointerId === lookId) lookId = null;
  }

  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onUp, { passive: true });

  runBtn?.addEventListener('click', () => {
    runLock = !runLock;
    runBtn.classList.toggle('on', runLock);
    if (moveId !== null) axes.sprint = runLock;
  });

  return { axes };
}
