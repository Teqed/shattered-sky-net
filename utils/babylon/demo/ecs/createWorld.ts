import createPixelCamera from '../createPixelCamera';
import createUICamera from '../createUICamera';
import { type Scene } from '@babylonjs/core/scene';
import { World } from 'thyseus';

export default async (scene: Scene, canvas: HTMLCanvasElement) => {
	const { camera } = await createPixelCamera(canvas, scene);
	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [camera, UICam];

	return await World.new().build();
};
