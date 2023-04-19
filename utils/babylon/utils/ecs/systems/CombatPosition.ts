import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';

export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class CombatPositionSystem extends System {
		friendlyEntitiesEntered = this.query(q => q.added
			.with(Component.Monster.Combat.FriendlyPosition)
			.using(Component.Monster.Combat.Position).write);

		enemyEntitiesEntered = this.query(q => q.added
			.with(Component.Monster.Combat.EnemyPosition)
			.using(Component.Monster.Combat.Position).write);

		override execute () {
			for (const entity of this.friendlyEntitiesEntered.added) {
				// An entity has gained one of the four valid friendly positions on the left side of the map.
				// We need to set its position to one of those positions.
				const friendlyPosition = entity.read(Component.Monster.Combat.FriendlyPosition);
				entity.add(Component.Monster.Combat.Position);
				const position = entity.write(Component.Monster.Combat.Position);
				// Now that we know which of the 4 positions this entity has, we can set its position.
				// Position 1 is at (-1, 0, 0).
				// Position 2 is at (-2, 0, 0).
				// Position 3 is at (-3, 0, 0).
				// Position 4 is at (-4, 0, 0).
				// These are arbitrary positions, but they are the positions that we will use for now.
				// We will use opposite positions for the enemy positions on the right side of the map.
				switch (friendlyPosition.value) {
					case 1:
						position.value = { x: -1, y: 0, z: 0 };
						break;
					case 2:
						position.value = { x: -2, y: 0, z: 0 };
						break;
					case 3:
						position.value = { x: -3, y: 0, z: 0 };
						break;
					case 4:
						position.value = { x: -4, y: 0, z: 0 };
						break;
				}
			}
			for (const entity of this.enemyEntitiesEntered.added) {
				const enemyPosition = entity.read(Component.Monster.Combat.EnemyPosition);
				entity.add(Component.Monster.Combat.Position);
				const position = entity.write(Component.Monster.Combat.Position);
				switch (enemyPosition.value) {
					case 1:
						position.value = { x: 1, y: 0, z: 0 };
						break;
					case 2:
						position.value = { x: 2, y: 0, z: 0 };
						break;
					case 3:
						position.value = { x: 3, y: 0, z: 0 };
						break;
					case 4:
						position.value = { x: 4, y: 0, z: 0 };
						break;
				}
			}
		}
	}
	return CombatPositionSystem;
}
