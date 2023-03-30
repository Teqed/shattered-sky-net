// import {babylonWorker} from './babylon-wrap';
let babylonWorker: any;
const onMouseEvent = (event: MouseEvent) => {
	const type = event.type;
	const button = event.button;
	const buttons = event.buttons;
	const x = event.clientX;
	const y = event.clientY;
	if (event instanceof WheelEvent) {
		const deltaY = event.deltaY;
		const deltaX = event.deltaX;
		const deltaZ = event.deltaZ;
		const deltaMode = event.deltaMode;
		const wheelEvent = {
			type,
			button,
			buttons,
			x,
			y,
			deltaY,
			deltaX,
			deltaZ,
			deltaMode,
		};
		babylonWorker.mouseEvent(wheelEvent);
	} else {
		const relayedMouseEvent = {
			type,
			button,
			buttons,
			x,
			y,
		}
		babylonWorker.mouseEvent(relayedMouseEvent);
	}
};
// eslint-disable-next-line import/prefer-default-export
export const attachMouseEvents = (parentWorker: any, canvas: HTMLCanvasElement) => {
	try {
		babylonWorker = parentWorker;
		canvas.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});
		canvas.addEventListener('pointerdown', onMouseEvent);
		canvas.addEventListener('pointermove', onMouseEvent);
		canvas.addEventListener('pointerup', onMouseEvent);
		canvas.addEventListener('wheel', onMouseEvent);
		babylonWorker.resize(canvas.clientWidth, canvas.clientHeight);
		window.addEventListener('resize', () => {
			babylonWorker.resize(canvas.clientWidth, canvas.clientHeight);
		});
	} catch (error) {
		console.error('attachMouseEvents', error);
	}
};
