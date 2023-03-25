import { MeshBodyVirtual } from '../worker/rapier';
export default function keepWithinBounds (meshBodies: MeshBodyVirtual) {
	// if any of the bodies are outside the bounds, move them back in
	const meshBodiesLength = Object.keys(meshBodies).length;
	const outerBoundary = 200;
	// const innerBoundary = 1;
	for (let index = 0; index < meshBodiesLength; index++) {
		const meshBody = meshBodies[index];
		const body = meshBody.body;
		const position = body.translation();
		if (position.x > outerBoundary) {
			// body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: -outerBoundary,
				y: position.y,
				z: position.z}, true);
		} else if (position.x < -outerBoundary) {
			// body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: outerBoundary,
				y: position.y,
				z: position.z}, true);
		}
		if (position.y > outerBoundary) {
			// body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: -outerBoundary,
				z: position.z}, true);
		} else if (position.y < -outerBoundary) {
			// body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: outerBoundary,
				z: position.z}, true);
		}
		if (position.z > outerBoundary) {
			// body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: position.y,
				z: -outerBoundary}, true);
		} else if (position.z < -outerBoundary) {
			// body.setLinvel({x: 0, y: 0, z: 0}, true);
			body.setTranslation({x: position.x,
				y: position.y,
				z: outerBoundary}, true);
		}
	}
}
