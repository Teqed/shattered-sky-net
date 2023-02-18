<script setup lang="ts">
import PlexIcon from "../assets/icons/IconPlex.vue";
useHead({
  title: 'Streaming - Shattered Sky',
  meta: [
    { name: 'description', content: 'Streaming from Shattered Sky.' }
  ],
});
</script>

<template>
  <main>
    <TileItem>
      <template #icon>📺</template>
      <template #heading>Streaming</template>

      <p></p>
    </TileItem>
    <TileItem>
      <template #icon><PlexIcon /></template>
      <template #heading>Plex</template>

      <p>
        Free Plex accounts can share media libraries between devices or to
        friends, and access Plex's content library of ad-supported video on
        demand and free-to-stream live TV channels.
      </p>
      <br />

      <p>
        If you already have your own account, you can request to have our
        library shared with you.
      </p>
      <br />

      <p><a href="https://plex.shatteredsky.net">Login here.</a></p>
    </TileItem>
    <TileItem>
      <template #icon>
        <img
          src="../assets/icons/jellyfin_ico.png"
          alt="Jellyfin"
          width="20"
          height="20"
        />
      </template>
      <template #heading>Jellyfin</template>

      <p>
        Jellyfin is a free and open source media server. It is a fork of Emby,
        written in C#. Compared to Plex, it does not have centralized
        authentication, meaning all user accounts must be locally registered,
        and content libraries cannot be shared across servers.
      </p>
      <br />

      <p><a href="https://jellyfin.shatteredsky.net">Login here.</a></p>
    </TileItem>
  </main>
</template>
