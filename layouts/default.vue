<script setup lang="ts">
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
      <Body>
        <header>
          <SiteHeader />
        </header>
        <br>
        <slot />
      </Body>
    </NuxtErrorBoundary>
  </div>
</template>

<style>
@import '~/public/style/tileitem.css';
</style>
