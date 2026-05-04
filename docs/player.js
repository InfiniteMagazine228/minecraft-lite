let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

const speed = 5;
const gravity = 20;

let player = {
    onGround: false
};

function updatePlayer(camera, delta) {
    if (!camera) return;

    // WASD movement
    direction.set(0, 0, 0);

    if (keys["w"]) direction.z -= 1;
    if (keys["s"]) direction.z += 1;
    if (keys["a"]) direction.x -= 1;
    if (keys["d"]) direction.x += 1;

    direction.normalize();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    let move = new THREE.Vector3();
    move.addScaledVector(forward, direction.z);
    move.addScaledVector(right, direction.x);

    camera.position.addScaledVector(move, speed * delta);

    // Gravity
    velocity.y -= gravity * delta;
    camera.position.y += velocity.y * delta;

    if (camera.position.y < 2) {
        camera.position.y = 2;
        velocity.y = 0;
        player.onGround = true;
    }

    // Jump
    if (keys[" "] && player.onGround) {
        velocity.y = 8;
        player.onGround = false;
    }
}
