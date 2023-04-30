import createPixelCamera from '../createPixelCamera';
import createUICamera from '../createUICamera';
import systems from './systems/systems';
import { type Scene } from '@babylonjs/core/scene';
import { createWorld, pipe } from 'bitecs';

export default async (scene: Scene, canvas: HTMLCanvasElement) => {
	const { camera } = await createPixelCamera(canvas, scene);
	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [camera, UICam];
	const world = createWorld();

	const allSytemsPipeline = pipe(
		systems.UIDSystem,
		systems.CombatPositionSystem,
		systems.MeshPositionSystem,
		systems.InputSystem,
	);
	// const allSytemsPipeline = systems.UIDSystem;
	// allSytemsPipeline(world);

	return { allSytemsPipeline, world };
};
