<script setup lang="ts">
// const title = computed(() => t('layouts.title', { title: t(route.meta.title ?? 'TBD') }))
useHead({
	meta: [],
});
</script>

<script lang="ts"></script>

<template>
	<div>
		<NuxtErrorBoundary>
			<Body>
				<header>
					<SiteHeader />
				</header>
				<slot />
			</Body>
		</NuxtErrorBoundary>
	</div>
</template>

<style>
* {
	--animation-generic: fadein 0.28s ease-out, slidein-top 0.28s ease-out;
}

#reverse {
	transition: none !important;
}

@media (hover: hover) {
	.item a:hover {
		text-decoration: underline;
		background-color: hsl(189deg 65% 21% / 20%);
	}
}

.tile {
	width: min(85vw, 85vmin);
	padding: 1.2vh 1vw;
	background: rgb(71 71 71 / 40%);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
	backdrop-filter: saturate(180%) blur(10px);
	/* stylelint-disable-next-line property-no-vendor-prefix */
	-webkit-backdrop-filter: saturate(180%) blur(10px);
	border: 1px solid rgb(121 121 121 / 51%);
	transition: box-shadow 0.28s ease-in-out;
}

.retile {
	width: min(85vw, 85vmin);
	padding: 1.2vh 1vw;
	background: rgb(71 71 71 / 40%);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
	backdrop-filter: saturate(180%) blur(10px);
	/* stylelint-disable-next-line property-no-vendor-prefix */
	-webkit-backdrop-filter: saturate(180%) blur(10px);
	border: 1px solid rgb(121 121 121 / 51%);
	/* transition: box-shadow 0.28s ease-in-out; */
}

.tile:hover {
	box-shadow: 0 4px 30px rgb(121 121 121 / 25%);
}

.retile:hover {
	box-shadow: 0 4px 30px rgb(121 121 121 / 25%);
}

.item {
	padding: 0.4vh 3vw 1.5vh 2vw;
	display: flex;
}

.reitem {
	padding: 0.4vh 3vw 1.5vh 2vw;
	display: flex;
}

.details {
	flex: 1;
	margin-left: 1.5vw;
	animation: var(--animation-generic);
}

.i-icon {
	display: flex;
	place-items: center;
	place-content: center;
	width: 32px;
	height: 32px;
	color: var(--color-text);
	animation: var(--animation-generic);
}

.rei-icon {
	display: flex;
	place-items: center;
	place-content: center;
	width: 32px;
	height: 32px;
	color: var(--color-text);
	/* animation: var(--animation-generic); */
}

h3 {
	font-size: 1.2rem;
	font-weight: 500;
	margin-bottom: 0.5vh;
	color: var(--color-heading);
}
</style>
