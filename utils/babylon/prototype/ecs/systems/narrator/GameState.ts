import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../components/components';
import { State } from '../../../utilityTypes';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class GameStateSystem extends System {
		private NarratorGameState = this.singleton.write(Component.Narrator.GameState);
		private lastGameState = State.Preload;

		private _dispatchStateEvent = (gameState: number) => {
			window.dispatchEvent(new CustomEvent('gameStateChange', { detail: { gameState } }));
		};

		override initialize () {
			this.NarratorGameState.value = State.Preload;
		}

		override execute () {
			if (this.NarratorGameState.value !== this.lastGameState) {
				switch (this.NarratorGameState.value) {
					case State.Title:
						// Send an event to the window to change the gamemode.
						this._dispatchStateEvent(State.Title);
						break;
					case State.NoCombat:
						this._dispatchStateEvent(State.NoCombat);
						break;
					case State.Combat:
						this._dispatchStateEvent(State.Combat);
						break;
					case State.Collection:
						this._dispatchStateEvent(State.Collection);
						break;
					case State.Cutscene:
						this._dispatchStateEvent(State.Cutscene);
						break;
					default:
						// Unknown game state
						break;
				}
				console.log(`Game state changed to ${this.NarratorGameState.value}!`);
				this.lastGameState = this.NarratorGameState.value;
				// if (this.NarratorGameState.value === State.Title) {
				// 	this.NarratorGameState.value = State.NoCombat;
				// }
			}
		}
	}
	return GameStateSystem;
}
