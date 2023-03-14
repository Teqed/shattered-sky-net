<template>
  <div id="meshcount" class="meshcount" />
  <div id="canvasWrapper" />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as RANDOMJS from 'random-js';
// import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
import * as Comlink from 'comlink';
const random = new RANDOMJS.Random(RANDOMJS.browserCrypto);

const worker = new Worker(new URL('../worker/rapier-11.ts', import.meta.url), {
	type: 'module',
});

const rapierExport = Comlink.wrap(worker);

// three.js variables
const scene = new THREE.Scene()
const meshBodies: {
	meshId: number,
	meshPos: {
		p: {x: number, y: number, z: number},
		r: { x: number, y: number, z: number, w: number}
	},
	mesh: THREE.Object3D<THREE.Event>,
}[] = [];

// const geometry = (new THREE.IcosahedronGeometry(1, 0))

const geometry = (new THREE.BufferGeometry())
const vertices = new Float32Array([
	-1.0, -1.0, 1.0,
	1.0, -1.0, 1.0,
	1.0, 1.0, 1.0,

	1.0, 1.0, 1.0,
	-1.0, 1.0, 1.0,
	-1.0, -1.0, 1.0,

	1.0, -1.0, 1.0,
	1.0, -1.0, -1.0,
	1.0, 1.0, -1.0,

	1.0, 1.0, -1.0,
	1.0, 1.0, 1.0,
	1.0, -1.0, 1.0,

	1.0, -1.0, -1.0,
	-1.0, -1.0, -1.0,
	-1.0, 1.0, -1.0,

	-1.0, 1.0, -1.0,
	1.0, 1.0, -1.0,
	1.0, -1.0, -1.0,

	-1.0, -1.0, -1.0,
	-1.0, -1.0, 1.0,
	-1.0, 1.0, 1.0,

	-1.0, 1.0, 1.0,
	-1.0, 1.0, -1.0,
	-1.0, -1.0, -1.0,

	-1.0, 1.0, 1.0,
	1.0, 1.0, 1.0,
	1.0, 1.0, -1.0,

	1.0, 1.0, -1.0,
	-1.0, 1.0, -1.0,
	-1.0, 1.0, 1.0,

	-1.0, -1.0, -1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0, 1.0,

	1.0, -1.0, 1.0,
	-1.0, -1.0, 1.0,
	-1.0, -1.0, -1.0

]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.computeVertexNormals()
// const geometry = (new THREE.BoxGeometry(1, 1, 1, 1, 1, 1))

const material = (new THREE.MeshLambertMaterial({
	color: new THREE.Color(
		0,
		0,
		0.75
	)
}))

const icosahedron = (
	arg: {
		position?: {x: number, y: number, z: number},
		rotation?: {x: number, y: number, z: number, w: number},
		mass?: number,
		size?: number}
) => {
	const THREEmesh = (new THREE.Mesh(
		geometry,
		material
	))
	THREEmesh.position.set(arg.position?.x ?? 0, arg.position?.y ?? 0, arg.position?.z ?? 0)
	THREEmesh.rotation.setFromQuaternion(new THREE.Quaternion(
		arg.rotation?.x ?? 0,
		arg.rotation?.y ?? 0,
		arg.rotation?.z ?? 0,
		arg.rotation?.w ?? 0))
	THREEmesh.matrixAutoUpdate = false;
	return initBody(
		THREEmesh,
		{
			p: {
				x: arg.position?.x ?? 0,
				y: arg.position?.y ?? 0,
				z: arg.position?.z ?? 0,
			},
			r: {
				x: arg.rotation?.x ?? 0,
				y: arg.rotation?.y ?? 0,
				z: arg.rotation?.z ?? 0,
				w: arg.rotation?.w ?? 0,
			},
		},
		arg.mass ?? 1,
		arg.size ?? 1,
	);
}

const initBody = async (
	mesh: THREE.Object3D<THREE.Event>,
	meshPos: {
		p: {x: number; y: number; z: number;},
		r: {x: number; y: number; z: number; w: number;},
	},
	mass?: number,
	size?: number,
) => {
	// Set the mesh size
	mesh.scale.set(size ?? 1, size ?? 1, size ?? 1);
	scene.add(mesh)
	mesh.updateMatrix();
	meshBodies.push({ meshId: mesh.id,
		meshPos: {
			p: {x: meshPos.p.x, y: meshPos.p.y, z: meshPos.p.z},
			r: {x: meshPos.r.x, y: meshPos.r.y, z: meshPos.r.z, w: meshPos.r.w}},
		mesh });
	const everNewerBodyObj = {
		meshId: mesh.id,
		p: {
			x: meshPos.p.x,
			y: meshPos.p.y,
			z: meshPos.p.z,
		},
		r: {
			x: meshPos.r.x,
			y: meshPos.r.y,
			z: meshPos.r.z,
			w: meshPos.r.w,
		},
		mass: mesh.userData.mass,
		size,
	};
	// Put newBodyObj into everNewerBodyObj where their properties overlap (aka no mesh)
	everNewerBodyObj.p.x = mesh.position.x;
	everNewerBodyObj.p.y = mesh.position.y;
	everNewerBodyObj.p.z = mesh.position.z;
	everNewerBodyObj.r.x = mesh.quaternion.x;
	everNewerBodyObj.r.y = mesh.quaternion.y;
	everNewerBodyObj.r.z = mesh.quaternion.z;
	everNewerBodyObj.r.w = mesh.quaternion.w;
	everNewerBodyObj.meshId = mesh.id;
	everNewerBodyObj.mass = mass;
	everNewerBodyObj.size = size;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await (rapierExport as any).newBody(everNewerBodyObj)
	return meshBodies[meshBodies.length - 1];
};

const createExample = async () => {
	// wait for worker to be ready
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const wait = (ms: number) => new Promise((resolve: (value: any) => void) => setTimeout(resolve, ms));
	for (let i = 0; i < 100; i++) {
		// eslint-disable-next-line no-await-in-loop
		await wait(100);
		const makeObject = () => {
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
				mass: random.real(0.5, 1.5),
				size: random.real(0.5, 1.5),
			});
		}
		for (let i = 0; i < 10; i++) {
			makeObject();
		}
	}
}

// const decoder = new TextDecoder();
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const decode = async (arrayBuffer: ArrayBuffer): Promise<any> => {
// 	return JSON.parse(await Promise.resolve(decoder.decode(arrayBuffer)));
// };

const decode = (arrayBuffer: ArrayBuffer): Promise<{
	[meshId: number]: {
		p: {
			x: number;
			y: number;
			z: number;
		};
		r: {
			x: number;
			y: number;
			z: number;
			w: number;
		};
	};
}> => {
	const update = new Float32Array(arrayBuffer);
	const meshUpdate: {
		[meshId: number]: {
			p: {
				x: number;
				y: number;
				z: number;
			};
			r: {
				x: number;
				y: number;
				z: number;
				w: number;
			};
		};
	} = {};
	for (let i = 0; i < update.length; i += 8) {
		const key = update[i];
		const p = {
			x: update[i + 1],
			y: update[i + 2],
			z: update[i + 3],
		};
		const r = {
			x: update[i + 4],
			y: update[i + 5],
			z: update[i + 6],
			w: update[i + 7],
		};
		meshUpdate[key] = { p, r };
	}
	return Promise.resolve(meshUpdate);
};
const updatePositions = (meshBodiesUpdate: {[meshId: number]: {
	p: {x: number,
		y: number,
		z: number},
	r: {x: number,
		y: number,
		z: number,
		w: number} } }) => {
	meshBodies.forEach((meshBodyArg) => {
		const meshUpdateTop = meshBodiesUpdate[meshBodyArg.mesh.id];
		if (!meshUpdateTop) {
			return;
		}
		meshBodyArg.mesh.position.set(
			meshUpdateTop.p.x,
			meshUpdateTop.p.y,
			meshUpdateTop.p.z
		);
		meshBodyArg.mesh.rotation.setFromQuaternion(new THREE.Quaternion(
			meshUpdateTop.r.x,
			meshUpdateTop.r.y,
			meshUpdateTop.r.z,
			meshUpdateTop.r.w
		));
	});
}

onMounted(() => {
	const threeSimulation = async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const waitForWorld = (rapierExport as any).startPhysics() as Promise<boolean>;
		const renderer = new THREE.WebGLRenderer(
			{	antialias: true,
				alpha: true	})
		renderer.setPixelRatio(window.devicePixelRatio)
		document.querySelector('#canvasWrapper')?.appendChild(renderer.domElement)
		let dimensions = {width: (window.innerWidth), height: (window.innerHeight)}
		const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.01, 1000)
		renderer.setSize(dimensions.width, dimensions.height)
		camera.position.z = 30

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

		const updateMeshes = async () => {
			updatePositions(await decode(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await ((rapierExport as any).getUpdate() as unknown as Promise<ArrayBufferLike>)) as {
				[meshId: number]: {
					p: {
						x: number;
						y: number;
						z: number;
					};
					r: {
						x: number;
						y: number;
						z: number;
						w: number;
					};
				};
			});
			// use object.updateMatrix() on every mesh in the scene
			for (let i = 0; i < scene.children.length; i++) {
				const object = scene.children[i];
				if (object instanceof THREE.Mesh) {
					object.updateMatrix();
				}
			}
		}
		const animate = () => {
			// @ts-expect-error - html element might not exist
			document.querySelector('#meshcount').textContent = meshBodies.length.toString();
			renderer.render(scene, camera)
			requestAnimationFrame(animate)
		}
		await waitForWorld
		animate();
		setInterval(() => {
			updateMeshes();
		}, 1000 / 30)
		updateMeshes();
		createExample();
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

  .meshcount {
	position: fixed;
	bottom: 0;
	right: 0;
	padding: 0.5em;
	background: rgba(56, 56, 56, 0.5);
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 0.5em;
	box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.2);
	margin: 0.5em;
	font-size: 1.5em;
	font-weight: bold;
  }

  </style>
