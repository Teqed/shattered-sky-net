
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class InputSystem extends System {
		private global = this.singleton.write(Component.Global);
		entities = this.query(q => q.current
			.with(Component.Monster.Collection.RestingInCollection).write
			.using(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat).write);

		override initialize () {
			addEventListener('keydown', (event) => {
				if (event.code === 'Space') {
					console.log('Space pressed');
					for (const entity of this.entities.current) {
						entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat);
					}
				}
				if (event.code === 'KeyS') {
					console.log('S pressed');
					// Save the game by setting the global value to 1.
					this.global.triggerSave = 1;
				}
				if (event.code === 'Digit0') {
					console.log('0 pressed');
					this.global.gameState = 0;
				}
				if (event.code === 'Digit1') {
					console.log('1 pressed');
					this.global.gameState = 1;
				}
				if (event.code === 'Digit2') {
					console.log('2 pressed');
					// Change the game state to 2 (collection).
					this.global.gameState = 2;
				}
				if (event.code === 'Digit3') {
					console.log('3 pressed');
					this.global.gameState = 3;
				}
			});
		}
	}
	return InputSystem;
}
