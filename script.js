const heading = document.getElementById('heading');
const pitch = document.getElementById('pitch');
const roll = document.getElementById('roll');
const height = document.getElementById('height');

const camera = document.getElementById('camera-emoji');
const fieldOfView = document.getElementById('field-of-view');

function updateCamera() {
  // Heading: rotate around Z axis (CSS rotate)
  // Pitch: simulate by skewing Y (not exact, but gives some effect)
  // Roll: rotate around X (simulate by skewX for 2D)
  // Height: move up/down

  const h = parseInt(heading.value);
  const p = parseInt(pitch.value);
  const r = parseInt(roll.value);
  const hei = parseInt(height.value);

  // Calculate camera center position in scene coordinates
  const sceneCenterX = 60; // 10% of 600px scene width (camera position)
  const sceneCenterY = 300 - hei; // Scene height (400px) - ground (60px) - height - 10 units upward

  // Compose transform: heading (rotate), pitch (skewX), roll (skewY)
  // Set transform origin to camera center for proper rotation
  camera.style.transformOrigin = 'center center';
  camera.style.transform =
    `translateX(-50%) ` +
    `rotate(${h}deg) ` +
    `skewX(${-p/2}deg) ` +
    `skewY(${r/3}deg)`;

  // Move camera up/down (60px accounts for ground height)
  camera.style.bottom = `${60 + hei}px`;

  // Update field of view to match camera rotation and height
  updateFieldOfView(h, hei, sceneCenterX, sceneCenterY);
}

function updateFieldOfView(heading, height, cameraCenterX, cameraCenterY) {
  // Field of view angle (about 60 degrees total, 30 degrees each side)
  const fovAngle = 30; // degrees from center line
  const lineLength = 2000; // Very long lines to extend far beyond any visible area
  
  // Convert heading to radians and calculate rotated field of view angles
  const headingRad = heading * Math.PI / 180;
  const angleTop = headingRad - fovAngle * Math.PI / 180; // Top line angle
  const angleBottom = headingRad + fovAngle * Math.PI / 180; // Bottom line angle
  
  // Calculate end points for rotated field of view lines
  const endXTop = cameraCenterX + Math.cos(angleTop) * lineLength;
  const endYTop = cameraCenterY + Math.sin(angleTop) * lineLength;
  const endXBottom = cameraCenterX + Math.cos(angleBottom) * lineLength;
  const endYBottom = cameraCenterY + Math.sin(angleBottom) * lineLength;
  
  // Remove any transform from field of view container - let SVG clipping handle it
  fieldOfView.style.transform = 'none';
  
  // Update the SVG elements with mathematically rotated coordinates
  const fovArea = document.getElementById('fov-area');
  const fovLineTop = document.getElementById('fov-line-top');
  const fovLineBottom = document.getElementById('fov-line-bottom');
  
  // Update polygon points for the field of view area (large triangle from camera center)
  fovArea.setAttribute('points', `${cameraCenterX},${cameraCenterY} ${endXTop},${endYTop} ${endXBottom},${endYBottom}`);
  
  // Update line positions (from camera center extending far beyond visible area)
  fovLineTop.setAttribute('x1', cameraCenterX);
  fovLineTop.setAttribute('y1', cameraCenterY);
  fovLineTop.setAttribute('x2', endXTop);
  fovLineTop.setAttribute('y2', endYTop);
  
  fovLineBottom.setAttribute('x1', cameraCenterX);
  fovLineBottom.setAttribute('y1', cameraCenterY);
  fovLineBottom.setAttribute('x2', endXBottom);
  fovLineBottom.setAttribute('y2', endYBottom);
}

function changeValue(controlId, delta) {
  const input = document.getElementById(controlId);
  let newValue = parseInt(input.value) + delta;
  
  // Respect min/max constraints
  if (newValue < parseInt(input.min)) newValue = parseInt(input.min);
  if (newValue > parseInt(input.max)) newValue = parseInt(input.max);
  
  input.value = newValue;
  updateCamera();
}

// Add event listeners for number inputs
[heading, pitch, roll, height].forEach(input => {
  input.addEventListener('input', updateCamera);
});

// Initial render
updateCamera();