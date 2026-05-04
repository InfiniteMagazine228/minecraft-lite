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

  // ===== RENDERER SAFE =====
  if (window.renderer) {
    try {
      window.renderer.dispose();
      document.body.removeChild(window.renderer.domElement);
    } catch (e) {}
  }

  window.renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  // ===== LIGHT =====
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(50, 100, 50);
  scene.add(light);

  // ===== FPS SYSTEM =====
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

  // ===== TIME SYSTEM (QUAN TRỌNG) =====
  let lastTime = performance.now();

  // ===== WORLD UPDATE THROTTLE =====
  let worldTimer = 0;
  const WORLD_UPDATE_RATE = 0.1; // 10 lần / giây

  // ===== LOOP =====
  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // ===== PLAYER =====
    if (window.playerUpdate) {
      window.playerUpdate(camera, delta);
    }

    // ===== WORLD (GIẢM LAG) =====
    worldTimer += delta;
    if (window.world && worldTimer >= WORLD_UPDATE_RATE) {
      world.updateWorld(camera.position);
      worldTimer = 0;
    }

    updateFPS();
    renderer.render(scene, camera);
  }

  animate();

  // ===== RESIZE =====
  window.addEventListener("resize", () => {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
