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
	public loadingUIBackgroundColor: string;

	public constructor(
		public loadingUIText: string,
		public loadingUIFadeInTime: number = 1,
	) {
		this.loadingUIBackgroundColor = '#151729';
	}

	public displayLoadingUI() {
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
		loadingScreenDiv.style.animation = `fadeIn ${this.loadingUIFadeInTime}s`;
	}

	public hideLoadingUI() {
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

export default class {
	public engine: Engine;

	public loadingScreen: CustomScreen;

	public constructor(engine: Engine) {
		this.engine = engine;
		this.loadingScreen = new CustomScreen('Loading...', 1);
		this.engine.loadingScreen = this.loadingScreen;
	}

	public hide = (): void => {
		this.engine.hideLoadingUI();
	};

	public show = (
		fadeInTime?: number,
		message?: string,
		color?: string,
	): void => {
		this.loadingScreen = new CustomScreen(
			message ?? 'Loading...',
			fadeInTime ?? 1,
		);
		this.engine.loadingScreen.loadingUIBackgroundColor = color ?? '#151729';
		this.engine.loadingScreen = this.loadingScreen;
		this.engine.displayLoadingUI();
	};
}
