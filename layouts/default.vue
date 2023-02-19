<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://shatteredsky.net/style/main.css',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
      crossorigin: '',
    },
  ],
});
</script>

<script lang="ts"></script>

<template>
  <main>
    <ClientOnly> <FollowCursor /></ClientOnly>
    <header>
      <SiteHeader />
    </header>
    <br>
    <NuxtPage v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </NuxtPage>
  </main>
</template>

<style>
/* @import '~/public/style/main.css'; */
</style>
