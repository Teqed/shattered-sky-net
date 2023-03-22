<template>
  <canvas id="renderCanvas" touch-action="none" />
  <div id="meshcount" class="meshcount" />
</template>
<script setup lang="ts">
// import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
// import * as Comlink from 'comlink';
import {
	wrap,
	transfer,
} from 'comlink';
import { Engine } from '@babylonjs/core/Engines/engine';
// import manyCubes from '../../utils/babylon/manyCubes';
// import manyIcosahedrons from '../../utils/babylon/manyIcosahedrons';
const worker = new Worker(new URL('../../utils/worker/babylon.ts', import.meta.url), {
	type: 'module',
});
const babylonWorker: {
	init: (canvas: OffscreenCanvas) => {
		/* ... */
	},
	resize: (width: number, height: number) => {
		/* ... */
	},
	mouseEvent: (event: {
		type: string,
		button: number,
		buttons: number,
		x: number,
		y: number,
		deltaY?: number,
		deltaX?: number,
		deltaZ?: number,
		deltaMode?: number,
	}
	) => {
		/* ... */
	},
} = wrap(worker);

// let engine: Engine;
// let canvas: HTMLCanvasElement;

// const babylonGlobal = {
// 	init: async (initCanvas: HTMLCanvasElement) => {
// 		canvas = initCanvas;
// 		engine = new Engine(canvas, true);
// 		// const scene = ballOnGround(engine, canvas);
// 		// const scene = await manyCubes(engine, canvas);
// 		const scene = await manyIcosahedrons(engine, canvas);
// 		engine.runRenderLoop(() => {
// 			scene.render();
// 		}
// 		);
// 		return scene;
// 	},
// 	resize: (width: number, height: number) => {
// 		canvas.width = width;
// 		canvas.height = height;
// 	},
// 	mouseEvent: () => {
// 	}
// }
onMounted(() => {
	// let babylon: typeof babylonGlobal | typeof babylonWorker;
	const canvas: HTMLCanvasElement = document.querySelector('#renderCanvas')!; // Get the canvas element
	// if ('OffscreenCanvas' in window && 'transferControlToOffscreen' in canvas) {

	// if (true) {
	// babylon = babylonWorker;
	const offscreen = canvas.transferControlToOffscreen();
	babylonWorker.init(transfer(offscreen, [offscreen]));
	const onMouseEvents = (event: MouseEvent) => {
		const type = event.type;
		const button = event.button;
		const buttons = event.buttons;
		const x = event.clientX;
		const y = event.clientY;
		// if scroll event...
		if (event instanceof WheelEvent) {
			const deltaY = event.deltaY;
			const deltaX = event.deltaX;
			const deltaZ = event.deltaZ;
			const deltaMode = event.deltaMode;
			const wheelEvent = {
				type,
				button,
				buttons,
				x,
				y,
				deltaY,
				deltaX,
				deltaZ,
				deltaMode,
			};
			babylonWorker.mouseEvent(wheelEvent);
		} else {
			const relayedMouseEvent = {
				type,
				button,
				buttons,
				x,
				y,
			}
			babylonWorker.mouseEvent(relayedMouseEvent);
		}
	};
	canvas.addEventListener('pointerdown', onMouseEvents);
	canvas.addEventListener('pointermove', onMouseEvents);
	canvas.addEventListener('pointerup', onMouseEvents);
	canvas.addEventListener('wheel', onMouseEvents);
	babylonWorker.resize(canvas.clientWidth, canvas.clientHeight);
	window.addEventListener('resize', () => {
		babylonWorker.resize(canvas.clientWidth, canvas.clientHeight);
	});
	// } else {
	// babylon = babylonGlobal;
	// const babylon = babylonGlobal;
	// babylonGlobal.init(canvas);
	// }
	// babylon.resize(canvas.clientWidth, canvas.clientHeight);
	// window.addEventListener('resize', () => {
	// 	babylon.resize(canvas.clientWidth, canvas.clientHeight);
	// });
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
