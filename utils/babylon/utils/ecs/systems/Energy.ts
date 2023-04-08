
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class EnergySystem extends System {
		entities = this.query(q => q.current
			.with(Component.Speed, Component.Energy).write
			.with(Component.ArchetypeCombatMonster)
			.without(Component.ActionReady).write
			.without(Component.CombatDisabled));

		override execute () {
			for (const entity of this.entities.current) {
				const speed = entity.read(Component.Speed);
				const energy = entity.write(Component.Energy);
				energy.value += speed.value * (this.delta);
				if (energy.value > 100) {
					energy.value = 0;
					try { entity.add(Component.ActionReady); } catch (error) { }
				}
			}
		}
	}
	return EnergySystem;
}
