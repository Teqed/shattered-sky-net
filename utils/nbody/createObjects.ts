import { Scene } from '@babylonjs/core/scene';
import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { type rapierWorkerType } from '../worker/rapier-wrap';
import { setMatricesSize } from './everyFrame';

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
const createIco = (scene: Scene) => {
	// const babylonMesh = BABYLON.CreateBox('root', {size: 1});
	const babylonMesh = CreateIcoSphere('root', {radius: 1, flat: true, subdivisions: 1});
	babylonMesh.doNotSyncBoundingInfo = true;

	const numberPerSide = 20;
	const size = 200;
	const ofst = size / (numberPerSide - 1);
	const initialMatrix = Matrix.Identity();
	let col = 0;
	let index = 0;

	const instanceCount = numberPerSide * numberPerSide * numberPerSide;
	const matricesDataInitial = new Float32Array(instanceCount * 16);
	const colorData = new Float32Array(instanceCount * 4);
	setMatricesSize(instanceCount);

	for (let x = 0; x < numberPerSide; x++) {
		for (let y = 0; y < numberPerSide; y++) {
			for (let z = 0; z < numberPerSide; z++) {
				const randomNoise = Math.random() * 20;
				initialMatrix.setTranslation(new Vector3(
					(-size / 2 + ofst * x * 0.3) + randomNoise,
					(-size / 2 + ofst * y) + randomNoise,
					(-size / 2 + ofst * z) + randomNoise,
				))
				initialMatrix.copyToArray(matricesDataInitial, index * 16)
				const coli = Math.floor(col)
				colorData[index * 4] = ((coli & 0xFF0000) >> 16) / 255;
				colorData[index * 4 + 1] = ((coli & 0x00FF00) >> 8) / 255;
				colorData[index * 4 + 2] = (coli & 0x0000FF) / 255
				index += 1;
				col += 0xFFFFFF / instanceCount;
			}
		}
	}
	babylonMesh.thinInstanceSetBuffer('matrix', matricesDataInitial, 16);
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
	const createPhysicsBodies = (instanceCount: number, matricesData: Float32Array) => {
		const bodyObjectsArray = [];
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
			// if (index % 100 === 0) {
			// 	// eslint-disable-next-line no-await-in-loop
			// 	await rapierWorker.newBody(bodyObject)
			// } else {
			// 	rapierWorker.newBody(bodyObject)
			// }
			// Add to array for later use
			bodyObjectsArray.push(bodyObject);
		}
		return bodyObjectsArray;
	}
	const bodyObjectsArray = createPhysicsBodies(instanceCount, matricesDataInitial);
	return {babylonMesh, bodyObjectsArray};
}
export default async (scene: Scene, rapierWorker: rapierWorkerType) => {
	const {babylonMesh, bodyObjectsArray} = createIco(scene);
	await rapierWorker.newBodies(bodyObjectsArray);
	return new Promise((resolve) => {
		resolve(babylonMesh);
	}) as Promise<Mesh>;
}
