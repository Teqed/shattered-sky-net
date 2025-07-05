<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const route = useRoute();
// const { data: markdown_page } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
// const title = markdown_page.value?.title || 'Title not found';

// useSeoMeta({
// 	title: markdown_page.value?.title,
// 	description: markdown_page.value?.description
// })
</script>

<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:information-outline text-2xl" />
			</template>
			<template #heading>
				<!-- {{ title }} -->
			</template>
			<p>
				<!-- <ContentRenderer v-if="markdown_page" :value="markdown_page" /> -->
				<!-- <div v-else>Markdown page not found</div> -->
			</p>
			<p />
		</TileItem>
	</div>
</template>
<style>
/* Tables https://github.com/micromark/micromark-extension-gfm-table#css */
/* Light theme. */
:root {
	--color-canvas-default: rgb(1 1 1 / 20%);
	--color-canvas-subtle: rgb(121 121 121 / 10%);
	--color-border-default: rgb(121 121 121 / 51%);
	--color-border-muted: rgb(121 121 121 / 26%);
}

table {
	border-spacing: 0;
	border-collapse: collapse;
	display: block;
	margin-top: 0;
	margin-bottom: 16px;
	width: max-content;
	max-width: 100%;
	overflow: auto;

	background: rgb(71 71 71 / 40%);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
	backdrop-filter: saturate(180%) blur(10px);
	/* stylelint-disable-next-line property-no-vendor-prefix */
	-webkit-backdrop-filter: saturate(180%) blur(10px);
	border: 1px solid rgb(121 121 121 / 51%);
	transition: box-shadow 0.28s ease-in-out;
}

table:hover {
	box-shadow: 0 4px 30px rgb(121 121 121 / 25%);
}

tr {
	background-color: var(--color-canvas-default);
	border-top: 1px solid var(--color-border-muted);
}

tr:nth-child(2n) {
	background-color: var(--color-canvas-subtle);
}

td,
th {
	padding: 6px 13px;
	border: 1px solid var(--color-border-default);
}

th {
	font-weight: 600;
}

table img {
	background-color: transparent;
}
</style>
