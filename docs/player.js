let keys = {};
let velY = 0;
let onGround = false;

// ===== INPUT =====
function initPlayer(camera){
  document.addEventListener("keydown", e => keys[e.key] = true);
  document.addEventListener("keyup", e => keys[e.key] = false);
}

// ===== MOVE WITH COLLISION =====
function moveWithCollision(dx, dz, camera){

  let newX = camera.position.x + dx;
  let newZ = camera.position.z + dz;

  // check X
  if (!isSolid(newX, camera.position.y - 2, camera.position.z)){
    camera.position.x = newX;
  }

  // check Z
  if (!isSolid(camera.position.x, camera.position.y - 2, newZ)){
    camera.position.z = newZ;
  }
}

// ===== UPDATE PLAYER =====
function updatePlayer(camera){

  const speed = 0.1;

  const forward = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(forward.z, 0, -forward.x);

  if (keys["w"]) moveWithCollision(forward.x*speed, forward.z*speed, camera);
  if (keys["s"]) moveWithCollision(-forward.x*speed, -forward.z*speed, camera);
  if (keys["a"]) moveWithCollision(-right.x*speed, -right.z*speed, camera);
  if (keys["d"]) moveWithCollision(right.x*speed, right.z*speed, camera);

  // ===== GRAVITY =====
  velY -= 0.01;
  let nextY = camera.position.y + velY;

  if (isSolid(camera.position.x, nextY - 2, camera.position.z)){
    velY = 0;
    onGround = true;
  } else {
    camera.position.y = nextY;
    onGround = false;
  }
}

// ===== JUMP =====
document.addEventListener("keydown", e => {
  if (e.code === "Space" && onGround){
    velY = 0.25;
    onGround = false;
  }
});
