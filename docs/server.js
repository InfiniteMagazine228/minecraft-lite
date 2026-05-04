const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port: PORT });

console.log("✅ WS running on port", PORT);

wss.on("connection", (ws) => {
  console.log("👤 Client connected");

  ws.on("message", (msg) => {
    // broadcast cho tất cả client khác
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
