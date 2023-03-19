// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
// import RAPIER from '@dimforge/rapier3d-compat';
import * as RANDOMJS from 'random-js';
import * as Comlink from 'comlink';
import RAPIER from './rapier';
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

const meshBodies: {
	meshId: number,
	body: RAPIER.RigidBody, update: Function }[] = []

const meshUpdate: {[meshId: number]: {
	p: {x: number,
		y: number,
		z: number},
	r: {x: number,
		y: number,
		z: number,
		w: number} } } = {};

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
		.setAngularDamping(0.001)
		.setLinearDamping(0.001)
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
	// Push the meshId and body into the meshUpdate object
	meshUpdate[meshId] = {
		p: { x: p.x, y: p.y, z: p.z },
		r: { x: r.x, y: r.y, z: r.z, w: r.w }
	};
	const update = () => {
		const rotation = body.rotation();
		// meshUpdate.ruaternion = { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
		// Round the values off to x.xxx precision
		meshUpdate[meshId].r = {
			x: Math.round(rotation.x * 1000) / 1000,
			y: Math.round(rotation.y * 1000) / 1000,
			z: Math.round(rotation.z * 1000) / 1000,
			w: Math.round(rotation.w * 1000) / 1000
		}
		const translation = body.translation();
		// meshUpdate.position = { x: translation.x, y: translation.y, z: translation.z }
		// Round the values off to x.xxx precision
		meshUpdate[meshId].p = {
			x: Math.round(translation.x * 1000) / 1000,
			y: Math.round(translation.y * 1000) / 1000,
			z: Math.round(translation.z * 1000) / 1000
		}
	}
	update();
	return { meshId,
		meshPos: {
			p: { x: p.x, y: p.y, z: p.z },
			r: { x: r.x, y: r.y, z: r.z, w: r.w }
		},
		body,
		update };
}

const physicsUpdate = () => {
	world.step();
	meshBodies.forEach((meshBody) => {
		meshBody.update();
	})
};

const startPhysics = async () => {
	console.log('starting physics...')
	await init()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	world = new RAPIER.World(gravity);
	physicsUpdate();
	setInterval(() => {
		physicsUpdate();
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
			const update = new Float32Array(Object.entries(meshUpdate).length * 8);
			let index = 0;
			Object.entries(meshUpdate).forEach(([key, value]) => {
				update[index] = Number(key);
				update[index + 1] = value.p.x;
				update[index + 2] = value.p.y;
				update[index + 3] = value.p.z;
				update[index + 4] = value.r.x;
				update[index + 5] = value.r.y;
				update[index + 6] = value.r.z;
				update[index + 7] = value.r.w;
				index += 8;
			});
			return update.buffer;
		} else {
			console.log('world not loaded yet');
			return [];
		}
	},
	newBody (meshId: number,
		_p: {
			x: number;
			y: number;
			z: number;
		},
		_r: {
			x: number;
			y: number;
			z: number;
			w: number;
		}, _mass?: number, _size?: number) {
		meshBodies.push(
			// @ts-ignore-next-line - meshId holds the properties
			initBody(meshId.meshId, meshId.p, meshId.r, meshId.mass ?? 1, meshId.size ?? 1)
		);
		return true;
	},
}

console.log('exposing rapier')
Comlink.expose(rapierExport);
console.log('ready to receive requests')
