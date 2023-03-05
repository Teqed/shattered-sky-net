<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

// @ts-ignore-next-line
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import * as RAPIER from '@dimforge/rapier3d-compat';

import * as THREE from 'three';

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

onMounted(() => {
	const runSimulation = async () => {
		await RAPIER.init();
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
		const groundSize = 100.0;
		const groundMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0.5, 0.5, 0.5)
		})
		const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize)
		const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
		groundMesh.rotation.x = -Math.PI / 2
		scene.add(groundMesh)
		const groundBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Fixed)
		const groundBody = world.createRigidBody(groundBodyDesc)
		const groundColliderDesc = new RAPIER.ColliderDesc(new RAPIER.Cuboid(groundSize / 2, 0.1, groundSize / 2))
		world.createCollider(groundColliderDesc)

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

		const spin: RAPIER.Vector = {
			x: 5.0,
			y: 0.0,
			z: 0.0,
		}
		const initScene = () => {
			const initBody = (mesh: THREE.Object3D<THREE.Event>, mass: number, position: RAPIER.Vector) => {
				const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
					.setTranslation(position.x, position.y, position.z)
					.setAdditionalMass(mass || 0)
				rigidBodyDesc.angvel = new RAPIER.Vector3(
					spin.x,
					spin.y,
					spin.z
					// Math.random() + 0.01 * (Math.random() > 0.5 ? 1 : -1),
					// Math.random() + 0.01 * (Math.random() > 0.5 ? 1 : -1),
					// Math.random() + 0.01 * (Math.random() > 0.5 ? 1 : -1)
				)
				const body = world.createRigidBody(rigidBodyDesc)
				// const colliderDesc = RAPIER.ColliderDesc.convexMesh(vertices, indices)
				mesh.position.set(position.x, position.y, position.z)
				const update = () => {
					const rotation = body.rotation();
					mesh.rotation.set(rotation.x, rotation.y, rotation.z)
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
						Math.random() * 0.5 + 0.5 + 0.25 * (Math.random() > 0.5 ? 1 : -1)
					)
				})
				// const mesh = new THREE.Mesh(geometry, material)
				const mesh = new THREE.Mesh(
					new THREE.BoxGeometry(size?.x || 1, size?.y || 1, size?.z || 1),
					new THREE.MeshStandardMaterial({
						// Pick a random color
						color: Math.random() * 0xFFFFFF,
					},
					)
				)
				scene.add(mesh)
				return initBody(mesh, mass, position);
			}

			for (let i = 0; i < 500; i++) {
				meshBodies.push(
					icosahedron(
						10,
						new RAPIER.Vector3(
							Math.random() * 40 - 20,
							Math.random() * 40 - 20,
							Math.random() * 40 - 20
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

		const animate = () => {
			meshBodies.forEach((meshBody) => {
				meshBody.update();
			})
			renderer.render(scene, camera)
			requestAnimationFrame(animate)
		}
		const gameLoop = () => {
			world.step();
			setTimeout(gameLoop, 16);
		};

		initScene();
		console.log('Scene initialized')
		animate();
		gameLoop();
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
