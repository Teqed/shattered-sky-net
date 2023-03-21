<template>
  <canvas id="renderCanvas" touch-action="none" />
  <div id="meshcount" class="meshcount" />
</template>
<script setup lang="ts">
// import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
// import * as Comlink from 'comlink';
// import {
// 	wrap,
// 	transfer,
// } from 'comlink';
import { Engine } from '@babylonjs/core/Engines/engine';
import manyCubes from '../../utils/babylon/manyCubes';
// import manyIcosahedrons from '../../utils/babylon/manyIcosahedrons';
// const worker = new Worker(new URL('../../utils/worker/babylon.ts', import.meta.url), {
// 	type: 'module',
// });
// const babylonWorker: {
// 	init: (canvas: OffscreenCanvas) => {
// 		/* ... */
// 	},
// 	resize: (width: number, height: number) => {
// 		/* ... */
// 	},
// 	mouseEvent: (
// 		type: string,
// 		x: number,
// 		y: number
// 	) => {
// 		/* ... */
// 	},
// } = wrap(worker);

let engine: Engine;
let canvas: HTMLCanvasElement;

const babylonGlobal = {
	init: async (initCanvas: HTMLCanvasElement) => {
		canvas = initCanvas;
		engine = new Engine(canvas, true);
		// const scene = ballOnGround(engine, canvas);
		const scene = await manyCubes(engine, canvas);
		// const scene = await manyIcosahedrons(engine, canvas);
		engine.runRenderLoop(() => {
			scene.render();
		}
		);
		return scene;
	},
	resize: (width: number, height: number) => {
		canvas.width = width;
		canvas.height = height;
	},
	mouseEvent: () => {
	}
}
onMounted(() => {
	// let babylon: typeof babylonGlobal | typeof babylonWorker;
	const canvas: HTMLCanvasElement = document.querySelector('#renderCanvas')!; // Get the canvas element
	// if ('OffscreenCanvas' in window && 'transferControlToOffscreen' in canvas) {

	// if (false) {
	// 	babylon = babylonWorker;
	// 	const offscreen = canvas.transferControlToOffscreen();
	// 	babylonWorker.init(transfer(offscreen, [offscreen]));
	// 	const onMouseEvents = (event: MouseEvent) => {
	// 		const type = event.type;
	// 		const x = event.clientX;
	// 		const y = event.clientY;
	// 		babylon.mouseEvent(type, x, y);
	// 	};
	// 	canvas.addEventListener('mousedown', onMouseEvents);
	// 	canvas.addEventListener('mousemove', onMouseEvents);
	// 	canvas.addEventListener('mouseup', onMouseEvents);
	// } else {
	// babylon = babylonGlobal;
	const babylon = babylonGlobal;
	babylonGlobal.init(canvas);
	// }
	babylon.resize(canvas.clientWidth, canvas.clientHeight);
	window.addEventListener('resize', () => {
		babylon.resize(canvas.clientWidth, canvas.clientHeight);
	});
});

</script>
<style>
header *:not(canvas) {
	animation: fadeout 1s ease-in-out forwards;
}

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
	outline: none;
	-webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
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
