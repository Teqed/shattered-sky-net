/* eslint-disable canonical/filename-match-exported */
/* eslint-disable canonical/filename-match-regex */
import { State } from '../../../utilityTypes';
import { Narrator } from '../../components/components';
import { addComponent, addEntity, defineQuery, type IWorld } from 'bitecs';

const queryNarratorGameStateEntity = defineQuery([Narrator.GameState]);

let lastGameState: State = State.Preload;

const GameStateSystem = (world: IWorld) => {
	const narratorGameStateEntity = queryNarratorGameStateEntity(world);

	// If the length of the query is 0, then add the entity.
	if (narratorGameStateEntity.length === 0) {
		// The Narrator entity does not have a GameState component.
		// This must be the very first time that the Narrator entity has been created.
		// We need to add one.
		const narrator = addEntity(world);
		addComponent(world, Narrator.GameState, narrator);
		Narrator.GameState.value[narrator] = State.Title;
		console.log('GameStateSystem: Narrator entity created.');
	}

	for (const entity of narratorGameStateEntity) {
		if ((Narrator.GameState.value[entity] as State) !== lastGameState) {
			switch (Narrator.GameState.value[entity]) {
				case State.Preload:
					// The game is in the Preload state.
					console.log('GameStateSystem: Preload');
					break;
				case State.Title:
					// The game is in the Title state.
					console.log('GameStateSystem: Title');
					break;
				case State.NoCombat:
					// The game is in the NoCombat state.
					console.log('GameStateSystem: NoCombat');
					break;
				case State.Combat:
					// The game is in the Combat state.
					console.log('GameStateSystem: Combat');
					break;
				case State.Cutscene:
					// The game is in the Cutscene state.
					console.log('GameStateSystem: Cutscene');
					break;
				case State.Collection:
					// The game is in the Collection state.
					console.log('GameStateSystem: Collection');
					break;
				default:
					// The game is in an unknown state.
					console.log('GameStateSystem: Unknown');
					break;
			}

			lastGameState = Narrator.GameState.value[entity] as State;
		}
	}

	return world;
};

export default GameStateSystem;
