// ===== CONFIG =====
const CHUNK_SIZE = 16;
const CHUNK_HEIGHT = 32;
const RENDER_DISTANCE = 4;

// ===== STORAGE =====
const chunks = {};
let sceneRef = null;

// ===== INIT =====
function initWorld(scene) {
  sceneRef = scene;
}

// ===== BLOCK TYPE =====
function getBlock(wx, y, wz) {
  const h = Math.floor(noise(wx * 0.05, wz * 0.05) * 10);

  if (y > h) return 0; // air
  if (y === h) return 1; // grass
  return 2; // dirt
}

// ===== GENERATE CHUNK DATA =====
function generateChunkData(cx, cz) {
  const data = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE * CHUNK_HEIGHT);

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let y = 0; y < CHUNK_HEIGHT; y++) {

        const wx = cx * CHUNK_SIZE + x;
        const wz = cz * CHUNK_SIZE + z;

        const block = getBlock(wx, y, wz);

        const i = x + z * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE;
        data[i] = block;
      }
    }
  }

  return data;
}

// ===== BUILD MESH (FACE CULLING) =====
function buildChunkMesh(cx, cz, data) {
  const positions = [];
  const normals = [];
  const colors = [];

  const directions = [
    [ 1, 0, 0], [-1, 0, 0],
    [ 0, 1, 0], [ 0,-1, 0],
    [ 0, 0, 1], [ 0, 0,-1]
  ];

  function get(x, y, z) {
    if (
      x < 0 || z < 0 ||
      x >= CHUNK_SIZE || z >= CHUNK_SIZE ||
      y < 0 || y >= CHUNK_HEIGHT
    ) return 0;

    return data[x + z * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE];
  }

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {

        const block = get(x, y, z);
        if (block === 0) continue;

        const wx = cx * CHUNK_SIZE + x;
        const wz = cz * CHUNK_SIZE + z;

        for (let d = 0; d < directions.length; d++) {
          const [dx, dy, dz] = directions[d];

          if (get(x + dx, y + dy, z + dz) !== 0) continue;

          addFace(wx, y, wz, d, block);
        }
      }
    }
  }

  function addFace(x, y, z, dir, block) {
    const size = 1;

    const faceVertices = [
      // 6 mặt cube
      [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], // +X
      [[0,0,1],[0,1,1],[0,1,0],[0,0,0]], // -X
      [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], // +Y
      [[0,0,0],[1,0,0],[1,0,1],[0,0,1]], // -Y
      [[1,0,1],[1,1,1],[0,1,1],[0,0,1]], // +Z
      [[0,0,0],[0,1,0],[1,1,0],[1,0,0]]  // -Z
    ];

    const normal = directions[dir];

    const verts = faceVertices[dir];

    const color =
      block === 1 ? [0.3, 0.8, 0.3] : // grass
      [0.5, 0.25, 0.1];              // dirt

    const idx = [0,1,2, 0,2,3];

    for (let i of idx) {
      const v = verts[i];

      positions.push(
        x + v[0]*size,
        y + v[1]*size,
        z + v[2]*size
      );

      normals.push(...normal);
      colors.push(...color);
    }
  }

  const geo = new THREE.BufferGeometry();

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });

  const mesh = new THREE.Mesh(geo, mat);
  return mesh;
}

// ===== CREATE CHUNK =====
function createChunk(cx, cz) {
  const key = `${cx},${cz}`;
  if (chunks[key]) return;

  const data = generateChunkData(cx, cz);
  const mesh = buildChunkMesh(cx, cz, data);

  sceneRef.add(mesh);

  chunks[key] = { mesh, data };
}

// ===== REMOVE CHUNK =====
function removeChunk(cx, cz) {
  const key = `${cx},${cz}`;
  const chunk = chunks[key];
  if (!chunk) return;

  sceneRef.remove(chunk.mesh);
  chunk.mesh.geometry.dispose();
  chunk.mesh.material.dispose();

  delete chunks[key];
}

// ===== UPDATE WORLD =====
function updateWorld(player) {
  const pcx = Math.floor(player.position.x / CHUNK_SIZE);
  const pcz = Math.floor(player.position.z / CHUNK_SIZE);

  const needed = new Set();

  for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
    for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {

      const cx = pcx + x;
      const cz = pcz + z;
      const key = `${cx},${cz}`;

      needed.add(key);

      if (!chunks[key]) createChunk(cx, cz);
    }
  }

  for (let key in chunks) {
    if (!needed.has(key)) {
      const [cx, cz] = key.split(',').map(Number);
      removeChunk(cx, cz);
    }
  }
}
