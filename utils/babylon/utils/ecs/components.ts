/* eslint-disable @typescript-eslint/no-unused-vars */
import { component, field, system, System, World, type Entity } from '@lastolivegames/becsy';

@component export class UID {
	@field.int32 declare value: number;
}
@component export class Team {
	@field.staticString(['Friend', 'Foe', 'Other']) declare value: string;
}
@component export class Health {
	@field.int16 declare value: number;
	@field.int16 declare baseValue: number;
}
@component export class Attack {
	@field.int16 declare value: number;
	@field.int16 declare baseValue: number;
}
@component export class Speed {
	@field.float64 declare value: number;
	@field.float64 declare baseValue: number;
}
@component export class ArchetypeMonster {
	static validate (entity: Entity): void {
		if (entity.has(ArchetypeMonster)) {
			if (entity.has(Team) === false) {
				console.error('ArchetypeMonster must have Team');
			}
			if (entity.has(Health) === false) {
				console.error('ArchetypeMonster must have Health');
			}
			if (entity.has(Attack) === false) {
				console.error('ArchetypeMonster must have Attack');
			}
			if (entity.has(Speed) === false) {
				console.error('ArchetypeMonster must have Speed');
			}
		}
	}
}
@component export class RestingInCollection {
}
@component export class TriggerMoveFromCollectionIntoCombat {
}
@component export class ArchetypeCollectedMonster {
	static validate (entity: Entity): void {
		if (entity.has(ArchetypeCollectedMonster)) {
			if (entity.has(RestingInCollection) === false && entity.has(ArchetypeCombatMonster) === false) {
				console.error(
					'ArchetypeCollectedMonster must have RestingInCollection or ArchetypeCombatMonster');
			}
		}
	}
}
@component export class Energy {
	@field.float64 declare value: number;
}
@component export class ActionReady {
}
@component export class QueuedAction {
	@field.staticString([
		'AttackEnemies', 'AttackEnemy', 'HealSelf', 'HealAllies'
	]) declare value: string;
}
@component export class Position {
	// @field.float64 declare x: number;
	// @field.float64 declare y: number;
	// @field.float64 declare z: number;
	@field.float64.vector(
		['x', 'y', 'z']) declare value: { x: number; y: number; z: number; };
}
@component export class ArchetypeCombatMonster {
	static validate (entity: Entity): void {
		if (entity.has(ArchetypeCombatMonster)) {
			if (entity.has(Position) === false) {
				console.error('ArchetypeCombatMonster must have Position');
			}
			if (entity.has(QueuedAction) === false) {
				console.error('ArchetypeCombatMonster must have QueuedAction');
			}
			if (entity.has(Energy) === false) {
				console.error('ArchetypeCombatMonster must have Energy');
			}
		}
	}
}
@component export class IncomingDamage {
	@field.int16 declare value: number;
}
@component export class CombatDisabled {
}
