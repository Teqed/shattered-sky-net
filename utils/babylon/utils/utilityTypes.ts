import { type SystemType, System } from '@lastolivegames/becsy';

export enum State { Preload = -1, Title = 0, NoCombat = 10, Combat = 20, Collection = 30, Cutscene = 40 }

export type SystemLoop = {
	UIDSystem: SystemType<System>,
	GameStateSystem: SystemType<System>,
	InputSystem: SystemType<System>,
	MoveIntoCombatSystem: SystemType<System>,
	EnergySystem: SystemType<System>,
	ActionSystem: SystemType<System>,
	CombatPositionSystem: SystemType<System>,
	MeshPositionSystem: SystemType<System>,
	DamageSystem: SystemType<System>,
	CleanupCombatSceneSystem: SystemType<System>,
	SaveGameSystem: SystemType<System>,
}
