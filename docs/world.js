// ===== CONFIG =====
const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 2;

let chunks = {};
let sceneRef;

// ===== INIT =====
function initWorld(scene){
  sceneRef = scene;
}

// ===== NOISE =====
function noise(x, z){
  return Math.sin(x * 0.05) + Math.cos(z * 0.05);
}

// ===== CREATE CHUNK =====
function createChunk(cx, cz){
  const group = new THREE.Group();

  for (let x=0; x<CHUNK_SIZE; x++){
    for (let z=0; z<CHUNK_SIZE; z++){

      let wx = cx*CHUNK_SIZE + x;
      let wz = cz*CHUNK_SIZE + z;

      let height = Math.floor(noise(wx, wz) * 5);

      for (let y=0; y<=height; y++){
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshLambertMaterial({ color: 0x55aa55 })
        );

        cube.position.set(wx,y,wz);
        group.add(cube);
      }
    }
  }

  sceneRef.add(group);
  chunks[`${cx},${cz}`] = group;
}

// ===== UPDATE WORLD =====
function updateWorld(px, pz){
  const cx = Math.floor(px / CHUNK_SIZE);
  const cz = Math.floor(pz / CHUNK_SIZE);

  let needed = {};

  for (let x=-RENDER_DISTANCE; x<=RENDER_DISTANCE; x++){
    for (let z=-RENDER_DISTANCE; z<=RENDER_DISTANCE; z++){
      let key = `${cx+x},${cz+z}`;
      needed[key] = true;

      if (!chunks[key]) createChunk(cx+x, cz+z);
    }
  }

  // unload chunk
  for (let key in chunks){
    if (!needed[key]){
      sceneRef.remove(chunks[key]);
      delete chunks[key];
    }
  }
}

// ===== COLLISION =====
function isSolid(x, y, z){
  x = Math.floor(x);
  y = Math.floor(y);
  z = Math.floor(z);

  let height = Math.floor(noise(x, z) * 5);

  return y <= height;
}
