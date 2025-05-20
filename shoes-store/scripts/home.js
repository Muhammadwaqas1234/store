const shoes = [
  document.getElementById("shoe1"),
  document.getElementById("shoe2"),
  document.getElementById("shoe3")
];

let orbitRadiusX, orbitRadiusZ, orbitCenterX;
let animationSpeed = 0.002;
let isSmallScreen = false;
let animationFrameId;

function updateOrbitParams() {
  isSmallScreen = window.innerWidth <= 400;

  if (isSmallScreen) {
    orbitRadiusX = 0;
    orbitRadiusZ = 0;
    orbitCenterX = 0;

    // Show only the first shoe
    shoes.forEach((shoe, i) => {
      if (i === 0) {
        shoe.style.setProperty('--tx', `0px`);
        shoe.style.setProperty('--tz', `0px`);
        shoe.style.setProperty('--scale', 1);
        shoe.style.setProperty('--ry', `0deg`);
        shoe.style.setProperty('--opacity', 1);
        shoe.style.display = 'block';
      } else {
        shoe.style.display = 'none';
      }
    });

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    return;
  }

  orbitRadiusX = window.innerWidth <= 600 ? 100 : 250;
  orbitRadiusZ = window.innerWidth <= 600 ? 300 : 600;
  orbitCenterX = window.innerWidth <= 600 ? 70 : 180;

  // Show all shoes
  shoes.forEach(shoe => {
    shoe.style.display = 'block';
  });

  if (!animationFrameId) animate();
}

window.addEventListener('resize', () => {
  updateOrbitParams();
});

let angle = 0;
function animate() {
  if (isSmallScreen) return;

  shoes.forEach((shoe, i) => {
    const shoeAngle = angle + (i * (2 * Math.PI) / shoes.length);
    const x = orbitCenterX + orbitRadiusX * Math.cos(shoeAngle);
    const z = orbitRadiusZ * Math.sin(shoeAngle);

    const norm = (z + orbitRadiusZ) / (2 * orbitRadiusZ);
    const scale = 0.6 + norm * 0.5;
    const opacity = 0.3 + norm * 0.7;
    const rotationY = (norm - 0.5) * 30;

    shoe.style.setProperty('--tx', `${x}px`);
    shoe.style.setProperty('--tz', `${z}px`);
    shoe.style.setProperty('--scale', scale);
    shoe.style.setProperty('--ry', `${rotationY}deg`);
    shoe.style.setProperty('--opacity', opacity.toFixed(2));

    if (z > orbitRadiusZ * 0.5) {
      shoe.dataset.depth = "near";
    } else if (z > 0) {
      shoe.dataset.depth = "mid";
    } else {
      shoe.dataset.depth = "far";
    }
  });

  angle += animationSpeed;
  animationFrameId = requestAnimationFrame(animate);
}

updateOrbitParams(); // Initial call
