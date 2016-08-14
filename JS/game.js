var MoveState = {
	LEFT:1,
	RIGHT:2,
	IDLE:3,
};

// Constants
MAX_MISSILES = 10;

var Game = {	
    preload : function() {
		game.load.spritesheet('ss', 'Images/sheet.png', 56, 71.125, 136);
		game.load.image('imgBack', 'Images/back.png');
		game.load.image('imgBullet', 'Images/projectile.png');
		game.load.image('imgMissile', 'Images/missile.png');
		game.load.image('imgSmoke', 'Images/smoke.png');
		game.load.spritesheet('imgExplosion', 'Images/explosion.png', 128, 128);
    },

    create: function () {
		//	Enable p2 physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Background
		game.add.sprite(0, 0, 'imgBack');

		// Player
		p = this.game.add.existing( new Player(this.game, 20, 600) );
		
		// Missile objects
		missileGroup = game.add.group();
		explosionGroup = game.add.group();

		// Set up keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
    },

    update: function () 
	{		
		// TEST CODE. //-------------------------------------------
		// If there are fewer than MAX_MISSILES, launch a new one
		if (missileGroup.countLiving() < MAX_MISSILES) {
			// Set the launch point to a random location below the bottom edge
			// of the stage
			launchMissile(game.rnd.integerInRange(50, game.width-50), 20);
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
				if (tempDistance < 23)
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

