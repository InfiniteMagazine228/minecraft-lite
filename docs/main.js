// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// ===== RENDERER (ONLY ONE) =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== LIGHT =====
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// ===== PLAYER INIT =====
camera.position.set(0, 20, 0);

// ===== FPS =====
let fps = 0, frames = 0, last = performance.now();

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);

  // Update world
  world.updateWorld(camera.position);

  // FPS
  frames++;
  const now = performance.now();
  if (now - last >= 1000) {
    fps = frames;
    frames = 0;
    last = now;
    document.getElementById("fps").innerText = "FPS: " + fps;
  }

  renderer.render(scene, camera);
}

animate();

// ===== RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
