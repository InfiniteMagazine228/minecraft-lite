let fps=0,frames=0,last=performance.now();

function updateFPS(){
    frames++;
    let now = performance.now();

    if(now-last>=1000){
        fps=frames;
        frames=0;
        last=now;

        document.getElementById("fps").innerText="FPS: "+fps;
    }
}
