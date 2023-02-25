<script setup lang="ts">useHead({
  title: 'Shattered Sky',
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: 'Welcome to %site.name.',
    },
  ],});
</script>
<script lang="ts"></script>

<template>
  <div>
    <header>
      <meta name="darkreader-lock">
      <SiteHeader />
    </header>
    <NuxtLayout />
  </div>
</template>

<style>
@import '~/public/style/main.css';</style>
