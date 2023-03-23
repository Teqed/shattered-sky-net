// import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
// import * as Comlink from 'comlink';
import { expose } from 'comlink';
// import ballOnGround from './babylon/ballOnGround';
// import manyCubes, { relayMouseEvent } from '../babylon/manyCubes';
import manyIcosahedrons, { createSubWorker, numberMeshes } from './manyIcosahedrons';

let engine: Engine;
let canvas: OffscreenCanvas;

// Device Enums
/**
 * Enum for All Pointers (Touch/Mouse)
 */
export enum PointerInput {
	/** Horizontal Axis (Not used in events/observables; only in polling) */
	Horizontal = 0,
	/** Vertical Axis (Not used in events/observables; only in polling) */
	Vertical = 1,
	/** Left Click or Touch */
	LeftClick = 2,
	/** Middle Click */
	MiddleClick = 3,
	/** Right Click */
	RightClick = 4,
	/** Browser Back */
	BrowserBack = 5,
	/** Browser Forward */
	BrowserForward = 6,
	/** Mouse Wheel X */
	MouseWheelX = 7,
	/** Mouse Wheel Y */
	MouseWheelY = 8,
	/** Mouse Wheel Z */
	MouseWheelZ = 9,
	/** Used in events/observables to identify if x/y changes occurred */
	Move = 12,
}

/** @internal */
export enum NativePointerInput {
	/** Horizontal Axis */
	Horizontal = PointerInput.Horizontal,
	/** Vertical Axis */
	Vertical = 1,
	/** Left Click or Touch */
	LeftClick = 2,
	/** Middle Click */
	MiddleClick = 3,
	/** Right Click */
	RightClick = 4,
	/** Browser Back */
	BrowserBack = 5,
	/** Browser Forward */
	BrowserForward = 6,
	/** Mouse Wheel X */
	MouseWheelX = 7,
	/** Mouse Wheel Y */
	MouseWheelY = 8,
	/** Mouse Wheel Z */
	MouseWheelZ = 9,
	/** Delta X */
	DeltaHorizontal = 10,
	/** Delta Y */
	DeltaVertical = 11,
}

/**
 * Native friendly interface for Event Object
 */
export interface IUIEvent {
	/**
     * Input array index
     */
	inputIndex: number;

	/**
     * Current target for an event
     */
	currentTarget?: any;

	/**
     * Alias for target
     * @deprecated Use target instead
     */
	srcElement?: any;

	/**
     * Type of event
     */
	type: string;

	/**
     * Reference to object where object was dispatched
     */
	target: any;

	/**
     * Tells user agent what to do when not explicitly handled
     */
	preventDefault: () => void;
}

/**
 * Native friendly interface for KeyboardEvent Object
 */
export interface IKeyboardEvent extends IUIEvent {
	/**
     * Status of Alt key being pressed
     */
	altKey: boolean;

	/**
     * Unicode value of character pressed
     * @deprecated Required for event, use keyCode instead.
     */
	charCode?: number;

	/**
     * Code for key based on layout
     */
	code: string;

	/**
     * Status of Ctrl key being pressed
     */
	ctrlKey: boolean;

	/**
     * String representation of key
     */
	key: string;
	/**
     * ASCII value of key
     * @deprecated Used with DeviceSourceManager
     */
	keyCode: number;

	/**
     * Status of Meta key (eg. Windows key) being pressed
     */
	metaKey: boolean;

	/**
     * Status of Shift key being pressed
     */
	shiftKey: boolean;
}

/**
 * Native friendly interface for MouseEvent Object
 */
export interface IMouseEvent extends IUIEvent {
	/**
     * Subset of possible PointerInput values for events, excluding ones that CANNOT be in events organically
     */
	inputIndex: Exclude<PointerInput, PointerInput.Horizontal | PointerInput.Vertical>;

	/**
     * Status of Alt key being pressed
     */
	altKey: boolean;

	/**
     * Value of single mouse button pressed
     */
	button: number;

	/**
     * Value of all mouse buttons pressed
     */
	buttons: number;

	/**
     * Current X coordinate
     */
	clientX: number;

	/**
     * Current Y coordinate
     */
	clientY: number;

	/**
     * Status of Ctrl key being pressed
     */
	ctrlKey: boolean;

	/**
     * Provides current click count
     */
	detail?: number;

	/**
     * Status of Meta key (eg. Windows key) being pressed
     */
	metaKey: boolean;

	/**
     * Delta of movement on X axis
     */
	movementX: number;

	/**
     * Delta of movement on Y axis
     */
	movementY: number;

	/**
     * Delta of movement on X axis
     * @deprecated Use 'movementX' instead
     */
	mozMovementX?: number;

	/**
     * Delta of movement on Y axis
     * @deprecated Use 'movementY' instead
     */
	mozMovementY?: number;

	/**
     * Delta of movement on X axis
     * @deprecated Use 'movementX' instead
     */
	msMovementX?: number;

	/**
     * Delta of movement on Y axis
     * @deprecated Use 'movementY' instead
     */
	msMovementY?: number;

	/**
     * Current coordinate of X within container
     */
	offsetX: number;

	/**
     * Current coordinate of Y within container
     */
	offsetY: number;

	/**
     * Horizontal coordinate of event
     */
	pageX: number;

	/**
     * Vertical coordinate of event
     */
	pageY: number;

	/**
     * Status of Shift key being pressed
     */
	shiftKey: boolean;

	/**
     * Delta of movement on X axis
     * @deprecated Use 'movementX' instead
     */
	webkitMovementX?: number;

	/**
     * Delta of movement on Y axis
     * @deprecated Use 'movementY' instead
     */
	webkitMovementY?: number;

	/**
     * Alias of clientX
     */
	x: number;

	/**
     * Alias of clientY
     */
	y: number;
}

class CustomMouseEvent extends Event {
	type: string;
	clientX: number;
	clientY: number;
	button: number;
	buttons: number;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	movementX: number;
	movementY: number;
	offsetX: number;
	offsetY: number;
	pageX: number;
	pageY: number;
	// relatedTarget: EventTarget | null;
	screenX: number;
	screenY: number;
	shiftKey: boolean;
	x: number;
	y: number;
	currentTarget: EventTarget | null;
	deltaX: number;
	deltaY: number;
	deltaZ: number;
	deltaMode: number;

	constructor (
		type: string,
		options: {
			clientX: number,
			clientY: number,
			button: number,
			currentTarget: EventTarget | null,
			deltaX?: number,
			deltaY?: number,
			deltaZ?: number,
			deltaMode?: number
		}) {
		super(type);
		this.type = type;
		this.clientX = options.clientX;
		this.clientY = options.clientY;
		this.button = options.button;
		this.buttons = options.button;
		this.altKey = false;
		this.ctrlKey = false;
		this.metaKey = false;
		this.movementX = 0;
		this.movementY = 0;
		this.offsetX = options.clientX;
		this.offsetY = options.clientY;
		this.pageX = options.clientX;
		this.pageY = options.clientY;
		// this.relatedTarget = null;
		this.screenX = options.clientX;
		this.screenY = options.clientY;
		this.shiftKey = false;
		this.x = options.clientX;
		this.y = options.clientY;
		this.currentTarget = options.currentTarget;
		this.deltaX = options.deltaX ?? 0;
		this.deltaY = options.deltaY ?? 0;
		this.deltaZ = options.deltaZ ?? 0;
		this.deltaMode = options.deltaMode ?? 0;
	}

	getTarget (): null {
		return null;
	}
}

const babylonWorker = {
	init: async (initCanvas: OffscreenCanvas) => {
		canvas = initCanvas as unknown as OffscreenCanvas;
		engine = new Engine(canvas, true);
		// const scene = ballOnGround(engine, canvas);
		// const scene = await manyCubes(engine, canvas);
		const scene = await manyIcosahedrons(engine, canvas);
		engine.runRenderLoop(() => {
			scene.render();
		}
		);
		// return scene;
	},
	resize: (width: number, height: number) => {
		canvas.width = width;
		canvas.height = height;
	},
	mouseEvent: (event: {
		type: string,
		x: number,
		y: number,
		button: number,
		buttons: number,
		deltaX?: number,
		deltaY?: number,
		deltaZ?: number,
		deltaMode?: number,
	}
	) => {
		const customEvent = new CustomMouseEvent(event.type, {
			clientX: event.x,
			clientY: event.y,
			button: event.button,
			currentTarget: canvas,
			deltaX: event.deltaX,
			deltaY: event.deltaY,
			deltaZ: event.deltaZ,
			deltaMode: event.deltaMode
		});
		// console.log(customEvent)
		canvas.dispatchEvent(customEvent
		);
	},
	subSpawn: (url: string) => {
		createSubWorker(url);
	},
	meshCounter: () => {
		return numberMeshes.number;
	}
}

expose(babylonWorker);
