<script setup lang="ts">
useHead({
  title: 'Files - Shattered Sky',
  meta: [
    { name: 'description', content: 'Files hosted at Shattered Sky.' }
  ],
})</script>

<template>
  <main>
    <TileItem>
      <template #icon>📂</template>
      <template #heading>Files</template>

      <p>
        File hosting accessible by
        <a href="https://files.shatteredsky.net/" target="_blank" rel="noopener"
          >login here.</a
        >&nbsp;
      </p>
    </TileItem>
  </main>
</template>
