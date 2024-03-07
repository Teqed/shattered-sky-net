<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
useHead({
	title: 'About',
	meta: [{ name: 'description', content: 'About Shattered Sky.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        <div class="i-mdi:information-outline text-2xl" />
      </template>
      <template #heading>
        {{ $t('about.card0.title') }}
      </template>
      <p>
        {{ $t('about.card0.blurb') }}
      </p>
      <br>
      <p>
        {{ $t('about.card0.blurb2') }}
      </p>

      <p />
    </TileItem>
    <TileItem>
      <template #icon>
        <div class="i-mdi:pencil-outline text-2xl" />
      </template>
      <template #heading>
        {{ $t('about.card1.title') }}
      </template>

      <p>
        {{ $t('about.card1.blurb') }}
      </p>
      <br>
      <p>
        <i18n-t keypath="about.card1.blurb2" scope="global" for="about.card1.linkText">
          <a
            href="https://quilling.dev"
            rel="author external"
          >quilling.dev</a>
        </i18n-t>
      </p>
    </TileItem>
  </div>
</template>
