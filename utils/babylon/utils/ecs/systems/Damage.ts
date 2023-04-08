
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class DamageSystem extends System {
	// This system will apply incoming damage to health.
	// First, query new entities with IncomingDamage.
		private incomingDamageEntities = this.query(q => q.added
			.with(Component.IncomingDamage, Component.Health, Component.Position).write
			.with(Component.ArchetypeCombatMonster)
			.without(Component.CombatDisabled).write);

		override execute () {
			for (const entity of this.incomingDamageEntities.added) {
				const health = entity.write(Component.Health);
				const incomingDamage = entity.read(Component.IncomingDamage);
				health.value -= incomingDamage.value;
				entity.remove(Component.IncomingDamage);
				if (health.value <= 0) {
					console.log(`Entity with ordinal ${entity.ordinal} has died!`);
					// Disable them from taking actions by adding the CombatDisabled component.
					entity.add(Component.CombatDisabled);
				}
			}
		}
	}
	return DamageSystem;
}
