<script setup lang="ts">
useHead({
  title: 'Social - Shattered Sky',
  meta: [{ name: 'description', content: 'Social platforms for Shattered Sky.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        📚
      </template>
      <template #heading>
        Social
      </template>

      <p />
    </TileItem>
    <TileItem>
      <template #icon>
        <img src="../assets/icons/discord-mark-white.svg" width="20" height="20">
      </template>
      <template #heading>
        Discord
      </template>
      <div style="overflow: hidden">
        <p>
          We have a
          <a href="https://discord.gg/VaWPCXr" target="_blank" rel="noopener">Discord</a>
          server for chatting and playing games together. We have several topic-based text channels
          for sharing media, threads for video game discussion, and usually one or two active voice
          channels streaming video games.
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
          />
        </div>
      </div>
    </TileItem>
    <TileItem>
      <template #icon>
        🐘
      </template>
      <template #heading>
        Mastodon
      </template>
      <div style="overflow: hidden">
        <p>
          We participate in
          <a
            href="https://en.wikipedia.org/wiki/Fediverse"
            target="_blank"
            rel="noopener"
          >federated</a>
          web publishing using the ActivityPub protocol, and currently have a
          <a
            href="https://mastodon.shatteredsky.net/public"
            target="_blank"
            rel="noopener"
          >Mastodon</a>
          microblogging front-end using Glitch-soc.
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
