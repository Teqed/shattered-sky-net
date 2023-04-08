
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class InputSystem extends System {
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
			});
		}
	}
	return InputSystem;
}
