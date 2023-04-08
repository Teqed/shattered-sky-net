
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class MoveIntoCombat extends System {
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
	return MoveIntoCombat;
}
