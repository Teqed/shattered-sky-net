<script setup lang="ts">useHead({
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
    <NuxtErrorBoundary>
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
