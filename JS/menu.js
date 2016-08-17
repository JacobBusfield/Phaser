score = 0;

var Menu = {
    preload : function() {
        game.load.image('imgStart', 'Images/start.png');
    },

    create: function () {
		this.add.button(0, 0, 'imgStart', this.startGame, this);
		
		style1 = { font: "16px Arial", fill: "#555", boundsAlignH: "center", boundsAlignV: "middle" };
		credits = game.add.text(0, 0, "Music by jmagnum (jmagnum.newgrounds.com)", style1);
		credits.setTextBounds(0, 100, 1024, 800);
		
		if (score > 0)
		{
			style2 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
			text = game.add.text(0, 0, "Score: " + score, style2);
			text.setTextBounds(0, 100, 1024, 100);
		}
    },

    startGame: function () {
        this.state.start('Game');
    }
};