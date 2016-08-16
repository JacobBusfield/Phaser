// Constants
MAX_HEALTH = 3
JUMP_SPEED = 400

// Player constructor
var Player = function(game, x, y) 
{
	Phaser.Sprite.call(this, game, x, y, 'ss');
	
	// Set up keyboard controls
	cursors = game.input.keyboard.createCursorKeys();
	wasd = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
	};

	// Player animations
	this.animations.add('walk', [34,35,36,37,38,39,40,41,42,43,44]);
	this.animations.add('idle', [17,18,19,17,17,17,18,19,17,17,18,19,20,85,86,87,86,85,20,19,17]);
	this.animations.add('hurt', [21,22,23,24,25,26,27,28]);
	this.animations.add('crouch',[14]);
	this.animations.add('jump', [53]);
	this.animations.add('air', [54,55]);
	this.animations.add('land', [56,57,51]);
	this.animations.add('shootIdle', [103]);
	this.animations.add('shootRun', [108,109,110,111,112,113,114,115,116,117,118]);
	this.animations.add('shootAir', [121]);
	this.animations.add('hit', [76,77,78]);
	
	// player attributes
	this.health = MAX_HEALTH;
	this.anchor.setTo(.5, 1);
	this.direction = MoveState.RIGHT;
	this.damageStep = false;
	
	this.jumps = 0;
	this.jumping = false;
	
	// Enable phyiscs on player
	game.physics.enable(this, Phaser.Physics.ARCADE);
	
	// Add weapon to player
	this.weapon = game.add.weapon(10, 'imgBullet');
	this.weapon.fireAngle = 0;
	this.weapon.trackSprite(this, 24, -33);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon.bulletSpeed = 1000;
	this.weapon.fireRate = 100;
	this.weapon.bulletGravity.y = -1000; // counter gravity.
	
	//  Modify a few player properties
	this.body.bounce.y = 0;
	this.body.collideWorldBounds = true;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	playerMovement(this); // Keyboard Controls
	if (this.health <= 0)
	{
		this.kill();
	}
};

function playerMovement(player) 
{
	if (!player.damageStep)
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
				
				drawWalkFrames(player);
			}
			// Else if player is airbourne
			else
			{
				drawAirFrames(player);
				
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
				
				drawWalkFrames(player);
			}
			// Else if player is airbourne
			else
			{
				drawAirFrames(player);

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
				drawAirFrames(player);
				player.body.velocity.x *= 0.995;
			}
			// Stood on land
			else
			{
				drawIdleFrames(player);
				player.body.velocity.x = 0; // Stop player		
			}		
		}
		
		/** Up (Jump) Button **/
		if (wasd.up.isDown)
		{
			// Jump just started
			if (player.jumping == false)
			{
				player.jumping = true;
				
				// Reset double jump when on floor.
				if (player.body.onFloor())
				{
					player.jumps = 2;
				}
				
				// else must be jumping in the air, reduce jumps left
				else if (player.jumps > 0)
				{
					player.jumps--;
				}
			}
			// up is being held, allow this to increase jump height for short period.
			else if (player.jumps > 0 && (wasd.up.duration<250)) 
			{
				player.animations.play('jump', 1, true);
				player.body.velocity.y = -this.JUMP_SPEED;
			}

		}
		// If jump is not being held, then reset jumping variable.
		else if (player.jumping){
			player.jumping = false;
		}
		
		
	}
	else
	{
		player.animations.play('hit', 20, true);
		if (player.animations.currentAnim.loopCount > 1)
		{
			player.damageStep = false;
			player.health--;
		}
	}
}

/***  ***/
function drawWalkFrames(player)
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
function drawIdleFrames(player)
{
	// If shooting, animate 
	if (cursors.up.isDown)
	{
		player.animations.play('shootIdle',5,true);
		player.weapon.fire();
	}
	// If hurt play laboured animation.
	else if (player.health < MAX_HEALTH)
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
function drawAirFrames(player)
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

Player.prototype.hit = function()
{
	this.damageStep=true;
}