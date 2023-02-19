<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://shatteredsky.net/style/header.css'
    }
  ]
});
</script>
<script lang="ts"></script>
<template>
  <div class="logo-container">
    <img
      alt="Site logo blur"
      class="logo-blur"
      src="../assets/icons/ss_icon.webp"
    />
    <NuxtLink to="/" class="logo-link">
      <img
        alt="Site logo"
        class="logo"
        src="../assets/icons/ss_icon.webp"
      />
    </NuxtLink>
  </div>
  <div class="wrapper">
    <!-- Site title -->
    <SiteTitle msg="Shattered Sky" />

    <!-- Navigation links -->
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/files">Files</NuxtLink>
      <NuxtLink to="/tabletop">Tabletop</NuxtLink>
      <!-- <NuxtLink to="/games">Games</NuxtLink> -->
      <NuxtLink to="/stream">Stream</NuxtLink>
      <NuxtLink to="/social">Social</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </nav>
  </div>
</template>
<style>
/* @import '~/public/style/header.css'; */
</style>
