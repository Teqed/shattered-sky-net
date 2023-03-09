// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import * as RAPIER from '@dimforge/rapier3d-compat';
import * as RANDOMJS from 'random-js';
import * as Comlink from 'comlink';
// importScripts('https://unpkg.com/comlink/dist/umd/comlink.js');
// importScripts('../node_modules/comlink/dist/esm/comlink.js');

const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

let worldloaded = false;

let world: RAPIER.World;
// let world;

const init = async () => {
	return await RAPIER.init();
}

// Icosahedron, twenty-sided, triangle faces
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
// Icosahedron, twenty-sided, triangle faces
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

// Function to create bodies
const initBody = (meshId: string, meshPos: {
	p: {x: number, y: number, z: number},
	q: { x: number, y: number, z: number, w: number}}, mass: number, size: number) => {
	const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
		.setCanSleep(false)
		.setTranslation(meshPos.p.x, meshPos.p.y, meshPos.p.z)
		.setAngularDamping(0.001)
		.setLinearDamping(0.001)
		.setLinvel(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1)
		)
		.setRotation(new RAPIER.Quaternion(
			meshPos.q.x,
			meshPos.q.y,
			meshPos.q.z,
			meshPos.q.w
		))
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
	const meshUpdate: {
		p: { x: number, y: number, z: number },
		q: { x: number, y: number, z: number, w: number },
	} = {
		p: { x: 0, y: 0, z: 0 },
		q: { x: 0, y: 0, z: 0, w: 0 },
	}
	const update = () => {
		const rotation = body.rotation();
		// meshUpdate.quaternion = { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
		// Round the values off to x.xxx precision
		meshUpdate.q = {
			x: Math.round(rotation.x * 1000) / 1000,
			y: Math.round(rotation.y * 1000) / 1000,
			z: Math.round(rotation.z * 1000) / 1000,
			w: Math.round(rotation.w * 1000) / 1000
		}
		const translation = body.translation();
		// meshUpdate.position = { x: translation.x, y: translation.y, z: translation.z }
		// Round the values off to x.xxx precision
		meshUpdate.p = {
			x: Math.round(translation.x * 1000) / 1000,
			y: Math.round(translation.y * 1000) / 1000,
			z: Math.round(translation.z * 1000) / 1000
		}
	}
	update();
	return { meshId, meshUpdate, body, update };
}

const physicsUpdate = () => {
	world.step();
	meshBodies.forEach((meshBody) => {
		meshBody.update();
	})
};

const meshBodies: {
	meshId: string,
	meshUpdate: {
		p: {x: number, y: number, z: number},
		q: { x: number, y: number, z: number, w: number}},
	body: RAPIER.RigidBody, update: Function }[] = []

const meshPos: {
	meshId: string;
	meshUpdate: {
		p: {
			x: number;
			y: number;
			z: number;
		};
		q: {
			x: number;
			y: number;
			z: number;
			w: number;
		};
	};
}[] = [];

const startPhysics = async () => {
	console.log('starting physics...')
	await init()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	world = new RAPIER.World(gravity);
	physicsUpdate();
	setInterval(() => {
		physicsUpdate();
	}, 1000 / 30);
	worldloaded = true;
	console.log('physics started')
	return true;
};

const rapierExport = {
	meshPos,
	startPhysics () {
		return startPhysics();
	},
	getUpdate () {
		if (worldloaded === true) {
			meshPos.length = 0;
			meshBodies.forEach((meshBody) => {
				meshPos.push({
					meshId: meshBody.meshId,
					meshUpdate: meshBody.meshUpdate
				});
			});
			return (meshPos);
		} else {
			console.log('world not loaded yet');
			return [];
		}
	},
	newBody (meshId: string, meshPos: {
		p: {
			x: number;
			y: number;
			z: number;
		};
		q: {
			x: number;
			y: number;
			z: number;
			w: number;
		};
	}, mass?: number, size?: number) {
		meshBodies.push(initBody(meshId, meshPos, mass ?? 1, size ?? 1));
	},
}

console.log('exposing rapier')
Comlink.expose(rapierExport);
console.log('ready to receive requests')
