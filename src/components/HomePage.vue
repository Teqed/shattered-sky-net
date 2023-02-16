<script setup lang="ts">
import WelcomeItem from "./TileItem.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";
</script>
<script lang="ts"></script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Files</template>

    File hosting can be found in the
    <a href="https://files.shatteredsky.net/" target="_blank" rel="noopener"
      >directory browser.</a
    >
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tabletop</template>

    We have three <RouterLink to="/tabletop">Foundry VTT servers</RouterLink>
    for our campaigns.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Streaming</template>

    We have a media collection available for access over your choice of
    <a href="https://plex.shatteredsky.net/" target="_blank" rel="noopener"
      >Plex</a
    >&nbsp;or
    <a href="https://jellyfin.shatteredsky.net/" target="_blank" rel="noopener"
      >Jellyfin</a
    >.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Blogging</template>

    We participate in
    <a
      href="https://en.wikipedia.org/wiki/Fediverse"
      target="_blank"
      rel="noopener"
      >federated</a
    >
    web publishing using the ActivityPub protocol, and currently have a
    <a href="https://mastodon.shatteredsky.net/" target="_blank" rel="noopener"
      >Mastodon</a
    >
    microblogging front-end.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Whitelisting</template>

    If you're a member of the Shattered Sky community, you can request access to
    any of the above services by contacting the administrators on
    <a href="https://discord.gg/VaWPCXr" target="_blank" rel="noopener"
      >our Discord</a
    >.
  </WelcomeItem>
</template>
