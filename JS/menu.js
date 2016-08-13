var Menu = {

    preload : function() {
        game.load.image(',menu', '.images/ball.png');
    },

    create: function () {
		this.add.sprite(0, 0, 'menu');
        //this.add.button(0, 0, 'menu', this.startGame, this);
    },

    /* startGame: function () {
        this.state.start('Game');
    } */
};