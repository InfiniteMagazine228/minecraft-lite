const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// block
const geometry = new THREE.BoxGeometry(1,1,1);

const materials = {
  grass: new THREE.MeshLambertMaterial({ color: 0x55aa55 }),
  stone: new THREE.MeshLambertMaterial({ color: 0x888888 }),
  dirt: new THREE.MeshLambertMaterial({ color: 0x8B4513 })
};

// ===== CHUNK SYSTEM =====
const CHUNK_SIZE = 16;
let chunks = {};
let blocks = [];

function createChunk(cx, cz) {
  const group = new THREE.Group();

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      const cube = new THREE.Mesh(geometry, materials.grass);

      cube.position.set(
        cx * CHUNK_SIZE + x,
        0,
        cz * CHUNK_SIZE + z
      );

      group.add(cube);
      blocks.push(cube);
    }
  }

  scene.add(group);
  chunks[`${cx},${cz}`] = group;
}

function updateChunks(px, pz) {
  const cx = Math.floor(px / CHUNK_SIZE);
  const cz = Math.floor(pz / CHUNK_SIZE);

  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      const key = `${cx+x},${cz+z}`;
      if (!chunks[key]) createChunk(cx+x, cz+z);
    }
  }
}

// ===== PLAYER =====
camera.position.set(0, 2, 5);

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// mouse
document.body.onclick = () => document.body.requestPointerLock();

let yaw = 0, pitch = 0;

document.addEventListener("mousemove", e => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
  }
});

// ===== GRAVITY =====
let velocityY = 0;
let onGround = false;

function physics() {
  velocityY -= 0.01;
  camera.position.y += velocityY;

  if (camera.position.y <= 2) {
    camera.position.y = 2;
    velocityY = 0;
    onGround = true;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && onGround) {
    velocityY = 0.2;
    onGround = false;
  }
});

// ===== INVENTORY =====
let inventory = ["grass","stone","dirt"];
let selected = 0;

document.addEventListener("keydown", e => {
  if (e.key >= "1" && e.key <= "3") {
    selected = parseInt(e.key) - 1;
    console.log("Selected:", inventory[selected]);
  }
});

// ===== BUILD / BREAK =====
const raycaster = new THREE.Raycaster();

document.addEventListener("mousedown", e => {
  raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
  const hit = raycaster.intersectObjects(blocks);

  if (hit.length > 0) {
    const block = hit[0].object;

    if (e.button === 0) {
      scene.remove(block);
      blocks = blocks.filter(b => b !== block);
    }

    if (e.button === 2) {
      const pos = hit[0].point.clone().add(hit[0].face.normal);
      const cube = new THREE.Mesh(
        geometry,
        materials[inventory[selected]]
      );
      cube.position.copy(pos).floor();
      scene.add(cube);
      blocks.push(cube);
    }
  }
});

// ===== MULTIPLAYER =====
const ws = new WebSocket("ws://localhost:3000");
let others = {};

ws.onmessage = e => {
  others = JSON.parse(e.data);
};

// ===== UPDATE =====
function update() {
  const speed = 0.1;

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(forward.z, 0, -forward.x);

  if (keys["w"]) camera.position.add(forward.clone().multiplyScalar(speed));
  if (keys["s"]) camera.position.add(forward.clone().multiplyScalar(-speed));
  if (keys["a"]) camera.position.add(right.clone().multiplyScalar(-speed));
  if (keys["d"]) camera.position.add(right.clone().multiplyScalar(speed));

  physics();
  updateChunks(camera.position.x, camera.position.z);

  ws.send(JSON.stringify(camera.position));
}

// ===== RENDER =====
function animate() {
  requestAnimationFrame(animate);

  update();

  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  renderer.render(scene, camera);
}
animate();
