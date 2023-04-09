import { Scene } from '@babylonjs/core/scene';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Control } from '@babylonjs/gui/2D/controls/control';
import { System, type World } from '@lastolivegames/becsy';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createPixelCamera from './createPixelCamera';
import createUICamera from './createUICamera';
// ! Debugger
// import '@babylonjs/core/Debug/debugLayer';
// ! Inspector
// import '@babylonjs/inspector';
// import '@babylonjs/loaders/glTF';
import titleScreenBackground from './titleScreenBackground';
import { SavegameManager, Savegame, SaveSlot } from './saveGameManager';
import CustomLoadingScreen from './loadingScreen';
import patchEngine from './fixFont';
import createWorld from './ecs/startAllSystems';
// *** *** *** *** *** *** ***
// *** *** END IMPORTS *** ***
// *** *** *** *** *** *** ***

enum State { Preload = -1, Title = 0, Combat = 1, Collection = 2, Cutscene = 3 }
// eslint-disable-next-line import/prefer-default-export
export class Game {
	// *** *** *** *** *** *** ***
	// *** *** CLASS BEGIN *** ***
	// *** *** *** *** *** *** ***
	// General Entire Application
	private _activeScene: Scene | undefined;
	private _uiScene: Scene | undefined;
	private _canvas: HTMLCanvasElement | OffscreenCanvas;
	private _engine: Engine;
	private _rapierWorker: rapierWorkerType;
	private _navigationToLoad: string;
	private _savegame: Savegame;
	private _saveSlotNum: number;
	private _loadedSaveSlot: SaveSlot;

	// Game State Related
	private _state: State = State.Title;
	private _laststate: State = State.Preload;
	private _gamescene: Scene | undefined;
	private _world: World | undefined;
	private _systems: any | undefined;
	// private _cutscene: Scene;

	// *** *** *** *** *** *** ***
	// *** *** CONSTRUCTOR *** ***
	// *** *** *** *** *** *** ***

	constructor (canvas: HTMLCanvasElement | OffscreenCanvas,
		navigationToLoad: string, rapierWorker: rapierWorkerType) {
		this._savegame = this._loadSavegame()
		this._saveSlotNum = this._savegame.lastSaveSlot
		this._loadedSaveSlot = SavegameManager.loadSlot(this._saveSlotNum, this._savegame)
		this._navigationToLoad = navigationToLoad;
		this._rapierWorker = rapierWorker;
		this._canvas = canvas as HTMLCanvasElement;
		this._engine = new Engine(this._canvas, true);
		if (canvas instanceof OffscreenCanvas) {
			patchEngine(this._engine);
		}
		//* *for development: make inspector visible/invisible
		if (canvas instanceof HTMLCanvasElement) {
			window.addEventListener('keydown', (event_) => {
			// Shift+I
				if (event_.shiftKey && event_.key === 'I') {
					if (this._activeScene!.debugLayer.isVisible()) {
						this._activeScene!.debugLayer.hide();
					} else {
						this._activeScene!.debugLayer.show();
					}
				}
			});
		}
		this._init();
	}
	// *** *** *** *** *** *** ***
	// *** *** *** GAME *** *** ***
	// *** *** *** *** *** *** ***

	private _init = async (): Promise<void> => {
		const game = await this._setUpGame();
		const world = game.world;
		const systems = game.systems;
		this._world = world;
		this._systems = systems;
		this._saveCurrentSlot()
		// Add resize listener
		window.addEventListener('resize', () => {
			this._engine.resize();
		});
		window.addEventListener('gameStateChange', (event_) => {
			const { detail } = event_ as CustomEvent;
			this._state = detail.gameState;
		});
		window.addEventListener('save', (event) => {
			const detail: string = (event as CustomEvent).detail;
			this._loadedSaveSlot.saveData.systemsData = detail;
			this._saveCurrentSlot();
		});

		await this._goToStart();
		await this._main();
	}

	// eslint-disable-next-line require-await
	private _main = async (): Promise<void> => {
		this._engine.runRenderLoop(() => {
			if (this._activeScene) {
				try {
					this._activeScene.render();
				} catch (error) {
					console.error(error);
				}
			}
		});
		setInterval(() => {
			if (this._state !== this._laststate) {
				switch (this._state) {
					case State.Title:
						this._world?.control({
							stop: [
								this._systems.InputSystem,
								this._systems.MoveIntoCombatSystem,
								this._systems.EnergySystem,
								this._systems.ActionSystem,
								this._systems.PositionSystem,
								this._systems.DamageSystem,
								this._systems.CleanupCombatSceneSystem,
							],
							restart: []
						})
						break;
					case State.Combat:
						this._world?.control({
							stop: [],
							restart: [
								this._systems.InputSystem,
								this._systems.MoveIntoCombatSystem,
								this._systems.EnergySystem,
								this._systems.ActionSystem,
								this._systems.PositionSystem,
								this._systems.DamageSystem,
								this._systems.CleanupCombatSceneSystem,
							]
						})
						break;
					case State.Collection:
						this._world?.control({
							stop: [
								this._systems.InputSystem,
								this._systems.MoveIntoCombatSystem,
								this._systems.EnergySystem,
								this._systems.ActionSystem,
								this._systems.PositionSystem,
								this._systems.DamageSystem,
								this._systems.CleanupCombatSceneSystem,
							],
							restart: []
						})
						console.warn('Collection not implemented yet')
						break;
					case State.Cutscene:
						this._world?.control({
							stop: [
								this._systems.InputSystem,
								this._systems.MoveIntoCombatSystem,
								this._systems.EnergySystem,
								this._systems.ActionSystem,
								this._systems.PositionSystem,
								this._systems.DamageSystem,
								this._systems.CleanupCombatSceneSystem,
							],
							restart: []
						})
						console.warn('Cutscene not implemented yet')
						break;
					default:
						break;
				}
				this._laststate = this._state;
			}

			try {
				this._world!.execute();
			} catch (error) {
				console.error(error);
			}
		}, 1000 / 1);
	}

	private _goToStart = async () => {
		const loadingScreen = new CustomLoadingScreen('Loading...')
		this._engine.loadingScreen = loadingScreen;
		this._engine.loadingScreen.loadingUIBackgroundColor = '#151729';
		this._engine.displayLoadingUI();
		try { this._uiScene?.dispose(); } catch (error) { }
		this._uiScene = undefined;
		this._uiScene = new Scene(this._engine);
		const {	camera: gameCam,
			shadows: shadowGenerator } = await createPixelCamera(this._canvas,
			this._uiScene);
		titleScreenBackground(this._uiScene,
			this._rapierWorker, shadowGenerator);
		const UICam = createUICamera(this._canvas, this._uiScene);
		this._uiScene.activeCameras = [gameCam, UICam];
		const mainMenuUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		mainMenuUI.layer!.layerMask = 0x10000000;
		mainMenuUI.idealHeight = 720;
		// Create a game title text
		// It'll be big, bold, and white
		// Center it horizontally and place it middle-top of the screen
		const title = new TextBlock();
		title.text = 'Game Title';
		title.color = 'white';
		title.fontSize = 100;
		title.fontFamily = 'Viga';
		title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
		title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
		title.top = '100px';
		mainMenuUI.addControl(title);
		const createControl = (label: string,
			position: number, action?: () => void,
			disable?: boolean) => {
			const button = Button.CreateSimpleButton(
				label.toLocaleLowerCase.toString(),
				label);
			button.top = `${position}px`;
			button.fontFamily = 'Viga';
			button.width = 0.2
			button.height = '30px';
			button.color = 'white';
			button.cornerRadius = 20;
			button.thickness = 0;
			button.background = 'black';
			button.onPointerEnterObservable.add(() => {
				button.color = 'black';
				button.background = 'white';
			});
			button.onPointerOutObservable.add(() => {
				button.color = 'white';
				button.background = 'black';
			});
			if (action) {
				button.onPointerDownObservable.add(() => action());
			}
			if (disable) {
				button.isHitTestVisible = false;
				button.alpha = 0.5;
			}
			mainMenuUI.addControl(button);
		}
		const newGameBoo = () => {
			if (this._loadedSaveSlot.name !== 'Unnamed') {
				return false;
			}
			return true;
		}
		createControl('CONTINUE', -70, this._goToGame, newGameBoo());
		createControl('NEW GAME', -35, this._createNewSaveSlot);
		createControl('LOAD GAME', 0, this._promptForSlot, newGameBoo());
		createControl('OPTIONS', 35);
		createControl('CREDITS', 70);
		this._activeScene = this._uiScene;
		this._engine.hideLoadingUI();
	}

	private _setUpGame = async () => {
		this._gamescene = new Scene(this._engine);

		return await createWorld(this._gamescene,
			this._canvas, this._rapierWorker);
	}

	private _goToGame = async () => {
		const loadingScreen = new CustomLoadingScreen('Loading...')
		this._engine.loadingScreen = loadingScreen;
		// this._activeScene!.removeCamera(this._activeScene!.activeCameras![0]);
		console.log('go to game')
		// try { this._activeScene!.detachControl() } catch (error) { }
		if (this._gamescene) {
			await this._gamescene.whenReadyAsync();
			this._activeScene = this._gamescene;
			this._activeScene.attachControl();
			this._state = State.Combat;
			// INPUT
			// this._input = new PlayerInput(scene, this._ui);

			// Initialize game loop
			// await this._initializeGameAsync(scene);

			// When finished loading

			// Actions to complete once game loop is setup
			try { this._uiScene?.dispose(); } catch (error) { }
			this._uiScene = undefined;

		// this.game.play();
		} else {
			await this._setUpGame();
			// await this._gamescene!.whenReadyAsync();
			await this._goToGame();
		}
		this._engine.hideLoadingUI();
		return Promise.resolve();
	}

	// *** *** *** *** *** *** ***
	// *** SAVEGAME FUNCTIONS ***
	// *** *** *** *** *** *** ***
	private _createNewSave = () => {
		this._savegame = new SavegameManager('Unnamed');
		return SavegameManager.saveSlot(0, this._loadedSaveSlot, this._savegame);
	}

	private _createNewSaveSlot = () => {
		try {
			const saveSlots = Object.keys(this._savegame.saveSlot);
			if (saveSlots.length < 3) {
				const name = window.prompt('Enter a name for your new save slot');
				if (name) {
					let newSlotNumber: number;
					if (this._loadedSaveSlot.name === 'Unnamed') {
						newSlotNumber = this._saveSlotNum;
					} else {
						newSlotNumber = saveSlots.length;
					}
					this._savegame = SavegameManager.newSaveSlot(
						name ?? `Unnamed ${newSlotNumber}`,
						newSlotNumber,
						this._savegame,
					);
					this._saveSlotNum = newSlotNumber;
					const attemptToLoadSaveSlot = this._savegame.saveSlot[this._saveSlotNum];
					if (attemptToLoadSaveSlot) {
						this._loadedSaveSlot = attemptToLoadSaveSlot;
						this._saveCurrentSlot();
						window.alert('New save slot created.')
						this._goToStart();
					} else { window.alert('Save slot not created.') }
				} else {
					window.alert('Save slot not created.')
				}
			} else {
				window.alert(`You can only have three save slots at a time.
					Delete one to make room for a new one.`)
			}
		} catch (error) { console.log('could not create new saveslot') }
	}

	private _saveCurrentSlot = () => {
		try {
			SavegameManager.saveSlot(
				this._saveSlotNum, this._loadedSaveSlot, this._savegame);
		} catch (error) { console.log('could not savegame') }
	}

	private _loadSavegame = () => {
		try {
			this._savegame = SavegameManager.load() ?? this._createNewSave();
			this._loadSaveSlot(this._saveSlotNum);
			return this._savegame;
		} catch (error) { console.log('no savegame found'); return this._createNewSave() }
	}

	private _loadSaveSlot = (slotNumber?: number) => {
		try {
			this._saveSlotNum = slotNumber ?? this._savegame.lastSaveSlot;
			this._loadedSaveSlot = SavegameManager.loadSlot(this._saveSlotNum, this._savegame);
			return this._loadedSaveSlot;
		} catch (error) { console.log('could not load save slot'); return this._loadedSaveSlot }
	}

	private _promptForSlot = () => {
		try {
			const slotNumber = window.prompt('Enter the number of the slot you want to load');
			// If slotNumber is 1, 2, or 3, load that slot
			if (slotNumber && slotNumber.match(/^[1-3]$/)) {
				this._loadSaveSlot(parseInt(slotNumber) - 1);
				console.log(this._loadedSaveSlot)
			} else {
				window.alert('Invalid slot number.');
				this._promptForSlot();
			}
		} catch (error) { console.log('could not prompt for slot') }
	}
}
