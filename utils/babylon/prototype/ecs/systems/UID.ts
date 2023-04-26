import { system, System } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default () => {
	@system class UIDSystem extends System {
		unassignedEntities = this.query(q => q.current.without(Component.UID).write);
		assignedEntities = this.query(q => q.current.with(Component.UID));

		override execute () {
			for (const entity of this.unassignedEntities.current) {
				let randomInt32 = crypto.getRandomValues(new Int32Array(1));
				let newUid = randomInt32[0];
				// Make sure the UID is unique by checking if it already exists
				while (this.assignedEntities.current.some(
					existingEntity => existingEntity.read(Component.UID).value === newUid)) {
					randomInt32 = crypto.getRandomValues(new Int32Array(1));
					newUid = randomInt32[0];
				}

				entity.add(Component.UID, { value: newUid });
			}
		}
	}
	return UIDSystem;
}
