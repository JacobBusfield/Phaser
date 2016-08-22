var Prep = {
	WARN:1,
	ZAP:2,
	IDLE:3
};

var Lightning = function(game)
{
	// Lightning marker variables
	Phaser.Sprite.call(this, game, 20, 20, 'imgMarker');
	//this.animations.add('go', [0,1,2,3,4,4,4,4,4,4]);
	this.animations.add('go', [0,1,2,3,4,5,6,7,8,9,9,9,9]);
	this.animations.add('hold', [5,5,5,5,4,3,2,1,0,0,0,0,0,0,0]);
	this.visible = false;
    this.anchor.setTo(0.5, 1);
	
	this.graphics = game.add.graphics(0, 0);
	
	// used to determine how often to cause lightning strikes.
	this.prep = Prep.IDLE;
	this.maxPeriod = 1; // Starting period, higher is less frequent.
	this.period = 0;	

	// Lightning variables
	// Create a bitmap for the lightning bolt texture
	lightningBitmap = game.add.bitmapData(400, 1500);
	// Create a sprite to hold the lightning bolt texture
	this.lightning = game.add.image(game.width/2, 0, lightningBitmap);
	// This adds what is called a "fragment shader" to the lightning sprite.
	// See the fragment shader code below for more information.
	// This is an WebGL feature. Because it runs in your web browser, you need
	// a browser that support WebGL for this to work.
	this.lightning.filters = [ game.add.filter('Glow') ];
	// Set the anchor point of the sprite to center of the top edge
	// This allows us to position the lightning by simply specifiying the
	// x and y coordinate of where we want the lightning to appear from.
	this.lightning.anchor.setTo(0.5, 0);

	// Create a white rectangle that we'll use to represent the flash
	this.flash = game.add.graphics(0, 0);
	this.flash.beginFill(0xffffff, 1);
	this.flash.drawRect(0, 0, game.width, game.height);
	this.flash.endFill();
	this.flash.alpha = 0;
		
		
	game.time.events.loop(Phaser.Timer.SECOND*3, launchBolt, this);
}
Lightning.prototype = Object.create(Phaser.Sprite.prototype);
Lightning.prototype.constructor = Lightning;


function launchBolt() 
{
	// 3 phases. Warn the player of bolt. Zap the bolt. Idly wait.
	
	if (this.prep == Prep.WARN)
	{
		// Set random location for strike
		this.x = Math.floor(Math.random() * 1024);
		this.y = 600
		
		// Draw marker
		this.animations.play('go',4,true);
		this.visible = true;
		
		// Damage region.
		this.graphics.beginFill(0x010000, 0.05);
		this.graphics.drawCircle(this.x, this.y-55, 300);
		this.graphics.endFill();
		
		// Next zap() call is strike.
		this.prep = Prep.ZAP;		
	}
	else if (this.prep == Prep.ZAP)
	{
		// Marker retreats
		this.animations.play('hold',4,true);
		this.graphics.clear();
		
		// Lightning hits marker top
		zap(this,this.x,this.y-55);
		
		// Next zap() call is idle.
		this.prep = Prep.IDLE;
	}
	else if (this.prep == Prep.IDLE)
	{
		// Remove marker
		this.visible = false;
		this.graphics.clear();
		
		// Use period variable to wait maxPeriod function calls before setting marker
		if (this.period >= this.maxPeriod)
		{
			this.animations.stop(null, true); // Stop animation so it can be restarted from start
			this.period = 0;
			this.prep = Prep.WARN;
		}
		else
		{
			this.period++;
		}
	}
}

// Create a lightning bolt
function zap(bolt, x, y) {
	// hit player if they are close.
	if (game.math.distance( p.x-24, p.y-33, x, y) < 150) 
	{
		p.hit();
	}
	// hit missile if its close
	missileGroup.forEachAlive(function(m) 
	{
		if (game.math.distance( m.x, m.y, x, y) < 150) 
		{
			missileHit(m);
		}
	},this);

    // Rotate the lightning sprite so it goes in the
    // direction of the pointer
    bolt.lightning.rotation = game.math.angleBetween( game.width/2, 0, x, y ) - Math.PI/2;

    // Calculate the distance from the lightning source to the pointer
    var distance = game.math.distance( game.width/2, 0, x, y );

    // Create the lightning texture
    createLightningTexture(lightningBitmap.width/2, 0, 20, 3, false, distance);

    // Make the lightning sprite visible
    bolt.alpha = 1;

    // Fade out the lightning sprite using a tween on the alpha property.
    // Check out the "Easing function" examples for more info.
    game.add.tween(bolt.lightning)
        .to({ alpha: 0.5 }, 200, Phaser.Easing.Bounce.Out)
        .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 0 }, 500, Phaser.Easing.Cubic.In)
        .start();

    // Create the flash
    bolt.flash.alpha = 1;
    game.add.tween(bolt.flash)
        .to({ alpha: 0 }, 200, Phaser.Easing.Cubic.In)
        .start();

    // Shake the camera by moving it up and down 5 times really fast
    game.camera.y = 0;
    game.add.tween(game.camera)
        .to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
        .start();
		
	// Play audio	
	thunder.play();
};

// This function creates a texture that looks like a lightning bolt
function createLightningTexture(x, y, segments, boltWidth, branch, distance) {
    // Get the canvas drawing context for the lightningBitmap
    var ctx = lightningBitmap.context;
    var width = lightningBitmap.width;
    var height = lightningBitmap.height;

    // Our lightning will be made up of several line segments starting at
    // the center of the top edge of the bitmap and ending at the target.

    // Clear the canvas
    if (!branch) ctx.clearRect(0, 0, width, height);

    // Draw each of the segments
    for(var i = 0; i < segments; i++) {
        // Set the lightning color and bolt width
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineWidth = boltWidth;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Calculate an x offset from the end of the last line segment and
        // keep it within the bounds of the bitmap
        if (branch) {
            // For a branch
            x += game.rnd.integerInRange(-10, 10);
        } else {
            // For the main bolt
            x += game.rnd.integerInRange(-30, 30);
        }
        if (x <= 10) x = 10;
        if (x >= width-10) x = width-10;

        // Calculate a y offset from the end of the last line segment.
        // When we've reached the target or there are no more segments left,
        // set the y position to the distance to the target. For branches, we
        // don't care if they reach the target so don't set the last coordinate
        // to the target if it's hanging in the air.
        if (branch) {
            // For a branch
            y += this.game.rnd.integerInRange(10, 20);
        } else {
            // For the main bolt
            y += this.game.rnd.integerInRange(20, distance/segments);
        }
        if ((!branch && i == segments - 1) || y > distance) {
            // This causes the bolt to always terminate at the center
            // lightning bolt bounding box at the correct distance to
            // the target.
            y = distance;
            if (!branch) x = width/2;
        }

        // Draw the line segment
        ctx.lineTo(x, y);
        ctx.stroke();

        // Quit when we've reached the target
        if (y >= distance) break;

        // Draw a branch 40% of the time off the main bolt only
        if (!branch) {
            if (Math.floor(Math.random() * 1.4)) {
                // Draws another, thinner, bolt starting from this position
                this.createLightningTexture(x, y, 10, 1, true, distance);
            }
        }
    }

    // This just tells the engine it should update the texture cache
    lightningBitmap.dirty = true;
};

// Fragment shader
// This is an OpenGL/WebGL feature. Need a browser that support WebGL for this to work.
Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
        '}'
    ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;