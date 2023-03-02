<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
});
useHead({
  meta: [
    {
      name: 'darkreader-lock',
    },
  ],
  });
</script>
<script lang="ts"></script>

<template>
  <div>
    <SeoKit :language="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" />
    <NuxtErrorBoundary>
      <ClientOnly>
        <FollowCursor />
      </ClientOnly>
      <NuxtLayout>
        <NuxtPage v-slot="{ Component }">
          <transition name="slide" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </transition>
        </NuxtPage>
      </NuxtLayout>
    </NuxtErrorBoundary>
  </div>
</template>

<style>
@import '~/public/style/main.css';</style>
