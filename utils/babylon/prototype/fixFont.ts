import { type Engine } from '@babylonjs/core/Engines/engine';
let canvas: OffscreenCanvas;
let context: OffscreenCanvasRenderingContext2D | null;
interface FontOffset {
	ascent: number
	height: number
	descent: number
}
export default (engine: Engine) => {
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
	engine.getFontOffset = getFontOffset;
}
