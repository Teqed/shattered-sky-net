import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';
import { Control } from '@babylonjs/gui/2D/controls/control';
import * as Component from '../../../components/components';
import { State } from '../../../../utilityTypes';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class CutsceneSystem extends System {
		private NarratorGameState = this.singleton.write(Component.Narrator.GameState)
		private NarratorDesiredCutscene = this.singleton.write(Component.Narrator.DesiredCutscene)
		private NarratorMemoryOfStarter = this.query(q => q.current.with(Component.Narrator.Memory.Exists).write)

		private starterSelection = async () => {
			// Offer the player the choice of three starter monsters.
			// Display a UI with three buttons, one for each starter monster.
			// When the player clicks a button, spawn the chosen starter monster in the player's party.
			// Wait until the player has chosen a starter monster before continuing.
			// Create an unresolved promise.
			const starterChosen = new Promise<number>((resolve) => {
				const starterUI = AdvancedDynamicTexture.CreateFullscreenUI('StarterUI');
				starterUI.layer!.layerMask = 0x10000000;
				const starterText = new TextBlock('StarterText', 'Choose your starter monster!');
				starterText.color = 'white';
				starterText.fontSize = 48;
				starterText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
				starterText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
				// Position above center.
				starterText.top = '-100px';
				starterUI.addControl(starterText);
				const starterButton1 = Button.CreateSimpleButton('StarterButton1', 'Starter 1');
				starterButton1.width = '200px';
				starterButton1.height = '50px';
				// Position left of center.
				starterButton1.left = '-300px';
				starterButton1.color = 'white';
				starterButton1.fontSize = 24;
				starterButton1.background = 'green';
				starterButton1.onPointerUpObservable.add(() => {
					starterUI.dispose();
					resolve(0);
				});
				starterUI.addControl(starterButton1);
				const starterButton2 = Button.CreateSimpleButton('StarterButton2', 'Starter 2');
				starterButton2.width = '200px';
				starterButton2.height = '50px';
				starterButton2.color = 'white';
				starterButton2.fontSize = 24;
				starterButton2.background = 'green';
				starterButton2.onPointerUpObservable.add(() => {
					starterUI.dispose();
					resolve(1);
				});
				starterUI.addControl(starterButton2);
				const starterButton3 = Button.CreateSimpleButton('StarterButton3', 'Starter 3');
				starterButton3.width = '200px';
				starterButton3.height = '50px';
				// Position right of center.
				starterButton3.left = '300px';
				starterButton3.color = 'white';
				starterButton3.fontSize = 24;
				starterButton3.background = 'green';
				starterButton3.onPointerUpObservable.add(() => {
					starterUI.dispose();
					resolve(2);
				});
				starterUI.addControl(starterButton3);
			});
			switch (await starterChosen) {
				case 0:
					this.createEntity(
						Component.Monster.CreateMe, { team: 'Friend', destination: 'Party' },
						Component.Monster.BaseStats, { health: 10, attack: 1, speed: 25 },
					);
					break;
				case 1:
					this.createEntity(
						Component.Monster.CreateMe, { team: 'Friend', destination: 'Party' },
						Component.Monster.BaseStats, { health: 10, attack: 1, speed: 25 },
					);
					break;
				case 2:
					this.createEntity(
						Component.Monster.CreateMe, { team: 'Friend', destination: 'Party' },
						Component.Monster.BaseStats, { health: 10, attack: 1, speed: 25 },
					);
			}
			// Remember that the player has received a starter monster by creating an entity with a Memory component.
			this.createEntity(Component.Narrator.Memory.Exists);
			this.NarratorGameState.value = State.NoCombat;
			this.NarratorDesiredCutscene.value = 'None';
		}

		override execute () {
			if (this.NarratorGameState.value !== State.Cutscene) {
				return;
			}

			switch (this.NarratorDesiredCutscene.value) {
				case 'Intro':
					// Play the intro cutscene.
					// For now, as a placeholder, just change the game state to NoCombat.
					this.NarratorGameState.value = State.NoCombat;
					this.NarratorDesiredCutscene.value = 'None';
					break;
				case 'Gameover':
					// Play the gameover cutscene.
					// For now, as a placeholder, just change the game state to Title.
					window.alert('Gameover!')
					this.NarratorGameState.value = State.Title;
					this.NarratorDesiredCutscene.value = 'None';
					break;
				case 'Starter':
					// Play the starter cutscene.
					this.starterSelection();
					this.NarratorDesiredCutscene.value = 'Async';
					break;
				case 'Async':
					// An async cutscene is currently playing.
					break;
				case 'None':
				default:
					// Unknown cutscene
					this.NarratorGameState.value = State.NoCombat;
					this.NarratorDesiredCutscene.value = 'None';
					break;
			}
		}
	}

	return CutsceneSystem;
}
