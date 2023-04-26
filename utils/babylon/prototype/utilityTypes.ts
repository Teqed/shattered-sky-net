import { type SystemType, System } from '@lastolivegames/becsy';

export enum State { Preload = -1, Title = 0, NoCombat = 10, Combat = 20, Collection = 30, Cutscene = 40 }

export type SystemLoop = {
	UIDSystem: SystemType<System>,
	InputSystem: SystemType<System>,
	MonsterMakerSystem: SystemType<System>,
	CombatNarratorSystem: SystemType<System>,
	EnergySystem: SystemType<System>,
	ActionSystem: SystemType<System>,
	CombatPositionSystem: SystemType<System>,
	MeshPositionSystem: SystemType<System>,
	DamageSystem: SystemType<System>,
	NoCombatSystem: SystemType<System>,
	CutsceneSystem: SystemType<System>,
	SaveGameSystem: SystemType<System>,
	GameStateSystem: SystemType<System>,
	DeleterSystem: SystemType<System>,
}
