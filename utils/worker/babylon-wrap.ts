// This is the only file in this directory that runs on the main thread.
import {
	wrap,
	transfer
} from 'comlink';
// @ts-expect-error
// eslint-disable-next-line import/default
import rapierWorkerUrl from './rapier-expose?worker&url';
import {type rapierWorkerType} from './rapier-wrap';
const worker = new Worker(new URL('../../utils/worker/babylon-expose.ts', import.meta.url), {
	type: 'module',
});
export interface babylonWorkerType {
	dispose: () => Promise<void>,
	resize: (width: number, height: number) => {
	/* ... */
	},
	mouseEvent: (event: {
		type: string,
		button: number,
		buttons: number,
		x: number,
		y: number,
		deltaY?: number,
		deltaX?: number,
		deltaZ?: number,
		deltaMode?: number,
	}
	) => {
	/* ... */
	},
	subSpawn: (url: string) => Promise<rapierWorkerType>,
	meshCounter: () => Promise<number>,
	initGame: (canvas: OffscreenCanvas, navigation: string, rapierWorker: rapierWorkerType) => Promise<rapierWorkerType>,
}
export const babylonWorker: babylonWorkerType = wrap(worker);
export const loadGame = async (canvas: HTMLCanvasElement, navigation: string) => {
	const offscreen = canvas.transferControlToOffscreen();
	const rapierWorker = await babylonWorker.initGame(transfer(offscreen, [offscreen]), navigation, rapierWorkerUrl);
	return {babylonWorker, rapierWorker};
};
