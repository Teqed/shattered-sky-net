import { Scene } from '@babylonjs/core/scene';
import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Physics/physicsEngineComponent'
import '@babylonjs/core/Helpers/sceneHelpers';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import {
	createWorld,
	addEntity,
	removeEntity,
	Types,
	defineComponent,
	addComponent,
	removeComponent,
	hasComponent,
	defineQuery,
	Changed,
	Not,
	enterQuery,
	exitQuery,
	defineSerializer,
	defineDeserializer,
	pipe,
} from 'bitecs'
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle } from '@babylonjs/gui';
import { type rapierWorkerType } from '../../worker/rapier-wrap';
import { setMatricesSize } from '../../nbody/everyFrame';
import createPixelCamera from './createPixelCamera';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';

enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }
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

		this._createCanvas(canvas);
		this._init();
	}

	private async _init (): Promise<void> {
		this._engine = new Engine(this._canvas, true);
		this._scene = new Scene(this._engine);
		//* *for development: make inspector visible/invisible
		window.addEventListener('keydown', (event_) => {
			// Shift+Ctrl+Alt+I
			if (event_.shiftKey && event_.ctrlKey && event_.altKey && event_.keyCode === 73) {
				if (this._scene.debugLayer.isVisible()) {
					this._scene.debugLayer.hide();
				} else {
					this._scene.debugLayer.show();
				}
			}
		});

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
					// this._scene.render();
					break;
				case State.LOSE:
					this._scene.render();
					break;
				default: break;
			}
		});
	}

	private _createCanvas (canvas: HTMLCanvasElement | OffscreenCanvas): HTMLCanvasElement {
		this._canvas = canvas as HTMLCanvasElement;
		return this._canvas;
	}

	private async _goToStart () {
	}

	private async _setUpGame () {
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

	private _loadSounds (scene: Scene) {
		// this.sfx = new Sound('sfx', './sounds/sfx.mp3', scene, null, { loop: false, autoplay: false });
		// this.music = new Sound('music', './sounds/music.mp3', scene, null, { loop: true, autoplay: false });
	}

	private async _goToGame () {
		// SETUP SCENE
		this._scene.detachControl();
		const scene = this._gamescene;

		// GUI
		const ui = new Hud(scene);
		this._ui = ui;
		scene.detachControl();

		// IBL
		const environmentHdri = CubeTexture.CreateFromPrefilteredData(
			'./assets/environment/environment.env',
			scene,
		);
		environmentHdri.name = 'env';
		environmentHdri.gammaSpace = false;
		scene.environmentTexture = environmentHdri;
		scene.environmentIntensity = 0.04;

		// INPUT
		this._input = new PlayerInput(scene, this._ui);

		// Initialize game loop
		await this._initializeGameAsync(scene);

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
		this.game.dispose();
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
		mainMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		mainMenu.fontFamily = 'Viga';
		mainMenu.width = 0.2
		mainMenu.height = '40px';
		mainMenu.color = 'white';
		winUI.addControl(mainMenu);

		mainMenu.onPointerDownObservable.add(() => {
			this._ui.transition = true;
			this._ui.quitSfx.play();
		})
	}

	private async _initializeGameAsync (scene: Scene): Promise<void> {
		createPixelCamera(this._canvas, this._scene);
		const objects = await initializeGame(this._scene, this._rapierWorker);
		startEveryFrame(this._scene, objects, this._rapierWorker);
		const world = await this._rapierWorker.startPhysics();
		world.gravity = { x: 0, y: -9.81, z: 0 };

		// Create the player
		this._player = new Player(this.assets, scene, shadowGenerator);

		// GAME LOOP
		scene.onBeforeRenderObservable.add(() => {
			// Loop
		});
	}
}

// ! BREAK --------------------------------------------------

let bodyObject: {
	meshId: number,
	p: {
		x: number,
		y: number,
		z: number,
	},
	r: {
		x: number,
		y: number,
		z: number,
		w: number,
	},
	mass: number,
	size: number,
};
const createGoblin = (scene: Scene) => {

}

// Define the gameworld class
export class GameWorld {
	world: any;
	// Define the components
	Position = defineComponent({
		x: Types.f32,
		y: Types.f32,
		z: Types.f32,
	});

	Rotation = defineComponent({
		x: Types.f32,
		y: Types.f32,
		z: Types.f32,
		w: Types.f32,
	});

	Mass = defineComponent({
		value: Types.f32,
	});

	Size = defineComponent({
		value: Types.f32,
	});

	// Define the queries
	// Query for all entities with a position and rotation
	PositionRotationQuery = defineQuery([Changed(Position), Changed(Rotation)]);
}

export default async (scene: Scene, rapierWorker: rapierWorkerType) => {
	const {babylonMesh, bodyObjectsArray} = createGoblin(scene);
	await rapierWorker.newBodies(bodyObjectsArray);
	return new Promise((resolve) => {
		resolve(babylonMesh);
	}) as Promise<Mesh>;
}
