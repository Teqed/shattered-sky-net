<script setup lang="ts">
useHead({
	link: [
		// {
		//   rel: 'stylesheet',
		//   href: 'https://shatteredsky.net/style/tileitem.css',
		// },
	],
});
</script>

<template>
  <div id="reverse" class="reitem">
    <div class="redetails retile">
      <h3>
        <slot name="heading" />
      </h3>
      <slot />
    </div>
    <div class="rei-icon">
      <slot name="icon" />
    </div>
  </div>
</template>

<style scoped>
/* @import '~/public/style/tileitem.css'; */
</style>
