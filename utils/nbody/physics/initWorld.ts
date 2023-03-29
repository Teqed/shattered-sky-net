import { init, World } from '../../worker/rapier-treeshake';
import { type MeshBodyVirtual } from '../../worker/rapier-expose'
import { worldLoaded, scheduleUpdates } from './worldStep';

export default async () => {
	const initRAPIER = async () => { return await init() };
	await initRAPIER()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	const world_ = new World(gravity);
	const meshBodies_: MeshBodyVirtual = {};
	scheduleUpdates(world_, meshBodies_);
	worldLoaded(true);
	return {world_, meshBodies_};
};
