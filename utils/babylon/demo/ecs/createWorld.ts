import createPixelCamera from '../createPixelCamera';
import createUICamera from '../createUICamera';
import CombatPositionSystem from './systems/CombatPosition';
import InputSystem from './systems/Input';
import MeshPositionSystem from './systems/MeshPosition';
import ActionSystem from './systems/narrator/combat/Action';
import CombatNarratorSystem from './systems/narrator/combat/CombatNarrator';
import DamageSystem from './systems/narrator/combat/Damage';
import EnergySystem from './systems/narrator/combat/Energy';
import GameStateSystem from './systems/narrator/GameState';
import UIDSystem from './systems/UID';
import { type Scene } from '@babylonjs/core/scene';
import { createWorld, pipe } from 'bitecs';

export default async (scene: Scene, canvas: HTMLCanvasElement) => {
	const { camera } = await createPixelCamera(canvas, scene);
	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [camera, UICam];
	const world = createWorld();

	const allSytemsPipeline = pipe(
		UIDSystem,
		CombatNarratorSystem,
		CombatPositionSystem,
		MeshPositionSystem,
		InputSystem,
		EnergySystem,
		ActionSystem,
		DamageSystem,
		GameStateSystem,
	);
	// const allSytemsPipeline = systems.UIDSystem;
	// allSytemsPipeline(world);

	return { allSytemsPipeline, world };
};
