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
		<TileItem>
			<template #icon>
				<div class="i-mdi:forum text-2xl" />
			</template>
			<template #heading>
				<a href="https://quilling.dev/blog/message-CPA4072/">Message CPA4072</a>
				<div style="float:right"><p><i>04-12-2025</i></p></div>
			</template>
			<p>A common message to receive on the AS/400 IBMi system while doing a routine task is CPA4072, "Maximum number of records reached for file". <a href="https://quilling.dev/blog/message-CPA4072/">Read more.</a></p>
		</TileItem>
		<TileItem>
			<template #icon>
				<div class="i-mdi:forum text-2xl" />
			</template>
			<template #heading>
				<a href="https://quilling.dev/blog/atproto-labels/">AT-Proto Label Services</a>
				<div style="float:right"><p><i>03-01-2025</i></p></div>
			</template>
			<p>Each label's val is a key used to reference a label definition defined at the labeling service account's app.bsky.labeler.service/self record. <a href="https://quilling.dev/blog/atproto-labels/">Read more.</a></p>
		</TileItem>
		<TileItem>
			<template #icon>
				<div class="i-mdi:forum text-2xl" />
			</template>
			<template #heading>
				<a href="https://quilling.dev/blog/more-about-me/">More about me</a>
				<div style="float:right"><p><i>01-01-2024</i></p></div>
			</template>
			<p>I was born in Winter Park, Florida, near Orlando. Before I could even read I was already playing on the computer. <a href="https://quilling.dev/blog/more-about-me/">Read more.</a></p>
		</TileItem>
	</div>
</template>
