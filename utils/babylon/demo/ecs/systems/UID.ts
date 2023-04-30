/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { UID } from '../components/components';
import { addComponent, defineQuery, type IWorld, Not } from 'bitecs';

const queryEntitiesWithoutUID = defineQuery([Not(UID)]);

const UIDSystem = (world: IWorld) => {
	console.log('UIDSystem');
	const entitiesWithoutUID = queryEntitiesWithoutUID(world);
	for (const eid of entitiesWithoutUID) {
		let tryUID: number = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
		while (UID.uid.includes(tryUID)) {
			tryUID = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
			if (tryUID === 0) {
				console.error('UIDSystem: tryUID === 0');
			}
		}

		addComponent(world, UID, eid);
		UID.uid[eid] = tryUID;
		console.log(`UIDSystem: ${eid} has UID ${UID.uid[eid]}`);
	}

	return world;
};

export default UIDSystem;
