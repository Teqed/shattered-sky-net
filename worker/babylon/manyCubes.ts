import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math.color';
// import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'
import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins/cannonJSPlugin'
// import * as CANNON from 'cannon-es';
// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';
import * as Comlink from 'comlink';

const worker = new Worker(new URL(
	'./rapier.ts',
	import.meta.url), {
	type: 'module',
});
const rapierExport = Comlink.wrap(worker);

let bodyObject: {
	meshId: number,
	p: {
		x: number,
		y: number,
		z: number,
	},
	r: {
		x: number,
		y: number,
		z: number,
		w: number,
	},
	mass: number,
	size: number,
};
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
	for (let index = 0; index < update.length; index += 8) {
		const key = update[index];
		const p = {
			x: update[index + 1],
			y: update[index + 2],
			z: update[index + 3],
		};
		const r = {
			x: update[index + 4],
			y: update[index + 5],
			z: update[index + 6],
			w: update[index + 7],
		};
		meshUpdate[key] = { p, r };
	}
	return Promise.resolve(meshUpdate);
};

// self.CANNON = CANNON;

export const relayMouseEvent = (canvas: HTMLCanvasElement | OffscreenCanvas, type: string, x: number, y: number) => {
	canvas.dispatchEvent(
		new MouseEvent(type, {
			clientX: x,
			clientY: y
		})
	);
}

export const createCamera = (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	// // Creates and positions a free camera
	// const camera = new FreeCamera('camera1',
	// 	new Vector3(0, 5, -10), scene);
	// 	// Targets the camera to scene origin
	// camera.setTarget(Vector3.Zero());
	const camera = new ArcRotateCamera('Camera', -Math.PI / 5, Math.PI / 3, 200, Vector3.Zero(), scene);
	// This attaches the camera to the canvas
	camera.attachControl(canvas, true);
}

const createScene = (engine: Engine, canvas: HTMLCanvasElement | OffscreenCanvas) => {
	// Creates a basic Babylon Scene object
	const scene = new Scene(engine);
	// scene.enablePhysics(
	// 	new Vector3(0, -9.81, 0),
	// 	// new Vector3(0, 0, 0),
	// 	new CannonJSPlugin()
	// );
	// // Set background color to transparent
	// scene.clearColor = new Color4(0, 0, 0, 0);
	// Creates a light, aiming 0,1,0 - to the sky
	const light = new HemisphericLight('light',
		new Vector3(0, 1, 0), scene);
		// Dim the light a small amount - 0 to 1
	light.intensity = 0.7;
	createCamera(canvas, scene);
	// scene.debugLayer.show();
	return scene;
}

const createPhysicsBodies = async (instanceCount: number, matricesData: any[] | Float32Array) => {
	// Create a new rapier body for each instance
	for (let index = 0; index < instanceCount; index++) {
		bodyObject = {
			meshId: index,
			size: 1,
			p: {
				x: matricesData[index * 16 + 12],
				y: matricesData[index * 16 + 13],
				z: matricesData[index * 16 + 14],
			},
			r: {
				// random values
				x: Math.random(),
				y: Math.random(),
				z: Math.random(),
				w: Math.random(),
			},
			mass: 1,
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (rapierExport as any).newBody(bodyObject)
	}
}

const createObjects = async (scene: Scene) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const waitForWorld = (rapierExport as any).startPhysics() as Promise<boolean>;
	await waitForWorld
	const box = BABYLON.CreateBox('root', {size: 1});
	box.doNotSyncBoundingInfo = true;
	const numberPerSide = 20; const size = 10; const ofst = size / (numberPerSide - 1);
	const m = BABYLON.Matrix.Identity();
	let col = 0; let index = 0;
	const instanceCount = numberPerSide * numberPerSide * numberPerSide;
	const matricesData = new Float32Array(instanceCount * 16);
	const colorData = new Float32Array(instanceCount * 4);
	// Create the instance buffer
	for (let x = 0; x < numberPerSide; x++) {
		m.m[12] = -size / 2 + ofst * x;
		for (let y = 0; y < numberPerSide; y++) {
			m.m[13] = -size / 2 + ofst * y;
			for (let z = 0; z < numberPerSide; z++) {
				m.m[14] = -size / 2 + ofst * z;
				m.copyToArray(matricesData, index * 16);

				const coli = Math.floor(col);

				colorData[index * 4] = ((coli & 0xFF0000) >> 16) / 255;
				colorData[index * 4 + 1] = ((coli & 0x00FF00) >> 8) / 255;
				colorData[index * 4 + 2] = (coli & 0x0000FF) / 255;

				index += 1;
				col += 0xFFFFFF / instanceCount;
			}
		}
	}
	// Set the instance buffers
	box.thinInstanceSetBuffer('matrix', matricesData, 16);
	box.thinInstanceSetBuffer('color', colorData, 4);
	// box.material = new BABYLON.StandardMaterial('material');
	box.material = new BABYLON.StandardMaterial('material', scene);
	// box.material.disableLighting = true;
	// box.material.emissiveColor = BABYLON.Color3.White();
	scene.freezeActiveMeshes();

	const updatePositions = (meshBodiesUpdate: {[meshId: number]: {
		p: {x: number,
			y: number,
			z: number},
		r: {x: number,
			y: number,
			z: number,
			w: number} } }) => {
		for (const meshId in meshBodiesUpdate) {
			// update thin instance matrix
			const body = meshBodiesUpdate[meshId];
			const matrix = BABYLON.Matrix.Identity();
			// BABYLON.Quaternion.FromArray([body.r.x, body.r.y, body.r.z, body.r.w]).toRotationMatrix(rot)
			BABYLON.Matrix.ComposeToRef(
				new BABYLON.Vector3(1, 1, 1),
				new BABYLON.Quaternion(body.r.x, body.r.y, body.r.z, body.r.w),
				new BABYLON.Vector3(body.p.x, body.p.y, body.p.z),
				matrix
			)
			// BABYLON.Matrix.RotationYawPitchRoll(body.r.y, body.r.x, body.r.z).multiplyToRef(matrix, matrix);
			matrix.copyToArray(matricesData, Number(meshId) * 16);
		}
		box.thinInstanceSetBuffer('matrix', matricesData, 16);
	}

	// every 30fps, update the positions
	setInterval(async () => {
		document.querySelector('#meshcount').textContent = `Mesh count: ${instanceCount}`;
		updatePositions(await decode(await (rapierExport as any).getUpdate()));
		// Randomize position every few frames
		// if (scene.getFrameId() % 10 === 0) {
		// 	for (let index_ = 0; index_ < instanceCount; index_++) {
		// 		matricesData[index_ * 16 + 12] = Math.random() * 10 - 5;
		// 		matricesData[index_ * 16 + 13] = Math.random() * 10 - 5;
		// 		matricesData[index_ * 16 + 14] = Math.random() * 10 - 5;
		// 	}
		// }
	}, 1000 / 30);

	// every 15fps, change color
	setInterval(() => {
		for (let index_ = 0; index_ < instanceCount; index_++) {
			colorData[index_ * 4] = Math.random();
			colorData[index_ * 4 + 1] = Math.random();
			colorData[index_ * 4 + 2] = Math.random();
		}
		// Update the instance buffer
		box.thinInstanceSetBuffer('color', colorData, 4);
	}, 1000 / 15);
	// // add ground
	// const ground = BABYLON.CreateGround('ground', {width: 500, height: 500});
	// // lower ground
	// ground.position.y = -10;
	// // set color to blue
	// ground.material = new BABYLON.StandardMaterial('material')
	// ground.material.diffuseColor = BABYLON.Color3.Blue();
	// // fix ground
	// ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

	return {instanceCount, matricesData};
}

export default async (
	engine: Engine,
	canvas: HTMLCanvasElement | OffscreenCanvas
) => {
	const scene = createScene(engine, canvas);
	const objects = await createObjects(scene);
	createPhysicsBodies(objects.instanceCount, objects.matricesData);
	return scene;
};
