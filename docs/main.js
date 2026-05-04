let scene,camera,renderer;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({
        antialias:false,
        powerPreference:"high-performance"
    });

    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    connect();
}

let last = performance.now();

function animate(){
    let now = performance.now();
    let dt = (now-last)/1000;
    last = now;

    updatePlayer(dt);
    updateWorld(player);
    sendPlayer();
    updateFPS();

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}

init();
animate();
