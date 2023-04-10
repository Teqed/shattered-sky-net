
export interface SaveSlot {
	name: string
	saveData: {
		systemsData: string
	},
}

export interface Savegame {
	// Savegame will be JSON stringified and saved to local storage
	// So we can't have functions or classes in here
	// We can have references to classes, but they need to be serializable

	// Savegame player UID
	UID: string
	// Savegame version
	version: number
	// Savegame date
	dateCreated: string
	dateUpdated: string
	// Last loaded saveslot
	lastSaveSlot: number
	// Savegame data
	saveSlot: SaveSlot[],
}

export class SavegameManager implements Savegame {
	UID: string
	version: number
	dateCreated: string
	dateUpdated: string
	lastSaveSlot: number
	saveSlot: {
		name: string
		saveData: {
			systemsData: string
		},
	}[]

	constructor (name: string) {
		this.UID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		this.version = 1
		this.dateCreated = new Date().toISOString()
		this.dateUpdated = new Date().toISOString()
		this.lastSaveSlot = 0
		this.saveSlot = [{
			name,
			saveData: {
				systemsData: '',
			},
		}]
	}

	public static newSaveSlot (name: string, slotNumber: number, saveGame: Savegame, override?: boolean) {
		if (saveGame.saveSlot[slotNumber] && !override) {
			if (saveGame.saveSlot[slotNumber]!.name !== 'Unnamed') {
				const _override = window.confirm('Are you sure you want to override this slot?')
				if (_override) {
					console.log('Overriding save slot ' + slotNumber)
					SavegameManager.newSaveSlot(name, slotNumber, saveGame, _override)
				}
			} else {
				SavegameManager.newSaveSlot(name, slotNumber, saveGame, true)
			}
		} else {
			const newSave: SaveSlot = {
				name,
				saveData: {
					systemsData: '',
				},
			}
			saveGame.saveSlot[slotNumber] = newSave
			saveGame.lastSaveSlot = slotNumber
		}
		return SavegameManager.save(saveGame)
	}

	public static saveSlot (
		saveSlot: number,
		saveData: SaveSlot,
		saveGame: Savegame,
	) {
		saveGame.saveSlot[saveSlot] = saveData
		saveGame.lastSaveSlot = saveSlot
		SavegameManager.save(saveGame)
		return saveGame
	}

	public static loadSlot (saveSlot: number, saveGame: Savegame) {
		if (saveGame.saveSlot[saveSlot]) {
			saveGame.lastSaveSlot = saveSlot
			SavegameManager.save(saveGame)
			return saveGame.saveSlot[saveSlot]!
		}
		SavegameManager.newSaveSlot('Unnamed', saveSlot, saveGame)
		saveGame.lastSaveSlot = saveSlot
		SavegameManager.save(saveGame)
		return saveGame.saveSlot[saveSlot]!
	}

	public static save (save: Savegame) {
		try {
			save.dateUpdated = new Date().toISOString()
			localStorage.setItem('savegame', JSON.stringify(save));
			return save;
		} catch (error) {
			console.error('Could not save savegame', error);
		}
		return save;
	}

	public static load (): Savegame {
		try {
			const savegame = localStorage.getItem('savegame');
			if (savegame) {
				return JSON.parse(savegame)
			} else { console.warn('No savegame found') }
		} catch (error) { console.error('Could not load savegame', error) }
		return new SavegameManager('Unnamed')
	}
}
