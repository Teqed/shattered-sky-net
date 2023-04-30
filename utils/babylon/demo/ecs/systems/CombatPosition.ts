/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster } from '../components/components';
import {
	addComponent,
	defineQuery,
	enterQuery,
	exitQuery,
	type IWorld,
	removeComponent,
} from 'bitecs';

// An entity has gained one of the four valid friendly positions on the left side of the map.
// We need to set its position to one of those positions.

// Position 1 is at (-1, 0, 0).
// Position 2 is at (-2, 0, 0).
// Position 3 is at (-3, 0, 0).
// Position 4 is at (-4, 0, 0).
// These are arbitrary positions, but they are the positions that we will use for now.
// We will use opposite positions for the enemy positions on the right side of the map.

const queryEntitiesWithFriendlyPosition = defineQuery([
	Monster.Combat.FriendlyPosition,
]);
const queryEntitiesWithEnemyPosition = defineQuery([
	Monster.Combat.EnemyPosition,
]);
const queryEntitiesEnteringFriendlyPosition = enterQuery(
	queryEntitiesWithFriendlyPosition,
);
const queryEntitiesEnteringEnemyPosition = enterQuery(
	queryEntitiesWithEnemyPosition,
);
const queryEntitiesExitingFriendlyPosition = exitQuery(
	queryEntitiesWithFriendlyPosition,
);
const queryEntitiesExitingEnemyPosition = exitQuery(
	queryEntitiesWithEnemyPosition,
);

const CombatPositionSystem = (world: IWorld) => {
	for (const entity of queryEntitiesEnteringFriendlyPosition(world)) {
		// An entity has gained one of the four valid friendly positions on the left side of the map.
		// We need to set its position to one of those positions.
		const friendlyPosition = Monster.Combat.FriendlyPosition.value[entity];
		addComponent(world, Monster.Combat.Position, entity);
		// Now that we know which of the 4 positions this entity has, we can set its position.
		// Position 1 is at (-1, 0, 0).
		// Position 2 is at (-2, 0, 0).
		// Position 3 is at (-3, 0, 0).
		// Position 4 is at (-4, 0, 0).
		// These are arbitrary positions, but they are the positions that we will use for now.
		// We will use opposite positions for the enemy positions on the right side of the map.
		switch (friendlyPosition) {
			case 1:
				Monster.Combat.Position.x[entity] = -1;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			case 2:
				Monster.Combat.Position.x[entity] = -2;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			case 3:
				Monster.Combat.Position.x[entity] = -3;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			case 4:
				Monster.Combat.Position.x[entity] = -4;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			default:
				console.error(
					`CombatPositionSystem: friendlyPosition ${friendlyPosition} is not valid`,
				);
				break;
		}
	}

	for (const entity of queryEntitiesEnteringEnemyPosition(world)) {
		// An entity has gained one of the four valid enemy positions on the right side of the map.
		// We need to set its position to one of those positions.
		const enemyPosition = Monster.Combat.EnemyPosition.value[entity];
		addComponent(world, Monster.Combat.Position, entity);
		// Now that we know which of the 4 positions this entity has, we can set its position.
		// Position 1 is at (1, 0, 0).
		// Position 2 is at (2, 0, 0).
		// Position 3 is at (3, 0, 0).
		// Position 4 is at (4, 0, 0).
		// These are arbitrary positions, but they are the positions that we will use for now.
		// We will use opposite positions for the enemy positions on the right side of the map.
		switch (enemyPosition) {
			case 1:
				Monster.Combat.Position.x[entity] = 1;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			case 2:
				Monster.Combat.Position.x[entity] = 2;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			case 3:
				Monster.Combat.Position.x[entity] = 3;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			case 4:
				Monster.Combat.Position.x[entity] = 4;
				Monster.Combat.Position.y[entity] = 0;
				Monster.Combat.Position.z[entity] = 0;
				break;
			default:
				console.error(
					`CombatPositionSystem: enemyPosition ${enemyPosition} is not valid`,
				);
				break;
		}
	}

	for (const entity of queryEntitiesExitingFriendlyPosition(world)) {
		// An entity has lost one of the four valid friendly positions on the left side of the map.
		// We need to remove its position.
		removeComponent(world, Monster.Combat.Position, entity);
	}

	for (const entity of queryEntitiesExitingEnemyPosition(world)) {
		// An entity has lost one of the four valid enemy positions on the right side of the map.
		// We need to remove its position.
		removeComponent(world, Monster.Combat.Position, entity);
	}

	return world;
};

export default CombatPositionSystem;
