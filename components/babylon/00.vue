<template>
  <canvas id="renderCanvas" touch-action="none" />
</template>
<script setup lang="ts">
// import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
// import * as Comlink from 'comlink';
import {
	wrap,
	transfer
} from 'comlink';
const worker = new Worker(new URL('../../worker/babylon.ts', import.meta.url), {
	type: 'module',
});
const babylonWorker: {
	init: (canvas: OffscreenCanvas) => {
		/* ... */
	},
	resize: (width: number, height: number) => {
		/* ... */
	},
} = wrap(worker);
onMounted(() => {
	const canvas: HTMLCanvasElement = document.querySelector('#renderCanvas')!; // Get the canvas element
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	const offscreen = canvas.transferControlToOffscreen();
	babylonWorker.init(transfer(offscreen, [offscreen]));
	window.addEventListener('resize', () => {
		babylonWorker.resize(canvas.clientWidth, canvas.clientHeight);
	});
});

</script>
<style>
html,
body {
overflow: hidden;
width: 100%;
height: 100%;
margin: 0;
padding: 0;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}

	canvas {
	position: fixed;
	top: 0;
	left: 0;
	/* z-index: -1; */
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

  .meshcount {
	position: fixed;
	bottom: 0;
	right: 0;
	padding: 0.5em;
	background: rgba(56, 56, 56, 0.5);
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 0.5em;
	box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.2);
	margin: 0.5em;
	font-size: 1.5em;
	font-weight: bold;
  }

</style>
