/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster } from '../../../components/components';
import {
	addComponent,
	defineQuery,
	type IWorld,
	Not,
	removeComponent,
} from 'bitecs';

const queryEntitiesReady = defineQuery([
	Monster.Combat.ActionReady,
	Monster.Combat.QueuedAction, // TODO: Implement this
	Monster.Combat.ArchetypeCombatMonster,
	Not(Monster.Combat.CombatDisabled),
]);
const queryAllCombatants = defineQuery([
	Monster.Combat.ArchetypeCombatMonster,
	Monster.Team,
	Not(Monster.Combat.CombatDisabled),
]);

const ActionSystem = (world: IWorld) => {
	const entitiesReady = queryEntitiesReady(world);
	const allCombatants = queryAllCombatants(world);

	for (const entity of entitiesReady) {
		for (const enemy of allCombatants) {
			if (Monster.Team.value[enemy] !== Monster.Team.value[entity]) {
				console.log(`ActionSystem: ${entity} attacks ${enemy}`);
				// If they already have incoming damage, add to it
				// Otherwise, set it
				if (Monster.Combat.IncomingDamage.value[enemy]) {
					Monster.Combat.IncomingDamage.value[enemy] +=
						Monster.Attack.value[entity]!;
				} else {
					addComponent(world, Monster.Combat.IncomingDamage, enemy);
					Monster.Combat.IncomingDamage.value[enemy] =
						Monster.Attack.value[entity]!;
				}
			}
		}

		removeComponent(world, Monster.Combat.ActionReady, entity);
	}

	return world;
};

export default ActionSystem;
