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
	<div class="item-srd">
		<div class="details-srd tile-srd">
			<h3>
				<slot name="heading" />
			</h3>
			<slot />
		</div>
	</div>
</template>

<style scoped>
/* @import '~/public/style/tileitem.css'; */
</style>
