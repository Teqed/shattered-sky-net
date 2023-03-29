import * as BABYLON from '@babylonjs/core';
const engine = new BABYLON.NullEngine();
const canvas = document.createElement('canvas');
const offscreen = canvas.transferControlToOffscreen();

const createScene = function () {
	const myfunction = () => {
		console.log('worker initialized')
		self.addEventListener('message', (event) => {
			if (event && event.data && event.data.canvas) {
				const canvas = event.data.canvas;
				const scene = new BABYLON.Scene(engine);
				const camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
				camera.setTarget(BABYLON.Vector3.Zero());
				camera.attachControl(canvas, true);
				const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
				light.intensity = 0.7;
				const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2, segments: 32}, scene);
				sphere.position.y = 1;
				BABYLON.MeshBuilder.CreateGround('ground', {width: 6, height: 6}, scene);

				scene.render();

				requestAnimationFrame(function render () {
					sphere.rotation.y += 0.01;
					scene.render();
					requestAnimationFrame(render);
				});
			} else if (event && event.data && event.data.pointerdown) {
				console.log('pointerdown on worker')
			}
		});
	}
	const functionBody = myfunction.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '')
	const blob = new Blob([functionBody], { type: 'text/javascript' });
	const url = URL.createObjectURL(blob);
	const myWorker = new Worker(url);
	myWorker.postMessage({ canvas: offscreen }, [offscreen]);
	self.addEventListener('pointerdown', (event) => {
		console.log('pointerdown on main thread')
		myWorker.postMessage({ pointerdown: true });
	});
};
createScene();
