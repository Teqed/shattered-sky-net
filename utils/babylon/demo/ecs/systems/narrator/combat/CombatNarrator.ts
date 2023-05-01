/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { State } from '../../../../utilityTypes';
import { Monster, Narrator } from '../../../components/components';
import {
	addComponent,
	defineQuery,
	type IWorld,
	Not,
	removeComponent,
} from 'bitecs';

const queryEntitiesInParty = defineQuery([Monster.Party]);
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
const queryGameState = defineQuery([Narrator.GameState]);
const queryDesiredCutscene = defineQuery([Narrator.DesiredCutscene]);

let battlefieldInit = false;

const CombatNarratorSystem = (world: IWorld) => {
	const entitiesInParty = queryEntitiesInParty(world);
	const entitiesOnFriendlyBattlefield =
		queryEntitiesOnFriendlyBattlefield(world);
	const entitiesInWild = queryEntitiesInWild(world);
	const entitiesOnEnemyBattlefield = queryEntitiesOnEnemyBattlefield(world);
	const activeCombatants = queryActiveCombatants(world);
	const defeatedFoes = queryDefeatedFoes(world);
	const defeatedFriendly = queryDefeatedFriendly(world);
	const entityWithGameState = queryGameState(world);
	const desiredCutscene = queryDesiredCutscene(world);

	for (const gameState of entityWithGameState) {
		if (gameState === State.Combat) {
			if (battlefieldInit) {
				const allFriendlyDisabled = defeatedFriendly.length === 4;
				const allEnemyDisabled = defeatedFoes.length === 4;

				if (allFriendlyDisabled) {
					for (const entity of entitiesOnFriendlyBattlefield) {
						removeComponent(
							world,
							Monster.Combat.FriendlyPosition,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.ArchetypeCombatMonster,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.QueuedAction,
							entity,
						);
						removeComponent(world, Monster.Combat.Energy, entity);
						removeComponent(world, Monster.Combat.Position, entity);
					}

					for (const entity of entitiesOnEnemyBattlefield) {
						removeComponent(
							world,
							Monster.Combat.EnemyPosition,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.ArchetypeCombatMonster,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.QueuedAction,
							entity,
						);
						removeComponent(world, Monster.Combat.Energy, entity);
						removeComponent(world, Monster.Combat.Position, entity);
					}

					battlefieldInit = false;
					Narrator.DesiredCutscene.value[gameState] = 1;
					Narrator.GameState.value[gameState] = State.Cutscene;
				} else if (allEnemyDisabled) {
					for (const entity of defeatedFoes) {
						removeComponent(
							world,
							Monster.Combat.ArchetypeCombatMonster,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.QueuedAction,
							entity,
						);
						removeComponent(world, Monster.Combat.Energy, entity);
						removeComponent(world, Monster.Combat.Position, entity);
						removeComponent(
							world,
							Monster.Combat.EnemyPosition,
							entity,
						);
					}

					for (const entity of entitiesOnFriendlyBattlefield) {
						removeComponent(
							world,
							Monster.Combat.FriendlyPosition,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.ArchetypeCombatMonster,
							entity,
						);
						removeComponent(
							world,
							Monster.Combat.QueuedAction,
							entity,
						);
						removeComponent(world, Monster.Combat.Energy, entity);
						removeComponent(world, Monster.Combat.Position, entity);
					}

					battlefieldInit = false;
					Narrator.GameState.value[gameState] = State.NoCombat;
				}
			} else {
				for (const entity of entitiesInParty) {
					const occupiedFriendlyPositions =
						entitiesOnFriendlyBattlefield.map(entity_ => {
							return Monster.Combat.FriendlyPosition.value[
								entity_
							]!;
						});

					const availableFriendlyPositions = [1, 2, 3, 4].filter(
						position => {
							return !occupiedFriendlyPositions.includes(
								position,
							);
						},
					);

					if (availableFriendlyPositions.length > 0) {
						const position = availableFriendlyPositions[0]!;
						addComponent(
							world,
							Monster.Combat.FriendlyPosition,
							entity,
						);
						Monster.Combat.FriendlyPosition.value[entity] =
							position;
						addComponent(
							world,
							Monster.Combat.ArchetypeCombatMonster,
							entity,
						);
						addComponent(
							world,
							Monster.Combat.QueuedAction,
							entity,
						);
						Monster.Combat.QueuedAction.action[entity] = 0;
						Monster.Combat.QueuedAction.target[entity] = 0;
						addComponent(world, Monster.Combat.Energy, entity);
						Monster.Combat.Energy.value[entity] = 0;
					} else {
						console.warn('No available positions!');
					}

					const occupiedEnemyPositions =
						entitiesOnEnemyBattlefield.map(entity_ => {
							return Monster.Combat.EnemyPosition.value[entity_]!;
						});

					const availableEnemyPositions = [1, 2, 3, 4].filter(
						position => {
							return !occupiedEnemyPositions.includes(position);
						},
					);

					if (availableEnemyPositions.length > 0) {
						const position = availableEnemyPositions[0]!;
						addComponent(
							world,
							Monster.Combat.EnemyPosition,
							entity,
						);
						Monster.Combat.EnemyPosition.value[entity] = position;
						addComponent(
							world,
							Monster.Combat.ArchetypeCombatMonster,
							entity,
						);
						addComponent(
							world,
							Monster.Combat.QueuedAction,
							entity,
						);
						Monster.Combat.QueuedAction.action[entity] = 0;
						Monster.Combat.QueuedAction.target[entity] = 0;
						addComponent(world, Monster.Combat.Energy, entity);
						Monster.Combat.Energy.value[entity] = 0;
					} else {
						console.warn('No available positions!');
					}
				}

				battlefieldInit = true;
			}
		}
	}

	return world;
};

export default CombatNarratorSystem;
