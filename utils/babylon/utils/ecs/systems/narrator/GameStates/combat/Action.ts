
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../../../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class ActionSystem extends System {
		// When an entity has enough energy to take an action, it gets the ActionReady component.
		// This system will then remove the ActionReady component and do the action.
		// First, query new entities with ActionReady.
		private readyEntities = this.query(q => q.added
			.with(Component.Monster.Combat.ActionReady).write
			.using(Component.Monster.Team, Component.Monster.Combat.QueuedAction, Component.Monster.Attack, Component.Monster.Combat.ArchetypeCombatMonster).read
			.without(Component.Monster.Combat.CombatDisabled));

		private combatants = this.query(q => q.current
			.with(Component.Monster.Team, Component.Monster.Health, Component.Monster.Combat.ArchetypeCombatMonster)
			.without(Component.Monster.Combat.CombatDisabled)
			.using(Component.Monster.Combat.IncomingDamage).write);

		override execute () {
			for (const entity of this.readyEntities.added) {
				entity.remove(Component.Monster.Combat.ActionReady);
				// Read their queued action, and do it. It's a string that might be 'AttackEnemies'.
				const queuedAction = entity.read(Component.Monster.Combat.QueuedAction);
				if (queuedAction.value === 'AttackEnemies') {
					console.log(`Entity with ordinal ${entity.ordinal} is attacking enemies!`);
					// Deal damage to the health of everyone on a different team
					const attack = entity.read(Component.Monster.Attack);
					for (const combatant of this.combatants.current) {
						if (combatant.read(Component.Monster.Team).value !== entity.read(Component.Monster.Team).value) {
							// If they already have an incoming damage, add to it.
							// Otherwise, create a new incoming damage.
							if (combatant.has(Component.Monster.Combat.IncomingDamage)) {
								const _incomingDamage = combatant.write(Component.Monster.Combat.IncomingDamage);
								_incomingDamage.value += attack.value;
							} else {
								combatant.add(Component.Monster.Combat.IncomingDamage, { value: attack.value });
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
