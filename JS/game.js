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
    },

    update: function () 
	{		
		// TEST CODE. //-------------------------------------------
		// If there are fewer than MAX_MISSILES, launch a new one
		if (missileGroup.countLiving() < 0) {
			// Set the launch point to a random location below the bottom edge
			// of the stage
			launchMissile(game.rnd.integerInRange(100, game.width-100), 20);
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
			// Floor or player
			tempDistance = game.math.distance(m.x, m.y, p.x-24, p.y-33);
			if ((tempDistance < 25)||(m.y > 580))
			{
				m.kill();
				getExplosion(m.x, m.y);
			}
			
			// Missiles
			missileGroup.forEachAlive(function(m2)
			{
				if (m != m2)
				{
					tempDistance = game.math.distance(m.x, m.y, m2.x, m2.y);
				if (tempDistance < 15)
				{
					m.kill();
					getExplosion(m.x, m.y);
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
					m.kill();
					getExplosion(m.x, m.y);
					b.kill();
				}
			}, this);
		}, this);
	}
};

