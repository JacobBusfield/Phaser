var Menu = {
    preload : function() {
		// Loading Screen
    game.start = game.add.sprite(0, 0, 'imgStart');
		style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		loadingText = game.add.text(0, 0, "Loading", style);
		loadingText.setTextBounds(0, 385, 1024, 100);
    
    this.game.paddingBot = 64;
		var barWidth = 600;
		var barHeight = 50;
		var barPaddingBot = 25
    var barX = (this.game.width - barWidth) / 2;
    var barY = this.game.height - barHeight - barPaddingBot - this.game.paddingBot;
    this.add.sprite(barX, barY, 'preloaderBarGray');
		this.preloadBar = this.add.sprite(barX, barY, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);
				
		
		/** GAME ASSETS **/
		// 
		// Images 
		game.load.image('imgBack', 'Images/back.png');
		game.load.image('imgTutorial', 'Images/tutorialScreen.png');
		game.load.image('imgBullet', 'Images/projectile.png');
		game.load.image('imgMissile', 'Images/missile.png');
		game.load.image('imgSmoke', 'Images/smoke.png');
		//
		// Sprite sheets
		game.load.spritesheet('imgStartButton', 'Images/startButton.png', 193, 67);
		game.load.spritesheet('imgTutorialButton', 'Images/tutorialButton.png', 193, 67);
		game.load.spritesheet('imgExplosion', 'Images/explosion.png', 128, 128);
		game.load.spritesheet('imgRaven', 'Images/raven2.png', 66.6666, 66.6666, 54);
		game.load.spritesheet('imgPlayer', 'Images/sheet.png', 56, 71.125, 136);
		game.load.spritesheet('imgRain', 'Images/rain.png', 17, 17);
		game.load.spritesheet('imgMarker', 'Images/marker.png', 20, 60);
		//
		// Audio
		game.load.audio('sLaser', 'Audio/laser.wav');
		game.load.audio('sExplode', 'Audio/explode.wav');
		game.load.audio('sThunder', 'Audio/thunder.wav');
		game.load.audio('sRaining', 'Audio/raining.wav');
		game.load.audio('sMusic', 'Audio/noSleep.mp3');		
    },

    create: function () {
    //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;
      
		// background image
		this.bgImg = this.add.sprite(0, 0, 'imgStart');
		
		// start / tutorial buttons
		this.buttonStart = game.add.button(game.world.centerX - 95, 450, 'imgStartButton', this.startGame, this, 1,0);
		this.buttonTutorial = game.add.button(game.world.centerX - 95, 360, 'imgTutorialButton', this.tutorial, this, 1,0);

		// giving recongnition to music's author
		this.style1 = { font: "16px Arial", fill: "#555", boundsAlignH: "center", boundsAlignV: "middle" };
		this.credits = game.add.text(0, 0, "Music by jmagnum (jmagnum.newgrounds.com)", this.style1);
		this.credits.setTextBounds(0, 100, 1024, 900);
		
		this.style2 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		
		// if score has been registered, show it on menu.
		if (score != 0)
		{
			if (highScore < score)
			{
				highScore = score;
			}
			this.scoreText = game.add.text(0, 0, "Score: " + score, this.style2);
			this.scoreText.setTextBounds(0, 40, 1024, 100);
			
			this.highScoreText = game.add.text(0, 0, "High Score: " + highScore, this.style2);
			this.highScoreText.setTextBounds(0, 100, 1024, 100);
		}
    },

    startGame: function () {
        this.state.start('Game');
    },
	
	tutorial: function () {
		this.bgImg.loadTexture('imgTutorial');
		this.buttonTutorial.kill();
		this.credits.kill();
		this.scoreText.kill();
		this.highScoreText.kill();
    }
};
