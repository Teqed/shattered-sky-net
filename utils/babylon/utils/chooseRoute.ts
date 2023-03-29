
// import '@babylonjs/core/Helpers/sceneHelpers';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
// import { Game } from './initializeGame';
import manyIcosahedrons from '../../nbody/manyIcosahedrons';

export default async (
	canvas: HTMLCanvasElement | OffscreenCanvas,
	navigationToLoad: string,
	rapierWorker: rapierWorkerType,
) => {
	switch (navigationToLoad) {
		case 'manyIcosahedrons': {
			await manyIcosahedrons(canvas, rapierWorker);
			break; }
		case 'scene0': {
			// const gameWorld = new Game(canvas, navigationToLoad, rapierWorker);
			// console.log('gameWorld', gameWorld);
			console.log('scene0');
			break; }
		default: {
			console.error('no navigationToLoad');
			break; }
	}
};
