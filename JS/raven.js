var Raven = function(game, x, y) 
{
	Phaser.Sprite.call(this, game, x, y, 'imgRaven');
	
	game.physics.enable(this, Phaser.Physics.ARCADE);
	
	this.body.allowGravity = false;
	this.body.velocity.x = 150;
		
	this.animations.add('fly', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20,21,22,23,24,25]);
	this.animations.add('flyMissile', [27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,50,51,52]);
	this.transformed = false;
}
Raven.prototype = Object.create(Phaser.Sprite.prototype);
Raven.prototype.constructor = Raven;

Raven.prototype.update = function() {
	if(this.transformed == false)
	{
		this.animations.play('flyMissile', 10, true);
	}
	else
	{
		this.animations.play('fly', 10, true);
	}
	
	if ((this.x < 800)&&(this.x>300)&&(this.transformed == false))
	{
		this.transformed = true;
		launchMissile(this.x+45, this.y+48,-5);
	}
	if ((this.x < -100)||(this.x>1300))
	{
		this.kill();
	}
};

function launchRaven(y) {
    // Get the first dead missile from the missileGroup
    var raven = this.rGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (raven === null) {
        raven = new Raven(this.game);
        this.rGroup.add(raven);
    }

    raven.revive();
	raven.transformed = false;

	raven.x = -Math.floor(Math.random() * 1000);
    raven.y = y;

    return raven;
};