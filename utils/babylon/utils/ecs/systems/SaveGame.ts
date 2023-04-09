
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import JSONToTypedArray from '@stdlib/array-reviver';
import typedArrayToJSON from '@stdlib/array-to-json';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	@system(s => s.after(afterSystem)) class SaveGameSystem extends System {
		private global = this.singleton.write(Component.Global);
		// Get all ArchetypeMonster entities.
		private monsters = this.query(q => q.current
			.with(Component.Monster.ArchetypeMonster)
			.usingAll.write);

		override execute () {
			// If global.value is 1, save the game.
			if (this.global.triggerSave === 1) {
				console.log('Saving the game!');
				this.global.triggerSave = 0;
				const monstersMap = new Map();
				for (const entity of this.monsters.current) {
					const monsterMatrix = new Float32Array(32);
					// For each component the entity has...
					if (entity.has(Component.UID)) {
						const UID = entity.read(Component.UID);
						monsterMatrix[0] = UID.value;
					} else { monsterMatrix[0] = -999; }
					if (entity.has(Component.Monster.Team)) {
						const Team = entity.read(Component.Monster.Team);
						let TeamValue = -1;
						switch (Team.value) {
							case 'Friend':
								TeamValue = 0;
								break;
							case 'Foe':
								TeamValue = 1;
								break;
							case 'Other':
								TeamValue = 2;
								break;
						}
						monsterMatrix[1] = TeamValue;
					} else { monsterMatrix[1] = -999; }
					if (entity.has(Component.Monster.Health)) {
						const Health = entity.read(Component.Monster.Health);
						monsterMatrix[2] = Health.value;
						monsterMatrix[3] = Health.baseValue;
					} else { monsterMatrix[2] = -999; monsterMatrix[3] = -999; }
					if (entity.has(Component.Monster.Attack)) {
						const Attack = entity.read(Component.Monster.Attack);
						monsterMatrix[4] = Attack.value;
						monsterMatrix[5] = Attack.baseValue;
					} else { monsterMatrix[4] = -999; monsterMatrix[5] = -999; }
					if (entity.has(Component.Monster.Speed)) {
						const Speed = entity.read(Component.Monster.Speed);
						monsterMatrix[6] = Speed.value;
						monsterMatrix[7] = Speed.baseValue;
					} else { monsterMatrix[6] = -999; monsterMatrix[7] = -999; }
					if (entity.has(Component.Monster.Collection.RestingInCollection)) {
						monsterMatrix[8] = 1;
					} else { monsterMatrix[8] = 0; }
					if (entity.has(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat)) {
						monsterMatrix[12] = 1;
					} else { monsterMatrix[12] = 0; }
					if (entity.has(Component.Monster.Collection.ArchetypeCollectedMonster)) {
						monsterMatrix[13] = 1;
					} else { monsterMatrix[13] = 0; }
					if (entity.has(Component.Monster.Combat.Energy)) {
						const Energy = entity.read(Component.Monster.Combat.Energy);
						monsterMatrix[14] = Energy.value;
					} else { monsterMatrix[14] = -999; }
					if (entity.has(Component.Monster.Combat.ActionReady)) {
						monsterMatrix[15] = 1;
					} else { monsterMatrix[15] = 0; }
					if (entity.has(Component.Monster.Combat.QueuedAction)) {
						const Combat = entity.read(Component.Monster.Combat.QueuedAction);
						let QueuedActionValue = -1;
						switch (Combat.value) {
							case 'AttackEnemies':
								QueuedActionValue = 0;
								break;
							case 'AttackFriend':
								QueuedActionValue = 1;
								break;
							case 'AttackOther':
								QueuedActionValue = 2;
								break;
							default:
								QueuedActionValue = -1;
								break;
						}
						monsterMatrix[16] = QueuedActionValue;
					} else { monsterMatrix[16] = -999; }
					if (entity.has(Component.Monster.Combat.Position)) {
						const Position = entity.read(Component.Monster.Combat.Position);
						monsterMatrix[9] = Position.value.x;
						monsterMatrix[10] = Position.value.y;
						monsterMatrix[11] = Position.value.z;
					} else { monsterMatrix[9] = -999; monsterMatrix[10] = -999; monsterMatrix[11] = -999; }
					if (entity.has(Component.Monster.Combat.FriendlyPosition)) {
						const FriendlyPosition = entity.read(Component.Monster.Combat.FriendlyPosition);
						monsterMatrix[17] = FriendlyPosition.value;
					} else { monsterMatrix[17] = -999; }
					if (entity.has(Component.Monster.Combat.EnemyPosition)) {
						const EnemyPosition = entity.read(Component.Monster.Combat.EnemyPosition);
						monsterMatrix[18] = EnemyPosition.value;
					} else { monsterMatrix[18] = -999; }
					if (entity.has(Component.Monster.Combat.ArchetypeCombatMonster)) {
						monsterMatrix[19] = 1;
					} else { monsterMatrix[19] = 0; }
					if (entity.has(Component.Monster.Combat.IncomingDamage)) {
						const IncomingDamage = entity.read(Component.Monster.Combat.IncomingDamage);
						monsterMatrix[20] = IncomingDamage.value;
					} else { monsterMatrix[20] = -999; }
					if (entity.has(Component.Monster.Combat.CombatDisabled)) {
						monsterMatrix[21] = 1;
					} else { monsterMatrix[21] = 0; }
					if (entity.has(Component.Monster.Combat.TriggerMoveFromWildIntoCombat)) {
						monsterMatrix[22] = 1;
					} else { monsterMatrix[22] = 0; }
					// Add to map of monsters
					monstersMap.set(monsterMatrix[0], monsterMatrix);
				}
				console.log(monstersMap);
				// Turn the map into a JSON string
				// const monstersJSON = JSON.stringify(Array.from(monstersMap.entries()));
				// For each entry in the map, add it to the JSON string
				const monstersJSONMap = new Map();
				// For each Float32Array in the map, convert it to a JSON using typedArrayToJSON
				// And add it to the monstersJSONMap
				monstersMap.forEach((value, key) => {
					monstersJSONMap.set(key, typedArrayToJSON(value));
				});
				console.log(monstersJSONMap);
			}
			if (this.global.triggerLoad === 1) {
				console.log('Loading the game!');
				this.global.triggerLoad = 0;
				// Fake monster data:
				const monstersMap = new Map();
				monstersMap.set(0, [0, 0, 200, 200, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, -999, -999, -999, 0, 0, 0, 0]);
				// eslint-disable-next-line
				// const monstersJSON = [[1891759104,{"0":1891759104,"1":0,"2":100,"3":100,"4":10,"5":10,"6":45.083248138427734,"7":100,"8":1,"9":-999,"10":-999,"11":-999,"12":0,"13":1,"14":0,"15":0,"16":0,"17":-999,"18":-999,"19":0,"20":-999,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[-797786624,{"0":-797786624,"1":1,"2":70,"3":100,"4":10,"5":10,"6":32.181522369384766,"7":100,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":32.181522369384766,"15":0,"16":0,"17":-999,"18":1,"19":1,"20":-999,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[1802066688,{"0":1802066688,"1":0,"2":80,"3":100,"4":10,"5":10,"6":35.29670715332031,"7":100,"8":0,"9":-1,"10":0,"11":0,"12":0,"13":1,"14":79.41759490966797,"15":0,"16":0,"17":1,"18":-999,"19":1,"20":20,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[251439968,{"0":251439968,"1":1,"2":70,"3":100,"4":10,"5":10,"6":57.21809387207031,"7":100,"8":0,"9":2,"10":0,"11":0,"12":0,"13":0,"14":42.90212631225586,"15":0,"16":0,"17":-999,"18":2,"19":1,"20":-999,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[1893160960,{"0":1893160960,"1":0,"2":80,"3":100,"4":10,"5":10,"6":68.59407043457031,"7":100,"8":0,"9":-2,"10":0,"11":0,"12":0,"13":1,"14":51.43183135986328,"15":0,"16":0,"17":2,"18":-999,"19":1,"20":20,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[1105709056,{"0":1105709056,"1":1,"2":70,"3":100,"4":10,"5":10,"6":90.45758056640625,"7":100,"8":0,"9":3,"10":0,"11":0,"12":0,"13":0,"14":45.12928771972656,"15":0,"16":0,"17":-999,"18":3,"19":1,"20":-999,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[-231402512,{"0":-231402512,"1":0,"2":80,"3":100,"4":10,"5":10,"6":69.79450225830078,"7":100,"8":0,"9":-3,"10":0,"11":0,"12":0,"13":1,"14":52.33191680908203,"15":0,"16":0,"17":3,"18":-999,"19":1,"20":20,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[-394589664,{"0":-394589664,"1":1,"2":70,"3":100,"4":10,"5":10,"6":18.326622009277344,"7":100,"8":0,"9":4,"10":0,"11":0,"12":0,"13":0,"14":77.88447570800781,"15":0,"16":0,"17":-999,"18":4,"19":1,"20":-999,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}],[1668334208,{"0":1668334208,"1":0,"2":80,"3":100,"4":10,"5":10,"6":57.09810256958008,"7":100,"8":0,"9":-4,"10":0,"11":0,"12":0,"13":1,"14":14.257396697998047,"15":0,"16":0,"17":4,"18":-999,"19":1,"20":20,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}]]
				// Turn the monstersJSON into a map of monsters
				// const monstersMap = new Map();
				// for (const monster of monstersJSON) {
				// 	monstersMap.set(monster[0], monster);
				// }
				console.log(monstersMap);
				// Load the monsters
				for (const monsterMatrix of monstersMap.values()) {
					// Create the entity
					const entity = this.createEntity();
					// Add the components
					entity.add(Component.UID, { value: monsterMatrix[0] });
					if (monsterMatrix[1] === 0) {
						entity.add(Component.Monster.Team, { value: 'Friend' });
					} else if (monsterMatrix[1] === 1) {
						entity.add(Component.Monster.Team, { value: 'Foe' });
					} else if (monsterMatrix[1] === 2) {
						entity.add(Component.Monster.Team, { value: 'Other' });
					}
					if (monsterMatrix[2] !== -999) {
						entity.add(Component.Monster.Health, { value: monsterMatrix[2], baseValue: monsterMatrix[3] });
					}
					if (monsterMatrix[4] !== -999) {
						entity.add(Component.Monster.Attack, { value: monsterMatrix[4], baseValue: monsterMatrix[5] });
					}
					if (monsterMatrix[6] !== -999) {
						entity.add(Component.Monster.Speed, { value: monsterMatrix[6], baseValue: monsterMatrix[7] });
					}
					if (monsterMatrix[8] === 1) {
						entity.add(Component.Monster.Collection.RestingInCollection);
					}
					if (monsterMatrix[12] === 1) {
						entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat);
					}
					if (monsterMatrix[13] === 1) {
						entity.add(Component.Monster.Collection.ArchetypeCollectedMonster);
					}
					if (monsterMatrix[14] !== -999) {
						entity.add(Component.Monster.Combat.Energy, { value: monsterMatrix[14] });
					}
					if (monsterMatrix[15] === 1) {
						entity.add(Component.Monster.Combat.ActionReady);
					}
					if (monsterMatrix[16] === 0) {
						entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackEnemies' });
					} else if (monsterMatrix[16] === 1) {
						entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackFriend' });
					} else if (monsterMatrix[16] === 2) {
						entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackOther' });
					}
					if (monsterMatrix[9] !== -999 && monsterMatrix[10] !== -999 && monsterMatrix[11] !== -999) {
						entity.add(Component.Monster.Combat.Position, { value: { x: monsterMatrix[9], y: monsterMatrix[10], z: monsterMatrix[11] } });
					}
					if (monsterMatrix[17] !== -999) {
						entity.add(Component.Monster.Combat.FriendlyPosition, { value: monsterMatrix[17] });
					}
					if (monsterMatrix[18] !== -999) {
						entity.add(Component.Monster.Combat.EnemyPosition, { value: monsterMatrix[18] });
					}
					if (monsterMatrix[19] === 1) {
						entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
					}
					if (monsterMatrix[20] !== -999) {
						entity.add(Component.Monster.Combat.IncomingDamage, { value: monsterMatrix[20] });
					}
					if (monsterMatrix[21] === 1) {
						entity.add(Component.Monster.Combat.CombatDisabled);
					}
					if (monsterMatrix[22] === 1) {
						entity.add(Component.Monster.Combat.TriggerMoveFromWildIntoCombat);
					}
				}
			}
		}
	}
	return SaveGameSystem;
}
