<script setup lang="ts">
import * as THREE from 'three';

// Once the component is mounted, we can access the DOM element
// and use it to create a Three.js scene.

onMounted(() => {
if (process.client) {
const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

			const renderer = new THREE.WebGLRenderer({ alpha: true });
			// renderer.setSize(window.innerWidth, window.innerHeight);
      // Keep the scene inside the div's width, but scale the height to keep the aspect ratio
      renderer.setSize(
        document.querySelector('#threejs')?.clientWidth,
        document.querySelector('#threejs')?.clientWidth
        );
      // Remove the "Not yet loaded" text
      document.querySelector('#threejs')?.removeChild(document.querySelector('#threejs')?.firstChild);
      document.querySelector('#threejs')?.appendChild(renderer.domElement);

			const geometry = new THREE.BoxGeometry(1, 1, 1);
			// const material = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 });
      // Create a material with a texture, from wall.jpg, in the assets/images folder
      const texture = new THREE.TextureLoader().load('../images/borg.webp');
      const material = new THREE.MeshBasicMaterial({ map: texture });
			const cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			camera.position.z = 2;

			const animate = () => {
				requestAnimationFrame(animate);

				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;

        // Move the cube in the z direction, back and forth
        cube.position.z = Math.sin(Date.now() / 1000) * 0.5;

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
