/* eslint-disable id-length */
// import '@babylonjs/core/Materials/Textures/baseTexture';
// import '@babylonjs/core/Rendering/edgesRenderer';
// @ts-expect-error - no types for image
import amigaPattern from '../../../assets/textures/mygrid.jpg';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createPixelCamera from './createPixelCamera';
import createUICamera from './createUICamera';
import { type Engine } from '@babylonjs/core/Engines/engine';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';
import { Control } from '@babylonjs/gui/2D/controls/control';

export default async (
	scene: Scene,
	_rapierWorker: rapierWorkerType,
	engine: Engine,
	canvas: HTMLCanvasElement,
) => {
	const { camera, shadows } = await createPixelCamera(canvas, scene);
	// Create a ground, and place a box on it
	// Create a rapier physics body too
	const ground = MeshBuilder.CreateBox(
		'ground',
		{ depth: 3, height: 0.01, width: 3 },
		scene,
	);
	ground.position.x = 0;
	ground.position.y = 0;
	ground.position.z = 0;
	const forGround = new StandardMaterial('forGround', scene);
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	forGround.diffuseTexture = amigaTexture;
	ground.material = forGround;
	// ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
	// ground.physicsImpostor.physicsBody.setFriction(0.5);
	// ground.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// ground.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// ground.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Static);
	// ground.physicsImpostor.physicsBody.setGravityEnabled(false);
	// ground.physicsImpostor.physicsBody.setActive(false);
	// ground.physicsImpostor.physicsBody.setCanSleep(false);

	const box = MeshBuilder.CreateBox(
		'box',
		{ depth: 0.75, height: 0.75, width: 0.75 },
		scene,
	);
	box.position.x = -0.75;
	box.position.y = 0.37;
	box.position.z = 0.75;
	box.rotate(new Vector3(0, 1, 0), Math.PI / 4);
	const forBox = new StandardMaterial('forBox', scene);
	const amigaSmallTexture = new Texture(amigaPattern, scene);
	amigaSmallTexture.updateSamplingMode(1);
	amigaSmallTexture.uScale = 1.5;
	amigaSmallTexture.vScale = 1.5;
	forBox.diffuseTexture = amigaSmallTexture;
	box.material = forBox;
	// box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
	// box.physicsImpostor.physicsBody.setFriction(0.5);
	// box.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// box.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// box.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Dynamic);
	// box.physicsImpostor.physicsBody.setGravityEnabled(true);
	// box.physicsImpostor.physicsBody.setActive(true);
	// box.physicsImpostor.physicsBody.setCanSleep(true);

	const box2 = MeshBuilder.CreateBox(
		'box2',
		{ depth: 0.55, height: 0.55, width: 0.55 },
		scene,
	);
	box2.position.x = 0;
	box2.position.y = 0.33;
	box2.position.z = 0;
	box2.rotate(new Vector3(0, 1, 0), Math.PI / 4);
	box2.material = forBox;
	const crystal = MeshBuilder.CreateIcoSphere(
		'crystal',
		{ radius: 0.25, subdivisions: 1 },
		scene,
	);
	crystal.position.x = 0;
	crystal.position.y = 1;
	crystal.position.z = 0;
	const forCrystal = new StandardMaterial('forCrystal', scene);
	forCrystal.diffuseColor = Color3.FromHexString('#1a548d');
	forCrystal.emissiveColor = Color3.FromHexString('#1a548d');
	crystal.material = forCrystal;

	// Add outline to crystal
	// crystal.enableEdgesRendering();

	let glowingBrighter = true;
	scene.onBeforeRenderObservable.add(() => {
		if (glowingBrighter) {
			forCrystal.emissiveColor.r += 0.002_5;
			forCrystal.emissiveColor.g += 0.002_5;
			forCrystal.emissiveColor.b += 0.002_5;
			if (forCrystal.emissiveColor.b >= 0.55) {
				glowingBrighter = false;
			}
		} else {
			forCrystal.emissiveColor.r -= 0.002_5;
			forCrystal.emissiveColor.g -= 0.002_5;
			forCrystal.emissiveColor.b -= 0.002_5;
			if (forCrystal.emissiveColor.b <= 0.33) {
				glowingBrighter = true;
			}
		}

		// rotate crystal
		crystal.rotate(new Vector3(0, 1, 0), Math.PI / 360);
	});

	try {
		shadows.getShadowMap()?.renderList?.push(ground);
		shadows.getShadowMap()?.renderList?.push(box);
		shadows.getShadowMap()?.renderList?.push(box2);
		shadows.getShadowMap()?.renderList?.push(crystal);
	} catch {
		console.error('Failed to add meshes to shadow map');
	}

	ground.receiveShadows = true;
	box.receiveShadows = true;
	box2.receiveShadows = true;
	crystal.receiveShadows = true;
	// rapierWorker.newBody(newBody)

	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [camera, UICam];
	const mainMenuUI = AdvancedDynamicTexture.CreateFullscreenUI(
		'UI',
		true,
		scene,
	);
	if (mainMenuUI.layer) {
		mainMenuUI.layer.layerMask = 0x10_00_00_00;
	} else {
		console.error('Failed to set layer mask for UI');
	}

	mainMenuUI.idealHeight = 720;
	// Create a game title text
	// It'll be big, bold, and white
	// Center it horizontally and place it middle-top of the screen
	const title = new TextBlock();
	title.text = 'Game Title';
	title.color = 'white';
	title.fontSize = 100;
	title.fontFamily = 'Viga';
	title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
	title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
	title.top = '100px';
	mainMenuUI.addControl(title);
	const createControl = (
		label: string,
		position: number,
		action?: () => void,
		disable?: boolean,
	) => {
		const button = Button.CreateSimpleButton(
			label.toLocaleLowerCase.toString(),
			label,
		);
		button.top = `${position}px`;
		button.fontFamily = 'Viga';
		button.width = 0.2;
		button.height = '30px';
		button.color = 'white';
		button.cornerRadius = 20;
		button.thickness = 0;
		button.background = 'black';
		button.onPointerEnterObservable.add(() => {
			button.color = 'black';
			button.background = 'white';
		});
		button.onPointerOutObservable.add(() => {
			button.color = 'white';
			button.background = 'black';
		});
		if (action) {
			button.onPointerDownObservable.add(() => action());
		}

		if (disable) {
			button.isHitTestVisible = false;
			button.alpha = 0.5;
		}

		mainMenuUI.addControl(button);
	};

	// const newGameBoo = () => {
	// 	if (loadedSaveSlot.name !== 'Unnamed') {
	// 		return false;
	// 	}

	// 	return true;
	// };

	createControl('CONTINUE', -70);
	createControl('NEW GAME', -35);
	createControl('LOAD GAME', 0);
	createControl('OPTIONS', 35);
	createControl('CREDITS', 70);
	// removeLoadingScreen();
};
