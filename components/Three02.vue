<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

// import * as THREE from 'three';
// import * as CANNON from 'cannon-es';
import { Object3D,
	Scene,
	OrthographicCamera,
	WebGLRenderer,
	Mesh,
	BoxGeometry,
	MeshBasicMaterial,
	Vector3,
	Quaternion,
	Event,
} from 'three';
import { World, Body, Box, Vec3 } from 'cannon-es';

/**
       * Really basic example to show js integration
       * with js.
       * Each frame the js world is stepped forward and then
       * the position and rotation data of the boody is copied
       * over to the js scene.
       */

// js variables
let camera: OrthographicCamera, myScene: Scene, renderer: WebGLRenderer
let mesh: Object3D<Event>

// js variables
let myWorld: World
let myBody: Body

const initThree = () => {
	// Div to hold the canvas
	const canvasWrapper = document.querySelector('#canvasWrapper') as HTMLDivElement;
	// Camera
	let dimensions = { width: (window.innerHeight * 0.65), height: (window.innerHeight * 0.65)}
	// camera = new PerspectiveCamera(75, dimensions.width / dimensions.height, 1, 100)
	// Orthographic camera
	camera = new OrthographicCamera(
		dimensions.width / -320,
		dimensions.width / 320,
		dimensions.height / 320,
		dimensions.height / -320,
		1,
		1000
	);
	camera.position.z = 5

	// Scene
	myScene = new Scene()

	// Renderer
	renderer = new WebGLRenderer({ antialias: true, alpha: true })
	// const dimensions = document.querySelector('#canvasWrapper')?.clientWidth ?? 800;
	//  renderer.setSize(dimensions, dimensions);
	renderer.setSize(dimensions.width, dimensions.height)

	// document.body.appendChild(renderer.domElement)
	// Instead of appending, we'll use a ref to the div
	// canvasWrapper?.removeChild(threejsdiv.firstChild as Node);
	canvasWrapper.appendChild(renderer.domElement);

	// Resize
	const onWindowResize = () => {
		dimensions = { width: (window.innerHeight * 0.65), height: (window.innerHeight * 0.65)}
		// camera.aspect = dimensions.width / (dimensions.height)
		// camera.updateProjectionMatrix()
		renderer.setSize(dimensions.width, dimensions.height)
	}
	onWindowResize();
	window.addEventListener('resize', onWindowResize)

	// Box
	const geometry = new BoxGeometry(2, 2, 2);
	const material = new MeshBasicMaterial({ color: 0xFF0000, wireframe: true })

	mesh = new Mesh(geometry, material)
	myScene.add(mesh)
}

const initCannon = () => {
	myWorld = new World()

	// Box
	const shape = new Box(new Vec3(1, 1, 1))
	myBody = new Body({
		mass: 1,
	})
	myBody.addShape(shape)
	myBody.angularVelocity.set(0, 10, 0)
	myBody.angularDamping = 0.5
	myWorld.addBody(myBody)
}

const animate = () => {
	requestAnimationFrame(animate)

	// Step the physics world
	myWorld.fixedStep();

	// Copy coordinates from js to js
	mesh.position.copy(new Vector3(myBody.position.x, myBody.position.y, myBody.position.z));
	mesh.quaternion.copy(new Quaternion(
		myBody.quaternion.x,
		myBody.quaternion.y,
		myBody.quaternion.z,
		myBody.quaternion.w));

	// Render js
	renderer.render(myScene, camera);
}

onMounted(() => {
	initThree()
	initCannon()
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
