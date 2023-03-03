<script setup lang="ts">
import * as THREE from 'three';

// Once the component is mounted, we can access the DOM element
// and use it to create a Three.js scene.

onMounted(() => {
if (process.client) {
const scene = new THREE.Scene();
      const threejsdiv = document.querySelector('#threejs');
      const dimensions = document.querySelector('#threejs')?.clientWidth ?? 800;
			const camera = new THREE.PerspectiveCamera(50, dimensions / dimensions, 0.1, 2000);

			const renderer = new THREE.WebGLRenderer(
        { alpha: true }
        );
			// renderer.setSize(window.innerWidth, window.innerHeight);
      // Keep the scene inside the div's width, but scale the height to keep the aspect ratio
      renderer.setSize(
        dimensions,
        dimensions
        );
      // Remove the "Not yet loaded" text
      threejsdiv?.removeChild(threejsdiv.firstChild as Node);
      threejsdiv?.appendChild(renderer.domElement);

      camera.position.y = -0.3;

      // Add a light
      const light = new THREE.PointLight(0xFFFFFF, 1, 100, 2);
      light.position.set(0, 10, -10);
      scene.add(light);
      const light2 = new THREE.PointLight(0xFFFFFF, 1, 100, 2);
      light2.position.set(0, 10, 10);
      scene.add(light2);
      const light3 = new THREE.PointLight(0xFFFFFF, 1, 100, 2);
      light3.position.set(0, -10, 10);
      scene.add(light3);

      // Set the rendering quality to high
      renderer.setPixelRatio(window.devicePixelRatio);

			const geometry = new THREE.BoxGeometry(1, 1, 1);
			// const material = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 });
      // Create a material with a texture, from wall.jpg, in the assets/images folder
      const texture = new THREE.TextureLoader().load('~/images/5210/5210.jpg');
      const normalMap = new THREE.TextureLoader().load('~/images/5210/5210-normal.jpg');
      const bumpMap = new THREE.TextureLoader().load('~/images/5210/5210-bump.jpg');
      const diffuseMap = new THREE.TextureLoader().load('~/images/5210/5210-diffuse.jpg');
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        normalMap,
        bumpMap,
        // shininess: 100,
        // specular: 0x111111,
        });
        // Change the color to blue
      material.color.setHex(0x0089FD);
			const cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

      // Make a new cube at a different position
      const cube2 = new THREE.Mesh(geometry, material);
      scene.add(cube2);
      cube2.position.z = -6;
      cube2.position.x = 2;
      cube2.position.y = 2;

      // Make a new cube at a different position
      const cube3 = new THREE.Mesh(geometry, material);
      scene.add(cube3);
      cube3.position.z = -6;
      cube3.position.x = -2;
      cube3.position.y = -2;

			// camera.position.z = 0;
      // camera.position.y = 1;

			const animate = () => {
				requestAnimationFrame(animate);

				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;
        cube2.rotation.x -= 0.01;
        cube2.rotation.y -= 0.01;
        cube3.rotation.x -= 0.01;
        cube3.rotation.y += 0.02;

        // Move the cube in the z direction, back and forth
        // cube.position.z = Math.sin(Date.now() / 1000) * 2.5 - 5;
        // Instead, move the camera in the z direction, back and forth
        camera.position.z = Math.sin(Date.now() / 1000) * 2.5 + 5;
        // To keep the cube in focus, we need to adjust the camera's field of view
        // camera.fov = Math.sin(Date.now() / 1000) * 2.5;

        // Keep the camera focused on the cube
        // camera.lookAt(cube.position);

				renderer.render(scene, camera);
			}

			animate();

cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
}
});
</script>

<script lang="ts">
</script>

<template>
  <div id="threejs">
    Not yet loaded
  </div>
</template>

<style scoped>
body { margin: 0; }
div { width: 100%; height: 100%; justify-content: center; align-items: center; display: flex;}
</style>
