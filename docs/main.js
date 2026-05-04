showMenu();

function startGame() {
  initThree();
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  physics();
  updateChunks(camera.position.x, camera.position.z);

  renderer.render(scene,camera);
}
