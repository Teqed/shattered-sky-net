
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import reviveTypedArray from '@stdlib/array-reviver';
import typedarray2json from '@stdlib/array-to-json';
import parseJSON from '@stdlib/utils-parse-json';
import * as Component from '../components/components';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	enum EntityFlags {
		None = 0b0,
		UID = 1 << 0,
		Team = 1 << 1,
		Health = 1 << 2,
		Attack = 1 << 3,
		Speed = 1 << 4,
		ArchetypeMonster = 1 << 5,
		RestingInCollection = 1 << 6,
		TriggerMoveFromCollectionIntoCombat = 1 << 7,
		ArchetypeCollectedMonster = 1 << 8,
		Energy = 1 << 9,
		ActionReady = 1 << 10,
		QueuedAction = 1 << 11,
		Position = 1 << 12,
		FriendlyPosition = 1 << 13,
		EnemyPosition = 1 << 14,
		ArchetypeCombatMonster = 1 << 15,
		IncomingDamage = 1 << 16,
		CombatDisabled = 1 << 17,
		TriggerMoveFromWildIntoCombat = 1 << 18,
	}
	enum EntityComponentFields {
		UID = 0,
		Team = 1,
		// Health
		Health_value = 2,
		Health_baseValue = 3,
		// Attack
		Attack_value = 4,
		Attack_baseValue = 5,
		// Speed
		Speed_value = 6,
		Speed_baseValue = 7,
		// Energy
		Energy = 8,
		// QueuedAction
		QueuedAction = 9,
		// Position
		Position_x = 10,
		Position_y = 11,
		Position_z = 12,
		// FriendlyPosition
		FriendlyPosition = 13,
		// EnemyPosition
		EnemyPosition = 14,
		// IncomingDamage
		IncomingDamage = 15,
		// Bitwise flags
		Flags = 31,
	}
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
				const monstersArray = [];
				for (const entity of this.monsters.current) {
					const monsterMatrix = new Float32Array(32);
					monsterMatrix[EntityComponentFields.Flags] = EntityFlags.None;
					// For each component the entity has...
					if (entity.has(Component.UID)) {
						const UID = entity.read(Component.UID);
						monsterMatrix[EntityComponentFields.UID] = UID.value;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.UID;
					}
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
						monsterMatrix[EntityComponentFields.Team] = TeamValue;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.Team;
					}
					if (entity.has(Component.Monster.Health)) {
						const Health = entity.read(Component.Monster.Health);
						monsterMatrix[EntityComponentFields.Health_value] = Health.value;
						monsterMatrix[EntityComponentFields.Health_baseValue] = Health.baseValue;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.Health;
					}
					if (entity.has(Component.Monster.Attack)) {
						const Attack = entity.read(Component.Monster.Attack);
						monsterMatrix[EntityComponentFields.Attack_value] = Attack.value;
						monsterMatrix[EntityComponentFields.Attack_baseValue] = Attack.baseValue;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.Attack;
					}
					if (entity.has(Component.Monster.Speed)) {
						const Speed = entity.read(Component.Monster.Speed);
						monsterMatrix[EntityComponentFields.Speed_value] = Speed.value;
						monsterMatrix[EntityComponentFields.Speed_baseValue] = Speed.baseValue;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.Speed;
					}
					if (entity.has(Component.Monster.Collection.RestingInCollection)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.RestingInCollection;
					}
					if (entity.has(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.TriggerMoveFromCollectionIntoCombat;
					}
					if (entity.has(Component.Monster.Collection.ArchetypeCollectedMonster)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.ArchetypeCollectedMonster;
					}
					if (entity.has(Component.Monster.Combat.Energy)) {
						const Energy = entity.read(Component.Monster.Combat.Energy);
						monsterMatrix[EntityComponentFields.Energy] = Energy.value;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.Energy;
					}
					if (entity.has(Component.Monster.Combat.ActionReady)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.ActionReady;
					}
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
						monsterMatrix[EntityComponentFields.QueuedAction] = QueuedActionValue;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.QueuedAction;
					}
					if (entity.has(Component.Monster.Combat.Position)) {
						const Position = entity.read(Component.Monster.Combat.Position);
						monsterMatrix[EntityComponentFields.Position_x] = Position.value.x;
						monsterMatrix[EntityComponentFields.Position_y] = Position.value.y;
						monsterMatrix[EntityComponentFields.Position_z] = Position.value.z;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.Position;
					}
					if (entity.has(Component.Monster.Combat.FriendlyPosition)) {
						const FriendlyPosition = entity.read(Component.Monster.Combat.FriendlyPosition);
						monsterMatrix[EntityComponentFields.FriendlyPosition] = FriendlyPosition.value;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.FriendlyPosition;
					}
					if (entity.has(Component.Monster.Combat.EnemyPosition)) {
						const EnemyPosition = entity.read(Component.Monster.Combat.EnemyPosition);
						monsterMatrix[EntityComponentFields.EnemyPosition] = EnemyPosition.value;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.EnemyPosition;
					}
					if (entity.has(Component.Monster.Combat.ArchetypeCombatMonster)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.ArchetypeCombatMonster;
					}
					if (entity.has(Component.Monster.Combat.IncomingDamage)) {
						const IncomingDamage = entity.read(Component.Monster.Combat.IncomingDamage);
						monsterMatrix[EntityComponentFields.IncomingDamage] = IncomingDamage.value;
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.IncomingDamage;
					}
					if (entity.has(Component.Monster.Combat.CombatDisabled)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.CombatDisabled;
					}
					if (entity.has(Component.Monster.Combat.TriggerMoveFromWildIntoCombat)) {
						monsterMatrix[EntityComponentFields.Flags] += EntityFlags.TriggerMoveFromWildIntoCombat;
					}
					monstersArray.push(monsterMatrix);
				}
				// console.log(monstersArray); // *** Might be useful for debugging?
				let monstersJSON = '[';
				for (const monster of monstersArray) {
					const monsterJSONRepresentation = typedarray2json(monster);
					const monsterJSON = JSON.stringify(monsterJSONRepresentation);
					monstersJSON += monsterJSON + ',';
				}
				monstersJSON = monstersJSON.slice(0, -1); // remove the last comma
				monstersJSON += ']';
				// Send event to the game to save the data:
				const saveEvent = new CustomEvent('save', { detail: monstersJSON });
				window.dispatchEvent(saveEvent);
			}
			if (this.global.triggerLoad === 1) {
				console.log('Loading the game!');
				this.global.triggerLoad = 0;
				// Remove all existing entities:
				for (const entity of this.monsters.current) {
					entity.delete();
				}
				// Fake monster data:
				// eslint-disable-next-line max-len
				const rawSaveJSON = '[{"type":"Float32Array","data":[-557805056,0,100,100,10,10,58.224464416503906,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[1625659008,1,100,100,10,10,58.538734436035156,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-144126112,0,100,100,10,10,45.34804153442383,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[-153578352,1,100,100,10,10,25.538976669311523,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-398403424,0,100,100,10,10,33.215694427490234,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[-1802108288,1,100,100,10,10,73.60997009277344,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-481368320,0,100,100,10,10,91.65564727783203,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[216954432,1,100,100,10,10,5.698422908782959,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-620746112,0,100,100,10,10,91.97325897216797,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[-8960669,1,100,100,10,10,59.7160530090332,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]}]';
				// Parse the JSON string into a JSON object
				const rawSaveArray = JSON.parse(rawSaveJSON);
				console.log(rawSaveArray);
				const processedSaveArray = [];
				for (const monster of rawSaveArray) {
					const monsterMatrix = parseJSON(JSON.stringify(monster), reviveTypedArray);
					processedSaveArray.push(monsterMatrix);
				}
				console.log(processedSaveArray);
				for (const monsterMatrix of processedSaveArray) {
					// Create the entity
					const entity = this.createEntity();
					// Add the components
					entity.add(Component.UID, { value: monsterMatrix[EntityComponentFields.UID] });
					switch (monsterMatrix[EntityComponentFields.Team]) {
						case 0:
							entity.add(Component.Monster.Team, { value: 'Friend' });
							break;
						case 1:
							entity.add(Component.Monster.Team, { value: 'Foe' });
							break;
						case 2:
							entity.add(Component.Monster.Team, { value: 'Other' });
							break;
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.Health) {
						entity.add(Component.Monster.Health, {
							value: monsterMatrix[EntityComponentFields.Health_value],
							baseValue: monsterMatrix[EntityComponentFields.Health_baseValue] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.Attack) {
						entity.add(Component.Monster.Attack, {
							value: monsterMatrix[EntityComponentFields.Attack_value],
							baseValue: monsterMatrix[EntityComponentFields.Attack_baseValue] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.Speed) {
						entity.add(Component.Monster.Speed, {
							value: monsterMatrix[EntityComponentFields.Speed_value],
							baseValue: monsterMatrix[EntityComponentFields.Speed_baseValue] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.RestingInCollection) {
						entity.add(Component.Monster.Collection.RestingInCollection);
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.TriggerMoveFromCollectionIntoCombat) {
						entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat);
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.ArchetypeCollectedMonster) {
						entity.add(Component.Monster.Collection.ArchetypeCollectedMonster);
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.Energy) {
						entity.add(Component.Monster.Combat.Energy, { value: monsterMatrix[EntityComponentFields.Energy] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.ActionReady) {
						entity.add(Component.Monster.Combat.ActionReady);
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.QueuedAction) {
						switch (monsterMatrix[EntityComponentFields.QueuedAction]) {
							case 0:
								entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackEnemies' });
								break;
							case 1:
								entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackFriend' });
								break;
							case 2:
								entity.add(Component.Monster.Combat.QueuedAction, { value: 'AttackOther' });
								break;
						}
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.Position) {
						entity.add(Component.Monster.Combat.Position, {
							value: {
								x: monsterMatrix[EntityComponentFields.Position_x],
								y: monsterMatrix[EntityComponentFields.Position_y],
								z: monsterMatrix[EntityComponentFields.Position_z] } });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.FriendlyPosition) {
						entity.add(Component.Monster.Combat.FriendlyPosition, { value: monsterMatrix[EntityComponentFields.FriendlyPosition] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.EnemyPosition) {
						entity.add(Component.Monster.Combat.EnemyPosition, { value: monsterMatrix[EntityComponentFields.EnemyPosition] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.ArchetypeCombatMonster) {
						entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.IncomingDamage) {
						entity.add(Component.Monster.Combat.IncomingDamage, { value: monsterMatrix[EntityComponentFields.IncomingDamage] });
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.CombatDisabled) {
						entity.add(Component.Monster.Combat.CombatDisabled);
					}
					if (monsterMatrix[EntityComponentFields.Flags] & EntityFlags.TriggerMoveFromWildIntoCombat) {
						entity.add(Component.Monster.Combat.TriggerMoveFromWildIntoCombat);
					}
				}
			}
		}
	}
	return SaveGameSystem;
}
