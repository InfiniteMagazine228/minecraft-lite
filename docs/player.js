const keys = {};
const speed = 0.2;

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function playerUpdate() {
  const cam = window.camera;
  if (!cam) return;

  if (keys["w"]) cam.position.z -= speed;
  if (keys["s"]) cam.position.z += speed;
  if (keys["a"]) cam.position.x -= speed;
  if (keys["d"]) cam.position.x += speed;
}

window.playerUpdate = playerUpdate;

// ===== BREAK BLOCK =====
window.addEventListener("mousedown", () => {
  const cam = window.camera;
  if (!cam) return;

  const x = Math.floor(cam.position.x);
  const y = Math.floor(cam.position.y - 1);
  const z = Math.floor(cam.position.z);

  if (window.world) {
    world.breakBlock(x, y, z);
  }
});
