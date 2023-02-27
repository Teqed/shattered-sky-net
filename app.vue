<script setup lang="ts">useHead({
  // title: 'Shattered Sky',
  // titleTemplate: '%s',
  meta: [
  //   {
  //     name: 'description',
  //     content: 'Welcome to Shattered Sky.',
  //   },
    {
      name: 'darkreader-lock',
    },
  ],
  });
</script>
<script lang="ts"></script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </NuxtPage>
    </NuxtLayout>
  </div>
</template>

<style>
@import '~/public/style/main.css';</style>
