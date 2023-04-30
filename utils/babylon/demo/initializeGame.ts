import { type rapierWorkerType } from '../../worker/rapier-wrap';
import createWorld from './ecs/createWorld';
import CustomLoadingScreen from './loadingScreen';
import titleScreenBackground from './titleScreen';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { addEntity, type IWorld } from 'bitecs';

// eslint-disable-next-line import/prefer-default-export
export class Game {
	private canvas: HTMLCanvasElement;

	private engine: Engine;

	private rapierWorker: rapierWorkerType;

	private world: IWorld | undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private pipeline: ((...input: any[]) => any) | undefined;

	private activeScene: Scene;

	private loadingScene: Scene;

	private loadingScreen: CustomLoadingScreen;

	public constructor(
		canvas: HTMLCanvasElement | OffscreenCanvas,
		_navigationToLoad: string,
		rapierWorker: rapierWorkerType,
	) {
		this.rapierWorker = rapierWorker;
		this.canvas = canvas as HTMLCanvasElement;
		this.engine = new Engine(this.canvas, true);
		this.loadingScreen = new CustomLoadingScreen(this.engine);
		this.activeScene = new Scene(this.engine);
		this.loadingScene = new Scene(this.engine);
		this.initialize();
	}

	private async initialize(): Promise<void> {
		this.loadingScreen.show(1, 'Loading...', '#151729');
		// eslint-disable-next-line no-promise-executor-return
		const screenFade = new Promise(resolve => setTimeout(resolve, 1_000));
		window.addEventListener('resize', () => {
			this.engine.resize();
		});
		this.registerLoops();
		await screenFade;
		await this.goToTitle();
		this.loadingScreen.show(0, 'Loading...', '#151729');
		const worldPromise = createWorld(this.loadingScene, this.canvas);
		this.loadingScreen.hide();
		const { world, allSytemsPipeline } = await worldPromise;
		this.world = world;
		this.pipeline = allSytemsPipeline;

		window.addEventListener('keydown', this.handleInput);
	}

	private handleInput = async (event: { code: string }) => {
		if (event.code === 'KeyC') {
			this.continue();
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			addEntity(this.world!);
		}

		if (event.code === 'KeyV') {
			await this.goBackToTitle();
		}
	};

	private async continue() {
		this.loadingScreen.show();
		// eslint-disable-next-line no-promise-executor-return
		const screenFade = new Promise(resolve => setTimeout(resolve, 1_000));
		await screenFade;
		this.activeScene.dispose();
		this.activeScene = this.loadingScene;
		this.loadingScreen.hide();
	}

	private async goBackToTitle() {
		this.loadingScreen.show();
		// eslint-disable-next-line no-promise-executor-return
		const screenFade = new Promise(resolve => setTimeout(resolve, 1_000));
		this.world = undefined;
		this.loadingScene = new Scene(this.engine);
		const newWorld = createWorld(this.loadingScene, this.canvas);
		await screenFade;
		this.activeScene.dispose();
		this.activeScene = new Scene(this.engine);
		this.goToTitle();
		this.world = await newWorld;
		this.loadingScreen.hide();
	}

	private registerLoops = (): void => {
		this.engine.runRenderLoop(() => {
			if (this.activeScene && this.activeScene.cameras.length > 0) {
				try {
					this.activeScene.render();
				} catch (error) {
					console.error(error);
				}
			}
		});
		let previousTime = 0;
		let delta = 0;
		const timeStep = 1_000 / 1;
		const worldLoop = async (time: number) => {
			const dt = time - previousTime;
			delta += dt;
			previousTime = time;
			while (delta > timeStep) {
				if (this.world && this.pipeline) {
					try {
						this.pipeline(this.world);
					} catch (error) {
						console.error(error);
					}
				}

				delta -= timeStep;
			}

			window.requestAnimationFrame(worldLoop);
		};

		window.requestAnimationFrame(worldLoop);
	};

	private goToTitle = async (): Promise<void> => {
		titleScreenBackground(
			this.activeScene,
			this.rapierWorker,
			this.engine,
			this.canvas as HTMLCanvasElement,
		);
	};
}
