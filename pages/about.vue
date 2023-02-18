<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
useHead({
  title: 'About - Shattered Sky',
  meta: [
    { name: 'description', content: 'About Shattered Sky.' }
  ],
})</script>

<template>
  <main>
    <TileItem>
      <template #icon>🕮</template>
      <template #heading>About</template>

      <p></p>
    </TileItem>
    <TileItem>
      <template #icon>✏️</template>
      <template #heading>Created By</template>

      Site assembled and hosted by Timothy E. Quilling, 2023. Please contact
      <a url="mailto:admin@shatteredsky.net">admin@shatteredsky.net</a> for
      inquiries.
    </TileItem>
  </main>
</template>
