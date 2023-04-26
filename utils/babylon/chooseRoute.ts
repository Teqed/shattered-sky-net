// import '@babylonjs/core/Helpers/sceneHelpers';
import { type rapierWorkerType } from '../worker/rapier-wrap';
// import manyIcosahedrons from '../../nbody/manyIcosahedrons';
// import { Game } from './initializeGame';

export default async (
	canvas: HTMLCanvasElement | OffscreenCanvas,
	navigationToLoad: string,
	rapierWorker: rapierWorkerType,
) => {
	switch (navigationToLoad) {
		case 'manyIcosahedrons': {
			const { default: manyIcosahedrons } = await import(
				'../nbody/manyIcosahedrons'
			);
			await manyIcosahedrons(canvas, rapierWorker);
			break;
		}

		case 'scene0': {
			const { Game } = await import('./prototype/initializeGame');
			const gameWorld = new Game(canvas, navigationToLoad, rapierWorker);
			console.log('gameWorld', gameWorld);
			break;
		}

		case 'scene1': {
			const { Game } = await import('./demo/initializeGame');
			const gameWorld = new Game(canvas, navigationToLoad, rapierWorker);
			break;
		}

		default: {
			console.error('no navigationToLoad');
			break;
		}
	}
};
