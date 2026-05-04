// ===== ANTI LOAD 2 LẦN =====
if (window.__game_init__) {
  console.warn("Game already initialized");
} else {
  window.__game_init__ = true;

  // ===== GLOBAL =====
  window.game = {};
  window.scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  window.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 20, 0);

  window.renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(50, 100, 50);
  scene.add(light);

  // ===== FPS SAFE =====
  window.fpsData = {
    fps: 0,
    frames: 0,
    last: performance.now()
  };

  function updateFPS() {
    const f = window.fpsData;
    f.frames++;

    const now = performance.now();
    if (now - f.last >= 1000) {
      f.fps = f.frames;
      f.frames = 0;
      f.last = now;

      const el = document.getElementById("fps");
      if (el) el.innerText = "FPS: " + f.fps;
    }
  }

  // ===== LOOP =====
  function animate() {
    requestAnimationFrame(animate);

    if (window.playerUpdate) window.playerUpdate();

    if (window.world && window.camera) {
      world.updateWorld(camera.position);
    }

    updateFPS();
    renderer.render(scene, camera);
  }

  animate();

  // ===== RESIZE =====
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
