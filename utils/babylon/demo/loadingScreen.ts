import { type Engine } from '@babylonjs/core/Engines/engine';

type ILoadingScreen = {
	// What happens when loading starts
	displayLoadingUI: () => void;
	// What happens when loading stops
	hideLoadingUI: () => void;
	// default loader support. Optional!
	loadingUIBackgroundColor: string;
	loadingUIText: string;
};
export class CustomScreen implements ILoadingScreen {
	// optional, but needed due to interface definitions

	public constructor(
		public loadingUIText: string = 'Loading...',
		public loadingUIFadeInTime: number = 1,
		public loadingUIFadeOutTime: number = 1,
		public loadingUIBackgroundColor: string = '#111',
	) {}

	public displayLoadingUI() {
		try {
			const oldLoadingScreenDiv =
				document.querySelector('#loadingScreenDiv');
			if (oldLoadingScreenDiv) {
				oldLoadingScreenDiv.remove();
			}
		} catch (error) {
			console.log(error);
		}

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
		style.id = 'loadingScreenDivStyle';
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
		loadingScreenDiv.style.animation = `fadeIn ${this.loadingUIFadeInTime}s`;
	}

	public hideLoadingUI() {
		// remove loading screen UI
		const loadingScreenDiv = document.querySelector('#loadingScreenDiv');
		if (loadingScreenDiv) {
			// Remove old style element
			const oldStyle = document.querySelector('#loadingScreenDivStyle');
			if (oldStyle) {
				oldStyle.remove();
			}

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
			loadingScreenDiv.style.animation = `fadeOut ${this.loadingUIFadeOutTime}s`;
			// When the animation is done, remove the element
			loadingScreenDiv.addEventListener('animationend', () => {
				if (loadingScreenDiv) {
					loadingScreenDiv.remove();
				}
			});
		}
	}
}

export default class {
	public engine: Engine;

	public loadingScreen: CustomScreen;

	public constructor(engine: Engine) {
		this.engine = engine;
		this.loadingScreen = new CustomScreen();
		this.engine.loadingScreen = this.loadingScreen;
	}

	public hide = (fadeOutTime?: number): void => {
		this.loadingScreen.loadingUIFadeOutTime = fadeOutTime ?? 1;
		this.loadingScreen = new CustomScreen(
			'Loading...',
			this.loadingScreen.loadingUIFadeInTime,
			this.loadingScreen.loadingUIFadeOutTime,
			this.loadingScreen.loadingUIBackgroundColor,
		);
		this.engine.loadingScreen = this.loadingScreen;
		this.engine.hideLoadingUI();
	};

	public show = (
		fadeInTime?: number,
		message?: string,
		color?: string,
	): void => {
		this.loadingScreen.loadingUIFadeInTime = fadeInTime ?? 1;
		this.loadingScreen.loadingUIBackgroundColor = color ?? '#111';
		this.loadingScreen = new CustomScreen(
			message ?? 'Loading...',
			this.loadingScreen.loadingUIFadeInTime,
			this.loadingScreen.loadingUIFadeOutTime,
			this.loadingScreen.loadingUIBackgroundColor,
		);
		this.engine.loadingScreen = this.loadingScreen;
		this.engine.displayLoadingUI();
	};
}
