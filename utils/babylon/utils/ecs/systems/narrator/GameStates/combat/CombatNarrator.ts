
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../../../components/components';
import { State } from '../../../../../utilityTypes';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class CombatNarrator extends System {
		entitiesCollection = this.query(q => q.current
			.with(Component.Monster.Party)
			.using(
				Component.Monster.Combat.ArchetypeCombatMonster,
				Component.Monster.Combat.FriendlyPosition,
				Component.Monster.Combat.QueuedAction,
				Component.Monster.Combat.Energy,
			).write);

		entitiesOnFriendlyBattlefield = this.query(q => q.current
			.with(Component.Monster.Combat.FriendlyPosition).write
		);

		entitiesWild = this.query(q => q.current
			.with(Component.Monster.Combat.TriggerMoveFromWildIntoCombat).write
			.using(Component.Monster.Combat.ArchetypeCombatMonster,
				Component.Monster.Combat.EnemyPosition,
				Component.Monster.Combat.QueuedAction,
				Component.Monster.Combat.Energy,
				Component.Monster.Wild,
			).write
			.usingAll.write); // For entity.delete() to work, we need to use usingAll.

		entitiesOnEnemyBattlefield = this.query(q => q.current
			.with(Component.Monster.Combat.EnemyPosition).write
		);

		private activeCombatants = this.query(q => q.current
			.with(Component.Monster.Combat.ArchetypeCombatMonster)
			.without(Component.Monster.Combat.CombatDisabled)
			.using(Component.Monster.Team).read);

		private defeatedFoes = this.query(q => q.current
			.with(Component.Monster.Combat.ArchetypeCombatMonster)
			.without(Component.Monster.Collection.ArchetypeCollectedMonster)
			.using(Component.Monster.Combat.Position).write
			.usingAll.write);

		private defeatedFriendly = this.query(q => q.current
			.with(Component.Monster.Combat.ArchetypeCombatMonster)
			.with(Component.Monster.Collection.ArchetypeCollectedMonster)
			.using(Component.Monster.Combat.Position).write
			.usingAll.write);

		private NarratorGameState = this.singleton.write(Component.Narrator.GameState);
		private NarratorDesiredCutscene = this.singleton.write(Component.Narrator.DesiredCutscene);

		private battlefieldInit = false;

		private setupBattlefield () {
			const friendlyPositions = this.entitiesOnFriendlyBattlefield.current.map((entity) => { return entity });
			for (const entity of this.entitiesCollection.current) {
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
					entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackEnemies' });
					entity.add(Component.Monster.Combat.Energy, { value: 0 });
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
					entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackEnemies' });
					entity.add(Component.Monster.Combat.Energy, { value: 0 });
					entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
					entity.add(Component.Monster.Combat.EnemyPosition, { value: position });
					entity.remove(Component.Monster.Wild);
					enemyPositions.push(entity);
				} else {
					console.warn('No available positions!')
					// TODO: Send it to a nice farm.
					entity.delete();
				}
			}
		}

		private checkForWinCondition () {
			const allFoesDisabled = !this.activeCombatants.current.some(entity => entity.read(Component.Monster.Team).value === 'Foe');
			if (allFoesDisabled) {
				console.log('All foes have been disabled. Cleaning up combat scene.');
				window.alert('Victory! All foes have been defeated.');
				for (const entity of this.defeatedFoes.current) {
				// Remove them from the battlefield by removing their position.
					entity.remove(Component.Monster.Combat.Position);
					if (entity.has(Component.Monster.Combat.EnemyPosition)) {
						entity.remove(Component.Monster.Combat.EnemyPosition);
					}
					if (entity.has(Component.Monster.Combat.FriendlyPosition)) {
						entity.remove(Component.Monster.Combat.FriendlyPosition);
					}
					entity.remove(Component.Monster.Combat.ArchetypeCombatMonster);
					// Remove the entity from the world.
					// entity.delete();
				}
				// End combat state
				this.battlefieldInit = false;
				this.NarratorGameState.value = State.NoCombat;
			} else {
				const allFriendlyDisabled = !this.activeCombatants.current.some(entity => entity.read(Component.Monster.Team).value === 'Friend');
				if (allFriendlyDisabled) {
					console.log('All friendly monsters have been disabled. Cleaning up combat scene.');
					window.alert('Defeat! All friendly monsters have been defeated.');
					for (const entity of this.activeCombatants.current) {
					// Remove them from the battlefield by removing their position.
						entity.remove(Component.Monster.Combat.Position);
						if (entity.has(Component.Monster.Combat.EnemyPosition)) {
							entity.remove(Component.Monster.Combat.EnemyPosition);
						}
						if (entity.has(Component.Monster.Combat.FriendlyPosition)) {
							entity.remove(Component.Monster.Combat.FriendlyPosition);
						}
						entity.remove(Component.Monster.Combat.ArchetypeCombatMonster);
						// Remove the entity from the world.
						// entity.delete();
					}
					// End combat state
					this.battlefieldInit = false;
					this.NarratorDesiredCutscene.value = 'Gameover';
					this.NarratorGameState.value = State.Cutscene;
				}
			}
		}

		override execute () {
			if (!this.battlefieldInit) {
				this.setupBattlefield();
				this.battlefieldInit = true;
			}
			this.checkForWinCondition();
		}
	}
	return CombatNarrator;
}
