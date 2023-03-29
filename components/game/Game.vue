<template>
  <canvas id="renderCanvas" touch-action="none" />
</template>
<script setup lang="ts">
import { loadGame, type babylonWorkerType } from '../../utils/worker/babylon-wrap';
import { attachMouseEvents } from '../../utils/worker/mouseEventsMain';
import { type rapierWorkerType } from '~~/utils/worker/rapier-wrap';
let babylonWorker: babylonWorkerType;
let rapierWorker: rapierWorkerType;
onMounted(async () => {
	const canvas: HTMLCanvasElement = document.querySelector('#renderCanvas')!;
	const workers = await loadGame(canvas, 'scene0');
	babylonWorker = workers.babylonWorker;
	rapierWorker = workers.rapierWorker;
	attachMouseEvents(canvas);
});

onUnmounted(() => {
	babylonWorker.dispose();
	rapierWorker.dispose();
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

  </style>
