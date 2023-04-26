import { expose } from 'comlink';
import chooseRoute from '../babylon/chooseRoute';
import { numberMeshes } from '../nbody/everyFrame';
import { CustomMouseEvent } from './mouseEvents';
import spawnRapier from './rapier-wrap';

let canvas: OffscreenCanvas;

const babylonWorker = {
	dispose: () => {
		// await createScene.dispose();
		return self.close();
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
	meshCounter: () => {
		return numberMeshes.number;
	},
	initGame: async (initCanvas: OffscreenCanvas, navigationToLoad: string, rapierWorkerUrl: string) => {
		const rapierWorker = spawnRapier(rapierWorkerUrl)
		canvas = initCanvas as unknown as OffscreenCanvas;
		await chooseRoute(canvas, navigationToLoad, rapierWorker);
		return rapierWorker;
	},
}

expose(babylonWorker);
