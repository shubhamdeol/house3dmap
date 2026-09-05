export function createDoorUI(camera, interactions, button, isTouch) {
  const label = button.querySelector('.door-label');
  const key = button.querySelector('kbd');
  let nearby = null;

  if (isTouch) key.hidden = true;

  function toggle() {
    if (nearby) nearby.toggle();
  }

  button.addEventListener('pointerdown', (e) => e.stopPropagation());
  button.addEventListener('click', toggle);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' && !e.repeat && nearby) toggle();
  });

  return {
    update(dt) {
      for (const interaction of interactions) interaction.update(dt);

      nearby = null;
      let nearest = Infinity;
      for (const interaction of interactions) {
        const dx = camera.position.x - interaction.object.position.x;
        const dz = camera.position.z - interaction.object.position.z;
        const distance = Math.hypot(dx, dz);
        if (distance <= interaction.range && distance < nearest) {
          nearby = interaction;
          nearest = distance;
        }
      }

      button.hidden = !nearby;
      if (nearby) {
        label.textContent = nearby.isOpen ? 'Close door' : 'Open door';
        button.setAttribute('aria-label', label.textContent);
      }
    },
  };
}
