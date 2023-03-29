import * as RANDOMJS from 'random-js';
import { Vector3, RigidBodyDesc, ColliderDesc, World } from '../../worker/rapier-treeshake';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);
const rigidBodyDesc = RigidBodyDesc.dynamic()
// const rigidBodyDesc = RigidBodyDesc.kinematicVelocityBased()
	// .setCanSleep(false)
	.setAngularDamping(0.01)
	// .setLinearDamping(0.1)
let colliderDesc = ColliderDesc.ball(1)
const initBody = (world: World, newBody: {meshId: number,
	p: { x: number, y: number, z: number },
	r: { x: number, y: number, z: number, w: number },
	mass: number, size: number}) => {
	const id = newBody.meshId;
	if (newBody.size !== 1) {
		colliderDesc = ColliderDesc.ball(newBody.size)
	}
	const createSpin = (x: number, y: number, z: number) => {
		const spin = new Vector3(0, 0, 0);

		// Calculate the distance of each object from the origin.
		const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

		// Calculate the angle between the object and the x-axis.
		const angle = Math.atan2(y, z);

		// Add a constant velocity to the angle to make the objects rotate around the origin.
		const velocity = 2; // radians per second
		const newAngle = angle + velocity;

		// Convert the angle back to x,y,z coordinates.
		spin.x = 0;
		spin.y = distance * Math.sin(newAngle + 0.5);
		spin.z = distance * Math.cos(newAngle);

		return spin;
	}
	const spin = createSpin(newBody.p.x, newBody.p.y, newBody.p.z);
	rigidBodyDesc.setTranslation(
		newBody.p.x ?? 0,
		newBody.p.y ?? 0,
		newBody.p.z ?? 0,
	)
		// .setLinvel(
		// 	random.real(-100, 500),
		// 	random.real(-50, 50),
		// 	random.real(-50, 50),
		// )
		.setLinvel(
			spin.x,
			spin.y,
			spin.z,
		)
		.setRotation({
			x: newBody.r.x ?? 0,
			y: newBody.r.y ?? 0,
			z: newBody.r.z ?? 0,
			w: newBody.r.w ?? 0,
		})
		.setAngvel(new Vector3(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1),
		))
	rigidBodyDesc.mass = newBody.mass
	const body = world.createRigidBody(rigidBodyDesc)
	body.setAdditionalMass(newBody.mass, true)
	// const thing = world.createCollider(colliderDesc, body)
	// thing.setRestitution(0.7)
	// thing.setFriction(1)
	const virtualPos = {
		x: newBody.p.x ?? 0,
		y: newBody.p.y ?? 0,
		z: newBody.p.z ?? 0,
	}
	const virtualRot = {
		x: newBody.r.x ?? 0,
		y: newBody.r.y ?? 0,
		z: newBody.r.z ?? 0,
		w: newBody.r.w ?? 0,
	}
	return { id, body, virtualPos, virtualRot };
}
export default initBody
