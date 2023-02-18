<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://shatteredsky.net/style/title.css'
    }
  ]
});
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="greetings">
    <RouterLink to="/" class="greetings-container"
      ><h1 class="blue">Shattered Sky</h1>
      <h1 class="blue, blur">Shattered Sky</h1></RouterLink
    >
    <h3>Hosting platform for the Shattered Sky community.</h3>
  </div>
</template>

<style scoped>
/* @import '~/assets/style/title.css'; */
</style>
