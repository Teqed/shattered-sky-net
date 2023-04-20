
import { system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import reviveTypedArray from '@stdlib/array-reviver';
import typedarray2json from '@stdlib/array-to-json';
import parseJSON from '@stdlib/utils-parse-json';
import * as Component from '../../components/components';
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
	enum Field {
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
		private NarratorTriggerLoadSave = this.singleton.write(Component.Narrator.TriggerLoadSave);
		private entities = this.query(q => q.current
			.with(Component.UID)
			.usingAll.write);

		override initialize () {
			addEventListener('load', (event) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if (this.NarratorTriggerLoadSave.triggerLoad === 1 && (event as any).detail.saveData.systemsData) {
					console.log('Loading the game!');
					this.NarratorTriggerLoadSave.triggerLoad = 0;
					// Remove all existing entities:
					for (const entity of this.entities.current) {
						entity.delete();
					}
					// Fake monster data:
					// eslint-disable-next-line max-len
					// const rawSaveJSON = '[{"type":"Float32Array","data":[-557805056,0,100,100,10,10,58.224464416503906,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[1625659008,1,100,100,10,10,58.538734436035156,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-144126112,0,100,100,10,10,45.34804153442383,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[-153578352,1,100,100,10,10,25.538976669311523,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-398403424,0,100,100,10,10,33.215694427490234,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[-1802108288,1,100,100,10,10,73.60997009277344,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-481368320,0,100,100,10,10,91.65564727783203,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[216954432,1,100,100,10,10,5.698422908782959,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]},{"type":"Float32Array","data":[-620746112,0,100,100,10,10,91.97325897216797,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911]},{"type":"Float32Array","data":[-8960669,1,100,100,10,10,59.7160530090332,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,264735]}]';
					// Fetch the savedata from event.detail.saveData
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const rawSaveJSON: string = (event as any).detail.saveData.systemsData as string;
					// Parse the JSON string into a JSON object
					const rawSaveArray = JSON.parse(rawSaveJSON);
					console.log(rawSaveArray);
					const processedSaveArray = [];
					for (const entity of rawSaveArray) {
						const entityData = parseJSON(JSON.stringify(entity), reviveTypedArray);
						processedSaveArray.push(entityData);
					}
					console.log(processedSaveArray);
					for (const monsterMatrix of processedSaveArray) {
					// Create the entity
						const entity = this.createEntity();
						// Add the components
						entity.add(Component.UID, { value: monsterMatrix[Field.UID] });
						switch (monsterMatrix[Field.Team]) {
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
						if (monsterMatrix[Field.Flags] & EntityFlags.Health) {
							entity.add(Component.Monster.Health, {
								value: monsterMatrix[Field.Health_value]});
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.Attack) {
							entity.add(Component.Monster.Attack, {
								value: monsterMatrix[Field.Attack_value]});
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.Speed) {
							entity.add(Component.Monster.Speed, {
								value: monsterMatrix[Field.Speed_value]});
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.RestingInCollection) {
							entity.add(Component.Monster.Collection.RestingInCollection);
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.TriggerMoveFromCollectionIntoCombat) {
							entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat);
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.ArchetypeCollectedMonster) {
							entity.add(Component.Monster.Collection.ArchetypeCollectedMonster);
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.Energy) {
							entity.add(Component.Monster.Combat.Energy, { value: monsterMatrix[Field.Energy] });
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.ActionReady) {
							entity.add(Component.Monster.Combat.ActionReady);
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.QueuedAction) {
							switch (monsterMatrix[Field.QueuedAction]) {
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
						if (monsterMatrix[Field.Flags] & EntityFlags.Position) {
							entity.add(Component.Monster.Combat.Position, {
								value: {
									x: monsterMatrix[Field.Position_x],
									y: monsterMatrix[Field.Position_y],
									z: monsterMatrix[Field.Position_z] } });
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.FriendlyPosition) {
							entity.add(Component.Monster.Combat.FriendlyPosition, { value: monsterMatrix[Field.FriendlyPosition] });
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.EnemyPosition) {
							entity.add(Component.Monster.Combat.EnemyPosition, { value: monsterMatrix[Field.EnemyPosition] });
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.ArchetypeCombatMonster) {
							entity.add(Component.Monster.Combat.ArchetypeCombatMonster);
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.IncomingDamage) {
							entity.add(Component.Monster.Combat.IncomingDamage, { value: monsterMatrix[Field.IncomingDamage] });
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.CombatDisabled) {
							entity.add(Component.Monster.Combat.CombatDisabled);
						}
						if (monsterMatrix[Field.Flags] & EntityFlags.TriggerMoveFromWildIntoCombat) {
							entity.add(Component.Monster.Combat.TriggerMoveFromWildIntoCombat);
						}
					}
				}
			});
		}

		override execute () {
			if (this.NarratorTriggerLoadSave.triggerSave === 1) {
				console.log('Saving the game!');
				this.NarratorTriggerLoadSave.triggerSave = 0;
				const entitiesArray = [];
				for (const entity of this.entities.current) {
					const entityComponent = new Float32Array(32);
					entityComponent[Field.Flags] = EntityFlags.None;
					if (entity.has(Component.UID)) {
						const UID = entity.read(Component.UID);
						entityComponent[Field.UID] = UID.value;
						entityComponent[Field.Flags] += EntityFlags.UID;
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
						entityComponent[Field.Team] = TeamValue;
						entityComponent[Field.Flags] += EntityFlags.Team;
					}
					if (entity.has(Component.Monster.Health)) {
						const Health = entity.read(Component.Monster.Health);
						entityComponent[Field.Health_value] = Health.value;
						entityComponent[Field.Flags] += EntityFlags.Health;
					}
					if (entity.has(Component.Monster.Attack)) {
						const Attack = entity.read(Component.Monster.Attack);
						entityComponent[Field.Attack_value] = Attack.value;
						entityComponent[Field.Flags] += EntityFlags.Attack;
					}
					if (entity.has(Component.Monster.Speed)) {
						const Speed = entity.read(Component.Monster.Speed);
						entityComponent[Field.Speed_value] = Speed.value;
						entityComponent[Field.Flags] += EntityFlags.Speed;
					}
					if (entity.has(Component.Monster.Collection.RestingInCollection)) {
						entityComponent[Field.Flags] += EntityFlags.RestingInCollection;
					}
					if (entity.has(Component.Monster.Collection.TriggerMoveFromCollectionIntoCombat)) {
						entityComponent[Field.Flags] += EntityFlags.TriggerMoveFromCollectionIntoCombat;
					}
					if (entity.has(Component.Monster.Collection.ArchetypeCollectedMonster)) {
						entityComponent[Field.Flags] += EntityFlags.ArchetypeCollectedMonster;
					}
					if (entity.has(Component.Monster.Combat.Energy)) {
						const Energy = entity.read(Component.Monster.Combat.Energy);
						entityComponent[Field.Energy] = Energy.value;
						entityComponent[Field.Flags] += EntityFlags.Energy;
					}
					if (entity.has(Component.Monster.Combat.ActionReady)) {
						entityComponent[Field.Flags] += EntityFlags.ActionReady;
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
						entityComponent[Field.QueuedAction] = QueuedActionValue;
						entityComponent[Field.Flags] += EntityFlags.QueuedAction;
					}
					if (entity.has(Component.Monster.Combat.Position)) {
						const Position = entity.read(Component.Monster.Combat.Position);
						entityComponent[Field.Position_x] = Position.value.x;
						entityComponent[Field.Position_y] = Position.value.y;
						entityComponent[Field.Position_z] = Position.value.z;
						entityComponent[Field.Flags] += EntityFlags.Position;
					}
					if (entity.has(Component.Monster.Combat.FriendlyPosition)) {
						const FriendlyPosition = entity.read(Component.Monster.Combat.FriendlyPosition);
						entityComponent[Field.FriendlyPosition] = FriendlyPosition.value;
						entityComponent[Field.Flags] += EntityFlags.FriendlyPosition;
					}
					if (entity.has(Component.Monster.Combat.EnemyPosition)) {
						const EnemyPosition = entity.read(Component.Monster.Combat.EnemyPosition);
						entityComponent[Field.EnemyPosition] = EnemyPosition.value;
						entityComponent[Field.Flags] += EntityFlags.EnemyPosition;
					}
					if (entity.has(Component.Monster.Combat.ArchetypeCombatMonster)) {
						entityComponent[Field.Flags] += EntityFlags.ArchetypeCombatMonster;
					}
					if (entity.has(Component.Monster.Combat.IncomingDamage)) {
						const IncomingDamage = entity.read(Component.Monster.Combat.IncomingDamage);
						entityComponent[Field.IncomingDamage] = IncomingDamage.value;
						entityComponent[Field.Flags] += EntityFlags.IncomingDamage;
					}
					if (entity.has(Component.Monster.Combat.CombatDisabled)) {
						entityComponent[Field.Flags] += EntityFlags.CombatDisabled;
					}
					if (entity.has(Component.Monster.Combat.TriggerMoveFromWildIntoCombat)) {
						entityComponent[Field.Flags] += EntityFlags.TriggerMoveFromWildIntoCombat;
					}
					entitiesArray.push(entityComponent);
				}
				// console.log(entitiesArray); // *** Might be useful for debugging?
				let entitiesString = '[';
				for (const entity of entitiesArray) {
					const entityJSONRepresentation = typedarray2json(entity);
					const entityJSON = JSON.stringify(entityJSONRepresentation);
					entitiesString += entityJSON + ',';
				}
				entitiesString = entitiesString.slice(0, -1); // remove the last comma
				entitiesString += ']';
				// Send event to the game to save the data:
				const saveEvent = new CustomEvent('save', { detail: entitiesString });
				window.dispatchEvent(saveEvent);
			}
		}
	}
	return SaveGameSystem;
}
