import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
// @ts-ignore
import amigaPattern from '../../../assets/textures/mygrid.jpg';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createUICamera from './createUICamera';
import createPixelCamera from './createPixelCamera';

export default async (scene: Scene, canvas: HTMLCanvasElement | OffscreenCanvas, rapierWorker: rapierWorkerType) => {
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	// Create a sphere, a box, and a cylinder
	// Sphere in the middle, box on the left, cylinder on the right
	const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
	sphere.position.x = 0;
	const box = MeshBuilder.CreateBox('box', { size: 1 }, scene);
	box.position.x = -2;
	const cylinder = MeshBuilder.CreateCylinder('cylinder', { diameter: 1, height: 2 }, scene);
	cylinder.position.x = 2;

	// Add textures
	const newMaterial = new StandardMaterial('newMaterial', scene);
	newMaterial.diffuseTexture = amigaTexture;
	sphere.material = newMaterial;
	box.material = newMaterial;
	cylinder.material = newMaterial;
	console.log(sphere, box, cylinder);

	const { camera: gameCam, shadows: shadowGenerator } = await createPixelCamera(canvas, scene);
	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [gameCam, UICam];
	// const objects = await initializeGame(this._scene, rapierWorker);
	// startEveryFrame(this._scene, objects, rapierWorker);
	const world = await rapierWorker.startPhysics();
	world.gravity = { x: 0, y: -9.81, z: 0 };

	// SOUNDS
	// this._loadSounds(scene);

	// CREATE ENVIRONMENT
	// const environment = new Environment(scene);
	// this._environment = environment;
	// Load environment and character assets
	// await this._environment.load();
	// await this._loadCharacterAssets(scene);

	// Create the player
	// this._player = new Player(this.assets, scene, shadowGenerator);

	// GAME LOOP
	// scene.onBeforeRenderObservable.add(() => {
	// 	// Loop
	// });
	// resolve promise

	try {
		shadowGenerator.getShadowMap()?.renderList?.push(sphere);
		shadowGenerator.getShadowMap()?.renderList?.push(box);
		shadowGenerator.getShadowMap()?.renderList?.push(cylinder);
	} catch (error) { }
};
