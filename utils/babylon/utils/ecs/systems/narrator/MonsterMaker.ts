import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import * as Component from '../../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class MonsterMakerSystem extends System {
		// We're going to check for entities that have the Monster.CreateMe component.
		// We'll use this to spawn monsters. It has all the information we need to spawn a monster.
		private MonsterCreateMe = this.query(q => q.current
			.with(Component.Monster.CreateMe).write
			.using(Component.Monster.BaseStats).read
			.using(
				Component.Monster.Team,
				Component.Monster.Health,
				Component.Monster.Attack,
				Component.Monster.Speed,
				Component.Monster.Combat.TriggerMoveFromWildIntoCombat,
				Component.Monster.Collection.TriggerMoveFromCollectionIntoParty,
				Component.Monster.Collection.ArchetypeCollectedMonster,
				Component.Monster.Combat.ArchetypeCombatMonster,
				Component.Monster.Collection.RestingInCollection,
				Component.Monster.Party,
				Component.Monster.Wild,
			).write);

		override execute () {
			for (const entity of this.MonsterCreateMe.current) {
				// Get the data from the entity.
				const { team, destination } = entity.read(Component.Monster.CreateMe);
				const { health, attack, speed } = entity.read(Component.Monster.BaseStats);
				// Add the components to the entity.
				entity.add(Component.Monster.Team, { value: team });
				entity.add(Component.Monster.Health, { value: health });
				entity.add(Component.Monster.Attack, { value: attack });
				entity.add(Component.Monster.Speed, { value: speed });
				// If its destination is the battlefield, add the appropriate Trigger move into combat.
				switch (destination) {
					case 'Combat':
						switch (team) {
							case 'Foe':
								entity.add(
									Component.Monster.Wild);
								entity.add(Component.Monster.Combat.TriggerMoveFromWildIntoCombat);
								break;
							case 'Friend':
								// entity.add(
								// 	Component.Monster.Collection.TriggerMoveFromCollectionIntoParty)
								entity.add(
									Component.Monster.Collection.ArchetypeCollectedMonster);
								// entity.add(
								// 	Component.Monster.Collection.RestingInCollection);
								entity.add(
									Component.Monster.Party);
								break;
							default:
								console.error('Invalid team value: ' + team)
						} break;
					case 'Collection':
						entity.add(
							Component.Monster.Collection.RestingInCollection);
						entity.add(
							Component.Monster.Collection.ArchetypeCollectedMonster);
						break;
					case 'Wild':
						entity.add(
							Component.Monster.Wild);
						break;
					default:
						console.error('Invalid destination value: ' + destination)
				}
				entity.remove(Component.Monster.CreateMe);
			}
		}
	}
	return MonsterMakerSystem;
}
