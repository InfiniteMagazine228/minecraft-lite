let socket = null;
let isConnected = false;
let messageQueue = [];

// ===== CONNECT =====
function connect() {
  socket = const socket = new WebSocket("wss://minecraft-lite-1.onrender.com");

  socket.onopen = () => {
    console.log("✅ Connected to server");
    isConnected = true;

    // gửi queue
    while (messageQueue.length > 0) {
      socket.send(messageQueue.shift());
    }
  };

  socket.onclose = () => {
    console.warn("❌ Disconnected. Reconnecting...");
    isConnected = false;

    setTimeout(connect, 2000); // auto reconnect
  };

  socket.onerror = (e) => {
    console.error("WebSocket error", e);
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "break") {
      if (window.world) {
        world.applyRemoteBreak(data.x, data.y, data.z);
      }
    }
  };
}

connect();

// ===== SAFE SEND =====
function send(data) {
  const msg = JSON.stringify(data);

  if (isConnected && socket.readyState === WebSocket.OPEN) {
    socket.send(msg);
  } else {
    messageQueue.push(msg);
  }
}

// expose global
window.net = {
  send
};
