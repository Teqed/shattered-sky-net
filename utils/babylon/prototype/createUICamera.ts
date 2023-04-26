import { Scene } from '@babylonjs/core/scene';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export default (_canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	const camera = new FreeCamera('Camera', Vector3.Zero(), scene);
	camera.layerMask = 0x10000000;
	return camera;
}
