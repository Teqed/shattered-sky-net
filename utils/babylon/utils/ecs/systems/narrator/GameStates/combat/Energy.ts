
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../../../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class EnergySystem extends System {
		entities = this.query(q => q.current
			.with(Component.Monster.Speed, Component.Monster.Combat.Energy).write
			.with(Component.Monster.Combat.ArchetypeCombatMonster)
			.without(Component.Monster.Combat.ActionReady).write
			.without(Component.Monster.Combat.CombatDisabled));

		override execute () {
			for (const entity of this.entities.current) {
				const speed = entity.read(Component.Monster.Speed);
				const energy = entity.write(Component.Monster.Combat.Energy);
				energy.value += speed.value * (this.delta);
				if (energy.value > 100) {
					energy.value = 0;
					try { entity.add(Component.Monster.Combat.ActionReady); } catch (error) { }
				}
			}
		}
	}
	return EnergySystem;
}
