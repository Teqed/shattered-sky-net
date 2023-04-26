import { type System, type SystemType } from '@lastolivegames/becsy';

export enum State {
	Preload = -1,
	Title = 0,
	NoCombat = 10,
	Combat = 20,
	Collection = 30,
	Cutscene = 40,
}

export type SystemLoop = {
	ActionSystem: SystemType<System>;
	CombatNarratorSystem: SystemType<System>;
	CombatPositionSystem: SystemType<System>;
	CutsceneSystem: SystemType<System>;
	DamageSystem: SystemType<System>;
	DeleterSystem: SystemType<System>;
	EnergySystem: SystemType<System>;
	GameStateSystem: SystemType<System>;
	InputSystem: SystemType<System>;
	MeshPositionSystem: SystemType<System>;
	MonsterMakerSystem: SystemType<System>;
	NoCombatSystem: SystemType<System>;
	SaveGameSystem: SystemType<System>;
	UIDSystem: SystemType<System>;
};
