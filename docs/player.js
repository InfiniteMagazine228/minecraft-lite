let player = {
    x:0,y:10,z:0,
    vx:0,vy:0,vz:0
};

let keys = {};
let creative = true;

document.addEventListener("keydown",e=>keys[e.code]=true);
document.addEventListener("keyup",e=>keys[e.code]=false);

function updatePlayer(dt){

    let speed = 10;

    if(keys["KeyW"]) player.z -= speed*dt;
    if(keys["KeyS"]) player.z += speed*dt;
    if(keys["KeyA"]) player.x -= speed*dt;
    if(keys["KeyD"]) player.x += speed*dt;

    if(creative){
        if(keys["Space"]) player.y += speed*dt;
        if(keys["ShiftLeft"]) player.y -= speed*dt;
    } else {
        player.vy -= 20*dt;
        player.y += player.vy*dt;
    }

    camera.position.set(player.x,player.y,player.z);
}
