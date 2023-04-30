/* eslint-disable id-length */
import { defineComponent, Types } from 'bitecs';

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };
const List = defineComponent({ values: [Types.f32, 3] }); // [type, length]
const Reference = defineComponent({ entity: Types.eid }); // Types.eid is used as a reference type
const Tag = defineComponent();

const UID = defineComponent({ uid: Types.f32 });

const Narrator = {
	DesiredCutscene: defineComponent({ value: Types.ui8 }),
	GameState: defineComponent({ value: Types.ui8 }),
	Memory: {
		Dungeon00Cleared: defineComponent(),
		Dungeon00Unlocked: defineComponent(),
		Dungeon01Cleared: defineComponent(),
		Dungeon01Unlocked: defineComponent(),
		Exists: defineComponent(),
	},
	SearchForEncounters: defineComponent({ value: Types.ui8 }),
	TriggerLoadSave: defineComponent({
		triggerLoad: Types.ui8,
		triggerSave: Types.ui8,
	}),
};

const Monster = {
	ArchetypeMonster: defineComponent(),
	Attack: defineComponent({ value: Types.i16 }),
	BaseStats: defineComponent({
		attack: Types.i16,
		health: Types.i16,
		speed: Types.i16,
	}),
	Collection: {
		ArchetypeCollectedMonster: defineComponent(),
		RestingInCollection: defineComponent(),
		TriggerMoveFromCollectionIntoParty: defineComponent(),
	},
	Combat: {
		ActionReady: defineComponent(),
		ArchetypeCombatMonster: defineComponent(),
		CombatDisabled: defineComponent(),
		EnemyPosition: defineComponent({ value: Types.ui8 }),
		Energy: defineComponent({ value: Types.f64 }),
		FriendlyPosition: defineComponent({ value: Types.ui8 }),
		IncomingDamage: defineComponent({ value: Types.i16 }),
		Position: defineComponent(Vector3),
		QueuedAction: defineComponent({ action: Types.ui8, target: Types.eid }),
		TriggerMoveFromWildIntoCombat: defineComponent(),
	},
	CreateMe: defineComponent({ destination: Types.ui8, team: Types.ui8 }),
	Health: defineComponent({ value: Types.i16 }),
	Party: defineComponent(),
	Speed: defineComponent({ value: Types.i16 }),
	Team: defineComponent({ value: Types.ui8 }),
	Wild: defineComponent(),
};

export { List, Monster, Narrator, Reference, Tag, UID };
