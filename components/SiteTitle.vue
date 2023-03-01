<script setup lang="ts">
</script>

<template>
  <div class="greetings">
    <RouterLink to="/" class="greetings-container">
      <h1 class="blue">
        Shattered Sky
      </h1>
      <h1 class="blue, blur">
        Shattered Sky
      </h1>
    </RouterLink>
    <h2>{{ $t('title.sub') }}</h2>
  </div>
</template>

<style scoped>
@import '~/public/style/title.css';
</style>
