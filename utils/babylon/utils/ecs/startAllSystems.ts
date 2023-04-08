import { type Scene } from '@babylonjs/core/scene';
import { system, System, World } from '@lastolivegames/becsy';
import { type rapierWorkerType } from '../../../worker/rapier-wrap';
import createUICamera from '../createUICamera';
import createPixelCamera from '../createPixelCamera';
import * as Component from './components';
import initializeUIDSystem from './systems/UID';
import initializeInputSystem from './systems/Input';
import initializeMoveIntoCombatSystem from './systems/MoveIntoCombat';
import initializeEnergySystem from './systems/Energy';
import intializeActionSystem from './systems/Action';
import initializePositionSystem from './systems/Position';
import initializeDamageSystem from './systems/Damage';
import initializeCleanupCombatSceneSystem from './systems/CleanupCombatScene';

export default async (scene: Scene, canvas: HTMLCanvasElement | OffscreenCanvas, rapierWorker: rapierWorkerType) => {
	const UIDSystem = initializeUIDSystem();
	const InputSystem = initializeInputSystem(UIDSystem);
	const MoveIntoCombatSystem = initializeMoveIntoCombatSystem(InputSystem);
	const EnergySystem = initializeEnergySystem(MoveIntoCombatSystem);
	const ActionSystem = intializeActionSystem(EnergySystem);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const PositionSystem = initializePositionSystem(ActionSystem, scene);
	const DamageSystem = initializeDamageSystem(ActionSystem);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const CleanupCombatSceneSystem = initializeCleanupCombatSceneSystem(DamageSystem);

	interface EntityData {
		UID: {
			value: number;
		},
		Position: {
			value: [number, number, number];
		},
		Speed: {
			value: number;
			baseValue: number;
		},
		Energy: {
			value: number;
		},
		QueuedAction: {
			value: string;
		}
		Team: {
		// 'Foe', 'Friend', or 'Other'
		// 0, 1, or 2
			value: number;
		},
		Attack: {
			value: number;
			baseValue: number;
		},
		Health: {
			value: number;
			baseValue: number;
		},
		ArchetypeMonster: {
			value: boolean;
		},
		ArchetypeCombatMonster: {
			value: boolean;
		},
		ArchetypeCollectedMonster: {
			value: boolean;
		},
		RestingInCollection: {
			value: boolean;
		},
	}
	// @system(s => s.after(CleanupCombatScene)) class SerializeAllEntities extends System {
	// 	// This system will serialize all entities to JSON.
	// 	// First, query all entities.
	// 	private allEntities = this.query(q => q.current
	// 		.with(ArchetypeMonster, UID, Position)
	// 		.usingAll);

	// 	override execute () {
	// 		const entities: EntityData[] = [];
	// 		for (const entity of this.allEntities.current) {
	// 			const uid = entity.read(UID).value;
	// 			const positionX = entity.read(Position).value.x;
	// 			const positionY = entity.read(Position).value.y;
	// 			const positionZ = entity.read(Position).value.z;
	// 			const entityData: EntityData = {
	// 				UID: { value: uid },
	// 				Position: { value: [positionX, positionY, positionZ] }
	// 			};
	// 			entities.push(entityData);
	// 		}
	// 		console.log(entities)
	// 		// Serialize the entities to JSON.
	// 		const json = JSON.stringify(entities);
	// 		console.log(json);
	// 	}
	// }
	// @system(s => s.after(SerializeAllEntities)) class DeserializeAllEntities extends System {
	// 	private allEntities = this.query(q => q.current
	// 		.with(UID)
	// 		.using(Position, Speed, Energy, QueuedAction, Team, Attack, Health, ArchetypeMonster, ArchetypeCombatMonster));

	// 	override execute () {
	// 		const entities = JSON.parse('{"UID":{"value":0},"Position":{"xyz":[0,0,0]}}');
	// 		// Populate the world with entities from the JSON. Don't override any existing entities, based on UID.
	// 		for (const entityData of entities) {
	// 			const uid = entityData.UID.value;
	// 			const positionX = entityData.Position.xyz.x;
	// 			const positionY = entityData.Position.xyz.y;
	// 			const positionZ = entityData.Position.xyz.z;
	// 			const existingEntity = this.allEntities.current.find(entity => entity.read(UID).value === uid);
	// 			if (existingEntity) {
	// 				// Entity already exists. Do nothing.
	// 			} else {
	// 				// Create a new entity.
	// 				world.createEntity(
	// 					UID, { value: uid },
	// 					Position, { xyz: [positionX, positionY, positionZ] },
	// 					ArchetypeMonster
	// 				);
	// 			}
	// 		}
	// 	}
	// }

	const world = await World.create();

	const createRandomMonster = () => {
		world.createEntity(
			Component.Position, { value: [Math.random() * 10, Math.random() * 10, 0] },
			Component.Speed, { value: Math.random() * 100, baseValue: 100 },
			Component.Energy, { value: 0 },
			Component.QueuedAction, { value: 'AttackEnemies' },
			Component.Team, { value: 'Foe' },
			Component.Attack, { value: 10, baseValue: 10 },
			Component.Health, { value: 100, baseValue: 100 },
			Component.ArchetypeMonster,
			Component.ArchetypeCombatMonster
		);
	};
	for (let index = 0; index < 5; index++) {
		world.createEntity(
			Component.Speed, { value: Math.random() * 100, baseValue: 100 },
			Component.Energy, { value: 0 },
			Component.QueuedAction, { value: 'AttackEnemies' },
			Component.Team, { value: 'Friend' },
			Component.Attack, { value: 10, baseValue: 10 },
			Component.Health, { value: 100, baseValue: 100 },
			Component.ArchetypeMonster,
			Component.ArchetypeCollectedMonster,
			Component.RestingInCollection
		);
		createRandomMonster();
	}
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
	return world;
};
