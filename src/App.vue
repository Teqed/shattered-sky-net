<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
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
  /* display: block; */
}
.logo-blur {
  filter: blur(10px);
  position: absolute;
  /* top: 0; */
  /* left: 0; */
  opacity: 0.1;
  transition: opacity 0.5s ease-in-out;
}

.logo-container:hover .logo-blur {
  opacity: 0.6;
}
.slide-enter-active {
  animation: fadein 1s ease, slidein_top_10 1s ease-out;
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
  /* padding-right: calc(var(--section-gap) / 2); */
  /* place-items: flex-start; */
  flex-wrap: wrap;
  justify-content: center;
}

header .wrapper {
  animation: fadein 1s ease, slidein_top 1s ease-out;
}

.logo {
  animation: fadein 1s ease, slidein_top 1s ease-out;
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
  /* Addition */
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 0rem;
  /* padding-right: 1rem; */
  background: rgba(71, 71, 71, 0.404);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(121, 121, 121, 0.1);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(121, 121, 121, 0.51);
  animation: slidein_top 1s ease-out;
  transition: box-shadow 0.5s ease-in-out;
}

nav:hover {
  box-shadow: 0 4px 30px rgba(121, 121, 121, 0.25);
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

nav a:first-of-type {
  border: 0;
}

.about-tile {
  min-height: 7vh;
  display: flex;
  align-items: center;
}
.tile {
  width: 55vw;
  /* Addition */
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  background: rgba(71, 71, 71, 0.404);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(121, 121, 121, 0.1);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  border: 1px solid rgba(121, 121, 121, 0.51);
  transition: box-shadow 0.3s ease-in-out;
}
.tile:hover {
  box-shadow: 0 4px 30px rgba(121, 121, 121, 0.25);
}
/* @mixin for-phone-only { */
@media (max-width: 599px) {
  .tile {
    width: 85vw;
  }
}
/* @mixin for-tablet-portrait-up { */
@media (min-width: 600px) {
  .tile {
    width: 80vw;
  }
  nav {
    margin-left: -1rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
  /* .logo {
    position: relative;
    float: left;
    display: block;
  } */
}
/* @mixin for-tablet-landscape-up { */
@media (min-width: 900px) {
  .tile {
    width: 65vw;
  }
}
/* @mixin for-desktop-up { */
@media (min-width: 1200px) {
  .tile {
    width: 45vw;
  }
}
/* @mixin for-med-desktop-up { */
@media (min-width: 1800px) {
  .tile {
    width: 40vw;
  }
}
/* @mixin for-big-desktop-up { */
@media (min-width: 1921px) {
  .tile {
    width: 30vw;
  }
}
</style>
