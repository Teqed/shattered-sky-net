import * as Comlink from 'comlink';
import initBody from '../physics/initBodies';
import { worldLoaded, updateFlag, updateBuffer } from '../physics/worldStep';
import initWorld from '../physics/initWorld';
import { Vector3, RigidBody, World } from '../worker/rapier-treeshake';
let world: World;
export type MeshBodyVirtual = { [meshId: number]: {body: RigidBody
	force?: Vector3, virtualPos: { x: number, y: number, z: number},
	virtualRot: { x: number, y: number, z: number, w: number },
} };
let meshBodies: MeshBodyVirtual;
const rapierExport = {
	async startPhysics () {
		const { world_, meshBodies_ } = await initWorld();
		world = world_;
		meshBodies = meshBodies_;
		return world;
	},
	getUpdate () {
		if (worldLoaded() === true && updateFlag() === true) {
			updateFlag(false);
			return updateBuffer;
		} else {
			return false;
		}
	},
	async newBody (meshId: {
		meshId: number,
		p: {
			x: number;
			y: number;
			z: number;
		},
		r: {
			x: number;
			y: number;
			z: number;
			w: number;
		}, mass?: number, size?: number
	}) {
		meshBodies[meshId.meshId] = initBody(world,
			{
				meshId: meshId.meshId,
				p: meshId.p,
				r: meshId.r,
				mass: meshId.mass ?? 1,
				size: meshId.size ?? 1,
			}
		);
		return await new Promise<boolean>((resolve) => {
			resolve(true);
		}
		);
	},
}

console.log('exposing rapier')
Comlink.expose(rapierExport);
console.log('ready to receive requests')
