// import * as BABYLON from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine';
import ballOnGround from './babylon/ballOnGround';

onmessage = (event_) => {
	const canvas = event_.data.canvas;
	const engine = new Engine(canvas, true);

	onmessage = function (event__) {
		if (event__.data.width) {
			canvas.width = event__.data.width;
			canvas.height = event__.data.height;
		}
	}
	const scene = ballOnGround(engine, canvas);
	engine.runRenderLoop(() => {
		scene.render();
	}
	);

	// // depending on which scene is requested, load the appropriate module
	// const scene = await import(`./babylon/${event_.data.scene}.ts`).then((module) => {
	// 	return module.default(engine, canvas);
	// }
	// );

	// engine.runRenderLoop(() => {
	// 	scene.render();
	// }
	// );

	// call ballOnGround.ts
	// const scene = await import('./babylon/ballOnGround').then((module) => {
	// 	return module.default(engine, canvas);
	// }
	// );

	// engine.runRenderLoop(() => {
	// 	scene.render();
	// }
	// );
}
