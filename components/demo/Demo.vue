<template>
	<canvas id="renderCanvas" touch-action="none" />
</template>
<script setup lang="ts">
import { loadGame as loadGameMain } from '../../utils/worker/babylon-main';
import { type rapierWorkerType } from '~~/utils/worker/rapier-wrap';
let rapierWorker: rapierWorkerType;
onMounted(async () => {
	const canvas: HTMLCanvasElement = document.querySelector('#renderCanvas')!;
	({ rapierWorker } = await loadGameMain(canvas, 'scene1'));
	// After a few seconds, remove the element named header
	setTimeout(() => {
		const header = document.querySelector('header');
		if (header) {
			header.remove();
		}
	}, 3000);
});

onUnmounted(() => {
	try {
		rapierWorker.dispose();
		// babylonWorker.dispose();
	} catch (error) {
		console.log(error);
	}
});
</script>
<style>
header *:not(canvas) {
	animation: fadeout 1s ease-in-out forwards;
	z-index: -3;
}

html,
body {
	z-index: -2;
	overflow: hidden;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}

#renderCanvas {
	z-index: -1;
	width: 100%;
	height: 100%;
	touch-action: none;
}

canvas {
	outline: none;
	-webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
	position: fixed;
	top: 0;
	left: 0;
	opacity: 0;
	animation: fadein 1s ease-in-out forwards;
}

@keyframes fadein {
	from {
		opacity: 0;
		filter: blur(10px);
	}

	to {
		opacity: 1;
		filter: blur(0);
	}
}

@keyframes fadeout {
	from {
		opacity: 1;
		filter: blur(0);
	}

	to {
		opacity: 0;
		filter: blur(10px);
	}
}
</style>
