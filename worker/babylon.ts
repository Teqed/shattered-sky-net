// import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
// import * as Comlink from 'comlink';
import { expose } from 'comlink';
// import ballOnGround from './babylon/ballOnGround';
import manyCubes, { relayMouseEvent } from './babylon/manyCubes';

let engine: Engine;
let canvas: OffscreenCanvas;

const babylonWorker = {
	init: async (initCanvas: OffscreenCanvas) => {
		canvas = initCanvas as unknown as OffscreenCanvas;
		engine = new Engine(canvas, true);
		// const scene = ballOnGround(engine, canvas);
		const scene = await manyCubes(engine, canvas);
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
	mouseEvent: (
		type: string,
		x: number,
		y: number) => {
		relayMouseEvent(canvas,
			type,
			x,
			y);
	}
}

expose(babylonWorker);
