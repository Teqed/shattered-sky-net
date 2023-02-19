<script setup lang="ts">
// Create a variable for the mouse position
let mouse = {
  x: 0,
  y: 0,
};

// Create a variable for the target position
let target = {
  x: 0,
  y: 0,
};

// Create a variable for the lerp
const lerp = 0.075;

// Create a variable for the window size
let windowSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Create a function to update the background position
function updateBackground() {
  // Update the target position
  target.x = mouse.x;
  target.y = mouse.y;

  // Update the background element
  document.documentElement.style.backgroundPosition = `
    ${(target.x / windowSize.width) * 100}%
    ${(target.y / windowSize.height) * 100}%`;
}

// Create a function to animate the background
function animateBackground() {
  // Update the mouse position
  mouse.x += (target.x - mouse.x) * lerp;
  mouse.y += (target.y - mouse.y) * lerp;

  // Update the background position
  updateBackground();

  // Animate the background
  requestAnimationFrame(animateBackground);
}

// Create a function to update the window size
function updateWindowSize() {
  // Update the window size
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;
}

// Create a function to update the mouse position
function updateMousePosition(event: MouseEvent) {
  // Update the mouse position
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

// Create a function to run when the page loads
function initialize() {
  // Add an event listener to update the mouse position
  document.addEventListener("mousemove", updateMousePosition);

  // Add an event listener to update the window size
  window.addEventListener("resize", updateWindowSize);

  // Animate the background
  animateBackground();
}

// Run the initialize function when the page loads
initialize();
</script>
<script lang="ts"></script>
<template>
  <div class="follow-cursor"></div>
</template>
<style scoped></style>
