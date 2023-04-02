import { Scene } from '@babylonjs/core/scene';
// import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder';
// import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import '@babylonjs/core/Meshes/thinInstanceMesh';
// import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
// import { Mesh } from '@babylonjs/core/Meshes/mesh';
// import {
// 	createWorld,
// 	addEntity,
// 	removeEntity,
// 	Types,
// 	defineComponent,
// 	addComponent,
// 	removeComponent,
// 	hasComponent,
// 	defineQuery,
// 	Changed,
// 	Not,
// 	enterQuery,
// 	exitQuery,
// 	defineSerializer,
// 	defineDeserializer,
// 	pipe,
// } from 'bitecs'
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle } from '@babylonjs/gui';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Control } from '@babylonjs/gui/2D/controls/control';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
// import { setMatricesSize } from '../../nbody/everyFrame';
import createPixelCamera from './createPixelCamera';
import createUICamera from './createUICamera';
// ! Debugger
import '@babylonjs/core/Debug/debugLayer';
// ! Inspector
import '@babylonjs/inspector';
// import '@babylonjs/loaders/glTF';
import titleScreenBackground from './titleScreenBackground';
import { SavegameManager, Savegame, SaveSlot } from './saveGameManager';
import CustomLoadingScreen from './loadingScreen';
import patchEngine from './fixFont';

enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }
// eslint-disable-next-line import/prefer-default-export
export class Game {
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
	// public assets;
	// private _input: PlayerInput;
	// private _player: Player;
	// private _ui: Hud;
	// private _environment;

	// Sounds
	// public sfx: Sound;
	// public music: Sound;

	// Scene - related
	// private _objects: Mesh;
	private _state = 0;
	private _gamescene: Scene | undefined;
	// private _cutscene: Scene;

	// post process
	// private _transition: boolean = false;

	constructor (canvas: HTMLCanvasElement | OffscreenCanvas, navigationToLoad: string, rapierWorker: rapierWorkerType) {
		this._savegame = SavegameManager.load() ?? new SavegameManager('Unnamed')
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

	private _init = async (): Promise<void> => {
		// Add resize listener
		window.addEventListener('resize', () => {
			this._engine.resize();
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
	}

	private _goToStart = async () => {
		const loadingScreen = new CustomLoadingScreen('Loading...')
		this._engine.loadingScreen = loadingScreen;
		this._engine.loadingScreen.loadingUIBackgroundColor = '#151729';
		this._engine.displayLoadingUI();
		try { this._uiScene?.dispose(); } catch (error) { }
		this._uiScene = undefined;
		this._uiScene = new Scene(this._engine);
		const { camera: gameCam, shadows: shadowGenerator } = await createPixelCamera(this._canvas, this._uiScene);
		titleScreenBackground(this._uiScene, this._rapierWorker, shadowGenerator);
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
		const createControl = (label: string, position: number, action?: () => void) => {
			const button = Button.CreateSimpleButton(label.toLocaleLowerCase.toString(), label);
			// button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
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
			mainMenuUI.addControl(button);
		}
		createControl('CONTINUE', -70, this._goToGame);
		createControl('NEW GAME', -35, this._createNewSave);
		createControl('LOAD GAME', 0, this._loadSavegame);
		createControl('OPTIONS', 35);
		createControl('CREDITS', 70);
		this._activeScene = this._uiScene;
		this._engine.hideLoadingUI();
		this._setUpGame();
	}

	private _setUpGame = async () => {
		this._gamescene = new Scene(this._engine);
		const { camera: gameCam, shadows: shadowGenerator } = await createPixelCamera(this._canvas, this._gamescene);
		const UICam = createUICamera(this._canvas, this._gamescene);
		this._gamescene.activeCameras = [gameCam, UICam];
		// const objects = await initializeGame(this._scene, this._rapierWorker);
		// startEveryFrame(this._scene, objects, this._rapierWorker);
		const world = await this._rapierWorker.startPhysics();
		world.gravity = { x: 0, y: -9.81, z: 0 };

		// SOUNDS
		// this._loadSounds(scene);

		// CREATE ENVIRONMENT
		// const environment = new Environment(scene);
		// this._environment = environment;
		// Load environment and character assets
		// await this._environment.load();
		// await this._loadCharacterAssets(scene);

		// Create the player
		// this._player = new Player(this.assets, scene, shadowGenerator);

		// GAME LOOP
		// scene.onBeforeRenderObservable.add(() => {
		// 	// Loop
		// });
		// resolve promise
		return Promise.resolve();
	}

	private _goToGame = async () => {
		this._activeScene!.removeCamera(this._activeScene!.activeCameras![0]);
		console.log('go to game')
		this._gamescene = new Scene(this._engine);
		try { this._activeScene!.detachControl() } catch (error) { }
		if (this._gamescene) {
			// INPUT
			// this._input = new PlayerInput(scene, this._ui);

			// Initialize game loop
			// await this._initializeGameAsync(scene);

			// When finished loading
			await this._gamescene.whenReadyAsync();

			// Actions to complete once game loop is setup
			// this._activeScene.dispose();
			this._state = State.GAME;
			this._activeScene = this._gamescene;
			// this._engine.hideLoadingUI();
			this._activeScene.attachControl();

			this._uiScene = undefined;
			console.log(this._uiScene)

		// this.game.play();
		} else {
			await this._setUpGame();
			// await this._gamescene!.whenReadyAsync();
			await this._goToGame();
		}
		return Promise.resolve();
	}

	private _createNewSave = () => {
		this._savegame = new SavegameManager('Unnamed');
		return SavegameManager.saveSlot(0, this._loadedSaveSlot, this._savegame);
	}

	private _createNewSaveSlot = () => {
		try {
			// Find out how many slots our save has
			// If it's less than three, we can make a new one
			// Otherwise, we can't
			const saveSlots = Object.keys(this._savegame.saveSlot);
			if (saveSlots.length < 3) {
				const newSlotNumber = saveSlots.length + 1;
				this._saveSlotNum = newSlotNumber;
				this._loadedSaveSlot = this._savegame.saveSlot[newSlotNumber];
				this._savegame = SavegameManager.newSaveSlot(
					`Unnamed ${newSlotNumber}`,
					newSlotNumber,
					this._savegame,
				);
				this._saveCurrentSlot();
			} else {
				window.alert('You can only have three save slots at a time. Delete one to make room for a new one.')
			}
		} catch (error) { console.log('could not create new saveslot') }
	}

	private _saveCurrentSlot = () => {
		try {
			SavegameManager.saveSlot(this._saveSlotNum, this._loadedSaveSlot, this._savegame);
		} catch (error) { console.log('could not savegame') }
	}

	private _loadSavegame = () => {
		try {
			this._savegame = SavegameManager.load() ?? this._createNewSave();
			this._loadSaveSlot(this._saveSlotNum);
		} catch (error) { console.log('no savegame found') }
	}

	private _loadSaveSlot = (slotNumber?: number) => {
		try {
			this._saveSlotNum = slotNumber ?? this._savegame.lastSaveSlot;
			this._loadedSaveSlot = SavegameManager.loadSlot(this._saveSlotNum, this._savegame);
			return this._loadedSaveSlot;
		} catch (error) { console.log('no saveslot found') }
	}
}
