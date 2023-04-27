import { type rapierWorkerType } from '../../worker/rapier-wrap';
import CustomLoadingScreen from './loadingScreen';
import titleScreenBackground from './titleScreen';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { type World } from '@lastolivegames/becsy';

// eslint-disable-next-line import/prefer-default-export
export class Game {
	private canvas: HTMLCanvasElement;

	private engine: Engine;

	private rapierWorker: rapierWorkerType;

	private world: World | undefined;

	private activeScene: Scene;

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
		this.initialize();
	}

	private async initialize(): Promise<void> {
		this.loadingScreen.show(0);
		window.addEventListener('resize', () => {
			this.engine.resize();
		});
		this.registerLoops();
		await this.goToTitle();
		this.loadingScreen.hide();
	}

	private registerLoops = (): void => {
		this.engine.runRenderLoop(() => {
			if (this.activeScene) {
				try {
					this.activeScene.render();
				} catch (error) {
					console.error(error);
				}
			}
		});
		setInterval(() => {
			if (this.world) {
				try {
					this.world.execute();
				} catch (error) {
					console.error(error);
				}
			}
		}, 1_000 / 8);
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
