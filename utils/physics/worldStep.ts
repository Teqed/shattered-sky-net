/* eslint-disable no-plusplus */

import gravitationalAttraction from '../physics/gravitationalAttraction';
import { barnesHutAttraction } from '../physics/barnes-hut';
import keepWithinBounds from '../physics/keepWithinBounds';
import { type World } from '../worker/rapier-treeshake';
import { type MeshBodyVirtual } from '../worker/rapier'

let update: number[];
// eslint-disable-next-line import/no-mutable-exports
let updateBuffer: ArrayBuffer;
let updateFlagBoo = false;
const updateFlag = (update?: boolean) => {
	if (update === true || update === false) {
		updateFlagBoo = update;
		return updateFlagBoo;
	}
	return updateFlagBoo;
}
let worldLoadedFlagBoo = false;
const worldLoaded = (loaded?: boolean) => {
	if (loaded === true || loaded === false) {
		worldLoadedFlagBoo = loaded;
		return worldLoadedFlagBoo;
	}
	return worldLoadedFlagBoo;
}
const virtualUpdate = (meshBodies: MeshBodyVirtual) => {
	const numberUpdates = Object.keys(meshBodies).length;
	update = new Array(numberUpdates * 8);
	let index = 0;
	for (const key of Object.keys(meshBodies)) {
		const body = meshBodies[Number(key)].body;
		const translation = body.translation();
		const rotation = body.rotation();
		update[index++] = Number(key);
		update[index++] = translation.x;
		update[index++] = translation.y;
		update[index++] = translation.z;
		update[index++] = rotation.x;
		update[index++] = rotation.y;
		update[index++] = rotation.z;
		update[index++] = rotation.w;
	}
	return new Float32Array(update).buffer;
}
const physicsUpdate = (world: World, meshBodies: MeshBodyVirtual) => {
	keepWithinBounds(meshBodies);
	// gravitationalAttraction(meshBodies);
	barnesHutAttraction(meshBodies);
	world.step();
	updateFlag(true)
};
const scheduleUpdates = (world: World, meshBodies: MeshBodyVirtual) => {
	physicsUpdate(world, meshBodies);
	updateBuffer = virtualUpdate(meshBodies);
	let lastPhysicsUpdate = 0;
	let doNotQueueAdditionalPhysicsUpdates = false;
	setInterval(() => {
		const now = Date.now();
		if (now - lastPhysicsUpdate >= 1000 / 60) {
			if (doNotQueueAdditionalPhysicsUpdates) {
				return;
			} else {
				doNotQueueAdditionalPhysicsUpdates = true;
				physicsUpdate(world, meshBodies);
				updateBuffer = virtualUpdate(meshBodies);
				doNotQueueAdditionalPhysicsUpdates = false;
			}
			lastPhysicsUpdate = now;
		}
	}, 1000 / 60);
}
export { updateFlag, worldLoaded, scheduleUpdates, updateBuffer }
