let scene, camera, renderer;
let player = { position: new THREE.Vector3(0,10,0) };

let selectedBlock = 1;

const raycaster = new THREE.Raycaster();

// FPS UI
let fps = 0, frames = 0, last = performance.now();
const fpsDiv = document.createElement("div");
fpsDiv.style.cssText = "position:fixed;top:10px;left:10px;color:#fff;background:#0008;padding:5px;font-family:monospace";
document.body.appendChild(fpsDiv);

function initGame(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,10,5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff,1);
  light.position.set(50,100,50);
  scene.add(light);

  initWorld(scene);

  animate();
}

function animate(){
  requestAnimationFrame(animate);

  // FPS
  frames++;
  let now = performance.now();
  if(now-last>=1000){
    fps = frames;
    frames=0;
    last=now;
    fpsDiv.textContent = "FPS: "+fps;
  }

  updateWorld(player);
  renderer.render(scene,camera);
}

// ===== CREATIVE CONTROLS =====
window.addEventListener("keydown",(e)=>{
  const n = parseInt(e.key);
  if(n>=1 && n<=5){
    selectedBlock = n;
  }
});

// ===== PLACE BLOCK =====
window.addEventListener("mousedown",(e)=>{
  if(e.button!==2) return;

  raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
  const hits = raycaster.intersectObjects(scene.children,true);

  if(hits.length){
    const p = hits[0].point.clone().add(hits[0].face.normal);

    placeBlock(
      Math.floor(p.x),
      Math.floor(p.y),
      Math.floor(p.z),
      selectedBlock
    );
  }
});

initGame();
