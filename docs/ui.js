function showMenu() {
  document.body.innerHTML = `
    <h1>Minecraft Lite</h1>
    <button onclick="startSingle()">Singleplayer</button>
    <button onclick="startMulti()">Multiplayer</button>
  `;
}

function startSingle() {
  location.reload();
}

function startMulti() {
  location.reload();
}
