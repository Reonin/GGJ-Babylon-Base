import HealthBarHelper from "./HealthBarHelper.js";

export default class UIManager {
	buttonList = {
		startGameButton: {},
	};
	#playerScore = {};
	#scoreLabel = {};
	#title = {};
	#subtitle = {};
	#timer = {};
	currentRound = 0;
	#startScreenBg = {};

	constructor(BABYLON, scene, engine) {
		this.BABYLON = BABYLON;
		this.GUI = this.BABYLON.GUI;

		this.advancedTexture = this.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
			"GUI",
			true,
			scene,
			BABYLON.Texture.NEAREST_NEAREST
		);

		this.#setUpHUD(scene, engine);
		
		this.healthBarHelper = new HealthBarHelper(this.GUI, this.advancedTexture);
		scene.onBeforeRenderObservable.add(() => {
			this.healthBarHelper.updateHealthBars();
		});

	}

	createHealthBar(mesh){
		this.healthBarHelper.createHealthBar(mesh);
	}

	updateHealthBars(){
		this.healthBarHelper.updateHealthBars();
	}

	async #setUpHUD(scene, engine) {

		await this.advancedTexture.parseFromURLAsync("./json/guiTexture.json");

		// Create start screen background image
		// this.#createStartScreenBackground(this.advancedTexture);

		this.#setUpButtons(this.advancedTexture);
		this.#createMuteButton(this.advancedTexture);


		this.#playerScore = this.advancedTexture.getControlByName("PlayerScore");
		this.#playerScore.paddingLeft = "30px";

		this.#scoreLabel  = this.advancedTexture.getControlByName("ScoreLabel");
		this.#title = this.advancedTexture.getControlByName("Title");
		this.#subtitle = this.advancedTexture.getControlByName("Subtitle");

		this.#timer = this.advancedTexture.getControlByName("Timer");
		this.#timer.paddingLeft = "30px";

		this.#setupTimer(scene, engine);
		this.#setupScore(scene, engine);

	}

	#createStartScreenBackground(advancedTexture) {
		const bgImage = new this.GUI.Image("startScreenBg", "./assets/plaguearism.png");
		bgImage.width = "100%";
		bgImage.height = "100%";
		bgImage.stretch = this.GUI.Image.STRETCH_UNIFORM;
		bgImage.horizontalAlignment = this.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		bgImage.verticalAlignment = this.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
		bgImage.zIndex = -1; // Behind other elements

		advancedTexture.addControl(bgImage);
		this.#startScreenBg = bgImage;
	}

	#hideTitleScreen() {
		this.#title.isVisible = false;
		this.#subtitle.isVisible = false;
		window.gameStarted = true;
		this.buttonList.startGameButton.isVisible = false;
		document.body.style.cursor = "none";
	}

	#setUpButtons(advancedTexture) {
		this.buttonList.startGameButton = advancedTexture.getControlByName("Start Game");

		this.buttonList.startGameButton.onPointerUpObservable.add(() => {
			this.#hideTitleScreen();
			console.log("%cStart Game Pressed", "color:green");
		});

		this.buttonList.startGameButton.onPointerEnterObservable.add(() => {
			document.body.style.cursor = "pointer";
		});

		this.buttonList.startGameButton.onPointerOutObservable.add(() => {
			if(window.gameStarted){
				document.body.style.cursor = "none";
			}
		});
	}

	#createMuteButton(advancedTexture) {
		const muteButton = this.GUI.Button.CreateSimpleButton("muteBtn", "Mute");
		muteButton.width = "80px";
		muteButton.height = "30px";
		muteButton.color = "white";
		muteButton.cornerRadius = 5;
		muteButton.background = "green";
		muteButton.horizontalAlignment = this.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		muteButton.verticalAlignment = this.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		muteButton.left = "350px";
		muteButton.top = "-10px";

		muteButton.onPointerUpObservable.add(function () {
			if (window.audioManager) {
				const isMuted = window.audioManager.toggleMute();
				muteButton.children[0].text = isMuted ? "Unmute" : "Mute";
				muteButton.background = isMuted ? "red" : "green";
			}
		});

		advancedTexture.addControl(muteButton);
	}

	#setupScore(scene, engine) {
		const target = this.#playerScore;
		let timeElapsed = 0;
		const targetTime = 5;
		let gameEnded = false;

		scene.onBeforeRenderObservable.add(() => {
			if (window.gameStarted && !gameEnded) {
				timeElapsed += engine.getDeltaTime() / 1000;

				if (timeElapsed >= targetTime) {
					target.text += 1;
					timeElapsed = 0;
				}
			}
		});
	}

	#setupTimer(scene, engine) {
		const target = this.#timer;
		let timeElapsed = 0;
		const targetTime = 300;
		let gameEnded = false;

		scene.onBeforeRenderObservable.add(() => {
			if (window.gameStarted && !gameEnded) {
				timeElapsed += engine.getDeltaTime() / 1000;

				if (window.gameOver) {
					resetToDefault();
					gameEnded = true;
					window.gameStarted = false;
					target.text = "Game Over";
					console.log("%cGame Over - Too Many Victims!", "color: red; font-size: 24px;");
					scene.onBeforeRenderObservable.remove(this);
				}
				else {
					target.text = `Time: ${timeElapsed.toFixed(1)}s`;
				}
			}
		});
	}



	resetToDefault() {
		this.#title.isVisible = true;
		this.#subtitle.isVisible = true;
		this.buttonList.startGameButton.isVisible = true;

		this.#title.text = "Restarting Game in 5 seconds";
		setTimeout(function () {
			window.location.reload();
		}, 5000);
	}


}


