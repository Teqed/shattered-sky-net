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

		private NarratorMemoryOfStarter = this.query(q => q.current.with(Component.Narrator.Memory.Exists));
		// private NarratorMemoryOfStarter = this.singleton.write(Component.Narrator.Memory.Exists);
		private NarratorDesiredCutscene = this.singleton.write(Component.Narrator.DesiredCutscene);

		override execute () {
			if (this.NarratorGameState.value !== State.NoCombat) {
				return;
			}

			if (this.NarratorMemoryOfStarter.current.length === 0) {
				console.log('No memory of starter found.')
				console.log(this.NarratorMemoryOfStarter.current.length)
				// If the player has not received the starter yet, send them to the starter cutscene.
				this.NarratorDesiredCutscene.value = 'Starter';
				this.NarratorGameState.value = State.Cutscene;
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
