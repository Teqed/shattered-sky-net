import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class CleanupCombatScene extends System {
	// This runs when all entities on the Foe team have been disabled.
	// It removes all entities from the scene except for the ones that belong to the collection.
		private activeCombatants = this.query(q => q.current
			.with(Component.ArchetypeCombatMonster)
			.without(Component.CombatDisabled)
			.using(Component.Team).read);

		private defeatedFoes = this.query(q => q.current
			.with(Component.ArchetypeCombatMonster)
			.without(Component.ArchetypeCollectedMonster)
			.using(Component.Position).write
			.usingAll.write);

		override execute () {
			const allFoesDisabled = !this.activeCombatants.current.some(entity => entity.read(Component.Team).value === 'Foe');
			if (allFoesDisabled) {
				console.log('All foes have been disabled. Cleaning up combat scene.');
				window.alert('Victory! All foes have been defeated.');
				for (const entity of this.defeatedFoes.current) {
				// Remove them from the battlefield by removing their position.
					entity.remove(Component.Position);
					// Remove the entity from the world.
					entity.delete();
				}
			}
		}
	}
	return CleanupCombatScene;
}
