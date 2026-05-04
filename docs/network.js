let socket;

function connect(){
    try{
        socket = new WebSocket("ws://localhost:3000");

        socket.onmessage = e=>{
            let msg = JSON.parse(e.data);

            if(msg.type==="player"){
                // demo only
            }
        };
    }catch(e){
        console.log("No server → Singleplayer");
    }
}

function sendPlayer(){
    if(!socket) return;

    socket.send(JSON.stringify({
        type:"player",
        x:player.x,
        y:player.y,
        z:player.z
    }));
}
