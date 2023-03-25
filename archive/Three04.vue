<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// three.js variables
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer

// cannon.js variables
let world: CANNON.World

// combined variables
let meshBodies: { mesh: THREE.Object3D<THREE.Event>, body: CANNON.Body, update: Function }[] = []
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

	const initCANNON = () => {
		// Create the world
		world = new CANNON.World()
		// world.gravity.set(0, -9.82, 0)
		world.broadphase = new CANNON.NaiveBroadphase()
		// set world drag on all bodies
		world.defaultContactMaterial.friction = 0.9
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
			mass?: number,
			position?: CANNON.Vec3,
			shape?: CANNON.Shape
		) => {
			console.log(position)
			// Create the body
			const body = new CANNON.Body({
				mass: mass || 0,
				position,
				shape: shape || new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
			})
			// Update the mesh position using the body position
			mesh.position.set(body.position.x, body.position.y, body.position.z)
			// randomAxis is a randomly chosen axis, either x, y, or z, the result as a Vec3
			const randomAxis = new CANNON.Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
			const update = () => {
				// Apply some drag to the body's current velocity
				body.velocity.scale(0.5)
				// Move the body back and forth on the provided axis from randomAxis
				// back and forth: Math.sin(Date.now() / 1000) * 2
				const moveThisFrame = ({
					x: randomAxis.x * Math.sin(Date.now() / 1000) * 0.05,
					y: randomAxis.y * Math.sin(Date.now() / 1000) * 0.05,
					z: randomAxis.z * Math.sin(Date.now() / 1000) * 0.05,
				})
				// Move it based on moveThisFrame
				body.position.set(
					body.position.x + moveThisFrame.x,
					body.position.y + moveThisFrame.y,
					body.position.z + moveThisFrame.z
				)
				// Give it velocity based on moveThisFrame
				// body.velocity.set(
				// 	body.velocity.x + moveThisFrame.x,
				// 	body.velocity.y + moveThisFrame.y,
				// 	body.velocity.z + moveThisFrame.z
				// )
				// Make sure the body isn't moving or spinning too fast. If it is, cap it.
				if (body.velocity.length() > 10) {
					body.velocity.normalize()
					body.velocity.scale(10)
				}
				if (body.angularVelocity.length() > 10) {
					body.angularVelocity.normalize()
					body.angularVelocity.scale(10)
				}
				// Move the body according to its velocity
				// body.position.set(
				// 	body.position.x + body.velocity.x,
				// 	body.position.y + body.velocity.y,
				// 	body.position.z + body.velocity.z
				// )
				// Update the mesh position using the body position
				mesh.position.set(body.position.x, body.position.y, body.position.z)
				// mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w)
			}
			world.addBody(body)
			return { mesh, body, update };
		}
		const box = (mass?: number, position?: CANNON.Vec3, size?: CANNON.Vec3) => {
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
				mesh, mass, position, new CANNON.Box(new CANNON.Vec3(size?.x || 1, size?.y || 1, size?.z || 1))
			);
		}

		// Push 50 meshBodies array
		for (let i = 0; i < 1000; i++) {
			meshBodies.push(
				box(
					0,
					new CANNON.Vec3(
						Math.random() * 10 - 5,
						Math.random() * 10 - 5,
						Math.random() * 10 - 5
					),
					new CANNON.Vec3(
						1,
						1,
						1
					)
				)
			)
		}
	}

	initCANNON();
	console.log('CANNON initialized')
	initTHREE();
	console.log('THREE initialized')
	initDOM();
	console.log('DOM initialized')
	initEventListeners();
	console.log('Event listeners initialized')
	initLights();
	console.log('Lights initialized')
	initMeshes();
	console.log('Meshes initialized')
}

const animate = () => {
	// Update the world
	world.step(1 / 60)
	// Update the meshes by calling the update function
	meshBodies.forEach((meshBody) => {
		meshBody.update()
	})
	// Render the scene
	renderer.render(scene, camera)
	// Call the function again
	requestAnimationFrame(animate)
}

onMounted(() => {
	initScene();
	console.log('Scene initialized')
	animate();
	console.log('Animation initialized')
	// camera.lookAt(0, 0, 0)
})

onUnmounted(() => {
	// Remove the event listeners
	window.removeEventListener('resize', () => {})
	// Remove the canvas
	document.querySelector('#canvasWrapper')?.removeChild(renderer.domElement)
	// Reset the variables
	camera = new THREE.PerspectiveCamera()
	scene = new THREE.Scene()
	renderer = new THREE.WebGLRenderer()
	world = new CANNON.World()
	meshBodies = []
	light = new THREE.DirectionalLight(0xFFFFFF, 1)
	ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
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
