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

		// Player animations
		player = game.add.sprite(20, 600, 'ss');
		player.animations.add('walk', [34,35,36,37,38,39,40,41,42,43,44]);
		player.animations.add('idle', [17,18,19,17,17,17,18,19,17,17,18,19,20,85,86,87,86,85,20,19,17]);
		player.animations.add('hurt', [21,22,23,24,25,26,27,28]);
		player.animations.add('crouch',[14]);
		player.animations.add('jump', [51,53,54]);
		player.animations.add('air', [54,55]);
		player.animations.add('land', [56,57,51]);
		player.animations.add('shootIdle', [103]);
		player.animations.add('shootRun', [108,109,110,111,112,113,114,115,116,117,118]);
		player.animations.add('shootAir', [121]);
		
		// player attributes
		player.health = 3;
		player.anchor.setTo(.5, 1);
		player.direction = MoveState.RIGHT;
		
		//  Enable if for physics. This creates a default rectangular body.
		game.physics.enable(player, Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 1000;
		
		// Add weapon to player
		player.weapon = game.add.weapon(10, 'imgBullet');
		player.weapon.fireAngle = 0;
		player.weapon.trackSprite(player, 24, -33);
		player.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		player.weapon.bulletSpeed = 1000;
		player.weapon.fireRate = 100;
		player.weapon.bulletGravity.y = -1000; // counter gravity.
		
		//  Modify a few player properties
		player.body.bounce.y = 0;
		player.body.collideWorldBounds = true;

		// Set up keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		
		wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
		
		// Groups
		missileGroup = game.add.group();
		explosionGroup = game.add.group();
    },

    update: function () 
	{		
		// Keyboard Controls
		playerMovement();
		
		// TEST CODE. //-------------------------------------------
		// If there are fewer than MAX_MISSILES, launch a new one
		if (missileGroup.countLiving() < MAX_MISSILES) {
			// Set the launch point to a random location below the bottom edge
			// of the stage
			launchMissile(game.rnd.integerInRange(50, game.width-50), 20);
		}
		//---------------------------------------------------------

		// Missile Collision
		missileGroup.forEachAlive(function(m) 
		{
			// Floor or player
			tempDistance = game.math.distance(m.x, m.y, player.x-24, player.y-33);
			if ((tempDistance < 25)||(m.y > 580))
			{
				m.kill();
				getExplosion(m.x, m.y);
			}
			
			// Bullets
			player.weapon.bullets.forEachAlive(function(b)
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


function playerMovement() 
{
	/** Left Button **/
	if (wasd.left.isDown)
	{
		// Is facing the wrong way, flip sprite horizontally.
		if (player.direction == MoveState.RIGHT)
		{
			player.scale.x *= -1;
			player.direction = MoveState.LEFT;
			player.weapon.fireAngle =180;
			player.weapon.trackSprite(player, -24, -33);
		}
		
		// If player is stood on a surface
		if (player.body.onFloor())
		{
			// Accelerate player left.
			if(player.body.velocity.x > -50)
			{
				player.body.velocity.x = -50;
			}
			else if(player.body.velocity.x >= -295)
			{
				player.body.velocity.x -= 5;
			}
			
			drawWalkFrames();
		}
		// Else if player is airbourne
		else
		{
			drawAirFrames();
			
			// slow player's horizontal movement (drag)
			player.body.velocity.x *= 0.995;
			
			// Give player some in-air control.
			if (player.body.velocity.x > -200)
			{
				player.body.velocity.x -= 5
			}
		}
	}
	/** Right Button **/
	else if (wasd.right.isDown)
	{
		// Is facing the wrong way, flip sprite horizontally.
		if (player.direction == MoveState.LEFT)
		{
			player.scale.x *= -1;
			player.direction = MoveState.RIGHT;
			player.weapon.fireAngle = 0;
			player.weapon.trackSprite(player, 24, -33);
		}
		
		// If player is stood on a surface
		if (player.body.onFloor())
		{	
			// Accelerate player right.
			if(player.body.velocity.x < 50)
			{
				player.body.velocity.x = 50;
			}
			else if(player.body.velocity.x <= 295)
			{
				player.body.velocity.x += 5;
			}
			
			drawWalkFrames();
		}
		// Else if player is airbourne
		else
		{
			drawAirFrames();

			// slow player's horizontal movement (drag)
			player.body.velocity.x *= 0.995;
			
			// Give player some in-air control.
			if (player.body.velocity.x < 200)
			{
				player.body.velocity.x += 5;
			}
		}
	}
	/** Down (Crouch) Button **/
	else if (wasd.down.isDown)
	{
		if (player.body.onFloor())
		{
			player.body.velocity.x = 0;
			player.animations.play('crouch', 5, true);
		}
	}
	/** Neither Left, Nor Right Button **/
	else
	{
		// Airbourne - slow player's horizontal movement
		if (!player.body.onFloor())
		{
			drawAirFrames();
			player.body.velocity.x *= 0.995;
		}
		// Stood on land
		else
		{
			drawIdleFrames();
			player.body.velocity.x = 0; // Stop player		
		}		
	}
	
	/** Up (Jump) Button **/
	if (wasd.up.isDown)
	{			
		if (player.body.onFloor())
		{
			player.animations.play('jump', 1, true);
			player.body.velocity.y = -500;
		}
	}
	

}

/***  ***/
function drawWalkFrames()
{
	// Accelerate through frames.
	temp = Math.abs((player.body.velocity.x)*(2/30));
	if (temp < 8) // Lower limit required to prevent weird animation.
	{
		temp = 8;
	}
	else{
		player.animations.currentAnim.speed = temp;
	}
	
	// Shooting while running
	if (cursors.up.isDown)
	{
		player.animations.play('shootRun', temp, true);
		player.weapon.fire();
	}
	// Just running
	else
	{
		player.animations.play('walk', temp, true);
	}
}

/***   ***/
function drawIdleFrames()
{
	// If shooting, animate 
	if (cursors.up.isDown)
	{
		player.animations.play('shootIdle',5,true);
		player.weapon.fire();
	}
	// If hurt play laboured animation.
	else if (player.health < 3)
	{
		player.animations.play('hurt', 5, true);
	}
	// Else stand proudly.
	else
	{
		player.animations.play('idle', 3, true);
	}
}

/***  ***/
function drawAirFrames()
{
	if (cursors.up.isDown)
	{
		player.animations.play('shootAir',5,true);
		player.weapon.fire();
	}
	else
	{
		player.animations.play('air', 2, true);
	}
}