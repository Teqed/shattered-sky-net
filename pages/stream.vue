<script setup lang="ts">
import PlexIcon from '../assets/icons/IconPlex.vue';
useHead({
  title: 'Streaming',
  meta: [{ name: 'description', content: 'Streaming from Shattered Sky.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        📺
      </template>
      <template #heading>
        {{ $t('stream.card0.title') }}
      </template>

      <p>{{ $t('stream.card0.blurb') }}</p>
    </TileItem>
    <TileItem>
      <template #icon>
        <PlexIcon />
      </template>
      <template #heading>
        {{ $t('stream.card1.title') }}
      </template>

      <p>
        {{ $t('stream.card1.blurb') }}
      </p>
      <br>

      <p>
        {{ $t('stream.card1.blurb2') }}
      </p>
      <br>

      <p><a href="https://plex.shatteredsky.net">{{ $t('stream.card1.linkText') }}</a></p>
    </TileItem>
    <TileItem>
      <template #icon>
        <img src="../assets/icons/jellyfin_ico.png" alt="Jellyfin" width="20" height="20">
      </template>
      <template #heading>
        {{ $t('stream.card2.title') }}
      </template>

      <p>
        {{ $t('stream.card2.blurb') }}
      </p>
      <br>

      <p><a href="https://jellyfin.shatteredsky.net">{{ $t('stream.card2.linkText') }}</a></p>
    </TileItem>
  </div>
</template>
