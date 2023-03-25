import { type RigidBody, Vector3 } from '../../worker/rapier';
interface Point {
	x: number;
	y: number;
	z: number;
}
class Boundary {
	// * The constructor makes it more convenient to create a boundary
	// eslint-disable-next-line no-useless-constructor
	constructor (
		private minX: number,
		private minY: number,
		private minZ: number,
		private maxX: number,
		private maxY: number,
		private maxZ: number) {}

	public contains (point: Point): boolean {
		return point.x >= this.minX && point.x <= this.maxX &&
 point.y >= this.minY && point.y <= this.maxY &&
 point.z >= this.minZ && point.z <= this.maxZ;
	}

	public get size (): number {
		return Math.max(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
	}
}
class BarnesHutNode {
	// eslint-disable-next-line no-use-before-define
	private readonly children: BarnesHutNode[] = [];
	private readonly centerOfMass: Point = { x: 0, y: 0, z: 0 };
	private totalMass = 0;
	// * The constructor makes it more convenient to create a boundary
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly boundary: Boundary) {}
	public insert (point: Point, mass: number): boolean {
		try {
			if (this.boundary.contains(point)) {
				this.updateCenterOfMass(point, mass);
				if (this.children.length !== 0) {
					for (const child of this.children) {
						if (child.insert(point, mass)) {
							return true;
						}
					}
				}
				return true;
			}
			return false;
		} catch (error) {
			console.error('Error in BarnesHutNode.insert', error);
			return false;
		}
	}

	public updateForces (point: Point, force: Point): void {
		try {
			const distance = this.getDistance(point, this.centerOfMass);
			const direction = this.getDirection(point, this.centerOfMass, distance);
			const magnitude = ((this.totalMass * distance) ** -10);
			if ((this.children.length === 0) || (this.boundary.size / distance < theta)) {
				if (this.centerOfMass !== point) {
					force.x += direction.x * magnitude;
					force.y += direction.y * magnitude;
					force.z += direction.z * magnitude;
				}
				return;
			}
			for (const child of this.children) {
				child.updateForces(point, force);
			}
		} catch (error) {
			console.error('Error in BarnesHutNode.updateForces', error);
		}
	}

	private updateCenterOfMass (point: Point, mass: number): void {
		const totalMass = this.totalMass + mass;
		const weight1 = this.totalMass / totalMass;
		const weight2 = mass / totalMass;
		this.centerOfMass.x = this.centerOfMass.x * weight1 + point.x * weight2;
		this.centerOfMass.y = this.centerOfMass.y * weight1 + point.y * weight2;
		this.centerOfMass.z = this.centerOfMass.z * weight1 + point.z * weight2;
		this.totalMass = totalMass;
	}

	private getDistance (point1: Point, point2: Point): number {
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
		const dz = point1.z - point2.z;

		return dx ** 2 + dy ** 2 + dz ** 2;
	}

	private getDirection (point1: Point, point2: Point, distance: number): Point {
		return {
			x: (point2.x - point1.x) / distance,
			y: (point2.y - point1.y) / distance,
			z: (point2.z - point1.z) / distance,
		};
	}
}
class BarnesHutTree {
	private readonly rootNode: BarnesHutNode;

	constructor (private readonly theta: number, private readonly boundary: Boundary) {
		this.rootNode = new BarnesHutNode(boundary);
	}

	public insert (point: Point, mass: number): void {
		this.rootNode.insert(point, mass);
	}

	public updateForces (point: Point, force: Point): void {
		this.rootNode.updateForces(point, force);
	}
}
const theta = 0.7;
const boundary = new Boundary(-1000, -1000, -1000, 1000, 1000, 1000);
const barnesHutTree = new BarnesHutTree(theta, boundary);
let meshBody;
let body;
let translation;
let meshBodiesLength;
// eslint-disable-next-line import/prefer-default-export
export const barnesHutAttraction = (meshBodies: {
	[meshId: number]: {
		body: RigidBody;
		force?: Vector3 | undefined;
	};
}) => {
	meshBodiesLength = Object.keys(meshBodies).length;
	for (let index = 0; index < meshBodiesLength; index++) {
		meshBody = meshBodies[index];
		meshBody.force = {x: 0, y: 0, z: 0};
	}
	for (let index = 0; index < meshBodiesLength; index++) {
		meshBody = meshBodies[index];
		body = meshBody.body;
		translation = body.translation();
		barnesHutTree.insert(translation, body.mass());
		// barnesHutTree.insert(translation, 1);
		barnesHutTree.updateForces(translation, meshBody.force!);
	}
	for (let index = 0; index < meshBodiesLength; index++) {
		try {
			meshBody = meshBodies[index];
			body = meshBody.body;
			body.addForce({
				x: meshBody.force!.x * 1,
				y: meshBody.force!.y * 1,
				z: meshBody.force!.z * 1,
			},
			true);
			meshBody.force = {x: 0, y: 0, z: 0};
		} catch (error) {
			console.error('Error in barnesHutAttraction', error);
		}
	}
};
