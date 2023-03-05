<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">
// We're going to be replacing CANNON with RAPIER,
// a physics engine written in Rust

// @ts-ignore-next-line
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

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
				const gravity = { x: 0.0, y: -9.81, z: 0.0 };
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
						// alpha: true
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
				// Add the meshes
				// Create the geometry
				const geometry = new THREE.BoxGeometry(1, 1, 1)
				// Create the material
				const material = new THREE.MeshStandardMaterial({ color: 0x00FF00 })
				// Create the mesh
				const mesh = new THREE.Mesh(geometry, material)
				// Add the mesh to the scene
				scene.add(mesh)
				// Create the body
				// const body = new CANNON.Body({
				// 	mass: 1,
				// 	position: new CANNON.Vec3(0, 0, 0),
				// 	shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
				// })
				const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
					.setTranslation(0.0, 0.0, 0.0);

				const body = world.createRigidBody(bodyDesc);
				const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
				world.createCollider(
					colliderDesc
				);
				// Add the body to the world
				// world.addBody(body)
				// Create the update function
				const update = () => {
					// mesh.position.copy(body.position)
					// mesh.quaternion.copy(body.quaternion)
					// Copy the RAPIER body position to the THREE mesh position
					mesh.position.copy(
						new THREE.Vector3(
							body.translation().x,
							body.translation().y,
							body.translation().z
						)
					);
					mesh.quaternion.copy(
						new THREE.Quaternion(
							body.rotation().x,
							body.rotation().y,
							body.rotation().z,
							body.rotation().w
						)
					);
				}
				// Add the mesh, body and update function to the meshBodies array
				meshBodies.push({ mesh, body, update })
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
			// Update the meshes by calling the update function
			meshBodies.forEach((meshBody) => {
				meshBody.update()
			})
			// Render the scene
			renderer.render(scene, camera)
			// Call the function again
			requestAnimationFrame(animate)
		}
		initScene();
		console.log('Scene initialized')
		animate();
		console.log('Animation initialized')
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
