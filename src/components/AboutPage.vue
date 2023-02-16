<script setup lang="ts">
import WelcomeItem from "./TileItem.vue";
</script>
<script lang="ts"></script>

<template>
  <WelcomeItem>
    <template #icon>🕮</template>
    <template #heading>About</template>

    <p></p>
  </WelcomeItem>
  <WelcomeItem>
    <template #icon>✏️</template>
    <template #heading>Created By</template>

    Site assembled and hosted by Timothy E. Quilling, 2023. Please contact
    <a url="mailto:admin@shatteredsky.net">admin@shatteredsky.net</a> for
    inquiries.
  </WelcomeItem>
</template>
