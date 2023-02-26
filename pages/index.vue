<script setup lang="ts">
import DocumentationIcon from '../assets/icons/IconDocumentation.vue';
import ToolingIcon from '../assets/icons/IconTooling.vue';
import EcosystemIcon from '../assets/icons/IconEcosystem.vue';
import CommunityIcon from '../assets/icons/IconCommunity.vue';
import SupportIcon from '../assets/icons/IconSupport.vue';
useHead({
  title: 'Shattered Sky',
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: 'Home page for Shattered Sky community.' },
  ],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>
        {{ $t('index.files.title') }}
      </template>

      <i18n-t keypath="index.files.blurb" tag="label" for="index.files.linkText">
        <a
          href="https://files.shatteredsky.net/"
          target="_blank"
          rel="noopener"
        >{{ $t('index.files.linkText') }}</a>
      </i18n-t>
    </TileItem>

    <TileItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>
        {{ $t('index.tabletop.title') }}
      </template>

      We have three
      <RouterLink to="/tabletop">
        Foundry VTT servers
      </RouterLink>
      for our campaigns.
    </TileItem>

    <TileItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>
        {{ $t('index.streaming.title') }}
      </template>

      We have a media collection available for access over your choice of
      <a href="https://plex.shatteredsky.net/" target="_blank" rel="noopener">Plex</a>&nbsp;or
      <a href="https://jellyfin.shatteredsky.net/" target="_blank" rel="noopener">Jellyfin</a>.
    </TileItem>

    <TileItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>
        {{ $t('index.social.title') }}
      </template>

      We participate in
      <a href="https://en.wikipedia.org/wiki/Fediverse" target="_blank" rel="noopener">federated</a>
      web publishing using the ActivityPub protocol, and currently have a
      <a href="https://mastodon.shatteredsky.net/" target="_blank" rel="noopener">Mastodon</a>
      microblogging front-end.
    </TileItem>

    <TileItem>
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>
        {{ $t('index.whitelisting.title') }}
      </template>

      If you're a member of the Shattered Sky community, you can request access to any of the above
      services by contacting the administrators on
      <a href="https://discord.gg/VaWPCXr" target="_blank" rel="noopener">our Discord</a>.
    </TileItem>
  </div>
</template>
