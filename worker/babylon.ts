// import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
// import * as Comlink from 'comlink';
import { expose } from 'comlink';
import ballOnGround from './babylon/ballOnGround';

let engine: Engine;
let canvas: HTMLCanvasElement;

const babylonWorker = {
	init: (initCanvas: OffscreenCanvas) => {
		canvas = initCanvas as unknown as HTMLCanvasElement;
		engine = new Engine(canvas, true);
		const scene = ballOnGround(engine, canvas);
		engine.runRenderLoop(() => {
			scene.render();
		}
		);
	},
	resize: (width: number, height: number) => {
		canvas.width = width;
		canvas.height = height;
	}
}

expose(babylonWorker);
