
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../../../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class DamageSystem extends System {
	// This system will apply incoming damage to health.
	// First, query new entities with IncomingDamage.
		private incomingDamageEntities = this.query(q => q.added
			.with(Component.Monster.Combat.IncomingDamage, Component.Monster.Health).write
			.without(Component.Monster.Combat.CombatDisabled).write);

		override execute () {
			try {
				for (const entity of this.incomingDamageEntities.added) {
					const health = entity.write(Component.Monster.Health);
					const incomingDamage = entity.read(Component.Monster.Combat.IncomingDamage);
					health.value -= incomingDamage.value;
					entity.remove(Component.Monster.Combat.IncomingDamage);
					console.log(`Entity with ordinal ${entity.ordinal} now has ${health.value} health!`)
					if (health.value <= 0) {
						console.log(`Entity with ordinal ${entity.ordinal} has died!`);
						// Disable them from taking actions by adding the CombatDisabled component.
						entity.add(Component.Monster.Combat.CombatDisabled);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
	return DamageSystem;
}
