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

const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
	// .setCanSleep(false)
	.setAngularDamping(0.001)
	.setLinearDamping(0.001)
const points = new Float32Array(
	vertices.map(v => v * 1)
)
const colliderDesc = RAPIER.ColliderDesc.convexMesh(points, indices)
// Function to create bodies
const initBody = (meshId: number,
	p: { x: number, y: number, z: number },
	r: { x: number, y: number, z: number, w: number },
	mass: number, size: number) => {
	rigidBodyDesc.setTranslation(
		p.x ?? 0,
		p.y ?? 0,
		p.z ?? 0,
	)
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
	// @ts-ignore-next-line - colliderDesc is possibly null
	world.createCollider(colliderDesc, body)
		.setRestitution(0.9999)
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
const gravitationAttraction = () => {
	const meshBodiesLength = Object.keys(meshBodies).length;
	// const gravitationalConstant = 0.0667;

	for (let index = 0; index < meshBodiesLength; index++) {
		const body1 = meshBodies[index].body;
		const body1Translation = body1.translation();
		const force = { x: 0, y: 0, z: 0 };
		// 	for (let index2 = 0; index2 < meshBodiesLength; index2++) {
		// 		if (index !== index2) {
		// 			const body2 = meshBodies[index2].body;
		// 			const body2Translation = body2.translation();
		// 			// Calculate the distance between the two bodies
		// 			const distanceVector = {
		// 				x: body2Translation.x - body1Translation.x,
		// 				y: body2Translation.y - body1Translation.y,
		// 				z: body2Translation.z - body1Translation.z,
		// 			};
		// 				// Calculate the gravitational force between the two bodies;
		// 				// The closer they are, the stronger the force
		// 			force.x += (distanceVector.x / 100) * gravitationalConstant;
		// 			force.y += (distanceVector.y / 100) * gravitationalConstant;
		// 			force.z += (distanceVector.z / 100) * gravitationalConstant;
		// 		}
		// 	}
		// Apply a generic force drawing bodies to 0,0,0
		force.x += -body1Translation.x / 100;
		force.y += -body1Translation.y / 100;
		force.z += -body1Translation.z / 100;
		// Apply the net force to the body
		body1.applyImpulse(force, true);
	}
};

const physicsUpdate = () => {
	gravitationAttraction();
	world.step();
	updateFlag = true;
};

const startPhysics = async () => {
	console.log('starting physics...')
	await init()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	world = new RAPIER.World(gravity);
	physicsUpdate();
	let lastPhysicsUpdate = 0;
	let doNotQueueAdditionalPhysicsUpdates = false;
	setInterval(() => {
		const now = Date.now();
		if (now - lastPhysicsUpdate >= 1000 / 60) {
			if (doNotQueueAdditionalPhysicsUpdates) {
				return;
			} else {
				doNotQueueAdditionalPhysicsUpdates = true;
				physicsUpdate();
				virtualUpdate();
				doNotQueueAdditionalPhysicsUpdates = false;
			}
			lastPhysicsUpdate = now;
		}
	}, 1000 / 60);
	worldloaded = true;
	console.log('physics started')
	return true;
};

let updateFlag = false;
const rapierExport = {
	updateFlag () {
		return updateFlag;
	},
	startPhysics () {
		return startPhysics();
	},
	getUpdate () {
		if (worldloaded === true) {
			updateFlag = false;
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
