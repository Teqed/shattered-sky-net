import { component, field, type Entity } from '@lastolivegames/becsy';

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

export default {
	Energy,
	ActionReady,
	QueuedAction,
	Position,
	ArchetypeCombatMonster,
	IncomingDamage,
	CombatDisabled,
}
