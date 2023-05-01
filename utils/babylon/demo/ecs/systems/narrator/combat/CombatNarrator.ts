/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster, Narrator } from '../../../components/components';
import {
	addComponent,
	defineQuery,
	type IWorld,
	Not,
	removeComponent,
} from 'bitecs';

const queryEntitiesInParty = defineQuery([
	Monster.Party,
]);
const queryEntitiesOnFriendlyBattlefield = defineQuery([
	Monster.Combat.FriendlyPosition,
]);
const queryEntitiesInWild = defineQuery([
	Monster.Combat.TriggerMoveFromWildIntoCombat,
]);
const queryEntitiesOnEnemyBattlefield = defineQuery([
	Monster.Combat.EnemyPosition,
]);
const queryActiveCombatants = defineQuery([
	Monster.Combat.ArchetypeCombatMonster,
	Not(Monster.Combat.CombatDisabled),
]);
const queryDefeatedFoes = defineQuery([
	Monster.Combat.ArchetypeCombatMonster,
	Not(Monster.Collection.ArchetypeCollectedMonster),
]);
const queryDefeatedFriendly = defineQuery([
	Monster.Combat.ArchetypeCombatMonster,
	Monster.Collection.ArchetypeCollectedMonster,
]);
const queryGameState = defineQuery([
	Narrator.GameState,
]);
const queryDesiredCutscene = defineQuery([
	Narrator.DesiredCutscene,
]);

const CombatNarratorSystem = (world: IWorld) => {

	return world;
};

export default CombatNarratorSystem;
