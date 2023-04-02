<template>
  <canvas id="renderCanvas" touch-action="none" />
</template>
<script setup lang="ts">
// import { type babylonWorkerType } from '../../utils/worker/babylon-wrap';
import { loadGame as loadGameMain } from '../../utils/worker/babylon-main';
import { attachMouseEvents } from '../../utils/worker/mouseEventsMain';
import { type rapierWorkerType } from '~~/utils/worker/rapier-wrap';
let babylonWorker: any;
let rapierWorker: rapierWorkerType;
onMounted(async () => {
	const canvas: HTMLCanvasElement = document.querySelector('#renderCanvas')!;
	// if offscreen canvas available
	if (false) {
		// dynamically import loadGameWorker from babylon-wrap
		const {
			loadGame: loadGameWorker,
		} = await import('../../utils/worker/babylon-wrap');
		const workers = await loadGameWorker(canvas, 'scene0');
		babylonWorker = workers.babylonWorker;
		rapierWorker = workers.rapierWorker;
		attachMouseEvents(babylonWorker, canvas);
	} else {
		({ rapierWorker } = await loadGameMain(canvas, 'scene0'));
	}
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
		babylonWorker.dispose();
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
