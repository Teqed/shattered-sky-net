<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">
// We're going to be replacing CANNON with RAPIER,
// a physics engine written in Rust

// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import * as RAPIER from '@dimforge/rapier3d-compat';

import * as THREE from 'three';

onMounted(() => {
	const runSimulation = async () => {
		await RAPIER.init();
		// three.js variables
		let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer

		// cannon.js variables
		// let world: CANNON.World
		let world: RAPIER.World

		// combined variables
		// let meshBodies: { mesh: THREE.Object3D<THREE.Event>, body: CANNON.Body, update: Function }[] = []
		const meshBodies: { mesh: THREE.Object3D<THREE.Event>, body: RAPIER.RigidBody, update: Function }[] = []
		let light: THREE.DirectionalLight
		let ambientLight: THREE.AmbientLight

		let dimensions = { width: (window.innerWidth), height: (window.innerHeight)}

		const initScene = () => {
			// First create CANNON world
			// Then create THREE scene and camera, renderer
			// Then add it to the DOM
			// Then add the event listeners
			// Then add the lights
			// Then add the meshes

			const initRAPIER = () => {
				// Create the world
				// world = new CANNON.World()
				const gravity = { x: 0.0, y: 0.0, z: 0.0 };
				// world = new RAPIER.World(gravity);
				world = new RAPIER.World(gravity)
				// world.gravity.set(0, -9.82, 0)
				// world.broadphase = new CANNON.NaiveBroadphase()
				// set world drag on all bodies
				// world.defaultContactMaterial.friction = 0.9
			}

			const initTHREE = () => {
				// Create the scene
				scene = new THREE.Scene()
				// Create the camera
				camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 1, 100)
				camera.position.z = 10
				// Create the renderer
				renderer = new THREE.WebGLRenderer(
					{
						antialias: true,
						alpha: true
					}
				)
				renderer.setSize(window.innerWidth, window.innerHeight)
				renderer.setPixelRatio(window.devicePixelRatio)
			}

			const initDOM = () => {
				// Add the renderer to the DOM
				document.querySelector('#canvasWrapper')?.appendChild(renderer.domElement)
			}

			const initEventListeners = () => {
				// Create the event listeners
				// Resize
				const onWindowResize = () => {
				// dimensions = { width: (window.innerHeight * 0.65), height: (window.innerHeight * 0.65)}
					dimensions = { width: (window.innerWidth), height: (window.innerHeight)}
					camera.aspect = dimensions.width / (dimensions.height)
					camera.updateProjectionMatrix()
					renderer.setSize(dimensions.width, dimensions.height)
				}
				onWindowResize();
				window.addEventListener('resize', onWindowResize)
			}

			const initLights = () => {
				// Add the lights
				light = new THREE.DirectionalLight(0xFFFFFF, 1)
				light.position.set(0, 0, 1)
				scene.add(light)
				// Ambient light
				ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
				scene.add(ambientLight)
			}

			const initMeshes = () => {
				const initBody = (
					mesh: THREE.Object3D<THREE.Event>,
					mass: number,
					// position?: CANNON.Vec3,
					position: RAPIER.Vector,
					// shape?: CANNON.Shape
					shape?: RAPIER.Shape
				) => {
					console.log(position)
					// Create the body
					// const body = new CANNON.Body({
					const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
						.setTranslation(position.x, position.y, position.z)
						.setAdditionalMass(mass || 0)
					rigidBodyDesc.angvel = new RAPIER.Vector3(
						Math.random() + 0.01 * (Math.random() > 0.5 ? 1 : -1),
						Math.random() + 0.01 * (Math.random() > 0.5 ? 1 : -1),
						Math.random() + 0.01 * (Math.random() > 0.5 ? 1 : -1)
					)
					const body = world.createRigidBody(rigidBodyDesc)
					// body.applyTorqueImpulse(spin, true)
					// Update the mesh position using the body position
					mesh.position.set(position.x, position.y, position.z)
					// randomAxis is a randomly chosen axis, either x, y, or z, the result as a Vec3
					// const randomAxis = new CANNON.Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
					const randomAxis = new RAPIER.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
					const update = () => {
						// Apply some drag to the body's current velocity
						// body.velocity.scale(0.5)
						// Move the body back and forth on the provided axis from randomAxis
						// back and forth: Math.sin(Date.now() / 1000) * 2
						const moveThisFrame = ({
							x: randomAxis.x * Math.sin(Date.now() / 1000) * 0.05,
							y: randomAxis.y * Math.sin(Date.now() / 1000) * 0.05,
							z: randomAxis.z * Math.sin(Date.now() / 1000) * 0.05,
						})
						const position = body.translation()
						// Move it based on moveThisFrame
						body.setTranslation({
							x: position.x + moveThisFrame.x,
							y: position.y + moveThisFrame.y,
							z: position.z + moveThisFrame.z,
						}, true)
						// Give it velocity based on moveThisFrame
						// body.velocity.set(
						// 	body.velocity.x + moveThisFrame.x,
						// 	body.velocity.y + moveThisFrame.y,
						// 	body.velocity.z + moveThisFrame.z
						// )
						// Make sure the body isn't moving or spinning too fast. If it is, cap it.
						// if (body.velocity.length() > 10) {
						// 	body.velocity.normalize()
						// 	body.velocity.scale(10)
						// }
						// if (body.angularVelocity.length() > 10) {
						// 	body.angularVelocity.normalize()
						// 	body.angularVelocity.scale(10)
						// }
						// Move the body according to its velocity
						// body.position.set(
						// 	body.position.x + body.velocity.x,
						// 	body.position.y + body.velocity.y,
						// 	body.position.z + body.velocity.z
						// )
						// Update the mesh position using the body position
						mesh.position.set(position.x, position.y, position.z)
						const quaternion = body.rotation();
						mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
					}
					// world.addBody(body)
					return { mesh, body, update };
				}
				// const box = (mass?: number, position?: CANNON.Vec3, size?: CANNON.Vec3) => {
				const box = (mass?: number, position?: RAPIER.Vector, size?: RAPIER.Vector) => {
					// Create the mesh
					const mesh = new THREE.Mesh(
						new THREE.BoxGeometry(size?.x || 1, size?.y || 1, size?.z || 1),
						new THREE.MeshStandardMaterial({
							// Pick a random color
							color: Math.random() * 0xFFFFFF,
						},
						)
					)
					scene.add(mesh)
					return initBody(
						// mesh, mass, position, new CANNON.Box(new CANNON.Vec3(size?.x || 1, size?.y || 1, size?.z || 1))
						mesh, (mass || 1), (position || new THREE.Vector3(0, 0, 0)), new RAPIER.Cuboid(size?.x || 1, size?.y || 1, size?.z || 1)
					);
				}

				// Push 50 meshBodies array
				for (let i = 0; i < 50; i++) {
					console.log('pushing' + i)
					meshBodies.push(
						box(
							1,
							new RAPIER.Vector3(
								Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1),
								Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1),
								Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1),
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

			initRAPIER()
			initTHREE()
			initDOM()
			initEventListeners()
			initLights()
			initMeshes()
		}

		const animate = () => {
			// Update the world
			// world.step(1 / 60)
			world.step();
			// Update the meshes by calling the update function
			meshBodies.forEach((meshBody) => {
				meshBody.update()
			})
			// Render the scene
			renderer.render(scene, camera)
			// Call the function again
			requestAnimationFrame(animate)
		}
		const gameLoop = () => {
			world.step();
			setTimeout(gameLoop, 16);
		};
		initScene();
		console.log('Scene initialized')
		animate();
		console.log('Animation initialized')
		gameLoop();
	// camera.lookAt(0, 0, 0)
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
