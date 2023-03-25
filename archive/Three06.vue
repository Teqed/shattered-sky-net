<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import * as RAPIER from '@dimforge/rapier3d-compat';

import * as THREE from 'three';

import * as RANDOMJS from 'random-js';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

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
const load = async () => {
	return await RAPIER.init();
}

onMounted(() => {
	const runSimulation = async () => {
		await load();
		// browser variables
		let dimensions = { width: (window.innerWidth), height: (window.innerHeight)}

		// three.js variables
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 1, 100)
		camera.position.z = 30
		const renderer = new THREE.WebGLRenderer(
			{
				antialias: true,
				alpha: true
			}
		)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(window.devicePixelRatio)
		document.querySelector('#canvasWrapper')?.appendChild(renderer.domElement)
		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 0, 1)
		scene.add(light)
		const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
		scene.add(ambientLight)

		// rapier.rs variables
		const gravity = { x: 0.0, y: 0.0, z: 0.0 };
		const world = new RAPIER.World(gravity)

		// combined variables
		const meshBodies: { mesh: THREE.Object3D<THREE.Event>, body: RAPIER.RigidBody, update: Function }[] = []

		// event listeners
		const onWindowResize = () => {
			dimensions = { width: (window.innerWidth), height: (window.innerHeight)}
			camera.aspect = dimensions.width / (dimensions.height)
			camera.updateProjectionMatrix()
			renderer.setSize(dimensions.width, dimensions.height)
		}
		onWindowResize();
		window.addEventListener('resize', onWindowResize)
		const initScene = () => {
			const initBody = (mesh: THREE.Object3D<THREE.Event>, mass: number, position: RAPIER.Vector) => {
				const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
					.setCanSleep(false)
					.setTranslation(position.x, position.y, position.z)
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
				mesh.position.set(position.x, position.y, position.z)
				const update = () => {
					const rotation = body.rotation();
					mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
					const translation = body.translation();
					mesh.position.set(translation.x, translation.y, translation.z)
				}
				return { mesh, body, update };
			}
			const icosahedron = (mass: number, position: RAPIER.Vector, size: RAPIER.Vector) => {
				const geometry = new THREE.IcosahedronGeometry(1, 0);
				const material = new THREE.MeshLambertMaterial({
					color: new THREE.Color(
						0,
						0,
						// Standard deviation of 0.25, mean of 0.5
						random.real(0, 1) * 0.5 + 0.25 + 0.25 * (random.real(-1, 1))
					)
				})
				const mesh = new THREE.Mesh(geometry, material)
				scene.add(mesh)
				return initBody(mesh, mass, position);
			}

			for (let i = 0; i < 500; i++) {
				meshBodies.push(
					icosahedron(
						10,
						new RAPIER.Vector3(
							random.integer(-20, 20),
							random.integer(-20, 20),
							random.integer(-20, 20),
						),
						new RAPIER.Vector3(
							1,
							1,
							1
						)
					)
				)
			}
		}

		const animate = async () => {
			meshBodies.forEach((meshBody) => {
				meshBody.update();
			})
			renderer.render(scene, camera)
			await new Promise(resolve => setTimeout(resolve, 32));
			requestAnimationFrame(animate)
		}
		const asyncGameLoop = () => {
			const doLoop = async () => {
				world.step();
				await new Promise(resolve => setTimeout(resolve, 32));
			}
			const loop = async () => {
				await doLoop();
				loop();
			}
			loop();
		};

		initScene();
		console.log('Scene initialized')
		animate();
		asyncGameLoop();
	}
	runSimulation();
}
)

onUnmounted(() => {
})
</script>

<script lang="ts">
</script>

<style>

  canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
  animation: fadein 1s ease-in-out forwards;
  }

@keyframes fadein {
  from {
    opacity: 0;
    filter: blur(10px);
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

</style>
