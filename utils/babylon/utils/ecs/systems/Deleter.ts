import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class DeleterSystem extends System {
		entities = this.query(q => q.current.with(Component.ToBeDeleted).usingAll.write);

		override execute () {
			for (const entity of this.entities.current) {
				entity.remove(Component.ToBeDeleted);
				entity.delete();
			}
		}
	}
	return DeleterSystem;
}
