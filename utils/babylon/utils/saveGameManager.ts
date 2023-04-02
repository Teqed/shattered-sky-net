
export interface SaveSlot {
	name: string
	saveData: {
		testData: number
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
			testData: number
		},
	}[]

	constructor (name: string) {
		this.UID = 'testID0000'
		this.version = 1
		this.dateCreated = new Date().toISOString()
		this.dateUpdated = new Date().toISOString()
		this.lastSaveSlot = 0
		this.saveSlot = [{
			name,
			saveData: {
				testData: 0,
			},
		}]
	}

	public static newSaveSlot (name: string, slotNumber: number, saveGame: Savegame, override?: boolean) {
		// If the slot already exists, check if we want to override it
		if (saveGame.saveSlot[slotNumber] && !override) {
			saveGame.saveSlot[slotNumber] = {
				name,
				saveData: {
					testData: 0,
				},
			}
			saveGame.lastSaveSlot = slotNumber
		} else {
			const _override = window.confirm('Are you sure you want to override this slot?')
			if (_override) {
				SavegameManager.newSaveSlot(name, slotNumber, saveGame, _override)
			}
		}
		return saveGame
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
		return saveGame.saveSlot[saveSlot]
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

	public static load (): Savegame | undefined {
		try {
			const savegame = localStorage.getItem('savegame');
			if (savegame) { return JSON.parse(savegame) }
		} catch (error) { console.error('Could not load savegame', error) }
		return undefined;
	}
}
