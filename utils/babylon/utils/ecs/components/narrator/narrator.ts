import { component, field, type Entity } from '@lastolivegames/becsy';
// Narrator components will go on a global entity,
// and will be used to control the flow of the game.
// The narrator will be responsible for:
// - Loading and saving the game
// - Changing the game state
// - Spawning monsters
// - Spawning items
// - Spawning cutscenes
// - Spawning dialogue
// - Otherwise controlling the flow of the game

// @component class FirstComponent {
// 	@field.int32 declare value: number;
// }
// The first component we might want to add is a component that
// controls the game state.
// The game state will be used to control the flow of the game.
@component class GameState {
	@field.uint8 declare value: number;
}
@component class TriggerLoadSave {
	@field.uint8 declare triggerSave: number;
	@field.uint8 declare triggerLoad: number;
}

export default {
	GameState,
	TriggerLoadSave,
}
