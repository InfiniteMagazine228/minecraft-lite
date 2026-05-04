let ws;
let players = {};

function initNetwork(enable){
  if(!enable) return;

  ws = new WebSocket("ws://localhost:3000");

  ws.onmessage = e=>{
    players = JSON.parse(e.data);
  };
}

function updateNetwork(camera){
  if(ws && ws.readyState===1){
    ws.send(JSON.stringify(camera.position));
  }
}
