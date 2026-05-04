let socket;

try {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => console.log("Connected to server");

  socket.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    world.applyNetworkUpdate(msg);
  };

  socket.onerror = () => {
    console.log("Offline mode");
  };

} catch (e) {
  console.log("No multiplayer");
}

window.socket = socket;
