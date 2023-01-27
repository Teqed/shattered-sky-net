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
  animation: slidein_top 1s ease-out;
}

h3 {
  font-size: 1.2rem;
  animation: slidein_top 1s ease-out;
}

.greetings h1,
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
