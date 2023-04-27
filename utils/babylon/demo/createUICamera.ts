/* eslint-disable canonical/filename-match-regex */
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { type Scene } from '@babylonjs/core/scene';

export default (_canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	const camera = new FreeCamera('Camera', Vector3.Zero(), scene);
	camera.layerMask = 0x10_00_00_00;
	return camera;
};
