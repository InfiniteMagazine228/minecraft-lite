let chunks = {};
const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 2;

function initWorld(sceneRef){
  scene = sceneRef;
}

function updateWorld(px,pz){
  const cx=Math.floor(px/CHUNK_SIZE);
  const cz=Math.floor(pz/CHUNK_SIZE);

  let needed={};

  for(let x=-RENDER_DISTANCE;x<=RENDER_DISTANCE;x++){
    for(let z=-RENDER_DISTANCE;z<=RENDER_DISTANCE;z++){
      let key=`${cx+x},${cz+z}`;
      needed[key]=true;

      if(!chunks[key]) createChunk(cx+x,cz+z);
    }
  }

  for(let key in chunks){
    if(!needed[key]){
      scene.remove(chunks[key]);
      delete chunks[key];
    }
  }
}
