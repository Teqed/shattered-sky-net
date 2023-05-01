/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster } from '../../../components/components';
import { addComponent, defineQuery, type IWorld, Not } from 'bitecs';

const queryEntitiesWithEnergy = defineQuery([
	Monster.Speed,
	Monster.Combat.Energy,
	Monster.Combat.ArchetypeCombatMonster,
	Not(Monster.Combat.ActionReady),
	Not(Monster.Combat.CombatDisabled),
]);

const EnergySystem = (world: IWorld) => {
	const entitiesWithEnergy = queryEntitiesWithEnergy(world);

	for (const entity of entitiesWithEnergy) {
		Monster.Combat.Energy.value[entity] += Monster.Speed.value[entity]!;
		try {
			if (Monster.Combat.Energy.value[entity]! >= 100) {
				Monster.Combat.Energy.value[entity] = 0;
				addComponent(world, Monster.Combat.ActionReady, entity);
			}
		} catch {
			console.error(
				'EnergySystem: Monster.Combat.Energy.value[entity] is undefined',
			);
		}
	}

	return world;
};

export default EnergySystem;
