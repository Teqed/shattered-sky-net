// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import * as RAPIER from '@dimforge/rapier3d-compat';
import * as RANDOMJS from 'random-js';

const main = async () => {
	const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

	let world: RAPIER.World;
	// let world;

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
		meshUuid: string,
		meshUpdate: {
			position: {x: number, y: number, z: number},
			quaternion: { x: number, y: number, z: number, w: number}},
		body: RAPIER.RigidBody, update: Function }[] = []
	// const meshBodies = []

	const load = async () => {
		console.log('loading rapier...')
		return await RAPIER.init();
	}
	await load();

	// Function to create bodies
	const initBody = (meshUuid: string, meshUpdate: {
		position: {x: number, y: number, z: number},
		quaternion: { x: number, y: number, z: number, w: number}}, mass: number) => {
	// const initBody = (meshUpdate, mass) => {
		const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
			.setCanSleep(false)
			.setTranslation(meshUpdate.position.x, meshUpdate.position.y, meshUpdate.position.z)
			// .setAdditionalMass(mass || 0)
			.setAngularDamping(0)
			.setLinearDamping(0)
			.setLinvel(
				random.real(-1, 1),
				random.real(-1, 1),
				random.real(-1, 1)
			)
		rigidBodyDesc.angvel = new RAPIER.Vector3(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1)
		)
		const body = world.createRigidBody(rigidBodyDesc)
		const colliderDesc = RAPIER.ColliderDesc.convexMesh(vertices, indices)
		// @ts-ignore-next-line - colliderDesc is possibly null
		world.createCollider(colliderDesc, body)
			.setMass(mass || 0)
		const update = () => {
			const rotation = body.rotation();
			meshUpdate.quaternion = { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
			const translation = body.translation();
			meshUpdate.position = { x: translation.x, y: translation.y, z: translation.z }
		}
		update();
		return { meshUuid, meshUpdate, body, update };
	}

	// Listen for messages from the main thread
	self.onmessage = (event) => {
		const { data } = event;
		if (data.type === 'initialize') {
			console.log('initializing rapier worker...')
			// rapier.rs variables
			const gravity = { x: 0.0, y: 0.0, z: 0.0 };
			world = new RAPIER.World(gravity)
			// combined variables
			// Perform your Rapier calculations and send the results back to the main thread
			const physicsUpdate = () => {
				world.step();
				meshBodies.forEach((meshBody) => {
					meshBody.update();
				})
			};

			const messagingUpdate = () => {
				self.postMessage({
					type: 'physics-update',
					meshBodies: meshBodies.map(({ meshUuid, meshUpdate }) => ({ meshUuid, meshUpdate })) });
			};

			// Send a message back to the main thread
			self.postMessage({ type: 'initialized' });

			setInterval(() => {
				physicsUpdate();
				messagingUpdate();
			}, 1000 / 30);
		}
		if (data.type === 'newBody') {
			console.log('new body', data)
			const { meshUuid, meshUpdate, mass } = data;
			meshBodies.push(initBody(meshUuid, meshUpdate, mass));
		}
	};

	// Send a message back to the main thread that we're ready to listen for messages
	self.postMessage({ type: 'ready' });
}

main()
