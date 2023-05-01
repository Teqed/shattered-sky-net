/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster } from '../../../components/components';
import { addComponent, defineQuery, type IWorld, Not } from 'bitecs';

const queryEntitiesWithIncomingDamage = defineQuery([
	Monster.Combat.IncomingDamage,
	Monster.Health,
	Not(Monster.Combat.CombatDisabled),
]);

const DamageSystem = (world: IWorld) => {
	const entitiesWithIncomingDamage = queryEntitiesWithIncomingDamage(world);

	for (const entity of entitiesWithIncomingDamage) {
		Monster.Health.value[entity]! -=
			Monster.Combat.IncomingDamage.value[entity]!;
		Monster.Combat.IncomingDamage.value[entity] = 0;
		if (Monster.Health.value[entity]! <= 0) {
			addComponent(world, Monster.Combat.CombatDisabled, entity);
		}
	}

	return world;
};

export default DamageSystem;
