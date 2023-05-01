/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { Monster, Narrator } from '../../components/components';
import { addComponent, defineQuery, type IWorld, Not } from 'bitecs';

const queryNarratorGameStateEntity = defineQuery([Narrator.GameState]);

const SaveGameSystem = (world: IWorld) => {
	const narratorGameStateEntity = queryNarratorGameStateEntity(world);

	for (const entity of narratorGameStateEntity) {
		// ...
	}

	return world;
};

export default SaveGameSystem;
