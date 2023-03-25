/* eslint-disable no-plusplus */
import * as RANDOMJS from 'random-js';
import * as Comlink from 'comlink';
import { Vector3, World, RigidBody, RigidBodyDesc, ColliderDesc, init } from '../worker/rapier';
import { barnesHutAttraction } from './utils/barnes-hut';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);
let worldloaded = false;
let world: World;
const initRAPIER = async () => { return await init() };
const meshBodies: { [meshId: number]: {body: RigidBody
	force?: Vector3} } = {};
const rigidBodyDesc = RigidBodyDesc.dynamic()
// const rigidBodyDesc = RigidBodyDesc.kinematicVelocityBased()
	// .setCanSleep(false)
	.setAngularDamping(1)
	.setLinearDamping(1)
const colliderDesc = ColliderDesc.ball(1)
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
			random.real(-10, 10),
			random.real(-10, 10),
			random.real(-10, 10),
		)
		.setRotation({
			x: r.x ?? 0,
			y: r.y ?? 0,
			z: r.z ?? 0,
			w: r.w ?? 0,
		}
		)
		.setAngvel(new Vector3(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1),
		))
	rigidBodyDesc.mass = mass
	const body = world.createRigidBody(rigidBodyDesc)
	const thing = world.createCollider(colliderDesc, body)
	// thing.setRestitution(0.9999)
	thing.setFriction(1)
	return { meshId, body };
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
		// 			const distanceVector = {
		// 				x: body2Translation.x - body1Translation.x,
		// 				y: body2Translation.y - body1Translation.y,
		// 				z: body2Translation.z - body1Translation.z,
		// 			};
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
		body1.addForce(force, true);
	}
};
const keepWithinBounds = () => {
	// if any of the bodies are outside the bounds, move them back in
	const meshBodiesLength = Object.keys(meshBodies).length;
	const outerBoundary = 1000;
	const innerBoundary = 900;
	for (let index = 0; index < meshBodiesLength; index++) {
		const meshBody = meshBodies[index];
		const body = meshBody.body;
		const position = body.translation();
		if (position.x > outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: innerBoundary,
				y: position.y,
				z: position.z}, true);
		} else if (position.x < -outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: -innerBoundary,
				y: position.y,
				z: position.z}, true);
		}
		if (position.y > outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: innerBoundary,
				z: position.z}, true);
		} else if (position.y < -outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: -innerBoundary,
				z: position.z}, true);
		}
		if (position.z > outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: position.y,
				z: innerBoundary}, true);
		} else if (position.z < -outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: position.y,
				z: -innerBoundary}, true);
		}
	}
};
const physicsUpdate = () => {
	keepWithinBounds();
	// gravitationAttraction();
	barnesHutAttraction(meshBodies);
	world.step();
	updateFlag = true;
};
const startPhysics = async () => {
	console.log('starting physics...')
	await initRAPIER()
	const gravity = { x: 0.0, y: 0.0, z: 0.0 };
	world = new World(gravity);
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
	updateFlag () { return updateFlag; },
	startPhysics () { return startPhysics(); },
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
		meshBodies[meshId.meshId] = initBody(
			meshId.meshId,
			meshId.p,
			meshId.r,
			meshId.mass ?? 1,
			meshId.size ?? 1
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
