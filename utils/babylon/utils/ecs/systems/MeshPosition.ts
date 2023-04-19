import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
// @ts-ignore
import amigaPattern from '../../../../../assets/textures/mygrid.jpg';
import * as Component from '../components/components';

export default (afterSystem: SystemGroup | SystemType<System>, scene: Scene) => {
	// *** Setup texture ***
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	const checkeredMaterial = new StandardMaterial('newMaterial', scene);
	checkeredMaterial.diffuseTexture = amigaTexture;
	@system(s => s.after(afterSystem)) class MeshPositionSystem extends System {
		entitiesEntered = this.query(q => q.added.with(Component.Monster.Combat.Position, Component.UID));
		entitiesExited = this.query(q => q.removed.with(Component.Monster.Combat.Position, Component.UID));
		entitiesChanged = this.query(q => q.changed.with(Component.Monster.Combat.Position, Component.UID));

		override execute () {
			for (const entity of this.entitiesExited.removed) {
				console.log(`Entity with ordinal ${entity.ordinal} has lost position!`);
				const uid = entity.read(Component.UID);
				try { const mesh = scene.getMeshByUniqueId(uid.value); mesh?.dispose(); } catch (error) { }
			}
			for (const entity of this.entitiesEntered.added) {
				const position = entity.read(Component.Monster.Combat.Position);
				console.log(`Entity with ordinal ${entity.ordinal} has gained position ${position.value.x}, ${position.value.y}, ${position.value.z}!`);
				const uid = entity.read(Component.UID).value;
				try { const meshOld = scene.getMeshByUniqueId(uid); meshOld?.dispose(); } catch (error) { }
				const mesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
				mesh.position = new Vector3(position.value.x, position.value.y, position.value.z);
				mesh.material = checkeredMaterial;
				mesh.metadata = { uid };
				mesh.uniqueId = uid;
			}
			for (const entity of this.entitiesChanged.changed) {
				const position = entity.read(Component.Monster.Combat.Position);
				// console.log(`Entity with ordinal ${entity.ordinal} has changed position to ${position.value.x}, ${position.value.y}, ${position.value.z}!`);
				const uid = entity.read(Component.UID).value;
				try {
					const mesh = scene.getMeshByUniqueId(uid)
					if (mesh) { mesh.position = new Vector3(position.value.x, position.value.y, position.value.z) }
				} catch (error) { }
			}
		}
	}
	return MeshPositionSystem;
}
