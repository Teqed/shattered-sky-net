import { type rapierWorkerType } from '../../worker/rapier-wrap';
import { Engine } from '@babylonjs/core/Engines/engine';

// eslint-disable-next-line import/prefer-default-export
export class Game {
	private canvas: HTMLCanvasElement | OffscreenCanvas; // The canvas is the HTML element that is used to render the scene.

	private engine: Engine; // The engine is the BabylonJS engine that is used to render the scene.

	private rapierWorker: rapierWorkerType; // The rapier worker is the web worker that is used to run the physics simulation.

	public constructor(
		canvas: HTMLCanvasElement | OffscreenCanvas,
		_navigationToLoad: string,
		rapierWorker: rapierWorkerType,
	) {
		this.rapierWorker = rapierWorker;
		this.canvas = canvas as HTMLCanvasElement;
		this.engine = new Engine(this.canvas, true);
	}
}
