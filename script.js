const heading = document.getElementById('heading');
const pitch = document.getElementById('pitch');
const roll = document.getElementById('roll');
const height = document.getElementById('height');

const headingVal = document.getElementById('headingVal');
const pitchVal = document.getElementById('pitchVal');
const rollVal = document.getElementById('rollVal');
const heightVal = document.getElementById('heightVal');

const camera = document.getElementById('camera-emoji');

function updateCamera() {
  // Heading: rotate around Z axis (CSS rotate)
  // Pitch: simulate by skewing Y (not exact, but gives some effect)
  // Roll: rotate around X (simulate by skewX for 2D)
  // Height: move up/down

  const h = parseInt(heading.value);
  const p = parseInt(pitch.value);
  const r = parseInt(roll.value);
  const hei = parseInt(height.value);

  headingVal.textContent = h;
  pitchVal.textContent = p;
  rollVal.textContent = r;
  heightVal.textContent = hei;

  // Compose transform: heading (rotate), pitch (skewX), roll (skewY)
  camera.style.transform =
    `translateX(-50%) ` +
    `rotate(${h}deg) ` +
    `skewX(${-p/2}deg) ` +
    `skewY(${r/3}deg)`;

  // Move camera up/down
  camera.style.bottom = `${hei}px`;
}

// Add event listeners
[heading, pitch, roll, height].forEach(input => {
  input.addEventListener('input', updateCamera);
});

// Initial render
updateCamera();