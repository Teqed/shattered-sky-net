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
		body: RAPIER.RigidBody,
		force?: RAPIER.Vector3
	} } = {};

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
// const colliderDesc = RAPIER.ColliderDesc.convexMesh(points, indices)
const colliderDesc = RAPIER.ColliderDesc.ball(1)
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
			random.real(-20, 20),
			random.real(-20, 20),
			random.real(-20, 20)
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
	const thing = world.createCollider(colliderDesc, body)
	thing.setRestitution(0.9999)
	// thing.setFriction(1)
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
		body1.addForce(force, true);
	}
};
interface Point {
	x: number;
	y: number;
	z: number;
}
class Boundary {
	// * The constructor makes it more convenient to create a boundary
	// eslint-disable-next-line no-useless-constructor
	constructor (
		private minX: number,
		private minY: number,
		private minZ: number,
		private maxX: number,
		private maxY: number,
		private maxZ: number) {}

	public contains (point: Point): boolean {
		return point.x >= this.minX && point.x <= this.maxX &&
 point.y >= this.minY && point.y <= this.maxY &&
 point.z >= this.minZ && point.z <= this.maxZ;
	}

	public get size (): number {
		return Math.max(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
	}
}
class BarnesHutNode {
	// eslint-disable-next-line no-use-before-define
	private readonly children: BarnesHutNode[] = [];
	private readonly centerOfMass: Point = { x: 0, y: 0, z: 0 };
	private totalMass = 0;

	// * The constructor makes it more convenient to create a boundary
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly boundary: Boundary) {}

	public insert (point: Point, mass: number): void {
		if (!this.boundary.contains(point)) {
			return;
		}

		if (this.children.length === 0) {
			this.totalMass += mass;
			this.updateCenterOfMass(point, mass);
			return;
		}

		this.totalMass += mass;
		this.updateCenterOfMass(point, mass);

		for (const child of this.children) {
			child.insert(point, mass);
		}
	}

	public updateForces (point: Point, force: Point, thetaSquared: number): void {
		if (this.children.length === 0) {
			if (this.centerOfMass !== point) {
				const distance = this.getDistance(point, this.centerOfMass);
				const direction = this.getDirection(point, this.centerOfMass);
				const magnitude = ((this.totalMass * distance) ** -0.00001);

				force.x += direction.x * magnitude;
				force.y += direction.y * magnitude;
				force.z += direction.z * magnitude;
			}
			return;
		}

		const distance = this.getDistance(point, this.centerOfMass);

		if (this.boundary.size / distance < Math.sqrt(thetaSquared)) {
			const direction = this.getDirection(point, this.centerOfMass);
			const magnitude = ((this.totalMass * distance) ** -0.00001);

			force.x += direction.x * magnitude;
			force.y += direction.y * magnitude;
			force.z += direction.z * magnitude;
			return;
		}

		for (const child of this.children) {
			child.updateForces(point, force, thetaSquared);
		}
	}

	private updateCenterOfMass (point: Point, mass: number): void {
		const totalMass = this.totalMass + mass;
		const weight1 = this.totalMass / totalMass;
		const weight2 = mass / totalMass;

		this.centerOfMass.x = this.centerOfMass.x * weight1 + point.x * weight2;
		this.centerOfMass.y = this.centerOfMass.y * weight1 + point.y * weight2;
		this.centerOfMass.z = this.centerOfMass.z * weight1 + point.z * weight2;

		this.totalMass = totalMass;
	}

	private getDistance (point1: Point, point2: Point): number {
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
		const dz = point1.z - point2.z;

		return dx ** 2 + dy ** 2 + dz ** 2;
	}

	private getDirection (point1: Point, point2: Point): Point {
		const distance = this.getDistance(point1, point2);

		return {
			x: (point2.x - point1.x) / distance,
			y: (point2.y - point1.y) / distance,
			z: (point2.z - point1.z) / distance,
		};
	}
}
class BarnesHutTree {
	private readonly rootNode: BarnesHutNode;

	constructor (private readonly theta: number, private readonly boundary: Boundary) {
		this.rootNode = new BarnesHutNode(boundary);
	}

	public insert (point: Point, mass: number): void {
		this.rootNode.insert(point, mass);
	}

	public updateForces (point: Point, force: Point, thetaSquared: number): void {
		this.rootNode.updateForces(point, force, thetaSquared);
	}
}
const thetaSquared = 0.7 * 0.7;
const boundary = new Boundary(-100, -100, -100, 100, 100, 100);
const barnesHutTree = new BarnesHutTree(0.7, boundary);
let meshBody;
let body;
let translation;
let meshBodiesLength;
const barnesHutAttraction = () => {
	meshBodiesLength = Object.keys(meshBodies).length;
	for (let index = 0; index < meshBodiesLength; index++) {
		meshBody = meshBodies[index];
		body = meshBody.body;
		translation = body.translation();
		meshBody.force = {x: 0, y: 0, z: 0};
		barnesHutTree.insert(translation, body.mass());
		barnesHutTree.updateForces(translation, meshBody.force, thetaSquared);
		body.applyImpulse({
			x: meshBody.force.x * 100,
			y: meshBody.force.y * 100,
			z: meshBody.force.z * 100,
		},
		true);
	}
};
const keepWithinBounds = () => {
	// if any of the bodies are outside the bounds, move them back in
	const meshBodiesLength = Object.keys(meshBodies).length;
	const outerBoundary = 500;
	const innerBoundary = 200;
	for (let index = 0; index < meshBodiesLength; index++) {
		const meshBody = meshBodies[index];
		const body = meshBody.body;
		const position = body.translation();
		if (position.x > outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: innerBoundary, y: position.y, z: position.z}, true);
		} else if (position.x < -outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: -innerBoundary, y: position.y, z: position.z}, true);
		}
		if (position.y > outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x, y: innerBoundary, z: position.z}, true);
		} else if (position.y < -outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x, y: -innerBoundary, z: position.z}, true);
		}
		if (position.z > outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x, y: position.y, z: innerBoundary}, true);
		} else if (position.z < -outerBoundary) {
			body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x, y: position.y, z: -innerBoundary}, true);
		}
	}
};

const physicsUpdate = () => {
	keepWithinBounds();
	// gravitationAttraction();
	barnesHutAttraction();
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
