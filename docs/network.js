try {
  const socket = new WebSocket("ws://localhost:3000");

  socket.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (window.world) {
      world.applyNetworkUpdate(msg);
    }
  };

  window.socket = socket;

} catch {
  console.log("Offline mode");
}
