
import { type Entity, system, System, type SystemGroup, type SystemType } from '@lastolivegames/becsy';
import reviveTypedArray from '@stdlib/array-reviver';
import typedarray2json from '@stdlib/array-to-json';
import parseJSON from '@stdlib/utils-parse-json';
import * as Component from '../../components/components';
import { Position } from '../../components/monster/combat';
export default (afterSystem: SystemGroup | SystemType<System>) => {
	enum EntityFlags {
		None = 0b0,
		UID = 1 << 0,
		Team = UID << 1,
		Health = Team << 1,
		Attack = Health << 1,
		Speed = Attack << 1,
		BaseStats = Speed << 1,
		CreateMe = BaseStats << 1,
		Party = CreateMe << 1,
		Wild = Party << 1,
		ArchetypeMonster = Wild << 1,
		RestingInCollection = ArchetypeMonster << 1,
		TriggerMoveFromCollectionIntoParty = RestingInCollection << 1,
		ArchetypeCollectedMonster = TriggerMoveFromCollectionIntoParty << 1,
		Energy = ArchetypeCollectedMonster << 1,
		ActionReady = Energy << 1,
		QueuedAction = ActionReady << 1,
		Position = QueuedAction << 1,
		ArchetypeCombatMonster = Position << 1,
		IncomingDamage = ArchetypeCombatMonster << 1,
		CombatDisabled = IncomingDamage << 1,
		TriggerMoveFromWildIntoCombat = CombatDisabled << 1,
		FriendlyPosition = TriggerMoveFromWildIntoCombat << 1,
		EnemyPosition = FriendlyPosition << 1, // 1 << 22
		// GameState = 1 << 23,
		// TriggerLoadSave = 1 << 24,
		// DesiredCutscene = 1 << 25,
	}
	enum Field {
		UID,
		Team,
		Health,
		Attack,
		Speed,
		BaseStats_health,
		BaseStats_attack,
		BaseStats_speed,
		Energy,
		QueuedAction,
		Position_x,
		Position_y,
		Position_z,
		IncomingDamage,
		FriendlyPosition,
		EnemyPosition,
		Flags = 31,
	}
	@system(s => s.after(afterSystem)) class SaveGameSystem extends System {
		private NarratorTriggerLoadSave = this.singleton.write(Component.Narrator.TriggerLoadSave);
		private entities = this.query(q => q.current
			.with(Component.UID)
			.usingAll.write);

		private _rawSaveArray: unknown[] = [];

		override initialize () {
			addEventListener('load', (event) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if ((event as any).detail.saveData.systemsData) {
					console.log('Loading the game!');
					this.NarratorTriggerLoadSave.triggerLoad = 1;
					// Fetch the savedata from event.detail.saveData
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const rawSaveJSON: string = (event as any).detail.saveData.systemsData as string;
					// Parse the JSON string into a JSON object
					const rawSaveArray = JSON.parse(rawSaveJSON);
					this._rawSaveArray = rawSaveArray;
					console.log(rawSaveArray);
				}
			});
		}

		override execute () {
			if (this.NarratorTriggerLoadSave.triggerLoad === 1) {
				this.NarratorTriggerLoadSave.triggerLoad = 0;
				// Remove all existing entities:
				for (const entity of this.entities.current) {
					entity.add(Component.ToBeDeleted);
					if (entity.has(Component.Monster.Combat.Position)) {
						entity.remove(Component.Monster.Combat.Position)
					}
				}
				const processedSaveArray = [];
				for (const entity of this._rawSaveArray) {
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
							value: monsterMatrix[Field.Health]});
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.Attack) {
						entity.add(Component.Monster.Attack, {
							value: monsterMatrix[Field.Attack]});
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.Speed) {
						entity.add(Component.Monster.Speed, {
							value: monsterMatrix[Field.Speed]});
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.BaseStats) {
						entity.add(Component.Monster.BaseStats, {
							health: monsterMatrix[Field.BaseStats_health],
							attack: monsterMatrix[Field.BaseStats_attack],
							speed: monsterMatrix[Field.BaseStats_speed],
						});
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.CreateMe) {
						entity.add(Component.Monster.CreateMe);
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.Party) {
						entity.add(Component.Monster.Party);
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.Wild) {
						entity.add(Component.Monster.Wild);
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.ArchetypeMonster) {
						entity.add(Component.Monster.ArchetypeMonster);
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.RestingInCollection) {
						entity.add(Component.Monster.Collection.RestingInCollection);
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.TriggerMoveFromCollectionIntoParty) {
						entity.add(Component.Monster.Collection.TriggerMoveFromCollectionIntoParty);
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
					if (monsterMatrix[Field.Flags] & EntityFlags.FriendlyPosition) {
						entity.add(Component.Monster.Combat.FriendlyPosition, { value: monsterMatrix[Field.FriendlyPosition] });
					}
					if (monsterMatrix[Field.Flags] & EntityFlags.EnemyPosition) {
						entity.add(Component.Monster.Combat.EnemyPosition, { value: monsterMatrix[Field.EnemyPosition] });
					}
				}
			}
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
						entityComponent[Field.Health] = Health.value;
						entityComponent[Field.Flags] += EntityFlags.Health;
					}
					if (entity.has(Component.Monster.Attack)) {
						const Attack = entity.read(Component.Monster.Attack);
						entityComponent[Field.Attack] = Attack.value;
						entityComponent[Field.Flags] += EntityFlags.Attack;
					}
					if (entity.has(Component.Monster.Speed)) {
						const Speed = entity.read(Component.Monster.Speed);
						entityComponent[Field.Speed] = Speed.value;
						entityComponent[Field.Flags] += EntityFlags.Speed;
					}
					if (entity.has(Component.Monster.BaseStats)) {
						const BaseStats = entity.read(Component.Monster.BaseStats);
						entityComponent[Field.BaseStats_health] = BaseStats.health;
						entityComponent[Field.BaseStats_attack] = BaseStats.attack;
						entityComponent[Field.BaseStats_speed] = BaseStats.speed;
						entityComponent[Field.Flags] += EntityFlags.BaseStats;
					}
					if (entity.has(Component.Monster.CreateMe)) {
						entityComponent[Field.Flags] += EntityFlags.CreateMe;
					}
					if (entity.has(Component.Monster.Party)) {
						entityComponent[Field.Flags] += EntityFlags.Party;
					}
					if (entity.has(Component.Monster.Wild)) {
						entityComponent[Field.Flags] += EntityFlags.Wild;
					}
					if (entity.has(Component.Monster.ArchetypeMonster)) {
						entityComponent[Field.Flags] += EntityFlags.ArchetypeMonster;
					}
					if (entity.has(Component.Monster.Collection.RestingInCollection)) {
						entityComponent[Field.Flags] += EntityFlags.RestingInCollection;
					}
					if (entity.has(Component.Monster.Collection.TriggerMoveFromCollectionIntoParty)) {
						entityComponent[Field.Flags] += EntityFlags.TriggerMoveFromCollectionIntoParty;
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
