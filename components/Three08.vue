<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as RANDOMJS from 'random-js';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

const worker = new Worker(new URL('../worker/rapier-worker.ts', import.meta.url), {
	type: 'module',
})

// Initialize object pool
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectPool: any[] = [];

// Create an object in the pool or create a new object if the pool is empty
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createObject = () => {
	return objectPool.length > 0 ? objectPool.pop() : {};
};

// Release an object back to the pool
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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
let meshBodiesUpdate: {[x: string]: {
	p: {x: number,
		y: number,
		z: number},
	q: {x: number,
		y: number,
		z: number,
		w: number} } } = {};

const icosahedron = (
	arg: {
		position?: {x: number, y: number, z: number},
		rotation?: {x: number, y: number, z: number, w: number},
		mass?: number,
		size?: number}
) => {
	const geometry = new THREE.IcosahedronGeometry(arg.size ?? 1, 0);
	const material = new THREE.MeshLambertMaterial({
		color: new THREE.Color(
			0,
			0,
			random.real(0, 1) * 0.5 + 0.25 + 0.25 * (random.real(-1, 1))
		)
	})
	const mesh = new THREE.Mesh(geometry, material)
	return initBody(
		mesh,
		arg.position ?? {x: 0, y: 0, z: 0},
		arg.rotation ?? {x: 0, y: 0, z: 0, w: 0},
		arg.mass ?? 1,
		arg.size ?? 1,
	);
}

const physicsUpdate = (
	update: {
		[x: string]: {
			p: {x: number,
				y: number,
				z: number},
			q: {x: number,
				y: number,
				z: number,
				w: number} } },
) => {	meshBodiesUpdate = update; }

worker.onmessage = (event) => {
	switch (event.data.type) {
		case 'ready':
			worker.postMessage({ type: 'initialize' });
			break;
		case 'initialized':
			for (let i = 0; i < 200; i++) {
				icosahedron({
					position: {
						x: random.integer(-20, 20),
						y: random.integer(-20, 20),
						z: random.integer(-20, 20),
					},
					rotation: {
						x: random.real(-1, 1),
						y: random.real(-1, 1),
						z: random.real(-1, 1),
						w: random.real(-1, 1),
					},
					size: random.real(0.5, 1.5),
				})
			}
			break;
		case 'physics-update':
			physicsUpdate(event.data.meshBodiesUpdate);
			break;
		default:
			console.log('Unknown message type', event.data.type);
	}
};

const initBody = (
	mesh: THREE.Object3D<THREE.Event>,
	position: {x: number; y: number; z: number;},
	rotation: {x: number; y: number; z: number; w: number;},
	mass?: number,
	size?: number,
) => {
	scene.add(mesh)
	meshBodies.push({ meshId: mesh.id,
		meshUpdate: {
			p: {x: position.x, y: position.y, z: position.z},
			q: {x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w}},
		mesh });
	worker.postMessage({ type: 'newBody',
		meshId: mesh.id,
		meshUpdate: {
			p: {x: position.x, y: position.y, z: position.z},
			q: {x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w}},
		mass,
		size
	});
	return meshBodies[meshBodies.length - 1];
};

onMounted(() => {
	const threeSimulation = () => {
		// browser variables
		let dimensions = {width: (window.innerWidth), height: (window.innerHeight)}
		const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 1, 100)
		camera.position.z = 30
		const renderer = new THREE.WebGLRenderer(
			{	antialias: true,
				alpha: true	})
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(window.devicePixelRatio)
		document.querySelector('#canvasWrapper')?.appendChild(renderer.domElement)

		const onWindowResize = () => {
			dimensions = { width: (window.innerWidth), height: (window.innerHeight)}
			camera.aspect = dimensions.width / (dimensions.height)
			camera.updateProjectionMatrix()
			renderer.setSize(dimensions.width, dimensions.height)
		}
		onWindowResize();
		window.addEventListener('resize', onWindowResize)

		const createLights = () => {
			const light = new THREE.DirectionalLight(0xFFFFFF, 1)
			light.position.set(0, 0, 1)
			scene.add(light)
			const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
			scene.add(ambientLight)
		}
		createLights()

		const updateMeshes = () => {
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
			renderer.render(scene, camera)
			requestAnimationFrame(animate)
		}
		animate();
		setInterval(() => {
			updateMeshes();
		}, 1000 / 30)
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
