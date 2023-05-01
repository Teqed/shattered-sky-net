/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster } from '../../components/components';
import { addComponent, defineQuery, enterQuery, type IWorld } from 'bitecs';

const queryMonstersCreateMe = defineQuery([Monster.CreateMe]);
const enteredQueryMonstersCreateMe = enterQuery(queryMonstersCreateMe);

const MonsterMakerSystem = (world: IWorld) => {
	const monstersNeedingToBeCreated = enteredQueryMonstersCreateMe(world);

	for (const entity of monstersNeedingToBeCreated) {
		// Add the components the monster needs.
		addComponent(world, Monster.Team, entity);
		Monster.Team.value[entity] = Monster.BaseStats.attack[entity] ?? 0;
		addComponent(world, Monster.Health, entity);
		Monster.Health.value[entity] = Monster.BaseStats.health[entity] ?? 0;
		addComponent(world, Monster.Attack, entity);
		Monster.Attack.value[entity] = Monster.BaseStats.attack[entity] ?? 0;
		addComponent(world, Monster.Speed, entity);
		Monster.Speed.value[entity] = Monster.BaseStats.speed[entity] ?? 0;
		switch (Monster.CreateMe.destination[entity]) {
			case 0:
				// The monster is being created in combat.
				switch (Monster.CreateMe.team[entity]) {
					case 0: // Friend
						// The monster is being created as a friend in combat.
						addComponent(world, Monster.Party, entity);
						addComponent(
							world,
							Monster.Collection.ArchetypeCollectedMonster,
							entity,
						);
						break;
					case 1: // Foe
						// The monster is being created as a foe in combat.
						addComponent(world, Monster.Wild, entity);
						addComponent(
							world,
							Monster.Combat.TriggerMoveFromWildIntoCombat,
							entity,
						);
						break;
					default:
						console.error(
							'Invalid team value: ' +
								Monster.CreateMe.team[entity],
						);
						break;
				}

				break;
			case 1: // Collection
				// The monster is being created in the collection.
				addComponent(
					world,
					Monster.Collection.RestingInCollection,
					entity,
				);
				addComponent(
					world,
					Monster.Collection.ArchetypeCollectedMonster,
					entity,
				);
				break;
			case 2: // Wild
				// The monster is being created in the wild.
				addComponent(world, Monster.Wild, entity);
				break;
			case 3: // Party
				// The monster is being created in the party.
				addComponent(world, Monster.Party, entity);
				addComponent(
					world,
					Monster.Collection.ArchetypeCollectedMonster,
					entity,
				);
				break;
			default:
				console.error(
					'Invalid destination value: ' +
						Monster.CreateMe.destination[entity],
				);
				break;
		}
	}

	return world;
};

export default MonsterMakerSystem;
