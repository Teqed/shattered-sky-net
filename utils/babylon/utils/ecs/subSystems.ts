
// /* eslint-disable @typescript-eslint/no-unused-vars */
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { component, field, system, System, World, type Entity } from '@lastolivegames/becsy';
// @ts-ignore
import amigaPattern from '../../../../assets/textures/mygrid.jpg';
import * as Component from './components';
import { UIDSystem } from './systemUID';
import initializeInputSystem from './systemInput';

const InputSystem = initializeInputSystem(UIDSystem);

@system(s => s.after(InputSystem)) export class MoveIntoCombat extends System {
	entities = this.query(q => q.current
		.with(Component.TriggerMoveFromCollectionIntoCombat, Component.RestingInCollection).write
		.using(Component.ArchetypeCombatMonster, Component.Position).write);

	override execute () {
		for (const entity of this.entities.current) {
			entity.remove(Component.RestingInCollection);
			entity.remove(Component.TriggerMoveFromCollectionIntoCombat);
			entity.add(Component.ArchetypeCombatMonster);
			// Generate a random position for the entity
			entity.add(Component.Position);
			const position = entity.write(Component.Position);
			position.value = { x: Math.random() * 10, y: 0, z: Math.random() * 10 };
		}
	}
}
@system(s => s.after(MoveIntoCombat)) export class EnergySystem extends System {
	entities = this.query(q => q.current
		.with(Component.Speed, Component.Energy).write
		.with(Component.ArchetypeCombatMonster)
		.without(Component.ActionReady).write
		.without(Component.CombatDisabled));

	override execute () {
		for (const entity of this.entities.current) {
			const speed = entity.read(Component.Speed);
			const energy = entity.write(Component.Energy);
			energy.value += speed.value * (this.delta);
			if (energy.value > 100) {
				energy.value = 0;
				try { entity.add(Component.ActionReady); } catch (error) { }
			}
		}
	}
}
@system(s => s.after(EnergySystem)) export class ActionSystem extends System {
	// When an entity has enough energy to take an action, it gets the ActionReady component.
	// This system will then remove the ActionReady component and do the action.
	// First, query new entities with ActionReady.
	private readyEntities = this.query(q => q.added
		.with(Component.ActionReady).write
		.using(Component.Team, Component.QueuedAction, Component.Attack, Component.ArchetypeCombatMonster).read
		.without(Component.CombatDisabled));

	private combatants = this.query(q => q.current
		.with(Component.Team, Component.Health, Component.ArchetypeCombatMonster)
		.without(Component.CombatDisabled)
		.using(Component.IncomingDamage).write);

	override execute () {
		for (const entity of this.readyEntities.added) {
			entity.remove(Component.ActionReady);
			// Read their queued action, and do it. It's a string that might be 'AttackEnemies'.
			const queuedAction = entity.read(Component.QueuedAction);
			if (queuedAction.value === 'AttackEnemies') {
				console.log(`Entity with ordinal ${entity.ordinal} is attacking enemies!`);
				// Deal damage to the health of everyone on a different team
				const attack = entity.read(Component.Attack);
				for (const combatant of this.combatants.current) {
					if (combatant.read(Component.Team).value !== entity.read(Component.Team).value) {
						// If they already have an incoming damage, add to it.
						// Otherwise, create a new incoming damage.
						if (combatant.has(Component.IncomingDamage)) {
							const _incomingDamage = combatant.write(Component.IncomingDamage);
							_incomingDamage.value += attack.value;
						} else {
							combatant.add(Component.IncomingDamage, { value: attack.value });
						}
					}
				}
			} else {
				console.log(`Entity with ordinal ${entity.ordinal} is loafing about!`);
			}
		}
	}
}
export const initializePositionSystem = (scene: Scene) => {
	// *** Setup texture ***
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	const checkeredMaterial = new StandardMaterial('newMaterial', scene);
	checkeredMaterial.diffuseTexture = amigaTexture;
	@system(s => s.after(ActionSystem)) class PositionSystem extends System {
		entitiesEntered = this.query(q => q.added.with(Component.Position, Component.UID));
		entitiesExited = this.query(q => q.removed.with(Component.Position, Component.UID));
		// entitiesChanged = this.query(q => q.changed.with(Position, UID));

		override execute () {
			for (const entity of this.entitiesExited.removed) {
				console.log(`Entity with ordinal ${entity.ordinal} has lost position!`);
				const uid = entity.read(Component.UID).value;
				try { const mesh = scene.getMeshByUniqueId(uid); mesh?.dispose(); } catch (error) { }
			}
			for (const entity of this.entitiesEntered.added) {
				console.log(`Entity with ordinal ${entity.ordinal} has gained position!`);
				const position = entity.read(Component.Position);
				const uid = entity.read(Component.UID).value;
				try { const meshOld = scene.getMeshByUniqueId(uid); meshOld?.dispose(); } catch (error) { }
				const mesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
				mesh.position = new Vector3(position.value.x, position.value.y, position.value.z);
				mesh.material = checkeredMaterial;
				mesh.metadata = { uid };
				mesh.uniqueId = uid;
			}
		}
	}
}
@system(s => s.after(ActionSystem)) export class DamageSystem extends System {
	// This system will apply incoming damage to health.
	// First, query new entities with IncomingDamage.
	private incomingDamageEntities = this.query(q => q.added
		.with(Component.IncomingDamage, Component.Health, Component.Position).write
		.with(Component.ArchetypeCombatMonster)
		.without(Component.CombatDisabled).write);

	override execute () {
		for (const entity of this.incomingDamageEntities.added) {
			const health = entity.write(Component.Health);
			const incomingDamage = entity.read(Component.IncomingDamage);
			health.value -= incomingDamage.value;
			entity.remove(Component.IncomingDamage);
			if (health.value <= 0) {
				console.log(`Entity with ordinal ${entity.ordinal} has died!`);
				// Disable them from taking actions by adding the CombatDisabled component.
				entity.add(Component.CombatDisabled);
			}
		}
	}
}

@system(s => s.after(DamageSystem)) export class CleanupCombatScene extends System {
	// This runs when all entities on the Foe team have been disabled.
	// It removes all entities from the scene except for the ones that belong to the collection.
	private activeCombatants = this.query(q => q.current
		.with(Component.ArchetypeCombatMonster)
		.without(Component.CombatDisabled)
		.using(Component.Team).read);

	private defeatedFoes = this.query(q => q.current
		.with(Component.ArchetypeCombatMonster)
		.without(Component.ArchetypeCollectedMonster)
		.using(Component.Position).write
		.usingAll.write);

	override execute () {
		const allFoesDisabled = !this.activeCombatants.current.some(entity => entity.read(Component.Team).value === 'Foe');
		if (allFoesDisabled) {
			console.log('All foes have been disabled. Cleaning up combat scene.');
			window.alert('Victory! All foes have been defeated.');
			for (const entity of this.defeatedFoes.current) {
				// Remove them from the battlefield by removing their position.
				entity.remove(Component.Position);
				// Remove the entity from the world.
				entity.delete();
			}
		}
	}
}
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
// @system(s => s.after(CleanupCombatScene)) export class SerializeAllEntities extends System {
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
// @system(s => s.after(SerializeAllEntities)) export class DeserializeAllEntities extends System {
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
