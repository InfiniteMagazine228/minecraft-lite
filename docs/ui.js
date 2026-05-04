// ===== FPS UI =====
const fpsDiv = document.createElement("div");
fpsDiv.id = "fps";
fpsDiv.style.position = "fixed";
fpsDiv.style.top = "10px";
fpsDiv.style.left = "10px";
fpsDiv.style.color = "white";
fpsDiv.style.fontFamily = "monospace";
document.body.appendChild(fpsDiv);

// ===== INVENTORY =====
const inventory = document.createElement("div");
inventory.style.position = "fixed";
inventory.style.bottom = "10px";
inventory.style.left = "50%";
inventory.style.transform = "translateX(-50%)";
inventory.style.display = "flex";
inventory.style.gap = "5px";

document.body.appendChild(inventory);

const blocks = ["GRASS", "DIRT", "STONE"];

blocks.forEach(b => {
  const slot = document.createElement("div");
  slot.innerText = b;
  slot.style.padding = "10px";
  slot.style.background = "#333";
  slot.style.color = "white";
  slot.style.cursor = "pointer";

  slot.onclick = () => {
    window.selectedBlock = b;
  };

  inventory.appendChild(slot);
});
