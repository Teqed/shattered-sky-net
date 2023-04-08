import { component, type Entity } from '@lastolivegames/becsy';

@component class RestingInCollection {
}
@component class TriggerMoveFromCollectionIntoCombat {
}
@component class ArchetypeCollectedMonster {
	static validate (entity: Entity): void {
		if (entity.has(ArchetypeCollectedMonster)) {
			if (
				entity.has(RestingInCollection) === false
				// &&
				// entity.has(ArchetypeCombatMonster) === false
			) {
				console.error(
					'ArchetypeCollectedMonster must have RestingInCollection or ArchetypeCombatMonster');
			}
		}
	}
}

export default { RestingInCollection, TriggerMoveFromCollectionIntoCombat, ArchetypeCollectedMonster };
