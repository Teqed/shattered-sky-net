<script setup lang="ts">
const route = useRoute();
const head = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: 'id',
	addSeoAttributes: true,
});
useHead({
	meta: [
		{
			name: 'darkreader-lock',
		},
	],
});
</script>
<script lang="ts"></script>

<template>
	<div>
		<SeoKit :language="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir" />
		<NuxtErrorBoundary>
			<ClientOnly>
				<FollowCursor />
			</ClientOnly>
			<NuxtLayout>
				<NuxtPage v-slot="{ Component }">
					<transition name="slide" mode="out-in">
						<component :is="Component" :key="route.path" />
					</transition>
				</NuxtPage>
			</NuxtLayout>
		</NuxtErrorBoundary>
	</div>
</template>

<style>
a,
.blue {
	text-decoration: none;
	color: rgb(47 112 172);
	transition: 0.28s;
}

:root {
	margin: 0 auto;
	/* padding: 2rem; */
	font-weight: normal;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	--vt-c-white: #fff;
	--vt-c-white-soft: #f8f8f8;
	--vt-c-white-mute: #f2f2f2;
	--vt-c-black: #181818;
	--vt-c-black-soft: #222;
	--vt-c-black-mute: #282828;
	--vt-c-indigo: #2c3e50;
	--vt-c-divider-light-1: rgb(60 60 60 / 29%);
	--vt-c-divider-light-2: rgb(60 60 60 / 12%);
	--vt-c-divider-dark-1: rgb(84 84 84 / 65%);
	--vt-c-divider-dark-2: rgb(84 84 84 / 48%);
	--vt-c-text-light-1: var(--vt-c-indigo);
	--vt-c-text-light-2: rgb(60 60 60 / 0.66%);
	--vt-c-text-dark-1: var(--vt-c-white);
	--vt-c-text-dark-2: rgb(235 235 235 / 64%);
	--section-gap: 160px;
	--color-background: var(--vt-c-black);
	--color-background-soft: var(--vt-c-black-soft);
	--color-background-mute: var(--vt-c-black-mute);
	--color-border: var(--vt-c-divider-dark-2);
	--color-border-hover: var(--vt-c-divider-dark-1);
	--color-heading: var(--vt-c-text-dark-1);
	--color-text: var(--vt-c-text-dark-2);
}

*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	position: relative;
	font-weight: normal;
}

body {
	/* max-width: 1280px; */

	min-height: 100vh;
	color: var(--color-text);
	line-height: 1.6;
	font-family: Roboto, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI',
		Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
		sans-serif;
	font-size: 15px;
	text-rendering: optimizelegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background: var(--color-background);
	background-size: 150% 150%;
	background-blend-mode: exclusion;
	background-image: radial-gradient(
			circle at bottom right,
			rgb(170 0 206 / 10%),
			rgb(50 0 206 / 0%) 65%
		),
		radial-gradient(
			circle at top left,
			rgb(50 0 206 / 15%),
			rgb(170 0 206 / 0%) 65%
		);
	will-change: background-position;
}

::-webkit-scrollbar {
	width: 0;
	background: transparent; /* make scrollbar transparent */
}

@keyframes fadein {
	from {
		opacity: 0.1;
		filter: blur(10px);
	}

	to {
		opacity: 1;
		filter: blur(0);
	}
}

@keyframes slidein-top {
	from {
		transform: translateY(-15%);
	}

	to {
		transform: translateY(0%);
	}
}

@keyframes slidein-top-10 {
	from {
		transform: translateY(-3%);
	}

	to {
		transform: translateY(0%);
	}
}
</style>
