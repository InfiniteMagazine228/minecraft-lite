let noise = (() => {
    function rand(x, y) {
        return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
    }

    function simplex2(x, y) {
        return rand(x, y);
    }

    return { simplex2 };
})();

window.noise = noise;
