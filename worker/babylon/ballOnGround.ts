// import * as BABYLON from '@babylonjs/core'
// import { Engine, Scene, Color4, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Materials/standardMaterial';

export default (engine: Engine, canvas: HTMLCanvasElement) => {
	// Creates a basic Babylon Scene object
	const scene = new Scene(engine);
	// Set background color to transparent
	scene.clearColor = new Color4(0, 0, 0, 0);
	// Creates and positions a free camera
	const camera = new FreeCamera('camera1',
		new Vector3(0, 5, -10), scene);
		// Targets the camera to scene origin
	camera.setTarget(Vector3.Zero());
	// This attaches the camera to the canvas
	camera.attachControl(canvas, true);
	// Creates a light, aiming 0,1,0 - to the sky
	const light = new HemisphericLight('light',
		new Vector3(0, 1, 0), scene);
		// Dim the light a small amount - 0 to 1
	light.intensity = 0.7;
	// Built-in 'sphere' shape.
	const sphere = MeshBuilder.CreateSphere('sphere',
		{diameter: 2, segments: 32}, scene);
		// Move the sphere upward 1/2 its height
	sphere.position.y = 1;
	// Built-in 'ground' shape.
	MeshBuilder.CreateGround('ground',
		{width: 6, height: 6}, scene);
	return scene;
};
