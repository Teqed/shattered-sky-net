
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class ActionSystem extends System {
		// When an entity has enough energy to take an action, it gets the ActionReady component.
		// This system will then remove the ActionReady component and do the action.
		// First, query new entities with ActionReady.
		private readyEntities = this.query(q => q.added
			.with(Component.ActionReady).write
			.using(Component.Team, Component.QueuedAction, Component.Attack, Component.ArchetypeCombatMonster).read
			.without(Component.CombatDisabled));

		private combatants = this.query(q => q.current
			.with(Component.Team, Component.Health, Component.ArchetypeCombatMonster)
			.without(Component.CombatDisabled)
			.using(Component.IncomingDamage).write);

		override execute () {
			for (const entity of this.readyEntities.added) {
				entity.remove(Component.ActionReady);
				// Read their queued action, and do it. It's a string that might be 'AttackEnemies'.
				const queuedAction = entity.read(Component.QueuedAction);
				if (queuedAction.value === 'AttackEnemies') {
					console.log(`Entity with ordinal ${entity.ordinal} is attacking enemies!`);
					// Deal damage to the health of everyone on a different team
					const attack = entity.read(Component.Attack);
					for (const combatant of this.combatants.current) {
						if (combatant.read(Component.Team).value !== entity.read(Component.Team).value) {
							// If they already have an incoming damage, add to it.
							// Otherwise, create a new incoming damage.
							if (combatant.has(Component.IncomingDamage)) {
								const _incomingDamage = combatant.write(Component.IncomingDamage);
								_incomingDamage.value += attack.value;
							} else {
								combatant.add(Component.IncomingDamage, { value: attack.value });
							}
						}
					}
				} else {
					console.log(`Entity with ordinal ${entity.ordinal} is loafing about!`);
				}
			}
		}
	}
	return ActionSystem;
}
