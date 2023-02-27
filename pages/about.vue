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
        🕮
      </template>
      <template #heading>
        {{ $t('about.card0.title') }}
      </template>

      <p />
    </TileItem>
    <TileItem>
      <template #icon>
        ✏️
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
          <a href="mailto:teqed@shatteredsky.net">teqed@shatteredsky.net</a>
        </i18n-t>
      </p>
    </TileItem>
  </div>
</template>
