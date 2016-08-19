var Boot = {
	preload: function()
	{
		// Load image for start menu
		game.load.image('imgStart', 'Images/start.png');
	}, 
	
	create: function () {
		 this.state.start('Menu');
    },
}