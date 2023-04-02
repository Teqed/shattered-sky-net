/* eslint-disable vue/one-component-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import {
	createWorld,
	addEntity,
	removeEntity,
	Types,
	defineComponent,
	addComponent,
	removeComponent,
	hasComponent,
	defineQuery,
	Changed,
	Not,
	enterQuery,
	exitQuery,
	defineSerializer,
	defineDeserializer,
	pipe,
} from 'bitecs'
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
// @ts-ignore
import amigaPattern from '../../../assets/textures/mygrid.jpg';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createUICamera from './createUICamera';
import createPixelCamera from './createPixelCamera';

const createStarters = (scene: Scene) => {
	const f32Vector2 = { x: Types.f32, y: Types.f32 };
	const f32Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };
	const f32Vector4 = { x: Types.f32, y: Types.f32, z: Types.f32, w: Types.f32 };
	const f32List16 = [Types.f32, 16];
	// *** Create a game that plays in the console for prototype purposes ***
	// First, the player needs to choose a starter monster. We'll offer three of them, functionally identical for now.
	// Later on, we'll add more monsters with different abilities, so they'll need to be able to change.
	// The player will choose a starter monster by clicking on it.
	// The player will then be taken to the game screen.
	// *** Create monster entity ***
	// The monster entity will be used for most mobs, friendly and foe alike.
	// It will have components for health, attack, defense, and equipment.
	// It will also have a component for the monster's sprite.
	// We're using bitecs for ECS.
	interface WorldType {
		time: {
			delta: number;
			elapsed: number;
			then: number;
		};
	}
	const worldECS: WorldType = createWorld();
	// worldECS.time = {
	// 	delta: 0,
	// 	elapsed: 0,
	// 	then: performance.now(),
	// }
	// const timeSystem = (world: WorldType) => {
	// 	const { time } = world;
	// 	const now = performance.now();
	// 	const delta = now - time.then
	// 	time.delta = delta;
	// 	time.elapsed += delta;
	// 	time.then = now;
	// };
	// Create a component for the monster's sprite
	// When the monster asks to be drawn, it will use this sprite
	const Sprite = defineComponent({
		sprite: Types.ui8c
	});
	// Create a component for the monster's health
	// When the monster takes damage, it will lose health
	const Health = defineComponent({
		health: Types.i16
	});
	// Create a component for the monster's attack
	// When the monster attacks, it will deal damage
	const Attack = defineComponent({
		attack: Types.i16
	});
	// Create a component for the monster's defense
	// When the monster takes damage, it will lose health
	const Defense = defineComponent({
		defense: Types.i16
	});
	// Create a component for the monster's weapon
	// It's part of determining the monster's attack
	const Weapon = defineComponent({
		weapon: Types.ui8c
	});
	// Create a component for the monster's armor
	// It's part of determining the monster's defense
	const Armor = defineComponent({
		armor: Types.ui8c
	});
	// Create a component for the monster's species (e.g. "dragon")
	// It's part of determining the monster's sprite, name, stats, and abilities
	const Species = defineComponent({
		species: Types.ui8c
	});
	// Create a component for the monster's name
	const Name = defineComponent({
		name: Types.ui8c
	});
	// Create a component for the monster's position
	const Position = defineComponent({
		f32Vector3
	});
	// Create a component for the monster's velocity
	const Velocity = defineComponent({
		f32Vector3
	});
	// Create a component for the monster's UID
	const UID = defineComponent({
		uid: Types.f32
	});

	// *** Create a query ***
	const positionQuery = defineQuery([Position]);
	const enteredPositionQuery = enterQuery(positionQuery);
	const exitedPositionQuery = exitQuery(positionQuery);
	// *** Setup texture ***
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	const checkeredMaterial = new StandardMaterial('newMaterial', scene);
	checkeredMaterial.diffuseTexture = amigaTexture;
	// *** Create a system ***
	const positionSystem = (world: WorldType) => {
		// For entities that have exited the query, console.log their name and position
		const entitiesThatExitedPositionQuery = exitedPositionQuery(world);
		for (let index = 0; index < entitiesThatExitedPositionQuery.length; index++) {
			const entity = entitiesThatExitedPositionQuery[index];
			const name = Name.name[entity];
			const position = {x: Position.f32Vector3.x[entity],
				y: Position.f32Vector3.y[entity],
				z: Position.f32Vector3.z[entity]};
			console.log(`Entity ${name} exited the position query with position ${position.x}, ${position.y}, ${position.z}`);
			// Find the mesh for the entity and remove it by using the entity's UID
			const uid = UID.uid[entity];
			const mesh = scene.getMeshByUniqueId(uid);
			try { mesh?.dispose(); } catch (error) {
				console.log(error);
			}
		}
		// For entities that have entered the query, console.log their name and position
		const entitiesThatEnteredPositionQuery = enteredPositionQuery(world);
		for (let index = 0; index < entitiesThatEnteredPositionQuery.length; index++) {
			const entity = entitiesThatEnteredPositionQuery[index];
			const name = Name.name[entity];
			const position = {x: Position.f32Vector3.x[entity],
				y: Position.f32Vector3.y[entity],
				z: Position.f32Vector3.z[entity]};
			console.log(`Entity ${name} entered the position query with position ${position.x}, ${position.y}, ${position.z}`);
			// Create a mesh for the entity at the position
			const mesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
			mesh.position = new Vector3(position.x, position.y, position.z);
			mesh.material = checkeredMaterial;
			// Give the mesh the UID so we can find it later
			mesh.metadata = {uid: UID.uid[entity]};
			mesh.uniqueId = UID.uid[entity];
		}
		const entitiesThatHavePosition = positionQuery(world);
		// For every entity with a position, console.log their name and position
		for (let index = 0; index < entitiesThatHavePosition.length; index++) {
			const entity = entitiesThatHavePosition[index];
			const name = Name.name[entity];
			const position = {x: Position.f32Vector3.x[entity],
				y: Position.f32Vector3.y[entity],
				z: Position.f32Vector3.z[entity]};
			// console.log(`Entity ${name} has position ${position.x}, ${position.y}, ${position.z}`);
		}
		return world;
	}

	const pipeline = pipe(
		positionSystem,
		// timeSystem
	);
	setInterval(() => {
		pipeline(worldECS);
		// positionSystem(worldECS);
	}, 1000);
	// *** Create a monster ***
	// Create a monster entity named Blue
	const blue = addEntity(worldECS);
	// Add the monster's UID component
	addComponent(worldECS, UID, blue);
	// Add the monster's sprite component
	addComponent(worldECS, Sprite, blue);
	// Add the monster's health component
	addComponent(worldECS, Health, blue);
	// Add the monster's attack component
	addComponent(worldECS, Attack, blue);
	// Add the monster's defense component
	addComponent(worldECS, Defense, blue);
	// Add the monster's weapon component
	addComponent(worldECS, Weapon, blue);
	// Add the monster's armor component
	addComponent(worldECS, Armor, blue);
	// Add the monster's species component
	addComponent(worldECS, Species, blue);
	// Add the monster's name component
	addComponent(worldECS, Name, blue);
	// Set the monster's UID, a 14-digit random number
	UID.uid[blue] = Math.random() * 100000000000000;
	// Set the monster's sprite
	Sprite.sprite[blue] = 0;
	// Set the monster's health
	Health.health[blue] = 10;
	// Set the monster's attack
	Attack.attack[blue] = 5;
	// Set the monster's defense
	Defense.defense[blue] = 5;
	// Set the monster's weapon
	Weapon.weapon[blue] = 0;
	// Set the monster's armor
	Armor.armor[blue] = 0;
	// Set the monster's species
	Species.species[blue] = 0;
	// Set the monster's name
	Name.name[blue] = 0;
	// *** Create a monster ***
	// Create a monster entity named Red
	const red = addEntity(worldECS);
	// Add the monster's UID component
	addComponent(worldECS, UID, red);
	// Add the monster's sprite component
	addComponent(worldECS, Sprite, red);
	// Add the monster's health component
	addComponent(worldECS, Health, red);
	// Add the monster's attack component
	addComponent(worldECS, Attack, red);
	// Add the monster's defense component
	addComponent(worldECS, Defense, red);
	// Add the monster's weapon component
	addComponent(worldECS, Weapon, red);
	// Add the monster's armor component
	addComponent(worldECS, Armor, red);
	// Add the monster's species component
	addComponent(worldECS, Species, red);
	// Add the monster's name component
	addComponent(worldECS, Name, red);
	// Set the monster's UID, a 14-digit random number
	UID.uid[red] = Math.random() * 100000000000000;
	// Set the monster's sprite
	Sprite.sprite[red] = 1;
	// Set the monster's health
	Health.health[red] = 10;
	// Set the monster's attack
	Attack.attack[red] = 5;
	// Set the monster's defense
	Defense.defense[red] = 5;
	// Set the monster's weapon
	Weapon.weapon[red] = 0;
	// Set the monster's armor
	Armor.armor[red] = 0;
	// Set the monster's species
	Species.species[red] = 0;
	// Set the monster's name
	Name.name[red] = 1;
	// *** Place Red and Blue in the world ***
	// Add the monster's position component
	addComponent(worldECS, Position, blue);
	addComponent(worldECS, Position, red);
	// Set the monster's position
	Position.f32Vector3.x[blue] = 0;
	Position.f32Vector3.y[blue] = 0;
	Position.f32Vector3.z[blue] = 0;
	Position.f32Vector3.x[red] = 1;
	Position.f32Vector3.y[red] = 0;
	Position.f32Vector3.z[red] = 0;

	// Wait 10 seconds, then remove Red
	setTimeout(() => {
		removeEntity(worldECS, red);
	}, 10000);
	// Wait 20 seconds, then remove Blue
	setTimeout(() => {
		removeEntity(worldECS, blue);
	}, 20000);
};

export default async (scene: Scene, canvas: HTMLCanvasElement | OffscreenCanvas, rapierWorker: rapierWorkerType) => {
	createStarters(scene);
	// *** Create some placeholder objects ***
	// const amigaTexture = new Texture(amigaPattern, scene);
	// amigaTexture.uScale = 3;
	// amigaTexture.vScale = 3;
	// amigaTexture.updateSamplingMode(1);
	// Create a sphere, a box, and a cylinder
	// Sphere in the middle, box on the left, cylinder on the right
	// const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
	// sphere.position.x = 0;
	// const box = MeshBuilder.CreateBox('box', { size: 1 }, scene);
	// box.position.x = -2;
	// const cylinder = MeshBuilder.CreateCylinder('cylinder', { diameter: 1, height: 2 }, scene);
	// cylinder.position.x = 2;

	// Add textures
	// const newMaterial = new StandardMaterial('newMaterial', scene);
	// newMaterial.diffuseTexture = amigaTexture;
	// sphere.material = newMaterial;
	// box.material = newMaterial;
	// cylinder.material = newMaterial;
	// console.log(sphere, box, cylinder);

	const { camera: gameCam, shadows: shadowGenerator } = await createPixelCamera(canvas, scene);
	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [gameCam, UICam];
	// const objects = await initializeGame(this._scene, rapierWorker);
	// startEveryFrame(this._scene, objects, rapierWorker);
	const worldPhysics = await rapierWorker.startPhysics();
	worldPhysics.gravity = { x: 0, y: -9.81, z: 0 };

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
		// shadowGenerator.getShadowMap()?.renderList?.push(sphere);
		// shadowGenerator.getShadowMap()?.renderList?.push(box);
		// shadowGenerator.getShadowMap()?.renderList?.push(cylinder);
	} catch (error) { }
};
