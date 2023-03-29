
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { PassPostProcess } from '@babylonjs/core/PostProcesses/passPostProcess';
import { BlurPostProcess } from '@babylonjs/core/PostProcesses/blurPostProcess';
import { TonemapPostProcess, TonemappingOperator } from '@babylonjs/core/PostProcesses/tonemapPostProcess';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';

const createVisualChain = (scene: Scene) => {
	const glow = new GlowLayer('glow', scene);
	const downsample = new PassPostProcess('downsample', 0.0, scene.activeCamera, Texture.NEAREST_SAMPLINGMODE, scene.getEngine());
	const blurPass1 = new BlurPostProcess('glareBlurPass1', new Vector2(1, 0), 6, 1.0, scene.activeCamera, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine());
	const blurPass2 = new BlurPostProcess('glareBlurPass2', new Vector2(0, 1), 6, 1.0, scene.activeCamera, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine());
	const toneMap = new TonemapPostProcess('tonemap', TonemappingOperator.HejiDawson, 1.8, scene.activeCamera);
	// Create an outline pass
	const outline = new PassPostProcess('outline', 1.0, scene.activeCamera, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine());

	return {
		glow,
		downsample,
		blurPass1,
		blurPass2,
		toneMap,
		outline
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	scene.clearColor = Color4.FromInts(135, 206, 250, 255);
	const light = new HemisphericLight('light',
		new Vector3(0, 1, 0), scene);
	light.intensity = 0.5;
	// const camera = new FreeCamera('Camera', new Vector3.Zero(), scene);
	const camera = new ArcRotateCamera('Camera', -Math.PI / 5, Math.PI / 3, 200, Vector3.Zero(), scene);
	camera.setTarget(new Vector3(-150, 0, 0));
	camera.radius = 50;
	camera.alpha = Math.PI / 1;
	camera.beta = Math.PI / 2;
	scene.pointerX = 0;
	scene.pointerY = 0;
	camera.lowerRadiusLimit = 3.5
	camera.upperRadiusLimit = 20
	camera.wheelPrecision = 50
	// scene.ambientColor = new BABYLON.Color3(0.62, 0.51, 0.68)
	const fx = createVisualChain(scene)
	let fxLevel = 0.0
	const fxTarget = 0.20

	scene.onReadyObservable.addOnce(() => {
		scene.onBeforeRenderObservable.add(() => {
			if (fxLevel < fxTarget) {
				// @ts-ignore - private property is stil accessible
				fx.downsample._options = fxLevel
				fxLevel += 0.0005
			} else {
				// @ts-ignore - private property is stil accessible
				fx.downsample._options = fxTarget
			}
		})
	})
}
