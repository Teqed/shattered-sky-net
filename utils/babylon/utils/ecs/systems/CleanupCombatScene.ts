import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
import { State } from '../../utilityTypes';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class CleanupCombatScene extends System {
	// This runs when all entities on the Foe team have been disabled.
	// It removes all entities from the scene except for the ones that belong to the collection.
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

		override execute () {
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
					// End combat state
					this.NarratorGameState.value = State.NoCombat;
				}
			}
			const allFriendlyDisabled = !this.activeCombatants.current.some(entity => entity.read(Component.Monster.Team).value === 'Friend');
			if (allFriendlyDisabled) {
				console.log('All friendly monsters have been disabled. Cleaning up combat scene.');
				window.alert('Defeat! All friendly monsters have been defeated.');
				for (const entity of this.defeatedFriendly.current) {
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
					// End combat state
					this.NarratorGameState.value = State.NoCombat;
				}
			}
		}
	}
	return CleanupCombatScene;
}
