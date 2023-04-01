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
// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';
// import '@babylonjs/loaders/glTF';
import titleScreenBackground from './titleScreenBackground';
interface ILoadingScreen {
	// What happens when loading starts
	displayLoadingUI: () => void;
	// What happens when loading stops
	hideLoadingUI: () => void;
	// default loader support. Optional!
	loadingUIBackgroundColor: string;
	loadingUIText: string;
}
class CustomLoadingScreen implements ILoadingScreen {
	// optional, but needed due to interface definitions
	public loadingUIBackgroundColor: string
	constructor (public loadingUIText: string) {
		this.loadingUIBackgroundColor = '#151729';
	}

	public displayLoadingUI () {
		// create a loading screen UI
		const loadingScreenDiv = document.createElement('div');
		loadingScreenDiv.style.width = '100%';
		loadingScreenDiv.style.height = '100%';
		loadingScreenDiv.style.backgroundColor = this.loadingUIBackgroundColor;
		loadingScreenDiv.style.color = 'white';
		loadingScreenDiv.style.position = 'absolute';
		loadingScreenDiv.style.top = '0';
		loadingScreenDiv.style.left = '0';
		loadingScreenDiv.style.display = 'flex';
		loadingScreenDiv.style.justifyContent = 'center';
		loadingScreenDiv.style.alignItems = 'center';
		loadingScreenDiv.style.zIndex = '1000';
		// loadingScreenDiv.innerHTML = this.loadingUIText;
		document.body.appendChild(loadingScreenDiv);
		// Give it the #loadingScreenDiv id
		loadingScreenDiv.id = 'loadingScreenDiv';
		// Use keyframes to fade in the loading screen
		// First, create a style element
		const style = document.createElement('style');
		style.innerHTML = `
			@keyframes fadeIn {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
				`;
		loadingScreenDiv.appendChild(style);
		loadingScreenDiv.style.animation = 'fadeIn 1s';
	}

	public hideLoadingUI () {
		// remove loading screen UI
		const loadingScreenDiv = document.querySelector('#loadingScreenDiv');
		if (loadingScreenDiv) {
			// First, transition the opacity to 0
			// Use keyframe animations
			// To do this, we need to create a style element
			const style = document.createElement('style');
			style.innerHTML = `
				@keyframes fadeOut {
					from {
						opacity: 1;
					}
					to {
						opacity: 0;
					}
				}
			`;
			loadingScreenDiv.appendChild(style);
			// @ts-expect-error - style is an element of loadingScreenDiv
			loadingScreenDiv.style.animation = 'fadeOut 1s';
			// When the animation is done, remove the element
			loadingScreenDiv.addEventListener('animationend', () => {
				if (loadingScreenDiv) {
					loadingScreenDiv.remove();
				}
			});
		}
	}
}

let canvas: OffscreenCanvas;
let context: OffscreenCanvasRenderingContext2D | null;
interface FontOffset {
	ascent: number
	height: number
	descent: number
}

const getFontOffset = (font: string): FontOffset => {
	if (!canvas || !context) {
		canvas = new OffscreenCanvas(64, 64);
		context = canvas.getContext('2d');
		if (!context) {
			throw new Error('2D context in offscreen not available!')
		}
	}

	context.font = font;
	context.textBaseline = 'alphabetic';
	const descent = context.measureText('Hg').actualBoundingBoxDescent;
	context.textBaseline = 'bottom';
	const ascent = context.measureText('Hg').actualBoundingBoxAscent;
	return { ascent, height: ascent + descent, descent };
}

const patchEngine = (engine: Engine) => {
	engine.getFontOffset = getFontOffset;
}

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
		this._navigationToLoad = navigationToLoad;
		this._rapierWorker = rapierWorker;
		this._canvas = canvas as HTMLCanvasElement;
		this._engine = new Engine(this._canvas, true);
		if (canvas instanceof OffscreenCanvas) {
			patchEngine(this._engine);
		}
		this._init();
	}

	private async _init (): Promise<void> {
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
		// Add resize listener
		window.addEventListener('resize', () => {
			this._engine.resize();
		});

		await this._goToStart();
		await this._main();
	}

	// eslint-disable-next-line require-await
	private async _main (): Promise<void> {
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

	private async _goToStart () {
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
		const createControl = (label: string, position: number, action?: (scene: Scene) => void) => {
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
				button.onPointerDownObservable.add(() => action(this._uiScene!));
			}
			mainMenuUI.addControl(button);
		}
		createControl('CONTINUE', -70, this._goToGame);
		createControl('NEW GAME', -35);
		createControl('LOAD GAME', 0);
		createControl('OPTIONS', 35);
		createControl('CREDITS', 70);
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
		this._activeScene = this._uiScene;
		this._engine.hideLoadingUI();
		this._setUpGame();
	}

	private async _setUpGame () {
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

	private async _goToGame (activeScene: Scene) {
		activeScene.removeCamera(activeScene.activeCameras![0]);
		console.log('go to game')
		this._gamescene = new Scene(this._engine);
		try { activeScene.detachControl() } catch (error) { }
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
			await this._goToGame(activeScene);
		}
		return Promise.resolve();
	}
}
