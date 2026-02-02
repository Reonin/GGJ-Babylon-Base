export class AudioManager {
	constructor(Babylon, scene) {
		this.BABYLON = Babylon;
		this.scene = scene;
		this.warmPiano;

		this.isMuted = false;
		this.keys = {
			pingFX: null,
			error: null
		};
		this.#loadSounds();

		// Store globally so mute button can access it
		window.audioManager = this;
	}


	playKey(key) {
		if (this.isMuted) return;
		this[key].then(s => s.play());
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
		// Pause/resume theme music
		if (this.theme) {
			this.theme.then(s => {
				if (this.isMuted) {
					s.pause();
				} else {
					s.play();
				}
			});
		}
		return this.isMuted;
	}

	
	async #loadSounds() {
		this.audioEngine = await this.BABYLON.CreateAudioEngineAsync();
		// Wait for the audio engine to unlock
		await this.audioEngine.unlockAsync();

		this.theme = new this.BABYLON.CreateSoundAsync("error", "./audio/useBeepBox.wav", {
			loop: true,
			autoplay: true,
			volume: 1.0,
		});

		/***Sound Map */
		const soundMap = {
			pingFX: "ping.mp3",
			error: "error.mp3"
		};

		const options = { loop: false, autoplay: false, volume: 1.0 };

		// Loop through the map and assign to this[key]
		Object.entries(soundMap).forEach(([key, fileName]) => {
			this[key] = new this.BABYLON.CreateSoundAsync(key, `./audio/${fileName}`, options);
		});

	}
}