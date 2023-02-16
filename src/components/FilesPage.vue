<script setup lang="ts">
import WelcomeItem from "./TileItem.vue";
</script>
<script lang="ts"></script>

<template>
  <WelcomeItem>
    <template #icon>📂</template>
    <template #heading>Files</template>

    <p>
      File hosting accessible by
      <a href="https://files.shatteredsky.net/" target="_blank" rel="noopener"
        >login here.</a
      >&nbsp;
    </p>
  </WelcomeItem>
</template>
