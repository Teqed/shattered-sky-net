<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})
// const title = computed(() => t('layouts.title', { title: t(route.meta.title ?? 'TBD') }))
useHead({
  meta: [
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
    <Html>
      <Head>
        <SeoKit :language="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" />
      </Head>
      <header>
        <SiteHeader />
      </header>
      <ClientOnly>
        <FollowCursor />
      </ClientOnly>
      <br>
      <Body>
        <slot />
      </Body>
    </Html>
  </div>
</template>

<style>
@import '~/public/style/tileitem.css';
</style>
