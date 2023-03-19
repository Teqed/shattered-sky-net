<script setup lang="ts">
useHead({
	title: 'Social',
	meta: [{ name: 'description', content: 'Social platforms for Shattered Sky.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        <div class="i-mdi:forum text-2xl" />
      </template>
      <template #heading>
        {{ $t('social.card0.title') }}
      </template>

      <p>{{ $t('social.card0.blurb') }}</p>
    </TileItem>
    <TileItem>
      <template #icon>
        <img src="../assets/icons/discord-mark-white.svg" width="20" height="20" alt="Discord logo">
      </template>
      <template #heading>
        {{ $t('social.card1.title') }}
      </template>
      <div style="overflow: hidden">
        <p>
          {{ $t('social.card1.blurb') }}
          <br>
          <br>
          <i18n-t keypath="social.card1.blurb2" scope="global" for="social.card1.linkText">
            <a href="https://discord.gg/VaWPCXr" target="_blank" rel="noopener">{{ $t('social.card1.linkText') }}</a>
          </i18n-t>
        </p>
        <br>
        <div style="width: 100%; height: 300px">
          <iframe
            src="https://discord.com/widget?id=272487248006479874"
            allowtransparency="true"
            style="transform: scale(0.75); transform-origin: 0 0"
            frameborder="0"
            width="133%"
            height="133%"
            overflow="hidden"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            title="Discord Widget"
          />
        </div>
      </div>
    </TileItem>
    <TileItem>
      <template #icon>
        <div class="i-mdi:elephant text-2xl" />
      </template>
      <template #heading>
        {{ $t('social.card2.title') }}
      </template>
      <div style="overflow: hidden">
        <p>
          {{ $t('social.card2.blurb') }}
          <br>
          <br>
          {{ $t('social.card2.blurb2') }}
          <a
            href="https://mastodon.shatteredsky.net/public"
            target="_blank"
            rel="noopener"
          >{{ $t('social.card2.linkText') }}</a>
        </p>
        <br>
        <div style="width: 100%; height: 600px">
          <iframe
            src="https://mastodon.shatteredsky.net/public"
            allowtransparency="true"
            style="transform: scale(0.85); transform-origin: 0 0"
            frameborder="0"
            width="118%"
            height="118%"
            overflow="hidden"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            title="Mastodon Widget"
          />
          <!-- <iframe
        allowfullscreen
        sandbox="allow-top-navigation allow-scripts allow-popups allow-popups-to-escape-sandbox"
        width="100%"
        height="100%"
        src="https://www.mastofeed.com/apiv2/feed?userurl=https%3A%2F%2Fmastodon.shatteredsky.net%2Fusers%2Fteq&theme=dark&size=75&header=true&replies=true&boosts=true"
      ></iframe> -->
        </div>
      </div>
    </TileItem>
  </div>
</template>
