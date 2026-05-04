if (!document.getElementById("fps")) {
  const fps = document.createElement("div");
  fps.id = "fps";
  fps.style.position = "fixed";
  fps.style.top = "10px";
  fps.style.left = "10px";
  fps.style.color = "white";
  fps.style.fontFamily = "monospace";
  document.body.appendChild(fps);
}
