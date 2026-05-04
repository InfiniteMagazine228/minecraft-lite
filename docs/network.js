let ws = new WebSocket("ws://localhost:3000");
let players = {};

ws.onmessage = e => {
  players = JSON.parse(e.data);
};
