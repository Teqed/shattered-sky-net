<script setup lang="ts">
import WelcomeItem from "./TileItem.vue";
</script>
<script lang="ts"></script>

<template>
  <WelcomeItem>
    <template #icon> 🎲 </template>
    <template #heading>Foundry Virtual Tabletop</template>

    <p>Pen & Paper RPGs without the paper.</p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon> 🌌 </template>
    <template #heading>Cyberpunk</template>

    <a
      href="https://foundry.shatteredsky.net/cyberpunk/"
      target="_blank"
      rel="noopener"
      >Cyberpunk RED</a
    >&nbsp;by R. Talsorian Games.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon> 🧙 </template>
    <template #heading>The Waking Rune</template>
    <a
      href="https://foundry.shatteredsky.net/krune/"
      target="_blank"
      rel="noopener"
      >The Waking Rune</a
    >&nbsp;from Pathfinder Society's Season 4.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon> 🐦 </template>
    <template #heading>Spheres of Power</template>
    A Skybourne-inspired
    <a
      href="https://foundry.shatteredsky.net/spheres/"
      target="_blank"
      rel="noopener"
      >Spheres of Power</a
    >&nbsp;campaign.
  </WelcomeItem>
</template>
