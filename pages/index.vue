<script setup lang="ts">
useHead({
	title: 'Shattered Sky',
	titleTemplate: '%s',
	meta: [
		{
			name: 'description',
			content: 'Home page for Shattered Sky community.',
		},
	],
	link: [
		{
			rel: 'me',
			href: 'https://mastodon.shatteredsky.net/@teq',
		},
	],
});
</script>

<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:file-document-multiple-outline text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.files.title') }}
			</template>

			<i18n-t
				keypath="index.files.blurb"
				scope="global"
				for="index.files.linkText"
			>
				<a
					href="https://files.shatteredsky.net/"
					target="_blank"
					rel="noopener"
					>{{ $t('index.files.linkText') }}</a
				>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:dice-d20-outline text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.tabletop.title') }}
			</template>

			<i18n-t
				keypath="index.tabletop.blurb"
				scope="global"
				for="index.tabletop.linkText"
			>
				<RouterLink to="/tabletop">
					{{ $t('index.tabletop.linkText') }}
				</RouterLink>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:youtube-tv text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.streaming.title') }}
			</template>

			<i18n-t
				keypath="index.streaming.blurb"
				scope="global"
				for="index.streaming.linkText"
			>
				<a
					href="https://plex.shatteredsky.net/"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.streaming.linkText') }}
				</a>
				<a
					href="https://jellyfin.shatteredsky.net/"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.streaming.linkText2') }}
				</a>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:forum text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.social.title') }}
			</template>

			<i18n-t
				keypath="index.social.blurb"
				scope="global"
				for="index.social.linkText"
			>
				<a
					href="https://en.wikipedia.org/wiki/Fediverse"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.social.linkText') }}
				</a>
				<a
					href="https://mastodon.shatteredsky.net/"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.social.linkText2') }}
				</a>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:playlist-check text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.whitelisting.title') }}
			</template>

			<i18n-t
				keypath="index.whitelisting.blurb"
				scope="global"
				for="index.whitelisting.linkText"
			>
				<a
					href="https://discord.gg/VaWPCXr"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.whitelisting.linkText') }}
				</a>
			</i18n-t>
		</TileItem>
	</div>
</template>
