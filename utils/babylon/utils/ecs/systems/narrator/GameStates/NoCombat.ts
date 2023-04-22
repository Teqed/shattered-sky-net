import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../../components/components';
import { State } from '../../../../utilityTypes';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class NoCombatSystem extends System {
		private NarratorGameState = this.singleton.write(Component.Narrator.GameState)
		private narratorSearchForEncounters = this.singleton.write(Component.Narrator.SearchForEncounters)
		private monsters = this.query(q => q.current.with(Component.Monster.ArchetypeMonster)
			.using(
				Component.Monster.CreateMe,
				Component.Monster.BaseStats,
			).write);

		override execute () {
			if (this.NarratorGameState.value !== State.NoCombat) {
				return;
			}

			if (this.narratorSearchForEncounters.value) {
			// Search for new combat encounters.
			// Do this by rolling on the chosen encounter table.
			// For now, as a placeholder, just roll a random number.
				const randomEncounter = Math.random() < 0.1;
				if (randomEncounter) {
					console.log('Encounter found!')
					// Change the game state to Combat.
					this.NarratorGameState.value = State.Combat;
					// Spawn the combat encounter.
					// For now, as a placeholder, just spawn a random monster.
					this.createEntity(
						Component.Monster.CreateMe, { team: 'Foe', destination: 'Combat' },
						Component.Monster.BaseStats, { health: 10, attack: 1, speed: 25 },
					);
					this.narratorSearchForEncounters.value = 0;
				} else { console.log('No encounter found.'); }
			}
		}
	}

	return NoCombatSystem;
}
