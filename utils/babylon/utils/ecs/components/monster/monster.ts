import { component, field, type Entity } from '@lastolivegames/becsy';
import _Collection from './collection';
import _Combat from './combat';

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
	// The BaseStats component is used to create a new entity.
	// It has all the information needed to create a new monster.
	@field.int16 declare health: number;
	@field.int16 declare attack: number;
	@field.float64 declare speed: number;
}
@component class CreateMe {
	@field.staticString(['Friend', 'Foe', 'Other']) declare team: string;
	@field.staticString(['Combat', 'Collection']) declare destination: string;
	// This component should only exist on entities without the ArchetypeActiveMonster.
	// It will tell the narrator to transform this entity into an ArchetypeActiveMonster.
	static validate (entity: Entity): void {
		if (entity.has(CreateMe)) {
			if (entity.has(ArchetypeMonster)) {
				console.error('ActivateMe must not have ArchetypeActiveMonster');
			}
		}
	}
}
@component class Party {
	// Party monsters are currently equipped for use in combat.
}

@component class Wild {
	// Wild monsters exist in limbo.
	// They are neither in the collection or in combat.
}
@component class ArchetypeMonster {
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
const Collection = _Collection;
const Combat = _Combat;
export default {
	Team,
	Health,
	Attack,
	Speed,
	BaseStats,
	CreateMe,
	Party,
	Wild,
	ArchetypeMonster,
	Collection,
	Combat
}
