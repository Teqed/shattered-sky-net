import { Scene } from '@babylonjs/core/scene';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { AdvancedDynamicTexture, Button, TextBlock } from '@babylonjs/gui';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Control } from '@babylonjs/gui/2D/controls/control';
import { type World } from '@lastolivegames/becsy';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createPixelCamera from './createPixelCamera';
import createUICamera from './createUICamera';
// ! Debugger
import '@babylonjs/core/Debug/debugLayer';
// ! Inspector
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import titleScreenBackground from './titleScreenBackground';
import { SavegameManager, Savegame, SaveSlot } from './saveGameManager';
import CustomLoadingScreen from './loadingScreen';
import patchEngine from './fixFont';
import createWorld from './ecs/startAllSystems';
import { State, type SystemLoop } from './utilityTypes';
import * as Component from './ecs/components/components';
// *** *** *** *** *** *** ***
// *** *** END IMPORTS *** ***
// *** *** *** *** *** *** ***

// eslint-disable-next-line import/prefer-default-export
export class Game {
	// *** *** *** *** *** *** ***
	// *** *** CLASS BEGIN *** ***
	// *** *** *** *** *** *** ***
	// General Entire Application
	private _activeScene: Scene | undefined; // The active scene is the scene that is currently being rendered.
	private _titleScene: Scene | undefined; // The title scene does not use ECS, so it can load first. We might also use it when changing the gamescene.
	private _canvas: HTMLCanvasElement | OffscreenCanvas; // The canvas is the HTML element that is used to render the scene.
	private _engine: Engine; // The engine is the BabylonJS engine that is used to render the scene.
	private _rapierWorker: rapierWorkerType; // The rapier worker is the web worker that is used to run the physics simulation.
	private _navigationToLoad: string; // The navigation to load is sometimes provided by the URL. Not yet implemented.
	private _savegame: Savegame; // The savegame is the savegame that is loaded from local storage.
	private _saveSlotNum: number; // The save slot number is the number of the save slot that is currently loaded.
	private _loadedSaveSlot: SaveSlot; // The loaded save slot is the save slot data that is currently loaded.

	// Game State Related
	private _state: State = State.Title; // The state is the current state of the game.
	private _laststate: State = State.Preload; // The last state is the previous state of the game. We use this to determine if we need to do any cleanup.
	private _gamescene: Scene | undefined; // The gamescene is our main scene. It uses ECS heavily.
	private _world: World | undefined; // The world is the ECS world that is used to manage the game entities.
	private _systems: SystemLoop | undefined; // The systems are the ECS systems that are used to manage the game entities.
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
		this._init();
	}
	// *** *** *** *** *** *** ***
	// *** *** *** GAME *** *** ***
	// *** *** *** *** *** *** ***

	private _init = async (): Promise<void> => {
		if (this._canvas instanceof OffscreenCanvas) {
			patchEngine(this._engine);
		}
		//* *for development: make inspector visible/invisible
		if (this._canvas instanceof HTMLCanvasElement) {
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
		window.addEventListener('resize', () => {
			this._engine.resize();
		});
		window.addEventListener('gameStateChange', (event_) => {
			const { detail } = event_ as CustomEvent;
			this._state = detail.gameState;
			// if (this._state === State.Title) {
			// 	this._setUpGame();
			// }
		});
		window.addEventListener('save', (event) => {
			const detail: string = (event as CustomEvent).detail;
			this._loadedSaveSlot.saveData.systemsData = detail;
			this._saveCurrentSlot();
		});

		await this._everyTick();
		// await this._goToTitle();
		const game = await this._setUpGame();
		const world = game.world;
		const systems = game.systems;
		this._world = world;
		this._systems = systems;
		this._saveCurrentSlot();
	}

	// eslint-disable-next-line require-await
	private _everyTick = async (): Promise<void> => {
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
			if (this._world) {
				try {
					if ((this._state !== this._laststate) && (this._systems)) {
						switch (this._state) {
							case State.Title:
								this._world.control({
									stop: [
										this._systems.GameStateSystem,
										this._systems.CutsceneSystem,
										this._systems.NoCombatSystem,
										this._systems.CombatNarratorSystem,
										this._systems.EnergySystem,
										this._systems.ActionSystem,
										this._systems.DamageSystem,
									],
									restart: []
								})
								this._goToTitle();
								break;
							case State.NoCombat:
								this._world.control({
									stop: [
										this._systems.CutsceneSystem,
										this._systems.CombatNarratorSystem,
										this._systems.EnergySystem,
										this._systems.ActionSystem,
										this._systems.DamageSystem,
									],
									restart: [
										this._systems.GameStateSystem,
										this._systems.NoCombatSystem,
									]
								})
								break;
							case State.Combat:
								this._world.control({
									stop: [
										this._systems.CutsceneSystem,
										this._systems.NoCombatSystem,
									],
									restart: [
										this._systems.GameStateSystem,
										this._systems.CombatNarratorSystem,
										this._systems.EnergySystem,
										this._systems.ActionSystem,
										this._systems.DamageSystem,
									]
								})
								break;
							case State.Collection:
								this._world.control({
									stop: [
										this._systems.CutsceneSystem,
										this._systems.NoCombatSystem,
										this._systems.CombatNarratorSystem,
										this._systems.EnergySystem,
										this._systems.ActionSystem,
										this._systems.DamageSystem,
									],
									restart: [
										this._systems.GameStateSystem,
									]
								})
								console.warn('Collection not implemented yet')
								break;
							case State.Cutscene:
								this._world.control({
									stop: [
										this._systems.NoCombatSystem,
										this._systems.CombatNarratorSystem,
										this._systems.EnergySystem,
										this._systems.ActionSystem,
										this._systems.DamageSystem,
									],
									restart: [
										this._systems.GameStateSystem,
										this._systems.CutsceneSystem,
									]
								})
								break;
							default:
								break;
						}
						this._laststate = this._state;
					}
				} catch (error) {
					console.error(error);
				}

				try {
					this._world.execute();
				} catch (error) {
					console.error(error);
				}
			}
		}, 1000 / 8);
	}

	private _showLoadingScreen = (message?: string, color?: string) => {
		this._engine.loadingScreen = new CustomLoadingScreen(message ?? 'Loading...');
		this._engine.loadingScreen.loadingUIBackgroundColor = color ?? '#151729';
		this._engine.displayLoadingUI();
	}

	private _removeLoadingScreen = () => {
		this._engine.hideLoadingUI();
	}

	private _goToTitle = async () => {
		this._showLoadingScreen();
		try { this._titleScene?.dispose(); } catch (error) { }
		this._titleScene = undefined;
		this._titleScene = new Scene(this._engine);
		const {	camera: gameCam,
			shadows: shadowGenerator } = await createPixelCamera(this._canvas,
			this._titleScene, this._engine);
		titleScreenBackground(this._titleScene,
			this._rapierWorker, shadowGenerator);
		const UICam = createUICamera(this._canvas, this._titleScene);
		this._titleScene.activeCameras = [gameCam, UICam];
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
		this._activeScene = this._titleScene;
		this._removeLoadingScreen();
	}

	private _setUpGame = async () => {
		this._gamescene = new Scene(this._engine);
		// if (this._world) {
		// 	await this._world.terminate();
		// }

		return await createWorld(this._gamescene,
			this._canvas, this._rapierWorker);
	}

	private _goToGame = async () => {
		this._showLoadingScreen();
		// this._activeScene!.removeCamera(this._activeScene!.activeCameras![0]);
		console.log('go to game')
		this._loadSaveSlot();
		// try { this._activeScene!.detachControl() } catch (error) { }
		if (this._gamescene) {
			await this._gamescene.whenReadyAsync();
			this._activeScene = this._gamescene;
			this._activeScene.attachControl();
			this._state = State.NoCombat;
			try { this._titleScene?.dispose(); } catch (error) { }
			this._titleScene = undefined;
		} else {
			await this._setUpGame();
			await this._goToGame();
		}
		this._removeLoadingScreen();
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
						this._loadSaveSlot(this._saveSlotNum);
						this._saveCurrentSlot();
						window.alert('New save slot created.')
						this._goToTitle();
					} else { throw new Error('could not load new save slot') }
				} else {
					window.alert('Save slot not created. No name given.')
				}
			} else {
				window.alert('You can only have three save slots at a time. Delete one to make room for a new one.')
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
			dispatchEvent(new CustomEvent('load', { detail: this._loadedSaveSlot }));
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
