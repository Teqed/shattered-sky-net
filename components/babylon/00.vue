<template>
  <canvas id="renderCanvas" touch-action="none" />
  <div id="meshcount" class="meshcount" />
</template>
<script setup lang="ts">
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
		const workers = await loadGameWorker(canvas, 'manyIcosahedrons');
		babylonWorker = workers.babylonWorker;
		rapierWorker = workers.rapierWorker;
		attachMouseEvents(babylonWorker, canvas);
	} else {
		({ rapierWorker } = await loadGameMain(canvas, 'manyIcosahedrons'));
	}
	setInterval(async () => {
		const meshCount = await babylonWorker.meshCounter();
		const meshCountDiv = document.querySelector('#meshcount')!;
		meshCountDiv.innerHTML = meshCount.toString();
	}, 1000);
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
