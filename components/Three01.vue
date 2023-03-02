<script setup lang="ts">
import * as THREE from 'three';

// We're going to create two spheres, and pretend that each has mass.
// Then we're going to have them apply a force to each other, attracting each other.
// We'll use the formula F = G * (m1 * m2) / r^2 to calculate the force.
// We'll also use the formula F = m * a to calculate the acceleration.
// We'll use the formula a = v / t to calculate the velocity.
// When the spheres collide, we'll have them stop moving, so they won't bounce off each other.

class MassMesh extends THREE.Mesh {
  mass: number;
  radius: number;
  velocity: THREE.Vector3;
  constructor (
    geometry: THREE.BufferGeometry | undefined,
    material: THREE.Material | THREE.Material[] | undefined,
    radius?: number,
    mass?: number,
    velocit?: THREE.Vector3
    ) {
    super(geometry, material);
    this.radius = radius ?? 0.5;
    this.mass = mass ?? 0.5;
    this.velocity = velocit ?? new THREE.Vector3(0, 0, 0);
  }
}

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
      camera.position.z = 15;

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

			const geometry = new THREE.SphereGeometry(0.5, 32, 32);
			// const material = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 });
      const texture = new THREE.TextureLoader().load('../images/5210/5210.jpg');
      const normalMap = new THREE.TextureLoader().load('../images/5210/5210-normal.jpg');
      const bumpMap = new THREE.TextureLoader().load('../images/5210/5210-bump.jpg');
      const diffuseMap = new THREE.TextureLoader().load('../images/5210/5210-diffuse.jpg');
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        normalMap,
        bumpMap,
        });

      // Create the first sphere
			const sphere = new MassMesh(geometry, material);
			scene.add(sphere);
      sphere.position.z = -15;
      sphere.position.x = -2;
      sphere.position.y = -2;
      // Give it a spin
      sphere.velocity = new THREE.Vector3(0.01, 0.01, 0.01);

      // Create an array to hold all the spheres
      const spheres: MassMesh[] = [];
      spheres.push(sphere);

      // Draw the plane on the screen
      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, opacity: 0, transparent: true });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.position.z = -15;
      scene.add(planeMesh);

      // When the user clicks the screen, create a new sphere at the mouse position
      window.addEventListener('click', (event) => {
        const mouse = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        };

        // Create a new sphere
        const sphereClick = new MassMesh(geometry, material);
        // We want to add the sphere to the location the mouse appears to be at
        // We'll use z = -15, and find the x and y coordinates where the mouse appears to be

        // Cast a ray from the camera to the mouse position
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        // Make sure the ray adjusts to the camera's position
        raycaster.ray.origin.copy(camera.position);

        // Find the point where the ray intersects the planeMesh
        const intersects = raycaster.intersectObject(planeMesh);
        // Set the sphere's position to the intersection point
        sphereClick.position.x = intersects[0].point.x;
        sphereClick.position.y = intersects[0].point.y;

        // Set the z coordinate to -15
        sphereClick.position.z = -15;
        // Add it to the scene
        scene.add(sphereClick);

        // Give it a random rotation
        sphereClick.rotation.x = Math.random() * 2 * Math.PI;
        // and random spin
        sphereClick.velocity = new THREE.Vector3(
          // Random positive or negative number
          (Math.random() * 0.02) + 0.01 * (Math.random() > 0.5 ? 1 : -1),
          (Math.random() * 0.02) + 0.01 * (Math.random() > 0.5 ? 1 : -1),
          (Math.random() * 0.001) + 0.001 * (Math.random() > 0.5 ? 1 : -1)
          );

        // Add it to the array of spheres
        spheres.push(sphereClick);
      });

			const animate = () => {
				requestAnimationFrame(animate);

        // Calculate the force between each pair of spheres
        // Start with the first sphere
        for (let i = 0; i < spheres.length; i++) {
          // Then compare it to every other sphere
          for (let j = 0; j < spheres.length; j++) {
            // Don't compare a sphere to itself
            if (i !== j) {
              // Don't compare a sphere to a sphere that has already been compared
              if (i < j) {
                // Calculate the distance between the two spheres
                const distance = spheres[i].position.distanceTo(spheres[j].position);
                // const maxDistance = 50; // example maximum distance value
                let force: number;

                // Check if the spheres are overlapping
                const radiusSum: number = spheres[i].radius + spheres[j].radius;
                const surfaceVector: THREE.Vector3 = new THREE.Vector3().copy(spheres[j].position).sub(spheres[i].position);
                const distanceFromSurface: number = surfaceVector.length() - radiusSum;

                // Calculate the gravitational force
                const gravitationalConstant = -0.2;
                force = -gravitationalConstant * (spheres[i].mass * spheres[j].mass) / (distance * distance);

                if (distanceFromSurface < 0.2) {
                  // The spheres are moving inside each other
                  // Reist this movement by applying a force in the opposite direction
                  force += distanceFromSurface * 1.2;
                }

                // Apply a gravitation attraction to z = -15, so that objects on either side are attracted to the center
                const zForce = spheres[i].position.z * -0.01;
                force += zForce;

                // Ensure the force doesn't become too large
                if (force > 5) {
                  force = 5;
                }

                // Calculate the acceleration of each sphere
                const acceleration = force / spheres[i].mass;
                const acceleration2 = force / spheres[j].mass;
                // Calculate the velocity of each sphere
                const velocity = acceleration / 60;
                const velocity2 = acceleration2 / 60;
                // Calculate the direction of the force
                const direction = spheres[j].position.clone().sub(spheres[i].position).normalize();
                const direction2 = spheres[i].position.clone().sub(spheres[j].position).normalize();
                // Apply the force to each sphere
                spheres[i].velocity.add(direction.multiplyScalar(velocity));
                spheres[j].velocity.add(direction2.multiplyScalar(velocity2));

                // Place a maximum on the velocity
                if (spheres[i].velocity.length() > 0.1) {
                  spheres[i].velocity.setLength(0.1);
                }
              }
            }
          }
        }

        // Apply each sphere's velocity to its position
        for (let i = 0; i < spheres.length; i++) {
          // Don't let the sphere go too far away
          // If it's beyond the boundaries, reverse its velocity
          if (spheres[i].position.x > 30) {
            spheres[i].velocity.x = -spheres[i].velocity.x;
          }
          if (spheres[i].position.x < -30) {
            spheres[i].velocity.x = -spheres[i].velocity.x;
          }
          if (spheres[i].position.y > 30) {
            spheres[i].velocity.y = -spheres[i].velocity.y;
          }
          if (spheres[i].position.y < -30) {
            spheres[i].velocity.y = -spheres[i].velocity.y;
          }
          spheres[i].position.add(spheres[i].velocity);
        }

        // Spin each sphere
        for (let i = 0; i < spheres.length; i++) {
          spheres[i].rotation.x += spheres[i].velocity.x;
          spheres[i].rotation.y += spheres[i].velocity.y;
          spheres[i].rotation.z += spheres[i].velocity.z;
        }

        // If a sphere is overlapping with another sphere, contract their size
        // Otherwise, set their radius to 1
        // for (let i = 0; i < spheres.length; i++) {
        //   spheres[i].radius = 1;
        //   for (let j = 0; j < spheres.length; j++) {
        //     if (i !== j) {
        //       const distance = spheres[i].position.distanceTo(spheres[j].position);
        //       const radiusSum: number = spheres[i].radius + spheres[j].radius;
        //       if (distance < radiusSum) {
        //         // The spheres are overlapping, so reduce the first sphere's radius by the second sphere's mass
        //         spheres[i].radius = spheres[i].radius - spheres[j].mass;
        //       }
        //     }
        //   }
        // }

				renderer.render(scene, camera);
			}

			animate();

sphere.rotation.x += 0.01;
sphere.rotation.y += 0.01;
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
