const speed = 0.2;
const keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// ===== MOVE =====
function updatePlayer() {
  if (keys["w"]) camera.position.z -= speed;
  if (keys["s"]) camera.position.z += speed;
  if (keys["a"]) camera.position.x -= speed;
  if (keys["d"]) camera.position.x += speed;
}

setInterval(updatePlayer, 16);

// ===== BREAK BLOCK =====
window.addEventListener("mousedown", () => {
  const x = Math.floor(camera.position.x);
  const y = Math.floor(camera.position.y - 1);
  const z = Math.floor(camera.position.z);

  world.breakBlock(x, y, z);
});
