<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/SiteTitle.vue";
</script>
<script lang="ts">
export default {
  data() {
    return {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      lerp: 0.075,
    };
  },
  computed: {},
  mounted() {
    document.addEventListener("mousemove", this.updateBackground);
    this.animateBackground();
  },
  methods: {
    updateBackground(event: { clientX: number; clientY: number }) {
      this.targetX = event.clientX;
      this.targetY = event.clientY;
    },
    animateBackground() {
      requestAnimationFrame(this.animateBackground);
      this.x += (this.targetX - this.x) * this.lerp;
      this.y += (this.targetY - this.y) * this.lerp;
      document.body.style.backgroundPosition = `
        ${(this.x / window.innerWidth) * 100}%
        ${(this.y / window.innerHeight) * 100}%`;
    },
  },
};
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
      <img
        alt="Site logo"
        class="logo"
        src="@/assets/ss_icon.webp"
        width="125"
        height="125"
      />
    </div>
    <div class="wrapper">
      <HelloWorld msg="Shattered Sky" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <a href="https://files.shatteredsky.net">Books</a>
        <RouterLink to="/tabletop">Tabletop</RouterLink>
        <a href="https://plex.shatteredsky.net">Stream</a>
        <a href="https://mastodon.shatteredsky.net/public">Blog</a>
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

.slide-enter-active {
  animation: fadein 1s ease, slidein-top-10 1s ease-out;
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
  animation: fadein 1s ease, slidein-top 1s ease-out;
}

.logo {
  animation: fadein 1s ease, slidein-top 1s ease-out;
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
  animation: slidein-top 1s ease-out;
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
