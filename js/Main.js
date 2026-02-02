import { ExternalDataManager } from "./ExternalDataManager.js";

export class Main {
 constructor() {
	this.canvas = document.getElementById("renderCanvas"); // Get the canvas element
	this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true }); // Generate the BABYLON 3D engine
	this.externalDataManager = new ExternalDataManager();

	const PromiseScene = this.#createScene(); //Call the createScene function that returns a promise
	PromiseScene.then(scene => {
		// Register a render loop to repeatedly render the scene
		this.engine.runRenderLoop(function () {
			scene.render();
		});

		scene.onKeyboardObservable.add((kbInfo) => {
			if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN) {
				console.log("KEY DOWN: ", kbInfo.event.key);
				switch (kbInfo.event.key) {
					case 'W':
					case 'w':

						break;
					case 'A':
					case 'a':

						break;
					case 'S':
					case 's':

						break;
					case 'D':
					case 'd':
						break;
					case ' ':
						// Spacebar
						break;
				}
				 switch (key) {
                        case '`':
                        case '~':
                            this.#toggleDebugger(scene);
                            break;
                    }
			}
			else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP) {

			}
		});

		this.boundResizeHandler = this.#handleResize.bind(this);
        window.addEventListener('resize', this.boundResizeHandler);

	})

}
	async #createScene() {
		// Creates a basic Babylon Scene object
		const scene = new BABYLON.Scene(this.engine);
		// Creates and positions a free camera
		const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 15, 0), scene);
		// Targets the camera to scene origin
		camera.setTarget(BABYLON.Vector3.Zero());
		// This attaches the camera to the canvas
		// camera.attachControl(canvas, true);
		// Creates a light, aiming 0,1,0 - to the sky
		const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, -0.400), scene);
		// Dim the light a small amount - 0 to 1
		light.intensity = 0.5;

		// Our built-in 'sphere' shape.
		const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
		// Move the sphere upward 1/2 its height
		sphere.position.y = 1;

		// Our built-in 'ground' shape.
		const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

		return scene;
	};

	// Watch for browser/canvas resize events
	#handleResize() {
        this.engine.resize();
    }

    #toggleDebugger(scene) {
        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            scene.debugLayer.show();
            document.body.style.cursor = "revert";
        }
    }
}