/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { UID } from '../components/components';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';
import { Control } from '@babylonjs/gui/2D/controls/control';
import { addComponent, defineQuery, type IWorld, Not } from 'bitecs';

addEventListener('keydown', event => {
	if (event.code === 'KeyQ') {
		const borderUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		borderUI.layer!.layerMask = 0x10_00_00_00;
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
		const createControl = (
			label: string,
			position: number,
			action?: () => void,
			disable?: boolean,
		) => {
			const button = Button.CreateSimpleButton(
				label.toLocaleLowerCase.toString(),
				label,
			);
			// Align to the left
			button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
			button.top = `${position}px`;
			button.fontFamily = 'Viga';
			button.width = 0.1;
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
		};

		createControl('🌎', -100, () => {
			borderUI.dispose();
			// this.narratorGameState.value = 1;
		});
		createControl('🗡️', -70, () => {
			borderUI.dispose();
			// this.narratorSearchForEncounters.value = 1;
		});
		createControl('📖', -40, () => {
			borderUI.dispose();
			// this.narratorGameState.value = 2;
		});
		createControl('🏛️', -10, () => {
			borderUI.dispose();
			// this.narratorGameState.value = 2;
		});
	}
});

const InputSystem = (world: IWorld) => {
	return world;
};

export default InputSystem;
