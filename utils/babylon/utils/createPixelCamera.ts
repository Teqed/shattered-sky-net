
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
import { PassPostProcess } from '@babylonjs/core/PostProcesses/passPostProcess';

const createVisualChain = async (scene: Scene, camera: Nullable<BABYLONCAMERA.Camera>, engine: any) => {
	// const nodeMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync('#KMBISP#10', scene)
	// const myPostProcess = nodeMaterial.createPostProcess(camera, 1.0, Texture.NEAREST_SAMPLINGMODE);
	// myPostProcess!.samples = 4;
	const glow = new GlowLayer('glow', scene);
	// const downsample = new PassPostProcess('downsample', 0.05, scene.activeCamera, 1, scene.getEngine());
	// const passProcess = new BABYLON.PassPostProcess('pass', 1, camera);
	// passProcess.samples = 1;
	// const nodeMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync('1IHPPF', scene)
	// const myPostProcess = nodeMaterial.createPostProcess(camera, 1.0, Texture.NEAREST_SAMPLINGMODE);
	// const pixelateX = nodeMaterial.getBlockByName('pixelateSizeX');
	// const pixelateY = nodeMaterial.getBlockByName('pixelateSizeY');
	// engine.setSize(
	// 	Math.floor(window.innerWidth / 8),
	// 	Math.floor(window.innerHeight / 8)
	// );
	// let t = 0;
	// scene.onBeforeRenderObservable.add(() => {
	// 	// @ts-expect-error
	// 	pixelateX.value = 1 + Math.abs(Math.sin(t) * 50);
	// 	// @ts-expect-error
	// 	pixelateY.value = 1 + Math.abs(Math.sin(t) * 50);

	// 	t += 0.01;
	// });
	// engine.setHardwareScalingLevel(1);
	const blurPass1 = new BlurPostProcess('glareBlurPass1', new Vector2(1, 0), 6, 1.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());
	const blurPass2 = new BlurPostProcess('glareBlurPass2', new Vector2(0, 1), 6, 1.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());
	// const toneMap = new TonemapPostProcess('tonemap', TonemappingOperator.HejiDawson, 1.8, scene.activeCamera);
	// downsample.alwaysForcePOT = true;

	// 	Effect.ShadersStore['customVertexShader'] = `
	// 	#if defined(WEBGL2) || defines(WEBGPU)
	// precision highp sampler2DArray;
	// #endif
	// precision highp float;

	// //Attributes
	// attribute vec2 position;

	// //Uniforms
	// uniform vec2 u_Scale;

	// //Varyings
	// varying vec2 v_position;

	// //Constants
	// float u_Constant = 1.0;

	// //Entry point
	// void main(void) {

	// //Position3D
	// vec4 xyzw = vec4(position, 0.0, u_Constant).xyzw;

	// //VertexOutput
	// gl_Position = xyzw;
	// v_position = position;

	// }
	// `;

	// 	// eslint-disable-next-line dot-notation
	// 	Effect.ShadersStore['customFragmentShader'] = `
	// 	#if defined(WEBGL2) || defines(WEBGPU)
	// 	precision highp sampler2DArray;
	// 	#endif
	// 	precision highp float;

	// 	//Uniforms
	// 	uniform vec2 u_Scale;

	// 	//Samplers
	// 	uniform sampler2D textureSampler;

	// 	//Varyings
	// 	varying vec2 v_position;

	// 	//CurrentScreen
	// 	#include<helperFunctions>

	// 	//Constants
	// 	float u_Constant = 1.0;

	// 	//Entry point
	// 	void main(void) {

	// 	//uv0
	// 	vec2 output1 = 0.0 + (v_position - -1.0) * (1.0 - 0.0) / (1.0 - -1.0);

	// 	//Posterize
	// 	vec2 output0 = floor(output1 / (1.0 / u_Scale)) * (1.0 / u_Scale);

	// 	//CurrentScreen
	// 	vec4 tempTextureRead = texture2D(textureSampler, output0);
	// 	vec4 rgba = tempTextureRead.rgba;

	// 	//FragmentOutput
	// 	gl_FragColor = rgba;
	// 	#ifdef CONVERTTOLINEAR0
	// 	gl_FragColor = toLinearSpace(gl_FragColor);
	// 	#endif
	// 	#ifdef CONVERTTOGAMMA0
	// 	gl_FragColor = toGammaSpace(gl_FragColor);
	// 	#endif

	// 	}
	// 	`;
	// 	const postProcess = new PostProcess('My custom post process', 'custom', ['position'], null, 1.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());
	// postProcess.onApply = (effect) => {
	// 	// effect.setFloat2('screenSize', postProcess.width, postProcess.height);
	// 	// effect.setFloat('threshold', 0.60);
	// 	effect.setFloat('normalEdgeStrength', 2.0);
	// 	effect.setFloat('depthEdgeStrength', 1.0);
	// 	effect.setFloat('pixelSize', 6);
	// 	// postProcess.setPixelSize(6);
	// };

	return {
		// myPostProcess,
		// passProcess,
		glow,
		// downsample,
		blurPass1,
		blurPass2,
		// toneMap,
		// postProcess,
	}
}

export default async (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene, engine: any) => {
	scene.clearColor = Color4.FromHexString('#151729')
	const light = new HemisphericLight('light',
		new Vector3(0, 0.8, 0), scene);
	light.intensity = 0.9;
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
	const orthoSize = 2;
	camera.orthoTop = orthoSize;
	camera.orthoBottom = -orthoSize;
	camera.orthoLeft = -orthoSize;
	camera.orthoRight = orthoSize;
	camera.mode = BABYLONCAMERA.Camera.ORTHOGRAPHIC_CAMERA;
	camera.attachControl(canvas, true);
	// camera.setTarget(new Vector3(-150, 0, 0));
	// camera.radius = 50;
	// camera.alpha = Math.PI / 1;
	// camera.beta = Math.PI / 2;
	scene.pointerX = 0;
	scene.pointerY = 0;
	camera.lowerRadiusLimit = 2
	camera.upperRadiusLimit = 500
	camera.wheelPrecision = 5
	camera.wheelDeltaPercentage = 0.01
	// eslint-disable-next-line no-constant-condition
	if (true) {
		// const fx =
		await createVisualChain(scene, camera, engine)
		// let fxLevel = 0.01
		// const fxTarget = 0.05

		// scene.onReadyObservable.addOnce(() => {
		// 	scene.onBeforeRenderObservable.add(() => {
		// 		if (fxLevel < fxTarget) {
		// 		// @ts-ignore - private property is stil accessible
		// 			fx.downsample._options = fxLevel
		// 			fxLevel += 0.001
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
