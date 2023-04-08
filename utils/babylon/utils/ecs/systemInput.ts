
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from './components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class InputSystem extends System {
		entities = this.query(q => q.current
			.with(Component.RestingInCollection).write
			.using(Component.TriggerMoveFromCollectionIntoCombat).write);

		override initialize () {
			addEventListener('keydown', (event) => {
				if (event.code === 'Space') {
					console.log('Space pressed');
					for (const entity of this.entities.current) {
						entity.add(Component.TriggerMoveFromCollectionIntoCombat);
					}
				}
			});
		}
	}
	return InputSystem;
}
