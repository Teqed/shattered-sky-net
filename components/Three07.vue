<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

import * as THREE from 'three';
import * as RANDOMJS from 'random-js';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

// Initialize object pool
const objectPool: any[] = [];

// Create an object in the pool or create a new object if the pool is empty
const createObject = () => {
	return objectPool.length > 0 ? objectPool.pop() : {};
};

// Release an object back to the pool
const releaseObject = (obj: { [x: string]: any; }) => {
	Object.keys(obj).forEach((key) => {
		delete obj[key];
	});
	objectPool.push(obj);
};

// three.js variables
const scene = new THREE.Scene()
const meshBodies: {
	meshId: number,
	meshUpdate: {
		p: {x: number, y: number, z: number},
		q: { x: number, y: number, z: number, w: number}
	},
	mesh: THREE.Object3D<THREE.Event>,
}[] = [];
let meshBodiesUpdate: { [x: string]: any; } = {};

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

const physicsUpdate = (
	update: { [x: string]: { p: { x: number, y: number, z: number }, q: { x: number, y: number, z: number, w: number } } },
) => {
	meshBodiesUpdate = update;
}

// Listen for messages from the worker
worker.onmessage = (event) => {
	switch (event.data.type) {
		case 'ready':
			worker.postMessage({ type: 'initialize' });
			break;
		case 'initialized':
			for (let i = 0; i < 2000; i++) {
				icosahedron(
					10,
					{
						x: random.integer(-20, 20),
						y: random.integer(-20, 20),
						z: random.integer(-20, 20),
					},
				)
			}
			break;
		case 'physics-update':
			physicsUpdate(event.data.meshBodiesUpdate);
			break;
		default:
			console.log('Unknown message type', event.data.type);
	}
};

// Send a message to the worker when initBody is called
const initBody = (mesh: THREE.Object3D<THREE.Event>, mass: number, position: { x: number; y: number; z: number; }) => {
	scene.add(mesh)
	// Push the mesh to the meshBodies array
	meshBodies.push({ meshId: mesh.id,
		meshUpdate: {
			p: {x: position.x, y: position.y, z: position.z},
			q: { x: 0, y: 0, z: 0, w: 0}},
		mesh });
	// Send a message to the worker
	worker.postMessage({ type: 'newBody',
		meshId: mesh.id,
		meshUpdate: {
			p: {x: position.x, y: position.y, z: position.z},
			q: { x: 0, y: 0, z: 0, w: 0}},
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

		const updateMeshes = () => {
		// Update the mesh positions
		// check if the meshBodiesUpdate object has any keys
			if (meshBodiesUpdate && Object.keys(meshBodiesUpdate).length > 0) {
				meshBodies.forEach((meshBody) => {
					if (meshBodiesUpdate[meshBody.meshId]) {
						meshBody.meshUpdate = meshBodiesUpdate[meshBody.meshId];
					}
					meshBody.mesh.position.set(
						meshBody.meshUpdate.p.x,
						meshBody.meshUpdate.p.y,
						meshBody.meshUpdate.p.z,
					);
					meshBody.mesh.quaternion.set(
						meshBody.meshUpdate.q.x,
						meshBody.meshUpdate.q.y,
						meshBody.meshUpdate.q.z,
						meshBody.meshUpdate.q.w,
					);
				});
			}
		}
		const animate = () => {
			updateMeshes();
			renderer.render(scene, camera)
			requestAnimationFrame(animate)
		}
		animate();
		// setInterval(() => {
		// 	updateMeshes();
		// }, 1000 / 30)
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
