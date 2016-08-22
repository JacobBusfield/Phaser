var Menu = {
    preload : function() {
		// Loading Screen
        game.start = game.add.sprite(0, 0, 'imgStart');
		style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		loadingText = game.add.text(0, 0, "Loading", style);
		loadingText.setTextBounds(0, 400, 1024, 100);
				
		
		/** GAME ASSETS **/
		// 
		// Images 
		game.load.image('imgBack', 'Images/back.png');
		game.load.image('imgBullet', 'Images/projectile.png');
		game.load.image('imgMissile', 'Images/missile.png');
		game.load.image('imgSmoke', 'Images/smoke.png');
		//
		// Sprite sheets
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
		this.add.button(0, 0, 'imgStart', this.startGame, this);
		
		style2 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		clickToStartText = game.add.text(0, 0, "Click to Start", style2);
		clickToStartText.setTextBounds(0, 400, 1024, 100);
		
		
		style1 = { font: "16px Arial", fill: "#555", boundsAlignH: "center", boundsAlignV: "middle" };
		credits = game.add.text(0, 0, "Music by jmagnum (jmagnum.newgrounds.com)", style1);
		credits.setTextBounds(0, 100, 1024, 800);
		
		if (score != 0)
		{
			if (highScore < score)
			{
				highScore = score;
			}
			scoreText = game.add.text(0, 0, "Score: " + score, style2);
			scoreText.setTextBounds(0, 40, 1024, 100);
			
			highScoreText = game.add.text(0, 0, "High Score: " + highScore, style2);
			highScoreText.setTextBounds(0, 100, 1024, 100);
		}
    },

    startGame: function () {
        this.state.start('Game');
    }
};