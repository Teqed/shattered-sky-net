/* eslint-disable no-plusplus */
// import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder';
// import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Quaternion, Matrix } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import '@babylonjs/core/Meshes/thinInstanceMesh';
// import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
// import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'
// import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins/cannonJSPlugin'
// import * as CANNON from 'cannon-es';
// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';
import * as Comlink from 'comlink';

export const numberMeshes: {number: number} = {
	number: 0,
};
let rapierExport: {
	startPhysics: () => Promise<boolean>,
	getUpdate: () => Promise<ArrayBuffer | false>,
	newBody: (bodyObject: {
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
	}) => Promise<boolean>,
}
export const createSubWorker = (url: string) => {
	const worker = new Worker(url, { type: 'module' });
	rapierExport = Comlink.wrap(worker);
}
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
const standardSizeVector3 = new Vector3(1, 1, 1);
const standardRotationQuaternion = new Quaternion(0, 0, 0, 1);
const standardTranslationVector3 = new Vector3(0, 0, 0);
let matricesData = new Float32Array();
let babylonMesh: Mesh;
const matrix = Matrix.Compose(
	standardSizeVector3,
	standardRotationQuaternion.copyFromFloats(0, 0, 0, 1),
	standardTranslationVector3.copyFromFloats(0, 0, 0)
)
const decode = (arrayBuffer: ArrayBuffer | false): Promise<number> => {
	if (arrayBuffer === false) {
		return Promise.resolve(numberMeshes.number);
	}
	let count = 0;
	let index_ = 0;
	const update = new Float32Array(arrayBuffer);
	for (let index = 0; index < update.length; index += 8) {
		count++;
		matrix.copyFrom(
			Matrix.Compose(
				standardSizeVector3,
				standardRotationQuaternion.copyFromFloats(
					update[index + 4],
					update[index + 5],
					update[index + 6],
					update[index + 7]
				),
				standardTranslationVector3.copyFromFloats(
					update[index + 1],
					update[index + 2],
					update[index + 3]
				)
			))
		matrix.copyToArray(matricesData, index_)
		index_ += 16;
	}
	babylonMesh.thinInstanceSetBuffer('matrix', matricesData, 16);
	return Promise.resolve(count);
};
export const createCamera = (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	// // Creates and positions a free camera
	// const camera = new FreeCamera('camera1',
	const camera = new ArcRotateCamera('Camera', -Math.PI / 5, Math.PI / 3, 200, Vector3.Zero(), scene);
	// 	new Vector3(0, 5, -10), scene);
	// 	// Targets the camera to scene origin
	camera.setTarget(Vector3.Zero());
	// This attaches the camera to the canvas
	// camera.attachControl(canvas);
	let isMouseDown = 0;
	let lastX = 0;
	let lastY = 0;
	// add event listener for mousedown,
	// if mousedown, move camera forward
	canvas.addEventListener('pointerdown', () => {
		isMouseDown = 1;
	});
	canvas.addEventListener('pointerup', () => {
		isMouseDown = 0;
	});
	canvas.addEventListener('pointermove', (event: any) => {
		camera.beta += isMouseDown * -0.01 * (event.y - lastY);
		camera.alpha += isMouseDown * -0.01 * (event.x - lastX);
		lastX = event.x;
		lastY = event.y;
	});
	canvas.addEventListener('wheel', (event: any) => {
		camera.radius += event.deltaY * 0.1;
	});
}

const createScene = (engine: Engine, canvas: HTMLCanvasElement | OffscreenCanvas) => {
	const scene = new Scene(engine);
	scene.clearColor = new Color4(0, 0, 0, 0);
	const light = new HemisphericLight('light',
		new Vector3(0, 1, 0), scene);
	light.intensity = 0.5;
	createCamera(canvas, scene);
	return scene;
}

const createPhysicsBodies = async (instanceCount: number, matricesData: Float32Array) => {
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
		if (index % 100 === 0) {
		// eslint-disable-next-line no-await-in-loop
			await rapierExport.newBody(bodyObject)
		} else {
			rapierExport.newBody(bodyObject)
		}
	}
}

const createObjects = async (scene: Scene) => {
	const waitForWorld = rapierExport.startPhysics();
	await waitForWorld
	// const babylonMesh = BABYLON.CreateBox('root', {size: 1});
	babylonMesh = CreateIcoSphere('root', {radius: 1, flat: true, subdivisions: 1});
	babylonMesh.doNotSyncBoundingInfo = true;

	const numberPerSide = 15;
	const size = 200;
	const ofst = size / (numberPerSide - 1);
	const m = Matrix.Identity();
	let col = 0;
	let index = 0;

	const instanceCount = numberPerSide * numberPerSide * numberPerSide;
	matricesData = new Float32Array(instanceCount * 16);
	const colorData = new Float32Array(instanceCount * 4);

	for (let x = 0; x < numberPerSide; x++) {
		for (let y = 0; y < numberPerSide; y++) {
			for (let z = 0; z < numberPerSide; z++) {
				m.setTranslation(new Vector3(
					-size / 2 + ofst * x,
					-size / 2 + ofst * y,
					-size / 2 + ofst * z
				))
				m.copyToArray(matricesData, index * 16)
				const coli = Math.floor(col)
				colorData[index * 4] = ((coli & 0xFF0000) >> 16) / 255;
				colorData[index * 4 + 1] = ((coli & 0x00FF00) >> 8) / 255;
				colorData[index * 4 + 2] = (coli & 0x0000FF) / 255
				index += 1;
				col += 0xFFFFFF / instanceCount;
			}
		}
	}
	babylonMesh.thinInstanceSetBuffer('matrix', matricesData, 16);
	babylonMesh.thinInstanceSetBuffer('color', colorData, 4);
	babylonMesh.material = new StandardMaterial('material', scene);
	scene.freezeActiveMeshes();

	// const standardSizeVector3 = new BABYLON.Vector3(1, 1, 1);
	// const standardRotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
	// const standardTranslationVector3 = new BABYLON.Vector3(0, 0, 0);

	// const updatePositions = async (meshBodiesUpdate: {[meshId: number]: {
	// 	p: {x: number,
	// 		y: number,
	// 		z: number},
	// 	r: {x: number,
	// 		y: number,
	// 		z: number,
	// 		w: number}
	// }}) => {
	// let index_ = 0;
	// const matrix = BABYLON.Matrix.Compose(
	// 	standardSizeVector3,
	// 	standardRotationQuaternion.copyFromFloats(0, 0, 0, 1),
	// 	standardTranslationVector3.copyFromFloats(0, 0, 0)
	// )
	// for (const [, body] of Object.entries(meshBodiesUpdate)) {
	// 	// update thin instance matrix
	// 	matrix.copyFrom(
	// 		BABYLON.Matrix.Compose(
	// 			standardSizeVector3,
	// 			standardRotationQuaternion.copyFromFloats(body.r.x, body.r.y, body.r.z, body.r.w),
	// 			standardTranslationVector3.copyFromFloats(body.p.x, body.p.y, body.p.z)
	// 		))
	// 	matrix.copyToArray(matricesData, index_)
	// 	index_ += 16;
	// }

	// babylonMesh.thinInstanceSetBuffer('matrix', matricesData, 16);
	// 	return await Promise.resolve(count);
	// }

	let doNotQueueAdditionalUpdates = false;
	let lastPhysicsUpdate = 0;
	scene.registerAfterRender(async () => {
		const now = Date.now();
		if (now - lastPhysicsUpdate > 1000 / 60) {
			if (doNotQueueAdditionalUpdates) {
				return;
			} else {
				doNotQueueAdditionalUpdates = true;
				numberMeshes.number = await decode(await rapierExport.getUpdate());
				doNotQueueAdditionalUpdates = false;
			}
			lastPhysicsUpdate = now;
		}
	})

	// every 15fps, change color
	// setInterval(() => {
	// 	for (let index_ = 0; index_ < instanceCount; index_++) {
	// 		colorData[index_ * 4] = Math.random();
	// 		colorData[index_ * 4 + 1] = Math.random();
	// 		colorData[index_ * 4 + 2] = Math.random();
	// 	}
	// 	// Update the instance buffer
	// 	babylonMesh.thinInstanceSetBuffer('color', colorData, 4);
	// }, 5000 / 1);
	// // add ground
	// const ground = BABYLON.CreateGround('ground', {width: 500, height: 500});
	// // lower ground
	// ground.position.y = -10;
	// // set color to blue
	// ground.material = new BABYLON.StandardMaterial('material')
	// ground.material.diffuseColor = BABYLON.Color3.Blue();
	// // fix ground
	// ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.babylonMeshImpostor, { mass: 0, restitution: 0.9 }, scene);

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
