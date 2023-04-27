// import '@babylonjs/core/Meshes/thinInstanceMesh';
// import '@babylonjs/core/Physics/physicsEngineComponent';
// import '@babylonjs/core/Helpers/sceneHelpers';
// import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import * as BABYLON from '@babylonjs/core';
import * as BABYLONCAMERA from '@babylonjs/core/Cameras';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { BlurPostProcess } from '@babylonjs/core/PostProcesses/blurPostProcess';
import { type Scene } from '@babylonjs/core/scene';

const createVisualChain = async (scene: Scene) => {
	// const nodeMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync('#KMBISP#10', scene)
	// const myPostProcess = nodeMaterial.createPostProcess(camera, 1.0, Texture.NEAREST_SAMPLINGMODE);
	// myPostProcess!.samples = 4;
	const glow = new GlowLayer('glow', scene);
	const blurPass1 = new BlurPostProcess(
		'glareBlurPass1',
		new Vector2(1, 0),
		6,
		1,
		scene.activeCamera,
		Texture.NEAREST_SAMPLINGMODE,
		scene.getEngine(),
	);
	const blurPass2 = new BlurPostProcess(
		'glareBlurPass2',
		new Vector2(0, 1),
		6,
		1,
		scene.activeCamera,
		Texture.NEAREST_SAMPLINGMODE,
		scene.getEngine(),
	);

	return {
		blurPass1,
		blurPass2,
		// myPostProcess,
		// passProcess,
		glow,
	};
};

export default async (
	canvas: HTMLCanvasElement | OffscreenCanvas,
	scene: Scene,
) => {
	scene.clearColor = Color4.FromHexString('#151729');
	const light = new HemisphericLight('light', new Vector3(0, 0.8, 0), scene);
	light.intensity = 0.9;
	scene.ambientColor = new BABYLON.Color3(0.62, 0.51, 0.68);
	const spotlight = new SpotLight(
		'spotlight',
		new Vector3(4, 8, 0),
		new Vector3(-4, -8, 0),
		Math.PI / 16,
		2,
		scene,
	);
	spotlight.diffuse = Color3.FromHexString('#FFC566');
	const shadows = new ShadowGenerator(1_024, spotlight);
	const camera = new ArcRotateCamera(
		'Camera',
		Math.PI / 4,
		Math.PI / 3,
		50,
		Vector3.Zero(),
		scene,
	);
	const orthoSize = 2;
	camera.orthoTop = orthoSize;
	camera.orthoBottom = -orthoSize;
	camera.orthoLeft = -orthoSize;
	camera.orthoRight = orthoSize;
	camera.mode = BABYLONCAMERA.Camera.ORTHOGRAPHIC_CAMERA;
	camera.attachControl(canvas, true);
	scene.pointerX = 0;
	scene.pointerY = 0;
	camera.lowerRadiusLimit = 2;
	camera.upperRadiusLimit = 500;
	camera.wheelPrecision = 5;
	camera.wheelDeltaPercentage = 0.01;
	await createVisualChain(scene);

	return { camera, shadows };
};
