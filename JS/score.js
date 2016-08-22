var score = 0;
var highScore = 0;

function addScore(game, x, y, amount)
{
	score += amount;
		
	this.styleUp = { font: "bold 12px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };
	
	// Get the first dead text object
    text = this.textGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (text === null) {
        text = game.add.text(x, y, amount, this.styleUp);
        this.textGroup.add(text);
    }

    text.revive();

    // Move text to the given coordinates and show amount
    text.x = x;
    text.y = y;
	text.text = "+" + amount;
	text.setStyle(this.styleUp);
	
	game.time.events.add(Phaser.Timer.SECOND*0.5, devestate, this);
}

function minusScore(game, x, y, amount)
{
	score -= amount;
	
	this.styleDown = { font: "bold 12px Arial", fill: "#ff0000", boundsAlignH: "center", boundsAlignV: "middle" };
	
	// Get the first dead text object
    text = this.textGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (text === null) {
        text = game.add.text(x, y, amount, this.styleDown);
        this.textGroup.add(text);
    }

    text.revive();

    // Move text to the given coordinates and show amount
    text.x = x;
    text.y = y;
	text.text = "-" + amount;
	text.setStyle(this.styleDown);
	
	game.time.events.add(Phaser.Timer.SECOND*0.5, devestate, this);
}


function devestate()
{
	textGroup.getFirstAlive().kill();
}