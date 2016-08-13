var MoveState = {
	LEFT:1,
	RIGHT:2,
	IDLE:3,
};

var Game = {	
    preload : function() {
		game.load.spritesheet('ss', 'Images/sheet.png', 56, 71.125, 136);
		game.load.image('imgBack', 'Images/back.png');
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
		
		// player attributes
		player.health = 3;
		player.anchor.setTo(.5, 1);
		player.direction = MoveState.RIGHT;
		
		//  Enable if for physics. This creates a default rectangular body.
		game.physics.enable(player, Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 250;
		
		//  Modify a few player properties
		player.body.bounce.y = 0;
		player.body.collideWorldBounds = true;

		// Set up keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
    },

    update: function () {		
		// Keyboard Controls
		playerMovement();
    }
};

function playerMovement() 
{
	/** Left Button **/
	if (cursors.left.isDown)
	{
		// Is facing the wrong way, flip sprite horizontally.
		if (player.direction == MoveState.RIGHT)
		{
			player.scale.x *= -1;
			player.direction = MoveState.LEFT;
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
			
			// Accelerate through frames based on actual speed.
			temp = Math.abs((player.body.velocity.x)*(2/30));
			if (temp > 8) // Lower limit required to prevent weird animation.
			{
				player.animations.play('walk', temp, true);
				player.animations.currentAnim.speed = temp;
			}
			else
			{
				player.animations.play('walk', 8, true);
			}
		}
		// Else if player is airbourne
		else
		{
			player.animations.play('air', 2, true);
			
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
	else if (cursors.right.isDown)
	{
		// Is facing the wrong way, flip sprite horizontally.
		if (player.direction == MoveState.LEFT)
		{
			player.scale.x *= -1;
			player.direction = MoveState.RIGHT;
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
			
			// Accelerate through frames based on actual speed.
			temp = Math.abs((player.body.velocity.x)*(2/30));
			if (temp > 8) // Lower limit required to prevent weird animation.
			{
				player.animations.play('walk', temp, true);
				player.animations.currentAnim.speed = temp;
			}
			else
			{
				player.animations.play('walk', 8, true);
			}
		}
		// Else if player is airbourne
		else
		{
			player.animations.play('air', 2, true);
			
			// slow player's horizontal movement (drag)
			player.body.velocity.x *= 0.995;
			
			// Give player some in-air control.
			if (player.body.velocity.x < 200)
			{
				player.body.velocity.x += 5;
			}
		}
	}
	/** Neither Left, Nor Right Button **/
	else
	{
		// Airbourne - slow player's horizontal movement
		if (!player.body.onFloor())
		{
			player.animations.play('air', 2, true);
			player.body.velocity.x *= 0.995;
		}
		// Stood on land
		else
		{
			// Stop player
			player.body.velocity.x = 0;
			
			// If hurt play laboured animation.
			if (player.health >= 3)
			{
				player.animations.play('idle', 3, true);
			}
			else
			{
				player.animations.play('hurt', 5, true);
			}
		}
		
		
	}
	
	/** Up (Jump) Button **/
	if (cursors.up.isDown)
	{			
		if (player.body.onFloor())
		{
			player.animations.play('jump', 1, true);
			player.body.velocity.y = -250;
		}
	}
	
	/** Down (Crouch) Button **/
	else if (cursors.down.isDown)
	{
		if (player.body.onFloor())
		{
			player.body.velocity.x = 0;
			player.animations.play('crouch', 5, true);
		}
	}
}