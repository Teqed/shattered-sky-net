/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';

export default (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	scene.clearColor = new Color4(0, 0, 0, 0);
	const light = new HemisphericLight('light',
		new Vector3(0, 1, 0), scene);
	light.intensity = 0.5;
	// // Creates and positions a free camera
	// const camera = new FreeCamera('camera1',
	const camera = new ArcRotateCamera('Camera', -Math.PI / 5, Math.PI / 3, 200, Vector3.Zero(), scene);
	// 	new Vector3(0, 5, -10), scene);
	// 	// Targets the camera to scene origin
	camera.setTarget(new Vector3(-150, 0, 0));
	// camera.position = new Vector3(0, 0, -200);
	camera.radius = 750;
	camera.alpha = Math.PI / 1;
	camera.beta = Math.PI / 2;
	// prevent zooming through the floor
	camera.lowerRadiusLimit = 10;
	camera.zoomToMouseLocation = true;
	camera.wheelDeltaPercentage = 0.01;
	// This attaches the camera to the canvas
	camera.attachControl();
	scene.onPointerObservable.add((event) => {
		console.log('observable detected', event);
	});
	scene.pointerX = 0;
	scene.pointerY = 0;
	let isLeftMouseDown = false;
	let isRightMouseDown = false;
	let lastX = 0;
	let lastY = 0;
	// add event listener for mousedown,
	// if mousedown, move camera forward
	canvas.addEventListener('pointerdown', (event: any) => {
		if (event.button === 0) {
			isLeftMouseDown = true;
		}
		if (event.button === 2) {
			isRightMouseDown = true;
		}
	});
	canvas.addEventListener('pointerup', (event: any) => {
		if (event.button === 0) {
			isLeftMouseDown = false;
		}
		if (event.button === 2) {
			isRightMouseDown = false;
		}
	});
	canvas.addEventListener('pointermove', (event: any) => {
		if (isLeftMouseDown) {
			camera.beta += -0.01 * (event.y - lastY);
			camera.alpha += -0.01 * (event.x - lastX);
		}
		if (isRightMouseDown) {
			camera.target.y += 0.5 * (event.y - lastY);
			const cameraWorldMatrix = camera.getWorldMatrix();
			const cameraWorldMatrixInverse = Matrix.Invert(cameraWorldMatrix);
			const cameraLocalX = Vector3.TransformNormal(new Vector3(1, 0, 0), cameraWorldMatrixInverse);
			camera.target.addInPlace(cameraLocalX.scale(1 * (event.x - lastX)));
		}
		lastX = event.x;
		lastY = event.y;
		scene.pointerX = event.x;
		scene.pointerY = event.y;
	});
	canvas.addEventListener('wheel', (event: any) => {
		camera.radius += event.deltaY * 0.1;
	});
}
