<script setup lang="ts">
useHead({
	title: 'Cloud',
	meta: [{ name: 'description', content: 'Cloud services hosted at Shattered Sky.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        <div class="i-mdi:file-document-multiple-outline text-2xl" />
      </template>
      <template #heading>
        {{ $t('cloud.card0.title') }}
      </template>

      <p>
        {{ $t('cloud.card0.blurb') }}
      </p>
      <br>
      <p>
        <a href="https://files.shatteredsky.net/" target="_blank" rel="noopener">
          {{ $t('cloud.card0.linkText') }}
        </a>
      </p>
    </TileItem>
  </div>
</template>
