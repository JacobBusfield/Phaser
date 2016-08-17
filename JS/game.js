var MoveState = {
	LEFT:1,
	RIGHT:2,
	IDLE:3,
};

var Game = {	
    preload : function() {
		game.load.spritesheet('ss', 'Images/sheet.png', 56, 71.125, 136);
		game.load.image('imgBack', 'Images/back.png');
		game.load.image('imgBullet', 'Images/projectile.png');
		game.load.image('imgMissile', 'Images/missile.png');
		game.load.image('imgSmoke', 'Images/smoke.png');
		game.load.spritesheet('imgExplosion', 'Images/explosion.png', 128, 128);
		game.load.spritesheet('imgRaven', 'Images/raven2.png', 66.6666, 66.6666, 54);
		
		//
		game.load.spritesheet('rain', 'Images/rain.png', 17, 17);
		
		//
		game.load.audio('laser', 'Audio/laser.wav');
		game.load.audio('explode', 'Audio/explode.wav');
		game.load.audio('music', 'Audio/noSleep.mp3');
    },

    create: function () {
		//	Enable p2 physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 1000;
		
		// Background
		game.add.sprite(0, 0, 'imgBack');

		// Player
		p = this.game.add.existing( new Player(this.game, 50, 600) );
		
		
		//
		rGroup = game.add.group();
		
		// Missile objects
		missileGroup = game.add.group();
		explosionGroup = game.add.group();
		
		
		//////////////////////////////////////////////////////////
		emitter = game.add.emitter(game.world.centerX, 0, 400);
		emitter.width = game.world.width;

		emitter.makeParticles('rain');

		emitter.minParticleScale = 0.1;
		emitter.maxParticleScale = 0.5;

		emitter.setYSpeed(300, 500);
		emitter.setXSpeed(-5, 5);

		emitter.minRotation = 0;
		emitter.maxRotation = 0;

		emitter.start(false, 1600, 5, 0);
		//////////////////////////////////////////////////////////
		
		
		explode = game.add.audio('explode');
		music = game.add.audio('music');
		music.loop = true;
		music.play();
		
    },

    update: function () 
	{	
		if (!p.exists)
		{
			score = 20;
			this.state.start('Menu');
		}


	
		// TEST CODE. //-------------------------------------------
		// If there are fewer than MAX_MISSILES, launch a new one
		if (missileGroup.countLiving() < 0) {
			// Set the launch point to a random location below the bottom edge
			// of the stage
			launchMissile(game.rnd.integerInRange(100, game.width-100), 20,0);
		}
		
		if (rGroup.countLiving()<5) 
		{
			launchRaven(game.rnd.integerInRange(0, 200))
		}
		//---------------------------------------------------------

		
		
		
		// Update where missiles are heading
		missileGroup.forEachAlive(function(m) 
		{
			setTarget(m, p.x-25,p.y-35);
		}, this);
		
		// Missile Collision
		missileGroup.forEachAlive(function(m) 
		{
			// Player
			tempDistance = game.math.distance(m.x, m.y, p.x-24, p.y-33);
			if (tempDistance < 25)
			{
				getExplosion(m.x, m.y);
				explode.play();
				m.kill();
				p.hit();
			}
			
			// Floor
			tempDistance = game.math.distance(m.x, m.y, p.x-24, p.y-33);
			if (m.y > 580)
			{
				getExplosion(m.x, m.y);
				explode.play();
				m.kill();
			}
			
			// Missiles
			missileGroup.forEachAlive(function(m2)
			{
				if (m != m2)
				{
					tempDistance = game.math.distance(m.x, m.y, m2.x, m2.y);
				if (tempDistance < 15)
				{
					getExplosion(m.x, m.y);
					explode.play();
					m.kill();
					m2.kill();
				}
				}
				
			}, this);
			
			// Bullets
			p.weapon.bullets.forEachAlive(function(b)
			{
				tempDistance = game.math.distance(m.x, m.y, b.x, b.y);
				if (tempDistance < 12)
				{
					getExplosion(m.x, m.y);
					explode.play();
					m.kill();
					b.kill();
				}
			}, this);
		}, this);
	}
};

