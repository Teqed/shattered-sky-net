import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class GameStateSystem extends System {
		private global = this.singleton.write(Component.Global);
		private lastGameState = -1;

		override execute () {
			if (this.global.gameState !== this.lastGameState) {
				switch (this.global.gameState) {
					// Game states:
					// 0: Title screen
					// 1: Combat
					// 2: Collection
					// 3: Cutscene
					case 0:
						// Send an event to the window to change the gamemode.
						window.dispatchEvent(new CustomEvent('gameStateChange', { detail: { gameState: 0 } }));
						// Title screen
						break;
					case 1:
						window.dispatchEvent(new CustomEvent('gameStateChange', { detail: { gameState: 1 } }));
						// Combat
						break;
					case 2:
						window.dispatchEvent(new CustomEvent('gameStateChange', { detail: { gameState: 2 } }));
						// Collection
						break;
					case 3:
						window.dispatchEvent(new CustomEvent('gameStateChange', { detail: { gameState: 3 } }));
						// Cutscene
						break;
					default:
						// Unknown game state
						break;
				}
				console.log(`Game state changed to ${this.global.gameState}!`);
				this.lastGameState = this.global.gameState;
			}
		}
	}
	return GameStateSystem;
}
