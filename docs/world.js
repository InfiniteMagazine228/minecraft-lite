const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 2;

let chunks = {};

function getBiome(x, z) {
  let h = perlin(x, z);

  if (h > 1) return "stone";
  if (h > 0) return "grass";
  return "desert";
}

function createTree(x, y, z, group) {
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(1,2,1),
    new THREE.MeshLambertMaterial({ color: 0x8B4513 })
  );
  trunk.position.set(x,y+1,z);
  group.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshLambertMaterial({ color: 0x228B22 })
  );
  leaves.position.set(x,y+3,z);
  group.add(leaves);
}

function createChunk(cx, cz) {
  const group = new THREE.Group();

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {

      let wx = cx*CHUNK_SIZE + x;
      let wz = cz*CHUNK_SIZE + z;

      let height = Math.floor(perlin(wx, wz) * 3);

      let biome = getBiome(wx, wz);

      for (let y=0;y<=height;y++) {
        let color =
          biome === "grass" ? 0x55aa55 :
          biome === "desert" ? 0xC2B280 :
          0x888888;

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshLambertMaterial({ color })
        );

        cube.position.set(wx,y,wz);
        group.add(cube);
      }

      // random tree
      if (Math.random() < 0.05 && biome==="grass") {
        createTree(wx,height,wz,group);
      }
    }
  }

  scene.add(group);
  chunks[`${cx},${cz}`] = group;
}

function updateChunks(px, pz) {
  const cx = Math.floor(px / CHUNK_SIZE);
  const cz = Math.floor(pz / CHUNK_SIZE);

  let needed = {};

  for (let x=-RENDER_DISTANCE;x<=RENDER_DISTANCE;x++) {
    for (let z=-RENDER_DISTANCE;z<=RENDER_DISTANCE;z++) {
      let key = `${cx+x},${cz+z}`;
      needed[key] = true;

      if (!chunks[key]) createChunk(cx+x,cz+z);
    }
  }

  for (let key in chunks) {
    if (!needed[key]) {
      scene.remove(chunks[key]);
      delete chunks[key];
    }
  }
}
