// SIMPLE NOISE FALLBACK
class SimpleNoise {
  noise2D(x, z) {
    return Math.sin(x * 12.9898 + z * 78.233) * 43758.5453 % 1;
  }
}

window.noise = new SimpleNoise();
