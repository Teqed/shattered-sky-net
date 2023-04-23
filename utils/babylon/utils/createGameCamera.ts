
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { BlurPostProcess } from '@babylonjs/core/PostProcesses/blurPostProcess';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import * as BABYLONCAMERA from '@babylonjs/core/Cameras';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { Nullable } from '@babylonjs/core';
import * as BABYLON from '@babylonjs/core';

const createVisualChain = async (scene: Scene, camera: Nullable<BABYLONCAMERA.Camera>) => {
	// const nodeMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync('#KMBISP#10', scene)
	// const myPostProcess = nodeMaterial.createPostProcess(camera, 1.0, Texture.NEAREST_SAMPLINGMODE);
	// myPostProcess!.samples = 4;
	const glow = new GlowLayer('glow', scene);
	const blurPass1 = new BlurPostProcess('glareBlurPass1', new Vector2(1, 0), 6, 1.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());
	const blurPass2 = new BlurPostProcess('glareBlurPass2', new Vector2(0, 1), 6, 1.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());

	return {
		// myPostProcess,
		glow,
		blurPass1,
		blurPass2,
	}
}

export default async (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	scene.clearColor = Color4.FromHexString('#151729')
	const light = new HemisphericLight('light',
		new Vector3(0, 0.8, 0), scene);
	light.intensity = 0.5;
	scene.ambientColor = new BABYLON.Color3(0.62, 0.51, 0.68)
	// point spotlight at center of scene, have it slightly offset
	// so that it's not directly on top of the camera
	const spotlight = new SpotLight('spotlight', new Vector3(4, 8, 0), new Vector3(-4, -8, 0), Math.PI / 16, 2, scene);
	// Set spotlight color to gold
	spotlight.diffuse = Color3.FromHexString('#FFC566');
	const shadows = new ShadowGenerator(1024, spotlight);

	// const camera = new FreeCamera('Camera', new Vector3.Zero(), scene);
	// const camera = new ArcRotateCamera('Camera', -Math.PI / 5, Math.PI / 3, 200, Vector3.Zero(), scene);
	const camera = new ArcRotateCamera('Camera', Math.PI / 4, Math.PI / 3, 50, Vector3.Zero(), scene);
	const orthoSize = 5;
	camera.orthoTop = orthoSize;
	camera.orthoBottom = -orthoSize;
	camera.orthoLeft = -orthoSize;
	camera.orthoRight = orthoSize;
	camera.mode = BABYLONCAMERA.Camera.ORTHOGRAPHIC_CAMERA;
	camera.attachControl(canvas, true);
	// camera.setTarget(new Vector3(-150, 0, 0));
	camera.radius = 10;
	camera.alpha = 1.5;
	camera.beta = 0.45;
	scene.pointerX = 0;
	scene.pointerY = 0;
	camera.lowerRadiusLimit = 2
	camera.upperRadiusLimit = 500
	camera.wheelPrecision = 5
	camera.wheelDeltaPercentage = 0.01
	// eslint-disable-next-line no-constant-condition
	if (true) {
		// const fx =
		await createVisualChain(scene, camera)
		// let fxLevel = 0.10
		// const fxTarget = 0.20

		// scene.onReadyObservable.addOnce(() => {
		// 	scene.onBeforeRenderObservable.add(() => {
		// 		if (fxLevel < fxTarget) {
		// 		// @ts-ignore - private property is stil accessible
		// 			fx.downsample._options = fxLevel
		// 			fxLevel += 0.01
		// 			// fxLevel += 0.0005
		// 		} else {
		// 		// @ts-ignore - private property is stil accessible
		// 			fx.downsample._options = fxTarget
		// 		}
		// 	})
		// })
	}
	return {camera, shadows};
}
