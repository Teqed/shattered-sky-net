
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class SaveGameSystem extends System {
		private global = this.singleton.write(Component.Global);

		override execute () {
			// If global.value is 1, save the game.
			if (this.global.triggerSave === 1) {
				console.log('Saving the game!');
				// Save the game by setting the global value to 0.
				this.global.triggerSave = 0;
			}
		}
	}
	return SaveGameSystem;
}
