<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="greetings">
    <h1 class="blue">{{ msg }}</h1>
    <h3>Hosting platform for the Shattered Sky community.</h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
  animation: slidein-top 1s ease-out;
}

h3 {
  font-size: 1.2rem;
  animation: slidein-top 1s ease-out;
}

.greetings h1 {
  text-align: center;

  /* Change colors as a gradient */
  background: linear-gradient(
      300deg,
      rgb(132, 0, 255),
      rgba(174, 0, 255, 0.5) 20%
    ),
    linear-gradient(100deg, rgba(0, 242, 255, 90%), rgba(0, 136, 255, 0.5) 90%);
  background-blend-mode: color-dodge, color-dodge;
  font-weight: 600;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.greetings h3 {
  text-align: center;
}

@media (min-width: 1200px) {
  /* .greetings h1,
  .greetings h3 {
    text-align: left;
  } */
}
</style>
