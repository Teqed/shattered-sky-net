<script setup lang="ts">
useHead({
  title: 'Shattered Sky',
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: 'Welcome to %site.name.',
    },
  ],
  link: [
    // {
    //   rel: 'preconnect',
    //   href: 'https://fonts.googleapis.com',
    // },
    // {
    //   rel: 'preconnect',
    //   href: 'https://fonts.gstatic.com',
    //   crossorigin: '',
    // },
    // {
    //   rel: 'stylesheet',
    //   href: 'https://shatteredsky.net/style/main.css',
    // },
    // {
    //   rel: 'stylesheet',
    //   href: 'https://shatteredsky.net/style/tileitem.css',
    // },
    // {
    //   rel: 'stylesheet',
    //   href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    //   crossorigin: '',
    // },
  ],
});
</script>

<script lang="ts"></script>

<template>
  <div>
    <ClientOnly>
      <FollowCursor />
      <!-- <SeoKit /> -->
    </ClientOnly>
    <br>
    <NuxtPage v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </NuxtPage>
  </div>
</template>

<style>
@import '~/public/style/tileitem.css';
</style>
