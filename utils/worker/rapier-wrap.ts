
import * as Comlink from 'comlink';
import { type World } from './rapier-treeshake';
export interface rapierWorkerType {
	dispose: () => Promise<void>,
	startPhysics: () => Promise<World>,
	getUpdate: () => Promise<ArrayBuffer | false>,
	newBody: (bodyObject: {
		meshId: number,
		p: {
			x: number,
			y: number,
			z: number,
		},
		r: {
			x: number,
			y: number,
			z: number,
			w: number,
		},
		mass: number,
		size: number,
	}) => Promise<boolean>,
	newBodies: (bodyObject: {
		meshId: number,
		p: {
			x: number,
			y: number,
			z: number,
		},
		r: {
			x: number,
			y: number,
			z: number,
			w: number,
		},
		mass: number,
		size: number,
	}[]) => Promise<boolean>,
}
export default (url: string) => {
	const rapierWorker: rapierWorkerType = Comlink.wrap(new Worker(url, { type: 'module' }));
	return rapierWorker;
}
