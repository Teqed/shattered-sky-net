/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
// @ts-expect-error - no types
import amigaPattern from '../../../../../assets/textures/mygrid.jpg';
import { Monster, UID } from '../components/components';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import {
	Changed,
	defineQuery,
	enterQuery,
	exitQuery,
	type IWorld,
} from 'bitecs';

const queryEntitiesWithPosition = defineQuery([Monster.Combat.Position, UID]);
const entitiesEnteredQuery = enterQuery(queryEntitiesWithPosition);
const entitiesExitedQuery = exitQuery(queryEntitiesWithPosition);
const queryEntitiesChanged = defineQuery([
	Changed(Monster.Combat.Position),
	UID,
]);

const MeshPositionSystem = (world: IWorld, scene: Scene) => {
	const entitiesChangedPosition = queryEntitiesChanged(world);
	const entitiesEntered = entitiesEnteredQuery(world);
	const entitiesExited = entitiesExitedQuery(world);
	for (const eid of entitiesEntered) {
		const x = Monster.Combat.Position.x[eid];
		const y = Monster.Combat.Position.y[eid];
		const meshZ = Monster.Combat.Position.z[eid];
		const uid = UID.uid[eid];
		if (uid) {
			const mesh = MeshBuilder.CreateSphere(
				`Entity ${eid}`,
				{ diameter: 1 },
				scene,
			);
			mesh.position = new Vector3(x, y, meshZ);
			mesh.uniqueId = uid;
			mesh.metadata = { uid };
			const amigaTexture = new Texture(amigaPattern, scene);
			amigaTexture.uScale = 3;
			amigaTexture.vScale = 3;
			amigaTexture.updateSamplingMode(1);
			const checkeredMaterial = new StandardMaterial(
				'newMaterial',
				scene,
			);
			checkeredMaterial.diffuseTexture = amigaTexture;
			mesh.material = checkeredMaterial;
		}
	}

	for (const eid of entitiesExited) {
		const uid = UID.uid[eid];
		if (uid) {
			const mesh = scene.getMeshByUniqueId(uid);
			mesh?.dispose();
		}
	}

	for (const eid of entitiesChangedPosition) {
		// Set mesh positions for entities with Position and UID
		const x = Monster.Combat.Position.x[eid];
		const y = Monster.Combat.Position.y[eid];
		const meshZ = Monster.Combat.Position.z[eid];
		const uid = UID.uid[eid];
		if (uid) {
			const mesh = scene.getMeshByUniqueId(uid);
			if (mesh) {
				mesh.position = new Vector3(x, y, meshZ);
			}
		}
	}

	return world;
};

export default MeshPositionSystem;
