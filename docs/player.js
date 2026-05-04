let velocityY = 0;
let onGround = false;

function physics() {
  velocityY -= 0.01;
  camera.position.y += velocityY;

  if (camera.position.y <= 2) {
    camera.position.y = 2;
    velocityY = 0;
    onGround = true;
  }
}
