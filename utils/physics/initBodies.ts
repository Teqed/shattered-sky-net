import * as RANDOMJS from 'random-js';
import { Vector3, RigidBodyDesc, ColliderDesc, World } from '../worker/rapier-treeshake';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);
const rigidBodyDesc = RigidBodyDesc.dynamic()
// const rigidBodyDesc = RigidBodyDesc.kinematicVelocityBased()
	// .setCanSleep(false)
	.setAngularDamping(1)
	.setLinearDamping(1)
let colliderDesc = ColliderDesc.ball(1)
const initBody = (world: World, newBody: {meshId: number,
	p: { x: number, y: number, z: number },
	r: { x: number, y: number, z: number, w: number },
	mass: number, size: number}) => {
	const id = newBody.meshId;
	if (newBody.size !== 1) {
		colliderDesc = ColliderDesc.ball(newBody.size)
	}
	rigidBodyDesc.setTranslation(
		newBody.p.x ?? 0,
		newBody.p.y ?? 0,
		newBody.p.z ?? 0,
	)
		.setLinvel(
			random.real(-10, 10),
			random.real(-10, 10),
			random.real(-10, 10),
		)
		.setRotation({
			x: newBody.r.x ?? 0,
			y: newBody.r.y ?? 0,
			z: newBody.r.z ?? 0,
			w: newBody.r.w ?? 0,
		}
		)
		.setAngvel(new Vector3(
			random.real(-1, 1),
			random.real(-1, 1),
			random.real(-1, 1),
		))
	rigidBodyDesc.mass = newBody.mass
	const body = world.createRigidBody(rigidBodyDesc)
	const thing = world.createCollider(colliderDesc, body)
	thing.setRestitution(0)
	thing.setFriction(1)
	return { id, body };
}
export default initBody
