// /* eslint-disable @typescript-eslint/no-unused-vars */
import { type Scene } from '@babylonjs/core/scene';
import { World } from '@lastolivegames/becsy';
import * as Component from './components';
import { initializePositionSystem } from './subSystems';

export default async (scene: Scene) => {
	initializePositionSystem(scene);
	const world = await World.create();

	const createRandomMonster = () => {
		world.createEntity(
			Component.Position, { value: [Math.random() * 10, Math.random() * 10, 0] },
			Component.Speed, { value: Math.random() * 100, baseValue: 100 },
			Component.Energy, { value: 0 },
			Component.QueuedAction, { value: 'AttackEnemies' },
			Component.Team, { value: 'Foe' },
			Component.Attack, { value: 10, baseValue: 10 },
			Component.Health, { value: 100, baseValue: 100 },
			Component.ArchetypeMonster,
			Component.ArchetypeCombatMonster
		);
	};
	for (let index = 0; index < 5; index++) {
		world.createEntity(
			Component.Speed, { value: Math.random() * 100, baseValue: 100 },
			Component.Energy, { value: 0 },
			Component.QueuedAction, { value: 'AttackEnemies' },
			Component.Team, { value: 'Friend' },
			Component.Attack, { value: 10, baseValue: 10 },
			Component.Health, { value: 100, baseValue: 100 },
			Component.ArchetypeMonster,
			Component.ArchetypeCollectedMonster,
			Component.RestingInCollection
		);
		createRandomMonster();
	}

	return world;
};
