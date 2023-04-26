
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';
import { Control } from '@babylonjs/gui/2D/controls/control';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class InputSystem extends System {
		private narratorTriggerLoadSave = this.singleton.write(Component.Narrator.TriggerLoadSave);
		private narratorGameState = this.singleton.write(Component.Narrator.GameState);
		private narratorSearchForEncounters = this.singleton.write(Component.Narrator.SearchForEncounters);
		entities = this.query(q => q.current
			.with(Component.Monster.Collection.RestingInCollection).write
			.using(Component.Monster.Collection.TriggerMoveFromCollectionIntoParty,
				Component.Monster.CreateMe,
				Component.Monster.BaseStats,
			).write);

		private monstersInParty = this.query(q => q.current
			.with(Component.Monster.Party));

		override initialize () {
			addEventListener('keydown', (event) => {
				if (event.code === 'Space') {
					console.log('Space pressed');
					for (const entity of this.entities.current) {
						entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoParty);
					}
				}
				if (event.code === 'KeyS') {
					console.log('S pressed');
					this.narratorTriggerLoadSave.triggerSave = 1;
				}
				if (event.code === 'KeyL') {
					console.log('L pressed');
					this.narratorTriggerLoadSave.triggerLoad = 1;
				}
				if (event.code === 'Digit0') {
					console.log('0 pressed');
					this.narratorGameState.value = 0;
				}
				if (event.code === 'Digit1') {
					console.log('1 pressed');
					this.narratorGameState.value = 1;
				}
				if (event.code === 'Digit2') {
					console.log('2 pressed');
					// Change the game state to 2 (collection).
					this.narratorGameState.value = 2;
				}
				if (event.code === 'Digit3') {
					console.log('3 pressed');
					this.narratorGameState.value = 3;
				}
				if (event.code === 'KeyZ') {
					console.log('Z pressed');
					// Create a new friendly monster.
					this.createEntity(
						Component.Monster.CreateMe, { team: 'Friend', destination: 'Combat' },
						Component.Monster.BaseStats, { health: 10, attack: 1, speed: 25 },
					);
				}
				if (event.code === 'KeyP') {
					console.log('P pressed');
					// Log the current party.
					for (const entity of this.monstersInParty.current) {
						console.log('Party member');
					}
				}
				if (event.code === 'KeyQ') {
					const borderUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
					borderUI.layer!.layerMask = 0x10000000;
					borderUI.idealHeight = 720;
					// const title = new TextBlock();
					// title.text = 'Game Title';
					// title.color = 'white';
					// title.fontSize = 100;
					// title.fontFamily = 'Viga';
					// title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
					// title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
					// title.top = '100px';
					// mainMenuUI.addControl(title);
					const createControl = (label: string,
						position: number, action?: () => void,
						disable?: boolean) => {
						const button = Button.CreateSimpleButton(
							label.toLocaleLowerCase.toString(),
							label);
						// Align to the left
						button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
						button.top = `${position}px`;
						button.fontFamily = 'Viga';
						button.width = 0.1
						button.height = '30px';
						button.color = 'white';
						// button.cornerRadius = 20;
						button.thickness = 2;
						button.background = 'black';
						button.onPointerEnterObservable.add(() => {
							button.color = 'black';
							button.background = 'white';
						});
						button.onPointerOutObservable.add(() => {
							button.color = 'white';
							button.background = 'black';
						});
						if (action) {
							button.onPointerDownObservable.add(() => action());
						}
						if (disable) {
							button.isHitTestVisible = false;
							button.alpha = 0.5;
						}
						borderUI.addControl(button);
					}
					createControl('🌎', -100, () => {
						borderUI.dispose();
						this.narratorGameState.value = 1;
					});
					createControl('🗡️', -70, () => {
						borderUI.dispose();
						this.narratorSearchForEncounters.value = 1;
					});
					createControl('📖', -40, () => {
						borderUI.dispose();
						this.narratorGameState.value = 2;
					});
					createControl('🏛️', -10, () => {
						borderUI.dispose();
						this.narratorGameState.value = 2;
					});
				}
			});
		}
	}
	return InputSystem;
}
