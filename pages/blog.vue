<script setup lang="ts">
useHead({
	title: 'Blog',
	meta: [{ name: 'description', content: 'Blog posts and related content.' }],
});
</script>

<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:forum text-2xl" />
			</template>
			<template #heading>
				{{ $t('blog.card0.title') }}
			</template>

			<p>{{ $t('blog.card0.blurb') }}</p>
		</TileItem>
	</div>
</template>
