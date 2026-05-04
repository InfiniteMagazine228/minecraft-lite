const CHUNK_SIZE = 16;
const CHUNK_HEIGHT = 32;
const RENDER_DISTANCE = 3;

const chunks = {};
let sceneRef = null;

function initWorld(scene) {
  sceneRef = scene;
}

function getBlock(wx, y, wz) {
  const h = Math.floor(noise(wx * 0.03, wz * 0.03) * 6);

  if (y > h) return 0;
  if (y === h) return 1;
  return 2;
}

function generateChunkData(cx, cz) {
  const data = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE * CHUNK_HEIGHT);

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        const wx = cx * CHUNK_SIZE + x;
        const wz = cz * CHUNK_SIZE + z;

        const i = x + z * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE;
        data[i] = getBlock(wx, y, wz);
      }
    }
  }

  return data;
}

function buildChunkMesh(cx, cz, data) {
  const positions = [];
  const normals = [];
  const colors = [];

  const dirs = [
    [1,0,0],[-1,0,0],
    [0,1,0],[0,-1,0],
    [0,0,1],[0,0,-1]
  ];

  function get(x,y,z){
    if(x<0||z<0||x>=CHUNK_SIZE||z>=CHUNK_SIZE||y<0||y>=CHUNK_HEIGHT) return 0;
    return data[x + z*CHUNK_SIZE + y*CHUNK_SIZE*CHUNK_SIZE];
  }

  const faces = [
    [[1,0,0],[1,1,0],[1,1,1],[1,0,1]],
    [[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
    [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],
    [[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
    [[1,0,1],[1,1,1],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
  ];

  function addFace(x,y,z,dir,block){
    const verts = faces[dir];
    const normal = dirs[dir];

    const color = block===1 ? [0.3,0.8,0.3] : [0.5,0.25,0.1];
    const idx = [0,1,2, 0,2,3];

    for(let i of idx){
      const v = verts[i];

      positions.push(x+v[0], y+v[1], z+v[2]);
      normals.push(...normal);
      colors.push(...color);
    }
  }

  for(let x=0;x<CHUNK_SIZE;x++){
    for(let y=0;y<CHUNK_HEIGHT;y++){
      for(let z=0;z<CHUNK_SIZE;z++){

        const block = get(x,y,z);
        if(block===0) continue;

        const wx = cx*CHUNK_SIZE + x;
        const wz = cz*CHUNK_SIZE + z;

        for(let d=0;d<6;d++){
          const [dx,dy,dz] = dirs[d];
          if(get(x+dx,y+dy,z+dz)!==0) continue;

          addFace(wx,y,wz,d,block);
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals,3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));

  const mat = new THREE.MeshLambertMaterial({ vertexColors:true });

  return new THREE.Mesh(geo, mat);
}

function createChunk(cx,cz){
  const key = `${cx},${cz}`;
  if(chunks[key]) return;

  const data = generateChunkData(cx,cz);
  const mesh = buildChunkMesh(cx,cz,data);

  sceneRef.add(mesh);
  chunks[key] = { mesh, data };
}

function removeChunk(cx,cz){
  const key = `${cx},${cz}`;
  const c = chunks[key];
  if(!c) return;

  sceneRef.remove(c.mesh);
  c.mesh.geometry.dispose();
  c.mesh.material.dispose();
  delete chunks[key];
}

function updateWorld(player){
  const pcx = Math.floor(player.position.x / CHUNK_SIZE);
  const pcz = Math.floor(player.position.z / CHUNK_SIZE);

  const needed = new Set();

  for(let x=-RENDER_DISTANCE;x<=RENDER_DISTANCE;x++){
    for(let z=-RENDER_DISTANCE;z<=RENDER_DISTANCE;z++){
      const cx = pcx + x;
      const cz = pcz + z;
      const key = `${cx},${cz}`;

      needed.add(key);
      if(!chunks[key]) createChunk(cx,cz);
    }
  }

  for(let key in chunks){
    if(!needed.has(key)){
      const [cx,cz] = key.split(',').map(Number);
      removeChunk(cx,cz);
    }
  }
}

// ===== PLACE BLOCK =====
function placeBlock(x,y,z,type){
  const cx = Math.floor(x / CHUNK_SIZE);
  const cz = Math.floor(z / CHUNK_SIZE);

  const chunk = chunks[`${cx},${cz}`];
  if(!chunk) return;

  const lx = x - cx*CHUNK_SIZE;
  const lz = z - cz*CHUNK_SIZE;

  const i = lx + lz*CHUNK_SIZE + y*CHUNK_SIZE*CHUNK_SIZE;
  chunk.data[i] = type;

  sceneRef.remove(chunk.mesh);
  chunk.mesh.geometry.dispose();

  chunk.mesh = buildChunkMesh(cx,cz,chunk.data);
  sceneRef.add(chunk.mesh);
}
