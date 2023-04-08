
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class MoveIntoCombat extends System {
		entities = this.query(q => q.current
			.with(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat, Component.Monster.Collection.RestingInCollection).write
			.using(Component.Monster.Combat.ArchetypeCombatMonster, Component.Monster.Combat.Position).write);

		override execute () {
			for (const entity of this.entities.current) {
				entity.remove(Component.Monster.Collection.RestingInCollection);
				entity.remove(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat);
				entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
				// Generate a random position for the entity
				entity.add(Component.Monster.Combat.Position);
				const position = entity.write(Component.Monster.Combat.Position);
				position.value = { x: Math.random() * 10, y: 0, z: Math.random() * 10 };
			}
		}
	}
	return MoveIntoCombat;
}
