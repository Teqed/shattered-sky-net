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
});
</script>

<script lang="ts"></script>

<template>
  <div>
    <NuxtErrorBoundary>
      <Html>
        <Head>
          <SeoKit :language="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" />
        </Head>
        <header>
          <NuxtErrorBoundary>
            <SiteHeader />
          </NuxtErrorBoundary>
        </header>
        <ClientOnly>
          <FollowCursor />
        </ClientOnly>
        <br>
        <Body>
          <NuxtErrorBoundary>
            <slot />
          </NuxtErrorBoundary>
        </Body>
      </Html>
    </NuxtErrorBoundary>
  </div>
</template>

<style>
@import '~/public/style/tileitem.css';
</style>
