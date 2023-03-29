/* eslint-disable no-plusplus */
import { Vector3, Quaternion, Matrix } from '@babylonjs/core/Maths/math.vector';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import { type Scene } from '@babylonjs/core/scene';
import { type Mesh } from '@babylonjs/core/Meshes/mesh';
import { type rapierWorkerType } from '../worker/rapier-wrap';

export const numberMeshes: {number: number} = {
	number: 0,
};
let matricesData0 = new Float32Array(); // current frame
let matricesData1 = new Float32Array(); // last frame
let matricesData2 = new Float32Array(); // last last frame
let matricesData3 = new Float32Array(); // last last last frame
let matricesDataEstimated = new Float32Array(); // estimated frame
let colorData = new Float32Array();
let instanceCount = 0;
export const setMatricesSize = (size: number) => {
	instanceCount = size;
	matricesData0 = new Float32Array(size * 16);
	matricesData1 = new Float32Array(size * 16);
	matricesData2 = new Float32Array(size * 16);
	matricesData3 = new Float32Array(size * 16);
	matricesDataEstimated = new Float32Array(size * 16);
	colorData = new Float32Array(size * 4);
}
export default (scene: Scene, babylonMesh: Mesh, rapierWorker: rapierWorkerType) => {
	const standardSizeVector3 = new Vector3(1, 1, 1);
	const standardRotationQuaternion = new Quaternion(0, 0, 0, 1);
	const standardTranslationVector3 = new Vector3(0, 0, 0);
	let matricesUpdate = new Float32Array();
	let matrix = Matrix.Compose(
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
		let timePassed = now - physicsUpdateTime0;
		if (timePassed > 33) {
			timePassed = (Math.log(timePassed - 32) * 100 * 0.01) + 32;
		}
		const alpha = timePassed / (physicsUpdateTime0 - physicsUpdateTime1);
		const alpha2 = alpha * alpha;
		const alphaPos0 = physicsUpdateTime0 / physicsUpdateTime1;
		const alphaPos1 = physicsUpdateTime1 / physicsUpdateTime2;
		const alphaPos2 = physicsUpdateTime2 / physicsUpdateTime3;

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
			numberMeshes.number = await decode(await rapierWorker.getUpdate());
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
}
