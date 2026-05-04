let scene, camera, renderer;
let yaw=0, pitch=0;

function initGame(multiplayer=false){

  document.getElementById("menu").style.display="none";
  document.getElementById("crosshair").style.display="block";

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
  camera.position.set(0,10,5);

  renderer = new THREE.WebGLRenderer({antialias:false});
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff,1);
  light.position.set(10,20,10);
  scene.add(light);

  initPlayer(camera);
  initWorld(scene);
  initNetwork(multiplayer);

  document.body.onclick = ()=>document.body.requestPointerLock();

  document.addEventListener("mousemove", e=>{
    if(document.pointerLockElement===document.body){
      yaw -= e.movementX*0.002;
      pitch -= e.movementY*0.002;
      pitch = Math.max(-1.5, Math.min(1.5,pitch));
    }
  });

  animate();
}

function animate(){
  requestAnimationFrame(animate);

  updatePlayer(camera);
  updateWorld(camera.position.x, camera.position.z);

  camera.rotation.order="YXZ";
  camera.rotation.y=yaw;
  camera.rotation.x=pitch;

  updateNetwork(camera);

  renderer.render(scene,camera);
}
