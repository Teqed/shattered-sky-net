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
    <img
      alt="Site logo"
      class="logo"
      src="@/assets/ss_icon.webp"
      width="125"
      height="125"
    />

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

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
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

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: center;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
    /* Addition */
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: 0rem;
    padding-right: 1rem;
    background: rgba(71, 71, 71, 0.404);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: saturate(180%) blur(10px);
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    border: 1px solid rgba(121, 121, 121, 0.51);
  }
}
</style>
