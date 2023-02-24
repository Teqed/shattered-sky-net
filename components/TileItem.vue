<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://shatteredsky.net/style/tileitem.css',
    },
  ],
});
</script>

<template>
  <div class="item">
    <div class="i-icon">
      <slot name="icon" />
    </div>
    <div class="details tile">
      <h3>
        <slot name="heading" />
      </h3>
      <slot />
    </div>
  </div>
</template>

<style scoped>
@import '~/public/style/tileitem.css';
</style>
