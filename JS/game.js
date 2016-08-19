var MoveState = {
	LEFT:1,
	RIGHT:2
};

var Game = {	
    preload : function() {
		
    },

    create: function () {
		//	Enable p2 physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 1000;
		
		// Background
		game.add.sprite(0, 0, 'imgBack');

		// Player
		p = this.game.add.existing( new Player(this.game, 50, 600) );
		
		// Missile carrying ravens.
		rGroup = game.add.group();
		
		// Missile objects
		missileGroup = game.add.group();
		explosionGroup = game.add.group();
		
		// Rain
		emitter = game.add.emitter(game.world.centerX, 0, 400);
		emitter.width = game.world.width;
		emitter.makeParticles('imgRain');
		emitter.minParticleScale = 0.1;
		emitter.maxParticleScale = 0.5;
		emitter.setYSpeed(300, 500);
		emitter.setXSpeed(-5, 5);
		emitter.minRotation = 0;
		emitter.maxRotation = 0;
		emitter.start(false, 1600, 5, 0);

		// Lightning
		// Make the world a bit bigger than the stage so we can shake the camera
		game.world.setBounds(-5, -5, game.width + 10, game.height + 10);
		/* lGroup = game.add.group(); */ ////////////////////////////////////////////////////////////
		this.game.add.existing( new Lightning(game) );
		explode = game.add.audio('sExplode');
		thunder = game.add.audio('sThunder');
		
		
		// Objects have long run time, so dont let them be overwritten and forgotten about as
		// instead of being 'collected' theyy continue playing.
		if (typeof game.raining == 'undefined')
		{
			game.raining = game.add.audio('sRaining');
			game.raining.loop = true;
			game.raining.play();
		}
		if (typeof game.music == 'undefined')
		{
			game.music = game.add.audio('sMusic');
			game.music.loop = true;
			game.music.allowMultiple = false;
			game.music.volume = 0.5;
			game.music.play();
		}
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
			launchRaven(game.rnd.integerInRange(0, 200));
		}
		
/* 		if (lGroup.countLiving()<5) 
		{
			launchLightning();
		} */
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

