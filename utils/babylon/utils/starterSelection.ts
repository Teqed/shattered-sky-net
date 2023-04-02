import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
// @ts-ignore
import amigaPattern from '../../../assets/textures/mygrid.jpg';

export default (scene: Scene) => {
	const amigaTexture = new Texture(amigaPattern, scene);
	amigaTexture.uScale = 3;
	amigaTexture.vScale = 3;
	amigaTexture.updateSamplingMode(1);
	// Create a sphere, a box, and a cylinder
	// Sphere in the middle, box on the left, cylinder on the right
	const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
	sphere.position.x = 0;
	const box = MeshBuilder.CreateBox('box', { size: 1 }, scene);
	box.position.x = -2;
	const cylinder = MeshBuilder.CreateCylinder('cylinder', { diameter: 1, height: 2 }, scene);
	cylinder.position.x = 2;

	// Add textures
	const newMaterial = new StandardMaterial('newMaterial', scene);
	newMaterial.diffuseTexture = amigaTexture;
	sphere.material = newMaterial;
	box.material = newMaterial;
	cylinder.material = newMaterial;
	console.log(sphere, box, cylinder);
};
