import { MeshBodyVirtual } from '../../worker/rapier-expose';
export default function gravitationalAttraction (meshBodies: MeshBodyVirtual) {
	const meshBodiesLength = Object.keys(meshBodies).length;
	// const gravitationalConstant = 0.0667;
	for (let index = 0; index < meshBodiesLength; index++) {
		if (meshBodies[index] !== undefined) {
			const body1 = meshBodies[index]!.body;
			const body1Translation = body1.translation();
			const force = { x: 0, y: 0, z: 0 };
			// for (let index2 = 0; index2 < meshBodiesLength; index2++) {
			// 	if (index !== index2) {
			// 		const body2 = meshBodies[index2].body;
			// 		const body2Translation = body2.translation();
			// 		const distanceVector = {
			// 			x: body2Translation.x - body1Translation.x,
			// 			y: body2Translation.y - body1Translation.y,
			// 			z: body2Translation.z - body1Translation.z,
			// 		};
			// 		force.x += (distanceVector.x / 100) * gravitationalConstant;
			// 		force.y += (distanceVector.y / 100) * gravitationalConstant;
			// 		force.z += (distanceVector.z / 100) * gravitationalConstant;
			// 	}
			// }
			// Apply a generic force drawing bodies to 0,0,0
			force.x += -body1Translation.x / 1;
			force.y += -body1Translation.y / 1;
			force.z += -body1Translation.z / 1;
			// Apply the net force to the body
			body1.addForce(force, true);
		}
	}
}
