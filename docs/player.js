let keys = {};
let velY = 0;
let onGround = false;

function initPlayer(camera){
  document.addEventListener("keydown", e=>keys[e.key]=true);
  document.addEventListener("keyup", e=>keys[e.key]=false);
}

function updatePlayer(camera){

  const speed=0.1;

  const forward=new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw));
  const right=new THREE.Vector3(forward.z,0,-forward.x);

  if(keys["w"]) camera.position.add(forward.clone().multiplyScalar(speed));
  if(keys["s"]) camera.position.add(forward.clone().multiplyScalar(-speed));
  if(keys["a"]) camera.position.add(right.clone().multiplyScalar(-speed));
  if(keys["d"]) camera.position.add(right.clone().multiplyScalar(speed));

  // gravity
  velY -= 0.01;
  camera.position.y += velY;

  if(camera.position.y<=2){
    camera.position.y=2;
    velY=0;
    onGround=true;
  }
}

document.addEventListener("keydown", e=>{
  if(e.code==="Space" && onGround){
    velY=0.25;
    onGround=false;
  }
});
