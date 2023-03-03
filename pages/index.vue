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

      <i18n-t keypath="index.files.blurb" scope="global" for="index.files.linkText">
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

      <i18n-t keypath="index.tabletop.blurb" scope="global" for="index.tabletop.linkText">
        <RouterLink to="/tabletop">
          {{ $t('index.tabletop.linkText') }}
        </RouterLink>
      </i18n-t>
    </TileItem>

    <TileItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>
        {{ $t('index.streaming.title') }}
      </template>

      <i18n-t keypath="index.streaming.blurb" scope="global" for="index.streaming.linkText">
        <a href="https://plex.shatteredsky.net/" target="_blank" rel="noopener">
          {{ $t('index.streaming.linkText') }}
        </a>
        <a href="https://jellyfin.shatteredsky.net/" target="_blank" rel="noopener">
          {{ $t('index.streaming.linkText2') }}
        </a>
      </i18n-t>
    </TileItem>

    <TileItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>
        {{ $t('index.social.title') }}
      </template>

      <i18n-t keypath="index.social.blurb" scope="global" for="index.social.linkText">
        <a href="https://en.wikipedia.org/wiki/Fediverse" target="_blank" rel="noopener">
          {{ $t('index.social.linkText') }}
        </a>
        <a href="https://mastodon.shatteredsky.net/" target="_blank" rel="noopener">
          {{ $t('index.social.linkText2') }}
        </a>
      </i18n-t>
    </TileItem>

    <TileItem>
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>
        {{ $t('index.whitelisting.title') }}
      </template>

      <i18n-t keypath="index.whitelisting.blurb" scope="global" for="index.whitelisting.linkText">
        <a href="https://discord.gg/VaWPCXr" target="_blank" rel="noopener">
          {{ $t('index.whitelisting.linkText') }}
        </a>
      </i18n-t>
    </TileItem>
  </div>
</template>
