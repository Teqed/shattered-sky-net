
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
let matricesUpdate = new Float32Array();
let babylonMesh: Mesh;
let matrix = Matrix.Compose(
	standardSizeVector3,
	standardRotationQuaternion.copyFromFloats(0, 0, 0, 1),
	standardTranslationVector3.copyFromFloats(0, 0, 0)
)
let matricesData0 = new Float32Array(); // current frame
let matricesData1 = new Float32Array(); // last frame
let matricesData2 = new Float32Array(); // last last frame
let matricesData3 = new Float32Array(); // last last last frame
let matricesDataEstimated = new Float32Array(); // estimated frame
const decode = (arrayBuffer: ArrayBuffer | false): Promise<number> => {
	if (arrayBuffer === false) {
		return Promise.resolve(numberMeshes.number);
	}
	let count = 0;
	let index_ = 0;
	matricesUpdate = new Float32Array(arrayBuffer);
	matricesData3.set(matricesData2)
	matricesData2.set(matricesData1)
	matricesData1.set(matricesData0)
	physicsUpdateTime3 = physicsUpdateTime2.valueOf();
	physicsUpdateTime2 = physicsUpdateTime1.valueOf();
	physicsUpdateTime1 = physicsUpdateTime0.valueOf();
	physicsUpdateTime0 = Date.now();
	for (let index = 0; index < matricesUpdate.length; index += 8) {
		count++;
		matrix = Matrix.Compose(
			standardSizeVector3,
			standardRotationQuaternion.copyFromFloats(
				matricesUpdate[index + 4],
				matricesUpdate[index + 5],
				matricesUpdate[index + 6],
				matricesUpdate[index + 7]
			),
			standardTranslationVector3.copyFromFloats(
				matricesUpdate[index + 1],
				matricesUpdate[index + 2],
				matricesUpdate[index + 3]
			)
		)
		matrix.copyToArray(matricesData0, index_)
		index_ += 16;
	}
	matricesDataEstimated.set(matricesData0)
	babylonMesh.thinInstanceSetBuffer('matrix', matricesData0, 16);
	return Promise.resolve(count);
};
const loadTime = Date.now();
let physicsUpdateTime0 = Date.now();
let physicsUpdateTime1 = Date.now();
let physicsUpdateTime2 = Date.now();
let physicsUpdateTime3 = Date.now();
const enableSmoothing: Boolean = true;
const estimateFrame = () => {
	const now = Date.now();
	if (!enableSmoothing || now - loadTime < 2000) {
		return;
	}
	const alpha = (now - physicsUpdateTime0) / (physicsUpdateTime0 - physicsUpdateTime1);
	const alpha2 = alpha * alpha;
	const alphaPos0 = physicsUpdateTime0 / physicsUpdateTime1;
	const alphaPos1 = physicsUpdateTime1 / physicsUpdateTime2;
	const alphaPos2 = physicsUpdateTime2 / physicsUpdateTime3;

	if (alpha > 1.25) {
		return
	}

	for (let index = 0; index < matricesData0.length; index += 16) {
		const vx1 = matricesData0[index + 12] - matricesData1[index + 12] * alphaPos0;
		const vy1 = matricesData0[index + 13] - matricesData1[index + 13] * alphaPos0;
		const vz1 = matricesData0[index + 14] - matricesData1[index + 14] * alphaPos0;
		const vx2 = matricesData1[index + 12] - matricesData2[index + 12] * alphaPos1;
		const vy2 = matricesData1[index + 13] - matricesData2[index + 13] * alphaPos1;
		const vz2 = matricesData1[index + 14] - matricesData2[index + 14] * alphaPos1;
		const vx3 = matricesData2[index + 12] - matricesData3[index + 12] * alphaPos2;
		const vy3 = matricesData2[index + 13] - matricesData3[index + 13] * alphaPos2;
		const vz3 = matricesData2[index + 14] - matricesData3[index + 14] * alphaPos2;
		const ax1 = vx1 - vx2;
		const ay1 = vy1 - vy2;
		const az1 = vz1 - vz2;
		const x = matricesData0[index + 12] + vx1 * alpha + ax1 * alpha2 + (ax1 - (vx2 - vx3)) * alpha2 * alpha;
		const y = matricesData0[index + 13] + vy1 * alpha + ay1 * alpha2 + (ay1 - (vy2 - vy3)) * alpha2 * alpha;
		const z = matricesData0[index + 14] + vz1 * alpha + az1 * alpha2 + (az1 - (vz2 - vz3)) * alpha2 * alpha;
		if (!isNaN(x) && !isNaN(y) && !isNaN(z) && isFinite(x) && isFinite(y) && isFinite(z)) {
			matricesDataEstimated[index + 12] = x;
			matricesDataEstimated[index + 13] = y;
			matricesDataEstimated[index + 14] = z;
		}
	}
	babylonMesh.thinInstanceSetBuffer('matrix', matricesDataEstimated, 16);
}
export const createCamera = (canvas: HTMLCanvasElement | OffscreenCanvas, scene: Scene) => {
	// // Creates and positions a free camera
	// const camera = new FreeCamera('camera1',
	const camera = new ArcRotateCamera('Camera', -Math.PI / 5, Math.PI / 3, 200, Vector3.Zero(), scene);
	// 	new Vector3(0, 5, -10), scene);
	// 	// Targets the camera to scene origin
	camera.setTarget(new Vector3(-150, 0, 0));
	// camera.position = new Vector3(0, 0, -200);
	camera.radius = 750;
	camera.alpha = Math.PI / 1;
	camera.beta = Math.PI / 2;
	// prevent zooming through the floor
	camera.lowerRadiusLimit = 10;
	camera.zoomToMouseLocation = true;
	camera.wheelDeltaPercentage = 0.01;
	// This attaches the camera to the canvas
	camera.attachControl();
	scene.onPointerObservable.add((event) => {
		console.log('observable detected', event);
	});
	scene.pointerX = 0;
	scene.pointerY = 0;
	let isLeftMouseDown = false;
	let isRightMouseDown = false;
	let lastX = 0;
	let lastY = 0;
	// add event listener for mousedown,
	// if mousedown, move camera forward
	canvas.addEventListener('pointerdown', (event: any) => {
		if (event.button === 0) {
			isLeftMouseDown = true;
		}
		if (event.button === 2) {
			isRightMouseDown = true;
		}
	});
	canvas.addEventListener('pointerup', (event: any) => {
		if (event.button === 0) {
			isLeftMouseDown = false;
		}
		if (event.button === 2) {
			isRightMouseDown = false;
		}
	});
	canvas.addEventListener('pointermove', (event: any) => {
		if (isLeftMouseDown) {
			camera.beta += -0.01 * (event.y - lastY);
			camera.alpha += -0.01 * (event.x - lastX);
		}
		if (isRightMouseDown) {
			camera.target.y += 0.5 * (event.y - lastY);
			const cameraWorldMatrix = camera.getWorldMatrix();
			const cameraWorldMatrixInverse = Matrix.Invert(cameraWorldMatrix);
			const cameraLocalX = Vector3.TransformNormal(new Vector3(1, 0, 0), cameraWorldMatrixInverse);
			camera.target.addInPlace(cameraLocalX.scale(1 * (event.x - lastX)));
		}
		lastX = event.x;
		lastY = event.y;
		scene.pointerX = event.x;
		scene.pointerY = event.y;
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

	const numberPerSide = 20;
	const size = 200;
	const ofst = size / (numberPerSide - 1);
	const initialMatrix = Matrix.Identity();
	let col = 0;
	let index = 0;

	const instanceCount = numberPerSide * numberPerSide * numberPerSide;
	matricesData0 = new Float32Array(instanceCount * 16);
	matricesData1 = new Float32Array(instanceCount * 16);
	matricesData2 = new Float32Array(instanceCount * 16);
	matricesData3 = new Float32Array(instanceCount * 16);
	matricesDataEstimated = new Float32Array(instanceCount * 16);
	const colorData = new Float32Array(instanceCount * 4);

	for (let x = 0; x < numberPerSide; x++) {
		for (let y = 0; y < numberPerSide; y++) {
			for (let z = 0; z < numberPerSide; z++) {
				const randomNoise = Math.random() * 20;
				initialMatrix.setTranslation(new Vector3(
					(-size / 2 + ofst * x * 0.3) + randomNoise,
					(-size / 2 + ofst * y) + randomNoise,
					(-size / 2 + ofst * z) + randomNoise,
				))
				initialMatrix.copyToArray(matricesData0, index * 16)
				const coli = Math.floor(col)
				colorData[index * 4] = ((coli & 0xFF0000) >> 16) / 255;
				colorData[index * 4 + 1] = ((coli & 0x00FF00) >> 8) / 255;
				colorData[index * 4 + 2] = (coli & 0x0000FF) / 255
				index += 1;
				col += 0xFFFFFF / instanceCount;
			}
		}
	}
	babylonMesh.thinInstanceSetBuffer('matrix', matricesData0, 16);
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
	let now = Date.now();
	let doNotQueueAdditionalUpdates = false;
	scene.registerAfterRender(() => {
	})
	scene.registerBeforeRender(() => {
	})

	setInterval(async () => {
		now = Date.now();
		if (now - physicsUpdateTime0 > 1000 / 60 && !doNotQueueAdditionalUpdates) {
			doNotQueueAdditionalUpdates = true;
			numberMeshes.number = await decode(await rapierExport.getUpdate());
			doNotQueueAdditionalUpdates = false;
		} else {
			estimateFrame();
		}
	}, 1000 / 144);

	setInterval(() => {
		for (let index_ = 0; index_ < instanceCount; index_++) {
			colorData[index_ * 4] = -matricesData0[index_ * 16 + 12] / 50;
			colorData[index_ * 4 + 1] = -matricesData0[index_ * 16 + 13] / 50;
			colorData[index_ * 4 + 2] = -matricesData0[index_ * 16 + 14] / 50;
		}
		// Update the instance buffer
		babylonMesh.thinInstanceSetBuffer('color', colorData, 4);
	}, 1000 / 60);
	return {instanceCount, matricesData: matricesData0};
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
