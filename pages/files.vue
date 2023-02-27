<script setup lang="ts">
useHead({
  title: 'Files',
  meta: [{ name: 'description', content: 'Files hosted at Shattered Sky.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        📂
      </template>
      <template #heading>
        {{ $t('files.card0.title') }}
      </template>

      <p>
        {{ $t('files.card0.blurb') }}
      </p>
      <br>
      <p>
        <a href="https://files.shatteredsky.net/" target="_blank" rel="noopener">
          {{ $t('files.card0.linkText') }}
        </a>
      </p>
    </TileItem>
  </div>
</template>
