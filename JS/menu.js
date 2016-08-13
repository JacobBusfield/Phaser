var Menu = {

    preload : function() {
        game.load.image('imgStart', 'Images/start.png');
    },

    create: function () {
		this.add.button(0, 0, 'imgStart', this.startGame, this);
    },

    startGame: function () {
        this.state.start('Game');
    }
};