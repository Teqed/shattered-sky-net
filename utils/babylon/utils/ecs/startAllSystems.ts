import { type Scene } from '@babylonjs/core/scene';
import { World } from '@lastolivegames/becsy';
import { type rapierWorkerType } from '../../../worker/rapier-wrap';
import createUICamera from '../createUICamera';
import createPixelCamera from '../createPixelCamera';
// import * as Component from './components/components';
import { type SystemLoop } from '../utilityTypes';
import initializeUIDSystem from './systems/UID';
import initializeInputSystem from './systems/Input';
import initializeMoveIntoCombatSystem from './systems/MoveIntoCombat';
import initializeEnergySystem from './systems/Energy';
import intializeActionSystem from './systems/Action';
import initializeCombatPositionSystem from './systems/CombatPosition';
import initializeDamageSystem from './systems/Damage';
import initializeCleanupCombatSceneSystem from './systems/CleanupCombatScene';
import initializeSaveGameSystem from './systems/narrator/SaveGame';
import initializeGameStateSystem from './systems/narrator/GameState';
import initalizeMeshPositionSystem from './systems/MeshPosition';

export default async (scene: Scene, canvas: HTMLCanvasElement | OffscreenCanvas, rapierWorker: rapierWorkerType) => {
	const UIDSystem = initializeUIDSystem();
	const GameStateSystem = initializeGameStateSystem(UIDSystem);
	const InputSystem = initializeInputSystem(GameStateSystem);
	const MoveIntoCombatSystem = initializeMoveIntoCombatSystem(InputSystem);
	const EnergySystem = initializeEnergySystem(MoveIntoCombatSystem);
	const ActionSystem = intializeActionSystem(EnergySystem);
	const CombatPositionSystem = initializeCombatPositionSystem(ActionSystem);
	const MeshPositionSystem = initalizeMeshPositionSystem(CombatPositionSystem, scene);
	const DamageSystem = initializeDamageSystem(MeshPositionSystem);
	const CleanupCombatSceneSystem = initializeCleanupCombatSceneSystem(DamageSystem);

	const SaveGameSystem = initializeSaveGameSystem(CleanupCombatSceneSystem);

	const world = await World.create();

	// const createRandomMonster = () => {
	// 	world.createEntity(
	// 		// Component.Monster.Combat.Position, { value: [Math.random() * 10, Math.random() * 10, 0] },
	// 		Component.Monster.Speed, { value: Math.random() * 100, baseValue: 100 },
	// 		Component.Monster.Combat.Energy, { value: 0 },
	// 		Component.Monster.Combat.QueuedAction, { value: 'AttackEnemies' },
	// 		Component.Monster.Team, { value: 'Foe' },
	// 		Component.Monster.Attack, { value: 10, baseValue: 10 },
	// 		Component.Monster.Health, { value: 100, baseValue: 100 },
	// 		Component.Monster.ArchetypeMonster,
	// 		Component.Monster.Combat.TriggerMoveFromWildIntoCombat
	// 	);
	// };
	// for (let index = 0; index < 5; index++) {
	// 	world.createEntity(
	// 		Component.Monster.Speed, { value: Math.random() * 100, baseValue: 100 },
	// 		Component.Monster.Combat.Energy, { value: 0 },
	// 		Component.Monster.Combat.QueuedAction, { value: 'AttackEnemies' },
	// 		Component.Monster.Team, { value: 'Friend' },
	// 		Component.Monster.Attack, { value: 10, baseValue: 10 },
	// 		Component.Monster.Health, { value: 100, baseValue: 100 },
	// 		Component.Monster.ArchetypeMonster,
	// 		Component.Monster.Collection.ArchetypeCollectedMonster,
	// 		Component.Monster.Collection.RestingInCollection
	// 	);
	// 	createRandomMonster();
	// }

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { camera: gameCam, shadows: shadowGenerator } = await createPixelCamera(canvas, scene);
	const UICam = createUICamera(canvas, scene);
	scene.activeCameras = [gameCam, UICam];
	// const objects = await initializeGame(this._scene, rapierWorker);
	// startEveryFrame(this._scene, objects, rapierWorker);
	const worldPhysics = await rapierWorker.startPhysics();
	worldPhysics.gravity = { x: 0, y: -9.81, z: 0 };

	const systems: SystemLoop = {
		UIDSystem,
		GameStateSystem,
		InputSystem,
		MoveIntoCombatSystem,
		EnergySystem,
		ActionSystem,
		CombatPositionSystem,
		MeshPositionSystem,
		DamageSystem,
		CleanupCombatSceneSystem,
		SaveGameSystem,
	}
	return { world, systems }
};
