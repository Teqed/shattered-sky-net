<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})
useHead({
  meta: [
    {
      name: 'darkreader-lock',
    },
    {
      name: 'lang',
      content: head.value.htmlAttrs.lang || 'en',
    },
    {
      name: 'dir',
      content: head.value.htmlAttrs.dir || 'ltr',
    }
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
    <header>
      <SeoKit />
      <SiteHeader />
    </header>
    <ClientOnly>
      <FollowCursor />
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
