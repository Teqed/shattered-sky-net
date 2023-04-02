import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import '@babylonjs/core/Materials/Textures/baseTexture';
// @ts-ignore
import amigaPattern from '../../../assets/textures/mygrid.jpg';
import '@babylonjs/core/Rendering/edgesRenderer'

export default (scene: Scene, _rapierWorker: rapierWorkerType, shadows: ShadowGenerator) => {
	// Create a ground, and place a box on it
	// Create a rapier physics body too
	const ground = MeshBuilder.CreateBox('ground', { width: 3, height: 0.01, depth: 3 }, scene);
	ground.position.x = 0;
	ground.position.y = 0;
	ground.position.z = 0;
	const forGround = new StandardMaterial('forGround', scene);
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	forGround.diffuseTexture = amigaTexture;
	ground.material = forGround;
	// ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
	// ground.physicsImpostor.physicsBody.setFriction(0.5);
	// ground.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// ground.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// ground.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Static);
	// ground.physicsImpostor.physicsBody.setGravityEnabled(false);
	// ground.physicsImpostor.physicsBody.setActive(false);
	// ground.physicsImpostor.physicsBody.setCanSleep(false);

	const box = MeshBuilder.CreateBox('box', { width: 0.75, height: 0.75, depth: 0.75 }, scene);
	box.position.x = -0.75;
	box.position.y = 0.37;
	box.position.z = 0.75;
	box.rotate(new Vector3(0, 1, 0), Math.PI / 4);
	const forBox = new StandardMaterial('forBox', scene);
	const amigaSmallTexture = new Texture(amigaPattern, scene);
	amigaSmallTexture.updateSamplingMode(1);
	amigaSmallTexture.uScale = 1.5;
	amigaSmallTexture.vScale = 1.5;
	forBox.diffuseTexture = amigaSmallTexture;
	box.material = forBox;
	// box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
	// box.physicsImpostor.physicsBody.setFriction(0.5);
	// box.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// box.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// box.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Dynamic);
	// box.physicsImpostor.physicsBody.setGravityEnabled(true);
	// box.physicsImpostor.physicsBody.setActive(true);
	// box.physicsImpostor.physicsBody.setCanSleep(true);

	const box2 = MeshBuilder.CreateBox('box2', { width: 0.55, height: 0.55, depth: 0.55 }, scene);
	box2.position.x = 0;
	box2.position.y = 0.33;
	box2.position.z = 0;
	box2.rotate(new Vector3(0, 1, 0), Math.PI / 4);
	box2.material = forBox;

	const newBody = {
		meshId: 1,
		p: {
			x: box.position.x,
			y: box.position.y,
			z: box.position.z,
		},
		r: {
			x: 0,
			y: 0,
			z: 0,
			w: 0,
		},
		mass: 1,
		size: 1,
	}

	// crystal will be a floating icosahedron, blue, with emissive glow
	// it will rotate slowly
	const crystal = MeshBuilder.CreateIcoSphere('crystal', { radius: 0.25, subdivisions: 1 }, scene);
	crystal.position.x = 0;
	crystal.position.y = 1;
	crystal.position.z = 0;
	const forCrystal = new StandardMaterial('forCrystal', scene);
	forCrystal.diffuseColor = Color3.FromHexString('#1a548d');
	forCrystal.emissiveColor = Color3.FromHexString('#1a548d');
	crystal.material = forCrystal;
	// crystal.physicsImpostor = new PhysicsImpostor(crystal, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
	// crystal.physicsImpostor.physicsBody.setFriction(0.5);
	// crystal.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// crystal.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// crystal.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Dynamic);
	// crystal.physicsImpostor.physicsBody.setGravityEnabled(true);
	// crystal.physicsImpostor.physicsBody.setActive(true);
	// crystal.physicsImpostor.physicsBody.setCanSleep(true);
	// crystal.physicsImpostor.physicsBody.setAngularVelocity(new Vector3(0, 0.1, 0));
	// crystal.physicsImpostor.physicsBody.setLinearVelocity(new Vector3(0, 0, 0));

	// Add outline to crystal
	// crystal.enableEdgesRendering();

	let glowingBrighter = true;
	scene.onBeforeRenderObservable.add(() => {
		if (glowingBrighter) {
			forCrystal.emissiveColor.r += 0.0025;
			forCrystal.emissiveColor.g += 0.0025;
			forCrystal.emissiveColor.b += 0.0025;
			if (forCrystal.emissiveColor.b >= 0.55) {
				glowingBrighter = false;
			}
		} else {
			forCrystal.emissiveColor.r -= 0.0025;
			forCrystal.emissiveColor.g -= 0.0025;
			forCrystal.emissiveColor.b -= 0.0025;
			if (forCrystal.emissiveColor.b <= 0.33) {
				glowingBrighter = true;
			}
		}

		// rotate crystal
		crystal.rotate(new Vector3(0, 1, 0), Math.PI / 360);
	});

	try {
		shadows.getShadowMap()?.renderList?.push(ground);
		shadows.getShadowMap()?.renderList?.push(box);
		shadows.getShadowMap()?.renderList?.push(box2);
		shadows.getShadowMap()?.renderList?.push(crystal);
	} catch (error) { }
	ground.receiveShadows = true;
	box.receiveShadows = true;
	box2.receiveShadows = true;
	crystal.receiveShadows = true;
	// rapierWorker.newBody(newBody)
}
