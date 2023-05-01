/* eslint-disable @typescript-eslint/prefer-enum-initializers */
/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
/* eslint-disable unicorn/prefer-math-trunc */
/* eslint-disable no-bitwise */
export enum EntityFlags {
	None = 0b0,
	UID = 1 << 0,
	Team = UID << 1,
	Health = Team << 1,
	Attack = Health << 1,
	Speed = Attack << 1,
	BaseStats = Speed << 1,
	CreateMe = BaseStats << 1,
	Party = CreateMe << 1,
	Wild = Party << 1,
	ArchetypeMonster = Wild << 1,
	RestingInCollection = ArchetypeMonster << 1,
	TriggerMoveFromCollectionIntoParty = RestingInCollection << 1,
	ArchetypeCollectedMonster = TriggerMoveFromCollectionIntoParty << 1,
	Energy = ArchetypeCollectedMonster << 1,
	ActionReady = Energy << 1,
	QueuedAction = ActionReady << 1,
	Position = QueuedAction << 1,
	ArchetypeCombatMonster = Position << 1,
	IncomingDamage = ArchetypeCombatMonster << 1,
	CombatDisabled = IncomingDamage << 1,
	TriggerMoveFromWildIntoCombat = CombatDisabled << 1,
	FriendlyPosition = TriggerMoveFromWildIntoCombat << 1,
	EnemyPosition = FriendlyPosition << 1, // 1 << 22
	GameState = EnemyPosition << 1,
	TriggerLoadSave = GameState << 1,
	DesiredCutscene = TriggerLoadSave << 1,
	SearchForEncounters = DesiredCutscene << 1,
	Memory = SearchForEncounters << 1,
	// GameState = 1 << 23,
	// TriggerLoadSave = 1 << 24,
	// DesiredCutscene = 1 << 25,
}
export enum MemoryFlags {
	None = 0b0,
	Exists = 1 << 0,
	Dungeon00Unlocked = Exists << 1,
	Dungeon00Cleared = Dungeon00Unlocked << 1,
	Dungeon01Unlocked = Dungeon00Cleared << 1,
	Dungeon01Cleared = Dungeon01Unlocked << 1, // 16, or 1 << 4
}
export enum Field {
	UID,
	Team,
	Health,
	Attack,
	Speed,
	BaseStats_health,
	BaseStats_attack,
	BaseStats_speed,
	Energy,
	QueuedAction,
	Position_x,
	Position_y,
	Position_z,
	IncomingDamage,
	FriendlyPosition,
	EnemyPosition, // 15
	GameState,
	TriggerLoadSave_triggerSave,
	TriggerLoadSave_triggerLoad,
	DesiredCutscene,
	SearchForEncounters, // 20
	Memory = 30,
	Flags = 31,
}

export enum State {
	Preload = -1,
	Title = 0,
	NoCombat = 10,
	Combat = 20,
	Collection = 30,
	Cutscene = 40,
}
