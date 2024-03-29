/* eslint-disable no-plusplus */
import { barnesHutAttraction } from '../physics/barnes-hut';
import { type World } from '../../worker/rapier-treeshake';
import { type MeshBodyVirtual } from '../../worker/rapier-expose'

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
		const meshBody = meshBodies[Number(key)];
		if (meshBody) {
			const translation = meshBody.virtualPos;
			const rotation = meshBody.virtualRot;
			update[index++] = Number(key);
			update[index++] = translation.x;
			update[index++] = translation.y;
			update[index++] = translation.z;
			update[index++] = rotation.x;
			update[index++] = rotation.y;
			update[index++] = rotation.z;
			update[index++] = rotation.w;
		}
	}
	updateFlag(true)
	return new Float32Array(update).buffer;
}
const physicsUpdate = (world: World, meshBodies: MeshBodyVirtual) => {
	barnesHutAttraction(meshBodies);
	world.step();
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
