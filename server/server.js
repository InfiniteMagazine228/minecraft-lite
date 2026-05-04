const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

let players = {};

wss.on("connection", ws => {
  const id = Math.random().toString(36).substr(2,5);
  players[id] = { x:0, y:2, z:0 };

  ws.on("message", msg => {
    players[id] = JSON.parse(msg);
  });

  ws.on("close", () => delete players[id]);

  setInterval(() => {
    ws.send(JSON.stringify(players));
  }, 50);
});

console.log("Server running on ws://localhost:3000");
