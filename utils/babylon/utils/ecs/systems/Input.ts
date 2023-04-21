
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class InputSystem extends System {
		private narratorTriggerLoadSave = this.singleton.write(Component.Narrator.TriggerLoadSave);
		private narratorGameState = this.singleton.write(Component.Narrator.GameState);
		entities = this.query(q => q.current
			.with(Component.Monster.Collection.RestingInCollection).write
			.using(Component.Monster.Collection.TriggerMoveFromCollectionIntoParty,
				Component.Monster.CreateMe,
				Component.Monster.BaseStats,
			).write);

		override initialize () {
			addEventListener('keydown', (event) => {
				if (event.code === 'Space') {
					console.log('Space pressed');
					for (const entity of this.entities.current) {
						entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoParty);
					}
				}
				if (event.code === 'KeyS') {
					console.log('S pressed');
					this.narratorTriggerLoadSave.triggerSave = 1;
				}
				if (event.code === 'KeyL') {
					console.log('L pressed');
					this.narratorTriggerLoadSave.triggerLoad = 1;
				}
				if (event.code === 'Digit0') {
					console.log('0 pressed');
					this.narratorGameState.value = 0;
				}
				if (event.code === 'Digit1') {
					console.log('1 pressed');
					this.narratorGameState.value = 1;
				}
				if (event.code === 'Digit2') {
					console.log('2 pressed');
					// Change the game state to 2 (collection).
					this.narratorGameState.value = 2;
				}
				if (event.code === 'Digit3') {
					console.log('3 pressed');
					this.narratorGameState.value = 3;
				}
				if (event.code === 'KeyZ') {
					console.log('Z pressed');
					// Create a new friendly monster.
					this.createEntity(
						Component.Monster.CreateMe, { team: 'Friend', destination: 'Combat' },
						Component.Monster.BaseStats, { health: 10, attack: 1, speed: 25 },
					);
				}
			});
		}
	}
	return InputSystem;
}
