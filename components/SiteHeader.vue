<script setup lang="ts">
</script>
<script lang="ts"></script>
<template>
  <div class="logo-container">
    <img
      alt="Site logo blur"
      class="logo-blur"
      src="../assets/icons/ss-logo.min.svg"
    >
    <NuxtLink to="/" class="logo-link">
      <img alt="Site logo" class="logo" src="../assets/icons/ss-logo.min.svg">
    </NuxtLink>
  </div>
  <div class="wrapper">
    <!-- Site title -->
    <SiteTitle msg="Shattered Sky" />

    <!-- Navigation links -->
    <nav>
      <NuxtLink to="/">
        {{ $t('nav.home') }}
      </NuxtLink>
      <NuxtLink to="/files">
        {{ $t('nav.files') }}
      </NuxtLink>
      <NuxtLink to="/tabletop">
        {{ $t('nav.tabletop') }}
      </NuxtLink>
      <NuxtLink to="/stream">
        {{ $t('nav.stream') }}
      </NuxtLink>
      <NuxtLink to="/social">
        {{ $t('nav.social') }}
      </NuxtLink>
      <NuxtLink to="/about">
        {{ $t('nav.about') }}
      </NuxtLink>
    </nav>
  </div>
</template>
<style>
@import '~/public/style/header.css';
</style>
