import { init, World } from '../worker/rapier-treeshake';
import { type MeshBodyVirtual } from '../worker/rapier'
import { worldLoaded, scheduleUpdates } from './worldStep';

const initRAPIER = async () => { return await init() };
export default async () => {
	console.log('starting physics...')
	await initRAPIER()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	const world_ = new World(gravity);
	const meshBodies_: MeshBodyVirtual = {};
	scheduleUpdates(world_, meshBodies_);
	worldLoaded(true);
	console.log('physics started')
	return {world_, meshBodies_};
};
