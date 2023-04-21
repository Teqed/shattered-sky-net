import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../../components/components';
import { State } from '../../../../utilityTypes';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class CutsceneSystem extends System {
		private NarratorGameState = this.singleton.write(Component.Narrator.GameState)
		private NarratorDesiredCutscene = this.singleton.write(Component.Narrator.DesiredCutscene)

		override execute () {
			if (this.NarratorGameState.value !== State.Cutscene) {
				return;
			}

			switch (this.NarratorDesiredCutscene.value) {
				case 'Intro':
					// Play the intro cutscene.
					// For now, as a placeholder, just change the game state to NoCombat.
					this.NarratorGameState.value = State.NoCombat;
					break;
				case 'Gameover':
					// Play the gameover cutscene.
					// For now, as a placeholder, just change the game state to Title.
					this.NarratorGameState.value = State.Title;
					break;
				default:
					// Unknown cutscene
					break;
			}
		}
	}

	return CutsceneSystem;
}
