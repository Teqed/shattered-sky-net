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
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
// import { setMatricesSize } from '../../nbody/everyFrame';
import createPixelCamera from './createPixelCamera';
// import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';

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

const createGoblin = (scene: Scene, rapierWorker: rapierWorkerType) => {
	// Create a ground, and place a box on it
	// Create a rapier physics body too
	const ground = MeshBuilder.CreateBox('ground', { width: 10, height: 0.1, depth: 10 }, scene);
	ground.position.y = -1;
	// ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
	// ground.physicsImpostor.physicsBody.setFriction(0.5);
	// ground.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// ground.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// ground.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Static);
	// ground.physicsImpostor.physicsBody.setGravityEnabled(false);
	// ground.physicsImpostor.physicsBody.setActive(false);
	// ground.physicsImpostor.physicsBody.setCanSleep(false);

	const box = MeshBuilder.CreateBox('box', { width: 1, height: 1, depth: 1 }, scene);
	box.position.y = 5;
	// box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
	// box.physicsImpostor.physicsBody.setFriction(0.5);
	// box.physicsImpostor.physicsBody.setAngularDamping(0.5);
	// box.physicsImpostor.physicsBody.setLinearDamping(0.5);
	// box.physicsImpostor.physicsBody.setRigidBodyType(RigidBodyType.Dynamic);
	// box.physicsImpostor.physicsBody.setGravityEnabled(true);
	// box.physicsImpostor.physicsBody.setActive(true);
	// box.physicsImpostor.physicsBody.setCanSleep(true);

	const newBody = {
		meshId: 1,
		p: {
			x: box.position.x,
			y: box.position.y,
			z: box.position.z,
		},
		r: {
			x: 0,
			y: 0,
			z: 0,
			w: 0,
		},
		mass: 1,
		size: 1,
	}
	// rapierWorker.newBody(newBody)
}

enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }
// eslint-disable-next-line import/prefer-default-export
export class Game {
	// General Entire Application
	private _scene: Scene;
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
	private _gamescene: Scene;
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
		this._scene = new Scene(this._engine);
		// this._gamescene = new Scene(this._engine);
		this._init();
	}

	private async _init (): Promise<void> {
		//* *for development: make inspector visible/invisible
		if (canvas instanceof HTMLCanvasElement) {
			window.addEventListener('keydown', (event_) => {
			// Shift+I
				if (event_.shiftKey && event_.key === 'I') {
					if (this._scene.debugLayer.isVisible()) {
						this._scene.debugLayer.hide();
					} else {
						this._scene.debugLayer.show();
					}
				}
			});
		}

		await this._main();
	}

	private async _main (): Promise<void> {
		await this._goToStart();

		this._engine.runRenderLoop(() => {
			switch (this._state) {
				case State.START:
					this._scene.render();
					break;
				case State.CUTSCENE:
					this._scene.render();
					break;
				case State.GAME:
					// if 240seconds/ 4mins have have passed, go to the lose state
					// if (this._ui.time >= 240 && !this._player.win) {
					// 	this._goToLose();
					// 	this._ui.stopTimer();
					// }
					// if (this._ui.quit) {
					// 	this._goToStart();
					// 	this._ui.quit = false;
					// }
					this._scene.render();
					break;
				case State.LOSE:
					this._scene.render();
					break;
				default: break;
			}
		});
	}

	private async _goToStart () {
		const scene = this._gamescene;
		await this._initializeGameAsync(scene);
		const winUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		winUI.idealHeight = 720;
		const mainMenu = Button.CreateSimpleButton('mainmenu', 'NEW GAME');
		// mainMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		mainMenu.fontFamily = 'Viga';
		mainMenu.width = 0.2
		mainMenu.height = '40px';
		mainMenu.color = 'white';
		mainMenu.cornerRadius = 20;
		mainMenu.onPointerEnterObservable.add(() => {
			mainMenu.color = 'black';
			mainMenu.background = 'white';
		});
		winUI.addControl(mainMenu);
		// this._showWin();
		// Start menu here
	}

	// eslint-disable-next-line require-await
	private async _setUpGame () {
		// Start game here
		// CREATE SCENE
		const scene = new Scene(this._engine);
		this._gamescene = scene;

		// SOUNDS
		// this._loadSounds(scene);

		// CREATE ENVIRONMENT
		// const environment = new Environment(scene);
		// this._environment = environment;
		// Load environment and character assets
		// await this._environment.load();
		// await this._loadCharacterAssets(scene);
	}

	private _loadSounds (_scene: Scene) {
		// There are no sounds yet, so this is a placeholder
		// this.sfx = new Sound('sfx', './sounds/sfx.mp3', scene, null, { loop: false, autoplay: false });
		// this.music = new Sound('music', './sounds/music.mp3', scene, null, { loop: true, autoplay: false });
	}

	private async _goToGame () {
		// SETUP SCENE
		this._scene.detachControl();
		const scene = this._gamescene;

		// GUI
		// const ui = new Hud(scene);
		// this._ui = ui;
		scene.detachControl();

		// IBL
		// const environmentHdri = CubeTexture.CreateFromPrefilteredData(
		// 	'./assets/environment/environment.env',
		// 	scene,
		// );
		// environmentHdri.name = 'env';
		// environmentHdri.gammaSpace = false;
		// scene.environmentTexture = environmentHdri;
		// scene.environmentIntensity = 0.04;

		// INPUT
		// this._input = new PlayerInput(scene, this._ui);

		// Initialize game loop
		// await this._initializeGameAsync(scene);

		// When finished loading
		await scene.whenReadyAsync();

		// Actions to complete once game loop is setup
		this._scene.dispose();
		this._state = State.GAME;
		this._scene = scene;
		this._engine.hideLoadingUI();
		this._scene.attachControl();

		// this.game.play();
	}

	private _showWin (): void {
		// this.game.dispose();
		// this.end.play();
		// this._player.onRun.clear();

		const winUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		winUI.idealHeight = 720;

		const rect = new Rectangle();
		rect.thickness = 0;
		rect.background = 'black';
		rect.alpha = 0.4;
		rect.width = 0.4;
		winUI.addControl(rect);

		const stackPanel = new StackPanel('credits');
		stackPanel.width = 0.4;
		stackPanel.fontFamily = 'Viga';
		stackPanel.fontSize = '16px';
		stackPanel.color = 'white';
		winUI.addControl(stackPanel);

		const wincreds = new TextBlock('special');
		wincreds.resizeToFit = true;
		wincreds.color = 'white';
		wincreds.text = 'Special thanks to the Babylon Team!';
		wincreds.textWrapping = true;
		wincreds.height = '24px';
		wincreds.width = '100%';
		wincreds.fontFamily = 'Viga';
		stackPanel.addControl(wincreds);

		// Credits for music & SFX
		const music = new TextBlock('music', 'Music');
		music.fontSize = 22;
		music.resizeToFit = true;
		music.textWrapping = true;

		const source = new TextBlock('sources', 'Sources: freesound.org, opengameart.org, and itch.io')
		source.textWrapping = true;
		source.resizeToFit = true;

		const jumpCred = new TextBlock('jumpCred', 'jump2 by LloydEvans09 - freesound.org');
		jumpCred.textWrapping = true;
		jumpCred.resizeToFit = true;

		const walkCred = new TextBlock('walkCred', 'Concrete 2 by MayaSama @mayasama.itch.io / ig: @mayaragandra');
		walkCred.textWrapping = true;
		walkCred.resizeToFit = true;

		const gameCred = new TextBlock('gameSong', 'Christmas synths by 3xBlast - opengameart.org');
		gameCred.textWrapping = true;
		gameCred.resizeToFit = true;

		const pauseCred = new TextBlock('pauseSong', 'Music by Matthew Pablo / www.matthewpablo.com - opengameart.org');
		pauseCred.textWrapping = true;
		pauseCred.resizeToFit = true;

		const endCred = new TextBlock('startendSong', 'copycat by syncopika - opengameart.org');
		endCred.textWrapping = true;
		endCred.resizeToFit = true;

		const loseCred = new TextBlock('loseSong', 'Eye of the Storm by Joth - opengameart.org');
		loseCred.textWrapping = true;
		loseCred.resizeToFit = true;

		const fireworksSfx = new TextBlock('fireworks', 'rubberduck - opengameart.org')
		fireworksSfx.textWrapping = true;
		fireworksSfx.resizeToFit = true;

		const dashCred = new TextBlock('dashCred', 'Woosh Noise 1 by potentjello - freesound.org');
		dashCred.textWrapping = true;
		dashCred.resizeToFit = true;

		// quit, sparkwarning, reset
		const sfxCred = new TextBlock('sfxCred', '200 Free SFX - https://kronbits.itch.io/freesfx');
		sfxCred.textWrapping = true;
		sfxCred.resizeToFit = true;

		// lighting lantern, sparkreset
		const sfxCred2 = new TextBlock('sfxCred2', 'sound pack by wobbleboxx.com - opengameart.org');
		sfxCred2.textWrapping = true;
		sfxCred2.resizeToFit = true;

		const selectionSfxCred = new TextBlock('select', '8bit menu select by Fupi - opengameart.org');
		selectionSfxCred.textWrapping = true;
		selectionSfxCred.resizeToFit = true;

		stackPanel.addControl(music);
		stackPanel.addControl(source);
		stackPanel.addControl(jumpCred);
		stackPanel.addControl(walkCred);
		stackPanel.addControl(gameCred);
		stackPanel.addControl(pauseCred);
		stackPanel.addControl(endCred);
		stackPanel.addControl(loseCred);
		stackPanel.addControl(fireworksSfx);
		stackPanel.addControl(dashCred);
		stackPanel.addControl(sfxCred);
		stackPanel.addControl(sfxCred2);
		stackPanel.addControl(selectionSfxCred);

		const mainMenu = Button.CreateSimpleButton('mainmenu', 'RETURN');
		// mainMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		mainMenu.fontFamily = 'Viga';
		mainMenu.width = 0.2
		mainMenu.height = '40px';
		mainMenu.color = 'white';
		winUI.addControl(mainMenu);

		// mainMenu.onPointerDownObservable.add(() => {
		// 	this._ui.transition = true;
		// 	this._ui.quitSfx.play();
		// })
	}

	private async _initializeGameAsync (scene: Scene): Promise<void> {
		createPixelCamera(this._canvas, this._scene);
		// const objects = await initializeGame(this._scene, this._rapierWorker);
		createGoblin(this._scene, this._rapierWorker);
		// startEveryFrame(this._scene, objects, this._rapierWorker);
		const world = await this._rapierWorker.startPhysics();
		world.gravity = { x: 0, y: -9.81, z: 0 };

		// Create the player
		// this._player = new Player(this.assets, scene, shadowGenerator);

		// GAME LOOP
		// scene.onBeforeRenderObservable.add(() => {
		// 	// Loop
		// });
	}
}
