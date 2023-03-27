// import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
// import * as Comlink from 'comlink';
import { expose } from 'comlink';
// import ballOnGround from './babylon/ballOnGround';
// import manyCubes, { relayMouseEvent } from '../babylon/manyCubes';
import manyIcosahedrons, { createSubWorker, numberMeshes } from '../babylon/manyIcosahedrons';
import { CustomMouseEvent } from './mouseEvents';

let engine: Engine;
let canvas: OffscreenCanvas;

const babylonWorker = {
	init: async (initCanvas: OffscreenCanvas) => {
		canvas = initCanvas as unknown as OffscreenCanvas;
		engine = new Engine(canvas, true);
		// const scene = ballOnGround(engine, canvas);
		// const scene = await manyCubes(engine, canvas);
		const scene = await manyIcosahedrons(engine, canvas);
		engine.runRenderLoop(() => {
			scene.render();
		}
		);
		// return scene;
	},
	resize: (width: number, height: number) => {
		canvas.width = width;
		canvas.height = height;
	},
	mouseEvent: (event: {
		type: string,
		x: number,
		y: number,
		button: number,
		buttons: number,
		deltaX?: number,
		deltaY?: number,
		deltaZ?: number,
		deltaMode?: number,
	}
	) => {
		const customEvent = new CustomMouseEvent(event.type, {
			clientX: event.x,
			clientY: event.y,
			button: event.button,
			buttons: event.buttons,
			currentTarget: canvas,
			deltaX: event.deltaX,
			deltaY: event.deltaY,
			deltaZ: event.deltaZ,
			deltaMode: event.deltaMode
		});
		// console.log(customEvent)
		canvas.dispatchEvent(customEvent);
	},
	subSpawn: (url: string) => {
		createSubWorker(url);
	},
	meshCounter: () => {
		return numberMeshes.number;
	}
}

expose(babylonWorker);
