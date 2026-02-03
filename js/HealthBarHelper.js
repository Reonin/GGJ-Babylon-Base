export default class HealthBarHelper {
	constructor(GUI, advancedTexture) {
		this.GUI = GUI;
		this.advancedTexture;
		this.healthBars = [];


	}


	createHealthBar(mesh) {
		const healthBarPanel = new this.GUI.StackPanel(`${mesh.id}_healthBarPanel`);
		healthBarPanel.widthInPixels = 55;
		healthBarPanel.heightInPixels = 70;
		healthBarPanel.isVertical = true;
		healthBarPanel.verticalAlignment = this.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		healthBarPanel.horizontalAlignment = this.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		healthBarPanel.background = 'rgba(0,0,0,0.5)';

		const healthBar = new this.GUI.Rectangle(`${mesh.id}_healthBar`);
		healthBar.widthInPixels = 55;
		healthBar.heightInPixels = 7;
		healthBar.color = 'rgba(101,9,9,0.8)';
		healthBar.background = 'rgba(158,13,13,0.8)';
		healthBar.thickness = 1;
		healthBar.setPaddingInPixels(2, 2, 2, 2);
		healthBar.horizontalAlignment = this.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

		healthBarPanel.addControl(healthBar);



		this.advancedTexture = this.GUI.AdvancedDynamicTexture.CreateForMesh(
			mesh,
			15,
			5,
		);

		const button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
			button1.width = 0.5;
			button1.height = 0.4;
			button1.color = "white";
			button1.background = "green";
			button1.onPointerUpObservable.add(function() {
				alert("Button clicked!");
		});

	

		this.advancedTexture.addControl(healthBarPanel);
		this.advancedTexture.addControl(button1);

		this.healthBars.push({ mesh, panel: healthBarPanel, healthBar});
	}

	getCoordinatesByMesh(mesh) {
		// const canvasRect = this.player.scene.getEngine().getRenderingCanvasClientRect()
		// if (!canvasRect) return

		// // to 2D
		// const projectedPosition = Vector3.Project(
		// mesh.position.clone().addInPlace(new Vector3(0, mesh.scaling.y * 1.9, 0)),
		// Matrix.Identity(),
		// this.player.scene.getTransformMatrix(),
		// this.player.scene.activeCamera.viewport.toGlobal(
		// 	this.player.scene.getEngine().getRenderWidth(),
		// 	this.player.scene.getEngine().getRenderHeight(),
		// ),
		// )

		// let x = (projectedPosition.x / canvasRect.width) * canvasRect.width
		// let y = (projectedPosition.y / canvasRect.height) * canvasRect.height

		// const cameraForward = this.player.scene.activeCamera.getForwardRay().direction
		// const toObject = mesh.position.subtract(this.player.scene.activeCamera.position).normalize()
		// const angle = Vector3.Dot(cameraForward, toObject)
		// if (angle < 0) {
		// 	x = -100 // offset on left screen part
		// 	y = -100
		// }

		return { x: mesh.position.x, y: mesh.position.y };
  }

	updateHealthBars() {
		this.healthBars.forEach((mesh, index) => {
			const healthBarData = this.healthBars[index];
			//const coords = this.getCoordinatesByMesh(healthBarData.mesh);
				console.log("woot")
				const coords = {x : 0, y: 1}
			if (healthBarData && coords) {
				const { panel, healthBar } = healthBarData;

				const isVisible = coords.y >= 0;

				if (isVisible) {
					panel.isVisible = true;
					healthBar.isVisible = true;
					if (panel.widthInPixels && panel.heightInPixels) {
						panel.leftInPixels = coords.x - panel.widthInPixels / 2;
						panel.topInPixels = coords.y - panel.heightInPixels / 2;
					}
					const health = mesh.metadata?.health || 0;
					const maxHealth = mesh.metadata?.maxHealth || 120;
					healthBar.width = `${(health / maxHealth) * 100}%`;
					// if (health === 0) {
					// 	healthBar.dispose()
					// 	panel.dispose()
					// }
				} else {
					panel.isVisible = false;
					healthBar.isVisible = false;
				}
			}
		})
	}


} 