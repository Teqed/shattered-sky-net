import * as Comlink from 'comlink';
import initBody from '../nbody/physics/initBodies';
import { worldLoaded, updateFlag, updateBuffer } from '../nbody/physics/worldStep';
import initWorld from '../nbody/physics/initWorld';
import { Vector3, RigidBody, World } from './rapier-treeshake';
let world: World;
export type MeshBodyVirtual = { [meshId: number]: {body: RigidBody
	force?: Vector3, virtualPos: { x: number, y: number, z: number},
	virtualRot: { x: number, y: number, z: number, w: number },
} };
let meshBodies: MeshBodyVirtual;
const rapierExport = {
	dispose () {
		return self.close();
	},
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
	async newBodies (meshId: {
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
	}[]) {
		// meshBodies[meshId.meshId] = initBody(world,
		// 	{
		// 		meshId: meshId.meshId,
		// 		p: meshId.p,
		// 		r: meshId.r,
		// 		mass: meshId.mass ?? 1,
		// 		size: meshId.size ?? 1,
		// 	}
		// );
		for (const mesh of meshId) {
			meshBodies[mesh.meshId] = initBody(world,
				{
					meshId: mesh.meshId,
					p: mesh.p,
					r: mesh.r,
					mass: mesh.mass ?? 1,
					size: mesh.size ?? 1,
				}
			);
		}
		return await new Promise<boolean>((resolve) => {
			resolve(true);
		}
		);
	},
}
Comlink.expose(rapierExport);
