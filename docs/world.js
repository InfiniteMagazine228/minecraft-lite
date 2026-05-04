const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 32;
const chunks = new Map();

const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3
};

// ===== NOISE SAFE =====
function getNoise(x, z) {
  if (!window.noise) return 0;
  return noise.noise2D(x * 0.05, z * 0.05);
}

// ===== TERRAIN =====
function getHeight(x, z) {
  return Math.floor((getNoise(x, z) + 1) * 10 + 5);
}

function getBlock(x, y, z) {
  const h = getHeight(x, z);

  if (y > h) return BLOCK.AIR;
  if (y === h) return BLOCK.GRASS;
  if (y > h - 3) return BLOCK.DIRT;
  return BLOCK.STONE;
}

// ===== CHUNK DATA =====
function generateChunkData(cx, cz) {
  const data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);

  let i = 0;
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        data[i++] = getBlock(
          cx * CHUNK_SIZE + x,
          y,
          cz * CHUNK_SIZE + z
        );
      }
    }
  }
  return data;
}

// ===== GREEDY MESHING =====
function buildMesh(data, cx, cz) {
  const geo = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  let index = 0;

  function pushFace(x, y, z) {
    const size = 1;

    vertices.push(
      x, y, z,
      x+size, y, z,
      x+size, y+size, z,
      x, y+size, z
    );

    indices.push(
      index, index+1, index+2,
      index, index+2, index+3
    );

    index += 4;
  }

  let i = 0;
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {

        const block = data[i++];
        if (block === BLOCK.AIR) continue;

        pushFace(
          cx * CHUNK_SIZE + x,
          y,
          cz * CHUNK_SIZE + z
        );
      }
    }
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({ color: 0x88cc88 });
  return new THREE.Mesh(geo, mat);
}

// ===== CREATE CHUNK =====
function createChunk(cx, cz) {
  const key = cx + "," + cz;
  if (chunks.has(key)) return;

  const data = generateChunkData(cx, cz);
  const mesh = buildMesh(data, cx, cz);

  scene.add(mesh);

  chunks.set(key, {
    data,
    mesh,
    cx,
    cz
  });
}

// ===== WORLD UPDATE =====
function updateWorld(player) {
  const cx = Math.floor(player.x / CHUNK_SIZE);
  const cz = Math.floor(player.z / CHUNK_SIZE);

  const RENDER_DIST = 2;

  for (let x = -RENDER_DIST; x <= RENDER_DIST; x++) {
    for (let z = -RENDER_DIST; z <= RENDER_DIST; z++) {
      createChunk(cx + x, cz + z);
    }
  }
}

// ===== BREAK BLOCK =====
function breakBlock(x, y, z) {
  const cx = Math.floor(x / CHUNK_SIZE);
  const cz = Math.floor(z / CHUNK_SIZE);
  const key = cx + "," + cz;

  const chunk = chunks.get(key);
  if (!chunk) return;

  const lx = x % CHUNK_SIZE;
  const lz = z % CHUNK_SIZE;

  const index =
    lx * CHUNK_SIZE * WORLD_HEIGHT +
    lz * WORLD_HEIGHT +
    y;

  chunk.data[index] = BLOCK.AIR;

  scene.remove(chunk.mesh);
  chunk.mesh = buildMesh(chunk.data, cx, cz);
  scene.add(chunk.mesh);

  // ===== MULTIPLAYER SYNC =====
  if (window.socket) {
    socket.send(JSON.stringify({
      type: "break",
      x, y, z
    }));
  }
}

// ===== MULTIPLAYER RECEIVE =====
function applyNetworkUpdate(msg) {
  if (msg.type === "break") {
    breakBlock(msg.x, msg.y, msg.z);
  }
}

// EXPORT
window.world = {
  updateWorld,
  breakBlock,
  applyNetworkUpdate
};
