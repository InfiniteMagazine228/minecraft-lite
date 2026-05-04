// SIMPLEX NOISE (FAST + GLOBAL SAFE)
let noise = (() => {
    const perm = new Uint8Array(512);
    const gradP = new Array(512);

    const grad3 = [
        [1,1],[ -1,1],[1,-1],[-1,-1],
        [1,0],[-1,0],[1,0],[-1,0],
        [0,1],[0,-1],[0,1],[0,-1]
    ];

    function seed(seed) {
        function random() {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        }

        for (let i = 0; i < 256; i++) {
            perm[i] = perm[i + 256] = Math.floor(random() * 256);
            gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
        }
    }

    function simplex2(xin, yin) {
        let n0, n1, n2;
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;

        let s = (xin + yin) * F2;
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);

        let t = (i + j) * G2;
        let X0 = i - t;
        let Y0 = j - t;

        let x0 = xin - X0;
        let y0 = yin - Y0;

        let i1, j1 = x0 > y0 ? (i1 = 1, 0) : (i1 = 0, 1);

        let x1 = x0 - i1 + G2;
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2 * G2;
        let y2 = y0 - 1 + 2 * G2;

        i &= 255;
        j &= 255;

        let gi0 = gradP[i + perm[j]];
        let gi1 = gradP[i + i1 + perm[j + j1]];
        let gi2 = gradP[i + 1 + perm[j + 1]];

        function tcalc(t, gx, gy, x, y) {
            if (t < 0) return 0;
            t *= t;
            return t * t * (gx * x + gy * y);
        }

        n0 = tcalc(0.5 - x0*x0 - y0*y0, gi0[0], gi0[1], x0, y0);
        n1 = tcalc(0.5 - x1*x1 - y1*y1, gi1[0], gi1[1], x1, y1);
        n2 = tcalc(0.5 - x2*x2 - y2*y2, gi2[0], gi2[1], x2, y2);

        return 70 * (n0 + n1 + n2);
    }

    seed(1234);

    return { simplex2, seed };
})();

window.noise = noise;
