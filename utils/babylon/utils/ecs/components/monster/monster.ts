import { component, field, type Entity } from '@lastolivegames/becsy';
import _Collection from './collection';
import _Combat from './combat';

@component class Team {
	@field.staticString(['Friend', 'Foe', 'Other']) declare value: string;
}
@component class Health {
	@field.int16 declare value: number;
	@field.int16 declare baseValue: number;
}
@component class Attack {
	@field.int16 declare value: number;
	@field.int16 declare baseValue: number;
}
@component class Speed {
	@field.float64 declare value: number;
	@field.float64 declare baseValue: number;
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
	ArchetypeMonster,
	Collection,
	Combat
}
