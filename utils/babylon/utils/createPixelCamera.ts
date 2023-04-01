
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { PassPostProcess } from '@babylonjs/core/PostProcesses/passPostProcess';
import { BlurPostProcess } from '@babylonjs/core/PostProcesses/blurPostProcess';
import { TonemapPostProcess, TonemappingOperator } from '@babylonjs/core/PostProcesses/tonemapPostProcess';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import * as BABYLONCAMERA from '@babylonjs/core/Cameras';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { Effect } from '@babylonjs/core/Materials/effect';
import { PostProcess } from '@babylonjs/core/PostProcesses/postProcess';
import { Nullable } from '@babylonjs/core';
import { NodeMaterial } from '@babylonjs/core/Materials/Node/nodeMaterial';
import * as BABYLON from '@babylonjs/core';

const createNewEffect = (scene: Scene) => {
	const nodeMaterial = new BABYLON.NodeMaterial('node', scene);

	// InputBlock
	const positiond = new BABYLON.InputBlock('position2d');
	positiond.visibleInInspector = false;
	positiond.visibleOnFrame = false;
	positiond.target = 1;
	positiond.setAsAttribute('position2d');

	// VectorMergerBlock
	const PositionD = new BABYLON.VectorMergerBlock('Position3D');
	PositionD.visibleInInspector = false;
	PositionD.visibleOnFrame = false;
	PositionD.target = 4;
	PositionD.xSwizzle = 'x';
	PositionD.ySwizzle = 'y';
	PositionD.zSwizzle = 'z';
	PositionD.wSwizzle = 'w';

	// InputBlock
	const Constant = new BABYLON.InputBlock('Constant1');
	Constant.visibleInInspector = false;
	Constant.visibleOnFrame = false;
	Constant.target = 1;
	Constant.value = 1;
	Constant.min = 0;
	Constant.max = 0;
	Constant.isBoolean = false;
	Constant.matrixMode = 0;
	Constant.animationType = BABYLON.AnimatedInputBlockTypes.None;
	Constant.isConstant = true;

	// VertexOutputBlock
	const VertexOutput = new BABYLON.VertexOutputBlock('VertexOutput');
	VertexOutput.visibleInInspector = false;
	VertexOutput.visibleOnFrame = false;
	VertexOutput.target = 1;

	// RemapBlock
	const uv = new BABYLON.RemapBlock('uv0');
	uv.visibleInInspector = false;
	uv.visibleOnFrame = false;
	uv.target = 4;
	uv.sourceRange = new BABYLON.Vector2(-1, 1);
	uv.targetRange = new BABYLON.Vector2(0, 1);

	// PosterizeBlock
	const Posterize = new BABYLON.PosterizeBlock('Posterize');
	Posterize.visibleInInspector = false;
	Posterize.visibleOnFrame = false;
	Posterize.target = 4;

	// InputBlock
	const Scale = new BABYLON.InputBlock('Scale');
	Scale.visibleInInspector = true;
	Scale.visibleOnFrame = false;
	Scale.target = 1;
	Scale.value = new BABYLON.Vector2(50, 50);
	Scale.isConstant = false;

	// CurrentScreenBlock
	const CurrentScreen = new BABYLON.CurrentScreenBlock('CurrentScreen');
	CurrentScreen.visibleInInspector = false;
	CurrentScreen.visibleOnFrame = false;
	// CurrentScreen.target = 2;

	// FragmentOutputBlock
	const FragmentOutput = new BABYLON.FragmentOutputBlock('FragmentOutput');
	FragmentOutput.visibleInInspector = false;
	FragmentOutput.visibleOnFrame = false;
	FragmentOutput.target = 2;
	FragmentOutput.convertToGammaSpace = false;
	FragmentOutput.convertToLinearSpace = false;
	FragmentOutput.useLogarithmicDepth = false;

	// Connections
	positiond.output.connectTo(PositionD.xyIn);
	Constant.output.connectTo(PositionD.w);
	PositionD.xyzw.connectTo(VertexOutput.vector);
	positiond.output.connectTo(uv.input);
	uv.output.connectTo(Posterize.value);
	Scale.output.connectTo(Posterize.steps);
	Posterize.output.connectTo(CurrentScreen.uv);
	CurrentScreen.rgba.connectTo(FragmentOutput.rgba);

	// Output nodes
	nodeMaterial.addOutputNode(VertexOutput);
	nodeMaterial.addOutputNode(FragmentOutput);
	nodeMaterial.build();

	return nodeMaterial;
}

const createVisualChain = async (scene: Scene, camera: Nullable<BABYLONCAMERA.Camera>) => {
	const nodeMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync('#KMBISP#8', scene)
	// const nodeMaterial = createNewEffect(scene);
	const myPostProcess = nodeMaterial.createPostProcess(camera, 1.0, Texture.NEAREST_SAMPLINGMODE);
	// myPostProcess!.samples = 4;
	const glow = new GlowLayer('glow', scene);
	// const downsample = new PassPostProcess('downsample', 0.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());
	const blurPass1 = new BlurPostProcess('glareBlurPass1', new Vector2(1, 0), 6, 1.0, scene.activeCamera, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine());
	const blurPass2 = new BlurPostProcess('glareBlurPass2', new Vector2(0, 1), 6, 1.0, scene.activeCamera, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine());
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
		glow,
		// downsample,
		blurPass1,
		blurPass2,
		// toneMap,
		// postProcess,
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
		const fx = await createVisualChain(scene, camera)
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
