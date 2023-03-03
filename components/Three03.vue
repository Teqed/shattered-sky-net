<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// three.js variables
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer
// let camera: THREE.OrthographicCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer

// cannon.js variables
let world: CANNON.World

// combined variables
const meshBodies = ref<{ mesh: THREE.Object3D<THREE.Event>, body: CANNON.Body }[]>([])

// my variables

const createMesh = () => {
	// const geometry = new THREE.BoxGeometry(2, 2, 2);
	// Instead of a Box, create a decagon
	const geometry = new THREE.IcosahedronGeometry(1, 0);
	const material = new THREE.MeshLambertMaterial({
		color: new THREE.Color(
			0,
			0,
			// Create blue colors. 0.5 is the mean, 0.25 is the standard deviation
			Math.random() * 0.5 + 0.5 + 0.25 * (Math.random() > 0.5 ? 1 : -1)
		)
	})

	const mesh = new THREE.Mesh(geometry, material)

	// Give it a random position
	mesh.position.x = Math.random() * 40 - 20
	mesh.position.y = Math.random() * 40 - 20
	mesh.position.z = Math.random() * 40 - 20

	scene.add(mesh)

	const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
	const body = new CANNON.Body({
		mass: 10,
	})
	body.addShape(shape)
	// Slightly randomize the angular momentum
	body.angularVelocity.set(
		Math.random() + 0.1 * (Math.random() > 0.5 ? 1 : -1),
		Math.random() + 0.1 * (Math.random() > 0.5 ? 1 : -1),
		Math.random() + 0.1 * (Math.random() > 0.5 ? 1 : -1)
	)
	body.angularDamping = 0
	world.addBody(body)

	meshBodies.value.push({ mesh, body })
}

const createMeshes = () => {
	for (let i = 0; i < 500; i++) {
		createMesh();
	}
}

const initThree = () => {
	// Div to hold the canvas
	const canvasWrapper = document.querySelector('#canvasWrapper') as HTMLDivElement;
	let dimensions = { width: (window.innerHeight * 0.65), height: (window.innerHeight * 0.65)}
	// Perspective Camera
	camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 1, 100)
	// Orthographic camera
	// camera = new THREE.OrthographicCamera(
	// 	dimensions.width / -100,
	// 	dimensions.width / 100,
	// 	dimensions.height / 100,
	// 	dimensions.height / -100,
	// 	1,
	// 	1000
	// );
	camera.position.z = 30

	// Scene
	scene = new THREE.Scene()

	// Add lights
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(0, 0, 1)
	scene.add(light)
	// Ambient light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(ambientLight)

	// Renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	})
	renderer.setSize(dimensions.width, dimensions.height)

	canvasWrapper.appendChild(renderer.domElement);

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

	// Create meshes
	createMeshes();
}

const createBodies = () => {
	for (let i = 0; i < meshBodies.value.length; i++) {
		const mesh = meshBodies.value[i].mesh;
		const body = meshBodies.value[i].body;

		// Copy coordinates from three.js to cannon.js
		body.position.copy(new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z));
		body.quaternion.copy(new CANNON.Quaternion(
			mesh.quaternion.x,
			mesh.quaternion.y,
			mesh.quaternion.z,
			mesh.quaternion.w));
	}
}

const initCannon = () => {
	world = new CANNON.World()
}

const animate = () => {
	requestAnimationFrame(animate)

	// Step the physics world
	world.fixedStep();

	// Copy coordinates from cannon.js to three.js
	for (let i = 0; i < meshBodies.value.length; i++) {
		const mesh = meshBodies.value[i].mesh;
		const body = meshBodies.value[i].body;

		mesh.position.copy(new THREE.Vector3(body.position.x, body.position.y, body.position.z));
		mesh.quaternion.copy(new THREE.Quaternion(
			body.quaternion.x,
			body.quaternion.y,
			body.quaternion.z,
			body.quaternion.w));
	}

	// Render three.js
	renderer.render(scene, camera);
}

onMounted(() => {
	initCannon()
	initThree()
	createBodies()
	animate()
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
