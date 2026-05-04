// GLOBAL (tránh trùng biến)
window.game = {};

// ===== SCENE =====
const scene = new THREE.Scene();
window.scene = scene;

scene.background = new THREE.Color(0x87ceeb);

// ===== CAMERA (GLOBAL) =====
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
window.camera = camera;

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== LIGHT =====
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// ===== START POS =====
camera.position.set(0, 20, 0);

// ===== FPS (ONLY HERE) =====
let fps = 0;
let frames = 0;
let last = performance.now();

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);

  if (window.playerUpdate) playerUpdate();

  world.updateWorld(camera.position);

  // FPS
  frames++;
  const now = performance.now();
  if (now - last >= 1000) {
    fps = frames;
    frames = 0;
    last = now;

    const el = document.getElementById("fps");
    if (el) el.innerText = "FPS: " + fps;
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
