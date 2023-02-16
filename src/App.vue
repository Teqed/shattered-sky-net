<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import SiteTitle from "./components/SiteTitle.vue";
</script>
<script lang="ts">
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
  document.body.style.backgroundPosition = `
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

<template>
  <header>
    <div class="logo-container">
      <img
        alt="Site logo blur"
        class="logo-blur"
        src="@/assets/ss_icon.webp"
        width="125"
        height="125"
      />
      <RouterLink to="/" class="logo-link">
        <img
          alt="Site logo"
          class="logo"
          src="@/assets/ss_icon.webp"
          width="125"
          height="125"
        />
      </RouterLink>
    </div>
    <div class="wrapper">
      <!-- Site title -->
      <SiteTitle msg="Shattered Sky" />

      <!-- Navigation links -->
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/files">Files</RouterLink>
        <RouterLink to="/tabletop">Tabletop</RouterLink>
        <!-- <RouterLink to="/games">Games</RouterLink> -->
        <RouterLink to="/stream">Stream</RouterLink>
        <RouterLink to="/blog">Social</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <br />
  <RouterView v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </transition>
  </RouterView>
</template>

<style scoped>
.logo-container {
  display: flex;
  margin: 0 2rem 2rem;
  position: sticky;
  float: left;
}

.logo-blur {
  filter: blur(10px);
  position: absolute;
  opacity: 0.1;
  transition: opacity 0.5s ease-in-out;
}

.logo-container:hover .logo-blur {
  opacity: 0.6;
}

.logo-link {
  text-decoration: none;
  background-color: transparent;
}

.slide-enter-active {
  animation: fadein 0.5s ease, slidein-top-10 0.5s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  filter: blur(20px);
  opacity: 0;
}

header {
  line-height: 1.5;
  min-height: 10vh;
  display: flex;
  place-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

header .wrapper {
  animation: fadein 0.5s ease-out, slidein-top 1s ease-out;
}

.logo {
  animation: fadein 0.5s ease-out, slidein-top 1s ease-out;
  justify-self: center;
}

nav {
  margin: auto;
  box-sizing: content-box;
  content: "";
  clear: both;
  display: table;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;

  /* Box */
  padding: 0.4rem 0.6rem;
  background: rgb(71 71 71 / 40.4%);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
  backdrop-filter: saturate(180%) blur(20px);
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgb(121 121 121 / 51%);
  transition: box-shadow 0.5s ease-in-out;
}

nav:hover {
  box-shadow: 0 4px 30px rgb(121 121 121 / 25%);
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

@media (hover: hover) {
  nav a:hover {
    text-decoration: none;
    background-color: hsl(189deg 65% 21% / 0%);
  }
}

nav a:first-of-type {
  border: 0;
}

/* @mixin for-phone-only { */
@media (max-width: 599px) {
  /* Empty */
}

/* @mixin for-tablet-portrait-up { */
@media (min-width: 600px) {
  nav {
    margin-left: -1rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
}

/* @mixin for-tablet-landscape-up { */
@media (min-width: 900px) {
  /* Empty */
}

/* @mixin for-desktop-up { */
@media (min-width: 1200px) {
  /* Empty */
}

/* @mixin for-med-desktop-up { */
@media (min-width: 1800px) {
  /* Empty */
}

/* @mixin for-big-desktop-up { */
@media (min-width: 1921px) {
  /* Empty */
}
</style>
