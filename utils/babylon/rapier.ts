/* eslint-disable no-plusplus */
// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
// import RAPIER from '@dimforge/rapier3d-compat';
import * as RANDOMJS from 'random-js';
import * as Comlink from 'comlink';
import RAPIER from '../worker/rapier';
// importScripts('https://unpkg.com/comlink/dist/umd/comlink.js');
// importScripts('../node_modules/comlink/dist/esm/comlink.js');
console.log('rapier.ts: RAPIER', RAPIER);

const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

let worldloaded = false;

let world: RAPIER.World;
// let world;

const init = async () => {
	return await RAPIER.init();
}

// Cube, six-sided, square faces
const vertices = new Float32Array([
	0, 0, -1,
	0.894, 0, -0.447,
	0.276, 0.851, -0.447,
	-0.724, 0.525, -0.447,
	-0.724, -0.525, -0.447,
	0.276, -0.851, -0.447,
	0.724, 0.525, 0.447,
	-0.276, 0.851, 0.447,
	-0.894, 0, 0.447,
	-0.276, -0.851, 0.447,
	0.724, -0.525, 0.447,
	0, 0, 1,
]);
// Cube, six-sided, square faces
const indices = new Uint32Array([
	0, 2, 1,
	0, 3, 2,
	0, 4, 3,
	0, 5, 4,
	0, 1, 5,
	1, 2, 6,
	2, 3, 7,
	3, 4, 8,
	4, 5, 9,
	5, 1, 10,
	1, 6, 10,
	2, 7, 6,
	3, 8, 7,
	4, 9, 8,
	5, 10, 9,
	6, 7, 11,
	7, 8, 11,
	8, 9, 11,
	9, 10, 11,
	10, 6, 11,
]);

const meshBodies: {
	[meshId: number]: {
		body: RAPIER.RigidBody } } = {};

// const meshUpdate: {
// 	[x: string]: number;[meshId: number]: {
// 		p: {x: number,
// 			y: number,
// 			z: number},
// 		r: {x: number,
// 			y: number,
// 			z: number,
// 			w: number} } } = {};

// Function to create bodies
const initBody = (meshId: number,
	p: { x: number, y: number, z: number },
	r: { x: number, y: number, z: number, w: number },
	mass: number, size: number) => {
	const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
		.setCanSleep(false)
		.setTranslation(
			p.x ?? 0,
			p.y ?? 0,
			p.z ?? 0,
		)
		.setAngularDamping(0.1)
		.setLinearDamping(1)
		.setLinvel(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1)
		)
		.setRotation({
			x: r.x ?? 0,
			y: r.y ?? 0,
			z: r.z ?? 0,
			w: r.w ?? 0,
		}
		)
		.setAngvel(new RAPIER.Vector3(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1)
		))
	rigidBodyDesc.mass = mass
	const body = world.createRigidBody(rigidBodyDesc)
	const points = new Float32Array(
		vertices.map(v => v * size)
	)
	const colliderDesc = RAPIER.ColliderDesc.convexMesh(points, indices)
	// @ts-ignore-next-line - colliderDesc is possibly null
	world.createCollider(colliderDesc, body)
	return { meshId,
		body,
	};
}

let update: number[];
const virtualUpdate = () => {
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

const physicsUpdate = () => {
	world.step();
};

const startPhysics = async () => {
	console.log('starting physics...')
	await init()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	world = new RAPIER.World(gravity);
	physicsUpdate();
	let lastPhysicsUpdate = 0;
	setInterval(() => {
		const now = Date.now();
		if (now - lastPhysicsUpdate >= 10) {
			physicsUpdate();
			virtualUpdate();
			lastPhysicsUpdate = now;
		}
	}, 1000 / 60);
	worldloaded = true;
	console.log('physics started')
	return true;
};

const rapierExport = {
	startPhysics () {
		return startPhysics();
	},
	getUpdate () {
		if (worldloaded === true) {
			return new Float32Array(update).buffer;
		} else {
			console.log('world not loaded yet');
			return [];
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
		// meshBodies.push(
		// 	initBody(meshId.meshId, meshId.p, meshId.r, meshId.mass ?? 1, meshId.size ?? 1)
		// );
		meshBodies[meshId.meshId] = initBody(meshId.meshId, meshId.p, meshId.r, meshId.mass ?? 1, meshId.size ?? 1);
		return await new Promise<boolean>((resolve) => {
			resolve(true);
		}
		);
	},
}

console.log('exposing rapier')
Comlink.expose(rapierExport);
console.log('ready to receive requests')
