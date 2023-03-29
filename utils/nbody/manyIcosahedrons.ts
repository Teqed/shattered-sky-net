import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { type Mesh } from '@babylonjs/core/Meshes/mesh';
import { rapierWorkerType } from '../worker/rapier-wrap';
import nbodyCreateCamera from './createCamera';
import nbodyCreateObjects from './createObjects';
import nbodyStartEveryFrame from './everyFrame';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/core/Physics/physicsEngineComponent'

export default async function (canvas: HTMLCanvasElement | OffscreenCanvas, rapierWorker: rapierWorkerType) {
	const engine = new Engine(canvas, true);
	const scene = new Scene(engine);
	nbodyCreateCamera(canvas, scene);
	await rapierWorker.startPhysics();
	const objects: Mesh = await nbodyCreateObjects(scene, rapierWorker);
	engine.runRenderLoop(() => { scene.render() });
	nbodyStartEveryFrame(scene, objects, rapierWorker);
}
