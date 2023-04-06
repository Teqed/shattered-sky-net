// /* eslint-disable @typescript-eslint/no-unused-vars */
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { component, field, system, System, World, type Entity } from '@lastolivegames/becsy';
// @ts-ignore
import amigaPattern from '../../../assets/textures/mygrid.jpg';

export default async (scene: Scene) => {
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
		@field.float64.vector(['x', 'y', 'z']) declare xyz: { x: number; y: number; z: number; };
	}
	@component class Team {
		@field.staticString(['Friend', 'Foe', 'Other']) declare value: string;
	}
	@component class Health {
		@field.int16 declare value: number;
	}
	@component class Attack {
		@field.int16 declare value: number;
	}
	@component class Speed {
		@field.float64 declare value: number;
	}
	@component class BaseStats {
		@field.int16 declare maxHealth: number;
		@field.int16 declare attack: number;
		@field.float64 declare speed: number;
	}
	@component class IncomingDamage {
		@field.int16 declare value: number;
	}
	@component class Energy {
		@field.float64 declare value: number;
	}
	@component class QueuedAction {
		@field.staticString(['AttackEnemies', 'AttackEnemy', 'HealSelf', 'HealAllies']) declare value: string;
	}
	@component class CombatDisabled {
	}
	@component class RestingInCollection {
	}
	@component class MoveFromCollectionIntoCombat {
	}
	@component class ActionReady {
	}
	@component class ArchetypeMonster {
		// This tag is attached to monsters and validates that they have the correct components.
		// This is a component with logic, which we'll almost never do,
		// but in this case the validate method works differently.
		// https://lastolivegames.github.io/becsy/guide/architecture/components.html#validating-component-combos
		// "All such validation methods will be called on all entities that had
		// component added or removed by a system, after that system has finished executing.
		// (So even though a validation method is defined on a specific component type for
		// convenience, it can actually validate any components on all entities.)"
		// Component validation is disabled in the performance build.
		// That means that we don't want to use any gamelogic in the validate function,
		// since this only provides developer feedback.
		static validate (entity: Entity): void {
			if (entity.has(ArchetypeMonster)) {
				if (entity.has(BaseStats) === false) {
					throw new Error('ArchetypeMonster must have BaseStats');
				}
				if (entity.has(Team) === false) {
					throw new Error('ArchetypeMonster must have Team');
				}
			}
		}
	}
	@component class ArchetypeCombatMonster {
		static validate (entity: Entity): void {
			if (entity.has(ArchetypeCombatMonster)) {
				if (entity.has(Health) === false) {
					throw new Error('ArchetypeCombatParticipant must have Health');
				}
				if (entity.has(Attack) === false) {
					throw new Error('ArchetypeCombatParticipant must have Attack');
				}
				if (entity.has(Speed) === false) {
					throw new Error('ArchetypeCombatParticipant must have Speed');
				}
			}
		}
	}
	@component class ArchetypeCollectedMonster {
		static validate (entity: Entity): void {
			if (entity.has(ArchetypeCollectedMonster)) {
				if (entity.has(RestingInCollection) === false && entity.has(ArchetypeCombatMonster) === false) {
					throw new Error('ArchetypeCollectedMonster must have RestingInCollection or ArchetypeCombatMonster');
				}
			}
		}
	}
	@system(s => s.after(UIDSystem)) class ListenForSpace extends System {
		entities = this.query(q => q.current
			.with(RestingInCollection).write
			.using(MoveFromCollectionIntoCombat).write);

		override initialize () {
			addEventListener('keydown', (event) => {
				if (event.code === 'Space') {
					console.log('Space pressed');
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
			.using(ArchetypeCombatMonster, Position).write);

		override execute () {
			for (const entity of this.entities.current) {
				entity.remove(MoveFromCollectionIntoCombat);
				entity.add(ArchetypeCombatMonster);
				// Generate a random position for the entity
				entity.add(Position);
				const position = entity.write(Position);
				position.xyz = { x: Math.random() * 10, y: 0, z: Math.random() * 10 };
			}
		}
	}
	@system(s => s.after(MoveIntoCombat)) class EnergySystem extends System {
		entities = this.query(q => q.current
			.with(Speed, Energy).write
			.with(ArchetypeCombatMonster)
			.without(ActionReady).write
			.without(CombatDisabled));

		override execute () {
			for (const entity of this.entities.current) {
				const speed = entity.read(Speed);
				const energy = entity.write(Energy);
				energy.value += speed.value * (this.delta);
				if (energy.value > 100) {
					energy.value = 0;
					try { entity.add(ActionReady); } catch (error) { }
				}
			}
		}
	}
	@system(s => s.after(EnergySystem)) class PositionSystem extends System {
		entitiesEntered = this.query(q => q.added.with(Position, UID));
		entitiesExited = this.query(q => q.removed.with(Position, UID));
		// entitiesChanged = this.query(q => q.changed.with(Position, UID));

		override execute () {
			for (const entity of this.entitiesExited.removed) {
				console.log(`Entity with ordinal ${entity.ordinal} has lost position!`);
				const uid = entity.read(UID).value;
				try { const mesh = scene.getMeshByUniqueId(uid); mesh?.dispose(); } catch (error) { }
			}
			for (const entity of this.entitiesEntered.added) {
				console.log(`Entity with ordinal ${entity.ordinal} has gained position!`);
				const position = entity.read(Position);
				const uid = entity.read(UID).value;
				try { const meshOld = scene.getMeshByUniqueId(uid); meshOld?.dispose(); } catch (error) { }
				const mesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
				mesh.position = new Vector3(position.xyz.x, position.xyz.y, position.xyz.z);
				mesh.material = checkeredMaterial;
				mesh.metadata = { uid };
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
			.with(Team, QueuedAction, Attack, ArchetypeCombatMonster)
			.without(CombatDisabled));

		private combatants = this.query(q => q.current
			.with(Team, Health, ArchetypeCombatMonster)
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
								combatant.add(IncomingDamage, { value: attack.value });
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
			.with(ArchetypeCombatMonster)
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@system(s => s.after(DamageSystem)) class CleanupCombatScene extends System {
		// This runs when all entities on the Foe team have been disabled.
		// It removes all entities from the scene except for the ones that belong to the collection.
		private activeCombatants = this.query(q => q.current
			.with(ArchetypeCombatMonster)
			.without(CombatDisabled)
			.using(Team).read);

		private defeatedFoes = this.query(q => q.current
			.with(ArchetypeCombatMonster)
			.without(ArchetypeCollectedMonster)
			.using(Position).write
			.usingAll.write);

		override execute () {
			const allFoesDisabled = !this.activeCombatants.current.some(entity => entity.read(Team).value === 'Foe');
			if (allFoesDisabled) {
				console.log('All foes have been disabled. Cleaning up combat scene.');
				window.alert('Victory! All foes have been defeated.');
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
			ArchetypeCombatMonster
		);
	};
	for (let index = 0; index < 5; index++) {
		world.createEntity(
			Speed, { value: Math.random() * 100 },
			Energy, { value: 0 },
			QueuedAction, { value: 'AttackEnemies' },
			Team, { value: 'Friend' },
			Attack, { value: 10 },
			Health, { value: 100 },
			ArchetypeCollectedMonster,
			RestingInCollection
		);
		createRandomMonster();
	}
	setInterval(async () => {
		await world.execute();
	}, 1000 / 60);
};
