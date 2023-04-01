
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
	const nodeMaterial = new BABYLON.NodeMaterial('node');

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

	// eslint-disable-next-line dot-notation
	// Effect.ShadersStore['customFragmentShader'] = `
    // #ifdef GL_ES
    //     precision highp float;
    // #endif

	// uniform sampler2D tDiffuse;
	// uniform sampler2D tDepth;
	// uniform sampler2D tNormal;
	// uniform vec4 resolution;
	// uniform float normalEdgeStrength;
	// uniform float depthEdgeStrength;
	// varying vec2 vUV;
	// float getDepth(int x, int y) {
	// 	return texture2D( tDepth, vUV + vec2(x, y) * resolution.zw ).r;
	// }
	// vec3 getNormal(int x, int y) {
	// 	return texture2D( tNormal, vUV + vec2(x, y) * resolution.zw ).rgb * 2.0 - 1.0;
	// }
	// float depthEdgeIndicator(float depth, vec3 normal) {
	// 	float diff = 0.0;
	// 	diff += clamp(getDepth(1, 0) - depth, 0.0, 1.0);
	// 	diff += clamp(getDepth(-1, 0) - depth, 0.0, 1.0);
	// 	diff += clamp(getDepth(0, 1) - depth, 0.0, 1.0);
	// 	diff += clamp(getDepth(0, -1) - depth, 0.0, 1.0);
	// 	return floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.;
	// }
	// float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {
	// 	float depthDiff = getDepth(x, y) - depth;
	// 	vec3 neighborNormal = getNormal(x, y);

	// 	// Edge pixels should yield to faces who's normals are closer to the bias normal.
	// 	vec3 normalEdgeBias = vec3(1., 1., 1.); // This should probably be a parameter.
	// 	float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
	// 	float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);

	// 	// Only the shallower pixel should detect the normal edge.
	// 	float depthIndicator = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);
	// 	return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;
	// }
	// float normalEdgeIndicator(float depth, vec3 normal) {

	// 	float indicator = 0.0;
	// 	indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
	// 	indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
	// 	indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
	// 	indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);
	// 	return step(0.1, indicator);
	// }
	// void main() {
	// 	vec4 texel = texture2D( tDiffuse, vUV );
	// 	float depth = 0.0;
	// 	vec3 normal = vec3(0.0);
	// 	if (depthEdgeStrength > 0.0 || normalEdgeStrength > 0.0) {
	// 		depth = getDepth(0, 0);
	// 		normal = getNormal(0, 0);
	// 	}
	// 	float dei = 0.0;
	// 	if (depthEdgeStrength > 0.0)
	// 		dei = depthEdgeIndicator(depth, normal);
	// 	float nei = 0.0;
	// 	if (normalEdgeStrength > 0.0)
	// 		nei = normalEdgeIndicator(depth, normal);
	// 	float Strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);
	// 	gl_FragColor = texel * Strength;
	// }
	// `;
	// const postProcess = new PostProcess('My custom post process', 'custom', ['position'], null, 1.0, scene.activeCamera);
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
