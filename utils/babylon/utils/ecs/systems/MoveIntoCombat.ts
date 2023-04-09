
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class MoveIntoCombat extends System {
		entitiesCollection = this.query(q => q.current
			.with(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat).write
			.using(
				Component.Monster.Collection.RestingInCollection,
				Component.Monster.Combat.ArchetypeCombatMonster,
				Component.Monster.Combat.FriendlyPosition).write);

		entitiesOnFriendlyBattlefield = this.query(q => q.current
			.with(Component.Monster.Combat.FriendlyPosition).write
		);

		entitiesWild = this.query(q => q.current
			.with(Component.Monster.Combat.TriggerMoveFromWildIntoCombat).write
			.using(Component.Monster.Combat.ArchetypeCombatMonster, Component.Monster.Combat.EnemyPosition).write
			.usingAll.write); // For entity.delete() to work, we need to use usingAll.

		entitiesOnEnemyBattlefield = this.query(q => q.current
			.with(Component.Monster.Combat.EnemyPosition).write
		);

		override execute () {
			const friendlyPositions = this.entitiesOnFriendlyBattlefield.current.map((entity) => { return entity });
			for (const entity of this.entitiesCollection.current) {
				entity.remove(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat);
				const occupiedPositions = friendlyPositions.map((entity) => {
					return entity.read(Component.Monster.Combat.FriendlyPosition).value;
				}
				);
				console.log('Occupied positions: ', occupiedPositions)
				const availablePositions = [1, 2, 3, 4].filter((position) => {
					return !occupiedPositions.includes(position);
				}
				);
				if (availablePositions.length > 0) {
					const position = availablePositions[0];
					entity.remove(Component.Monster.Collection.RestingInCollection);
					entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
					entity.add(Component.Monster.Combat.FriendlyPosition, { value: position });
					friendlyPositions.push(entity);
				} else {
					console.warn('No available positions!')
					// Put it back in the collection.
				}
			}
			const enemyPositions = this.entitiesOnEnemyBattlefield.current.map((entity) => { return entity });
			for (const entity of this.entitiesWild.current) {
				entity.remove(Component.Monster.Combat.TriggerMoveFromWildIntoCombat);
				const occupiedPositions = enemyPositions.map((entity) => {
					return entity.read(Component.Monster.Combat.EnemyPosition).value;
				}
				);
				const availablePositions = [1, 2, 3, 4].filter((position) => {
					return !occupiedPositions.includes(position);
				}
				);
				if (availablePositions.length > 0) {
					const position = availablePositions[0];
					entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
					entity.add(Component.Monster.Combat.EnemyPosition, { value: position });
					enemyPositions.push(entity);
				} else {
					console.warn('No available positions!')
					// TODO: Send it to a nice farm.
					entity.delete();
				}
			}
		}
	}
	return MoveIntoCombat;
}
