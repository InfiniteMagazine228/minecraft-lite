const CHUNK_SIZE = 16;
const HEIGHT = 32;
const DIST = 4;

let chunks = new Map();
let queue = [];

function key(x,z){ return x+","+z; }

function getHeight(x,z){
    return Math.floor((noise.simplex2(x/20,z/20)+1)*5+5);
}

function gen(cx,cz){
    const geo = new THREE.BoxGeometry(1,1,1);
    const mat = new THREE.MeshBasicMaterial({color:0x55aa55});
    const mesh = new THREE.InstancedMesh(geo,mat,2000);

    let i=0;
    const m = new THREE.Matrix4();

    for(let x=0;x<CHUNK_SIZE;x++){
        for(let z=0;z<CHUNK_SIZE;z++){
            let h = getHeight(cx*16+x,cz*16+z);

            for(let y=0;y<h;y++){
                m.setPosition(cx*16+x,y,cz*16+z);
                mesh.setMatrixAt(i++,m);
            }
        }
    }

    mesh.count = i;
    scene.add(mesh);

    return mesh;
}

function updateWorld(player){
    let cx = Math.floor(player.x/CHUNK_SIZE);
    let cz = Math.floor(player.z/CHUNK_SIZE);

    for(let x=-DIST;x<=DIST;x++){
        for(let z=-DIST;z<=DIST;z++){
            let k = key(cx+x,cz+z);

            if(!chunks.has(k)){
                chunks.set(k,"loading");
                queue.push({x:cx+x,z:cz+z});
            }
        }
    }

    for(let i=0;i<2;i++){
        let job = queue.shift();
        if(!job) break;

        chunks.set(key(job.x,job.z), gen(job.x,job.z));
    }
}
