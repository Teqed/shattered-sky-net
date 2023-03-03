<template>
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

      /**
       * Really basic example to show cannon.js integration
       * with three.js.
       * Each frame the cannon.js world is stepped forward and then
       * the position and rotation data of the boody is copied
       * over to the three.js scene.
       */

      // three.js variables
      let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer
      let mesh: THREE.Object3D<THREE.Event>

      // cannon.js variables
      let world: CANNON.World
      let body: CANNON.Body

      const initThree = () => {
        // Div to hold the canvas
        const canvasWrapper = document.querySelector('#canvasWrapper') as HTMLDivElement;
        // Camera
        let dimensions = { width: canvasWrapper.clientWidth, height: (window.innerHeight * 0.75)}
        console.log(dimensions);
        camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 1, 100)
        camera.position.z = 5

        // Scene
        scene = new THREE.Scene()

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        // const dimensions = document.querySelector('#canvasWrapper')?.clientWidth ?? 800;
        //  renderer.setSize(dimensions, dimensions);
        renderer.setSize(dimensions.width, dimensions.height * 0.75)

        // document.body.appendChild(renderer.domElement)
        // Instead of appending, we'll use a ref to the div
        // canvasWrapper?.removeChild(threejsdiv.firstChild as Node);
        canvasWrapper.appendChild(renderer.domElement);

        // Resize
      const onWindowResize = () => {
        camera.aspect = dimensions.width / (dimensions.height * 0.75)
        camera.updateProjectionMatrix()
        renderer.setSize(dimensions.width, dimensions.height * 0.75)
      }
        onWindowResize();
        window.addEventListener('resize', onWindowResize)

        // Box
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true })

        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      }

      const initCannon = () => {
        world = new CANNON.World()

        // Box
        const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        body = new CANNON.Body({
          mass: 1,
        })
        body.addShape(shape)
        body.angularVelocity.set(0, 10, 0)
        body.angularDamping = 0.5
        world.addBody(body)
      }

      const animate = () => {
        requestAnimationFrame(animate)

        // Step the physics world
        world.fixedStep();

        // Copy coordinates from cannon.js to three.js
        mesh.position.copy(new THREE.Vector3(body.position.x, body.position.y, body.position.z));
        mesh.quaternion.copy(new THREE.Quaternion(
          body.quaternion.x,
          body.quaternion.y,
          body.quaternion.z,
          body.quaternion.w));

        // Render three.js
        renderer.render(scene, camera);
      }

      onMounted(() => {
        initThree()
        initCannon()
        animate()
      })
</script>

<script lang="ts">
</script>

<style scoped>
  body {
    margin: 0;
  }

  div {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }
</style>
