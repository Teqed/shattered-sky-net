
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import {component, field, system, System, Type, World} from '@lastolivegames/becsy';
// @ts-ignore
import amigaPattern from '../../../assets/textures/mygrid.jpg';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createUICamera from './createUICamera';
import createPixelCamera from './createPixelCamera';

const createStartersBecsy = async (scene: Scene) => {
	// We're going to reimplement the starter selection screen using becsy instead of bitecs.
	// *** Setup texture ***
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	const checkeredMaterial = new StandardMaterial('newMaterial', scene);
	checkeredMaterial.diffuseTexture = amigaTexture;
	@component class UID {
		@field.int32 declare value: number;
	}
	@system class UIDSystem extends System {
		unassignedEntities = this.query(q => q.current.without(UID).write);
		assignedEntities = this.query(q => q.current.with(UID));

		override execute () {
			for (const entity of this.unassignedEntities.current) {
				let randomInt32 = crypto.getRandomValues(new Int32Array(1));
				let newUid = randomInt32[0];
				// Make sure the UID is unique by checking if it already exists
				while (this.assignedEntities.current.some(existingEntity => existingEntity.read(UID).value === newUid)) {
					randomInt32 = crypto.getRandomValues(new Int32Array(1));
					newUid = randomInt32[0];
				}

				entity.add(UID, { value: newUid });
			}
		}
	}
	@component class Position {
		// @field.float64 declare x: number;
		// @field.float64 declare y: number;
		// @field.float64 declare z: number;
		@field.float64.vector(['x', 'y', 'z']) declare xyz: { x: number, y: number, z: number }
		//  & [number, number, number];
	}
	@component class Team {
		@field.staticString(['Friend', 'Foe', 'Other']) declare value: string;
	}
	@component class Health {
		@field.int16 declare value: number;
	}
	@component class MaxHealth {
		@field.int16 declare value: number;
	}
	@component class IncomingDamage {
		@field.int16 declare value: number;
	}
	@component class Attack {
		@field.int16 declare value: number;
	}
	@component class Speed {
		@field.float64 declare value: number;
	}
	@component class Energy {
		@field.float64 declare value: number;
	}
	@component class QueuedAction {
		@field.staticString(['AttackEnemies', 'AttackEnemy', 'HealSelf', 'HealAllies']) declare value: string;
	}
	@component class CombatParticipant {
		// CombatParticipant is a tag component that indicates that an entity is participating in combat.
		// This is used to determine which entities should be included in combat queries.
	}
	@component class CombatDisabled {
		// Disabled entities cannot take actions.
		// We don't want to include them in queries where damage might be dealt,
		// actions are used, etc.
		// We might want to target them with a resurrection spell, though.
		// So they remain in combat but can't interact with its systems without being re-enabled.
	}
	@component class BelongsToCollection {
		// When monsters are captured, they are added to the collection.
		// This makes sure that when we're clearing the combat scene,
		// we don't remove the monsters from the collection.
	}
	@component class RestingInCollection {
		// When monsters are captured but not being used in combat,
		// they spend most of their time resting in the collection.
		// They are not in combat, but they are not disabled either.
	}
	@component class MoveFromCollectionIntoCombat {
		// When a monster in the collection is requested to be used in combat,
		// it gains this component so that the combat system can move it into combat.
	}
	@component class ActionReady {
		// Entities with ActionReady can take an action.
		// This component is added by the EnergySystem
		// when the entity has enough energy to take an action.
	}
	@system(s => s.after(UIDSystem)) class ListenForSpace extends System {
		entities = this.query(q => q.current
			.with(RestingInCollection).write
			.using(MoveFromCollectionIntoCombat).write);

		override initialize () {
			addEventListener('keydown', (event) => {
				if (event.code === 'Space') {
					console.log('Space pressed')
					for (const entity of this.entities.current) {
						entity.add(MoveFromCollectionIntoCombat);
						entity.remove(RestingInCollection);
					}
				}
			});
		}
	}
	@system(s => s.after(ListenForSpace)) class MoveIntoCombat extends System {
		entities = this.query(q => q.current
			.with(MoveFromCollectionIntoCombat).write
			.using(CombatParticipant, Position).write);

		override execute () {
			for (const entity of this.entities.current) {
				entity.remove(MoveFromCollectionIntoCombat);
				entity.add(CombatParticipant);
				// Generate a random position for the entity
				entity.add(Position);
				const position = entity.write(Position);
				position.xyz = { x: Math.random() * 10, y: 0, z: Math.random() * 10}
			}
		}
	}
	@system(s => s.after(MoveIntoCombat)) class EnergySystem extends System {
		entities = this.query(q => q.current
			.with(Speed, Energy).write
			.with(CombatParticipant)
			.without(ActionReady).write
			.without(CombatDisabled));

		override execute () {
			for (const entity of this.entities.current) {
				const speed = entity.read(Speed);
				const energy = entity.write(Energy);
				energy.value += speed.value * (this.delta);
				if (energy.value > 100) {
					energy.value = 0;
					entity.add(ActionReady);
				}
			}
		}
	}
	@system(s => s.after(EnergySystem)) class PositionSystem extends System {
		entitiesEntered = this.query(q => q.added.with(Position, UID));
		entitiesExited = this.query(q => q.removed.with(Position, UID));

		override execute () {
			for (const entity of this.entitiesExited.removed) {
				console.log(`Entity with ordinal ${entity.ordinal} has lost position!`);
				// Remove the mesh in BABYLONJS for this entity.
				const uid = entity.read(UID).value;
				try { const mesh = scene.getMeshByUniqueId(uid); mesh?.dispose(); } catch (error) { }
			}
			for (const entity of this.entitiesEntered.added) {
				console.log(`Entity with ordinal ${entity.ordinal} has gained position!`);
				// Create a mesh in BABYLONJS for this entity.
				const position = entity.read(Position);
				// Create sphere
				// Create material
				const material = new StandardMaterial('material', scene);
				// First, make sure no mesh already exists for the entity
				// const uid = UID.uid[entity];
				const uid = entity.read(UID).value;
				try { const meshOld = scene.getMeshByUniqueId(uid); meshOld?.dispose(); } catch (error) { }
				const mesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
				mesh.position = new Vector3(position.xyz.x, position.xyz.y, position.xyz.z);
				mesh.material = checkeredMaterial;
				// Give the mesh the UID so we can find it later
				mesh.metadata = {uid};
				mesh.uniqueId = uid;
			}
		}
	}
	@system(s => s.after(PositionSystem)) class ActionSystem extends System {
		// When an entity has enough energy to take an action, it gets the ActionReady component.
		// This system will then remove the ActionReady component and do the action.
		// First, query new entities with ActionReady.
		private readyEntities = this.query(q => q.added
			.with(ActionReady).write
			.with(Team, QueuedAction, Attack, CombatParticipant)
			.without(CombatDisabled));

		private combatants = this.query(q => q.current
			.with(Team, Health, CombatParticipant)
			.without(CombatDisabled)
			.using(IncomingDamage).write);

		override execute () {
			for (const entity of this.readyEntities.added) {
				entity.remove(ActionReady);
				// Read their queued action, and do it. It's a string that might be 'AttackEnemies'.
				const queuedAction = entity.read(QueuedAction);
				if (queuedAction.value === 'AttackEnemies') {
					console.log(`Entity with ordinal ${entity.ordinal} is attacking enemies!`);
					// Deal damage to the health of everyone on a different team
					const attack = entity.read(Attack);
					for (const combatant of this.combatants.current) {
						if (combatant.read(Team).value !== entity.read(Team).value) {
							// If they already have an incoming damage, add to it.
							// Otherwise, create a new incoming damage.
							if (combatant.has(IncomingDamage)) {
								const _incomingDamage = combatant.write(IncomingDamage);
								_incomingDamage.value += attack.value;
							} else {
								combatant.add(IncomingDamage, {value: attack.value});
							}
						}
					}
				} else {
					console.log(`Entity with ordinal ${entity.ordinal} is loafing about!`);
				}
			}
		}
	}
	@system(s => s.after(ActionSystem)) class DamageSystem extends System {
		// This system will apply incoming damage to health.
		// First, query new entities with IncomingDamage.
		private incomingDamageEntities = this.query(q => q.added
			.with(IncomingDamage, Health, Position).write
			.with(CombatParticipant)
			.without(CombatDisabled).write);

		override execute () {
			for (const entity of this.incomingDamageEntities.added) {
				const health = entity.write(Health);
				const incomingDamage = entity.read(IncomingDamage);
				health.value -= incomingDamage.value;
				entity.remove(IncomingDamage);
				if (health.value <= 0) {
					console.log(`Entity with ordinal ${entity.ordinal} has died!`);
					// Disable them from taking actions by adding the CombatDisabled component.
					entity.add(CombatDisabled);
				}
			}
		}
	}
	@system(s => s.after(DamageSystem)) class CleanupCombatScene extends System {
		// This runs when all entities on the Foe team have been disabled.
		// It removes all entities from the scene except for the ones that belong to the collection.
		private activeCombatants = this.query(q => q.current
			.with(CombatParticipant)
			.without(CombatDisabled)
			.using(Team).read);

		private defeatedFoes = this.query(q => q.current
			.with(CombatParticipant)
			.without(BelongsToCollection)
			.using(Position).write
			.usingAll.write);

		override execute () {
			const allFoesDisabled = !this.activeCombatants.current.some(entity => entity.read(Team).value === 'Foe');
			if (allFoesDisabled) {
				console.log('All foes have been disabled. Cleaning up combat scene.');
				window.alert('Victory! All foes have been defeated.')
				for (const entity of this.defeatedFoes.current) {
					// Remove them from the battlefield by removing their position.
					entity.remove(Position);
					// Remove the entity from the world.
					entity.delete();
				}
			}
		}
	}

	const world = await World.create();

	const createRandomMonster = () => {
		world.createEntity(
			Position, { xyz: [Math.random() * 10, Math.random() * 10, 0] },
			Speed, { value: Math.random() * 100 },
			Energy, { value: 0 },
			QueuedAction, { value: 'AttackEnemies' },
			Team, { value: 'Foe' },
			Attack, { value: 10 },
			Health, { value: 100 },
			CombatParticipant,
		)
	}
	for (let index = 0; index < 5; index++) {
		world.createEntity(
			Speed, { value: Math.random() * 100 },
			Energy, { value: 0 },
			QueuedAction, { value: 'AttackEnemies' },
			Team, { value: 'Friend' },
			Attack, { value: 10 },
			Health, { value: 100 },
			BelongsToCollection,
			RestingInCollection,
		)
		createRandomMonster();
	}
	setInterval(async () => {
		await world.execute()
	}, 1000 / 60);
};

export default async (scene: Scene, canvas: HTMLCanvasElement | OffscreenCanvas, rapierWorker: rapierWorkerType) => {
	createStartersBecsy(scene);
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
