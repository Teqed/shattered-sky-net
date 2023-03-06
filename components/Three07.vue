<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

import * as THREE from 'three';

import * as RANDOMJS from 'random-js';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

// three.js variables
const scene = new THREE.Scene()
const meshBodies: {
	meshUuid: string,
	meshUpdate: {
		position: {x: number, y: number, z: number},
		quaternion: { x: number, y: number, z: number, w: number}
	},
	mesh: THREE.Object3D<THREE.Event>,
}[] = []

const icosahedron = (mass: number, position: { x: number, y: number, z: number }) => {
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
	return initBody(mesh, mass, position);
}

// Create a new web worker
const worker = new Worker(new URL('../worker/rapier-worker.ts', import.meta.url), {
	type: 'module',
})

// Listen for messages from the worker
worker.onmessage = (event) => {
	const { data } = event;
	if (data.type === 'ready') {
		// The worker is ready to receive messages
		// Send a message to the worker to initialize the physics world
		worker.postMessage({ type: 'initialize' });
	}
	if (data.type === 'initialized') {
		for (let i = 0; i < 500; i++) {
			icosahedron(
				10,
				{
					x: random.integer(-20, 20),
					y: random.integer(-20, 20),
					z: random.integer(-20, 20),
				},
			)
		}
	}
	if (data.type === 'physics-update') {
		console.log(data)
		console.log(data.meshBodies[0].meshUuid)
		// Update the mesh positions
		data.meshBodies.forEach((meshBody: {
			meshUuid: string,
			meshUpdate: {
				position: {x: number, y: number, z: number},
				quaternion: { x: number, y: number, z: number, w: number}
			},
		}
		) => {
			const meshBodyIndex = meshBodies.findIndex(meshBodyItem => meshBodyItem.meshUuid === meshBody.meshUuid);
			meshBodies[meshBodyIndex].meshUpdate = meshBody.meshUpdate;
		});
	}
};

// Send a message to the worker when initBody is called
const initBody = (mesh: THREE.Object3D<THREE.Event>, mass: number, position: { x: number; y: number; z: number; }) => {
	scene.add(mesh)
	// Push the mesh to the meshBodies array
	meshBodies.push({ meshUuid: mesh.uuid,
		meshUpdate: {
			position: {x: position.x, y: position.y, z: position.z},
			quaternion: { x: 0, y: 0, z: 0, w: 0}},
		mesh });
	// Send a message to the worker
	worker.postMessage({ type: 'newBody',
		meshUuid: mesh.uuid,
		meshUpdate: {
			position: {x: position.x, y: position.y, z: position.z},
			quaternion: { x: 0, y: 0, z: 0, w: 0}},
		mass });
	return meshBodies[meshBodies.length - 1];
};

onMounted(() => {
	const threeSimulation = () => {
		// browser variables
		let dimensions = { width: (window.innerWidth), height: (window.innerHeight)}
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
		// event listeners
		const onWindowResize = () => {
			dimensions = { width: (window.innerWidth), height: (window.innerHeight)}
			camera.aspect = dimensions.width / (dimensions.height)
			camera.updateProjectionMatrix()
			renderer.setSize(dimensions.width, dimensions.height)
		}
		onWindowResize();
		window.addEventListener('resize', onWindowResize)

		console.log('Scene initialized')
		const animate = async () => {
			console.log('animate')
			// Update the mesh positions
			meshBodies.forEach((meshBody) => {
				meshBody.mesh.position.set(meshBody.meshUpdate.position.x, meshBody.meshUpdate.position.y, meshBody.meshUpdate.position.z)
				meshBody.mesh.quaternion.set(meshBody.meshUpdate.quaternion.x, meshBody.meshUpdate.quaternion.y, meshBody.meshUpdate.quaternion.z, meshBody.meshUpdate.quaternion.w)
			});
			renderer.render(scene, camera)
			await new Promise(resolve => setTimeout(resolve, 32));
			requestAnimationFrame(animate)
		}
		animate();
	}
	threeSimulation();
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
