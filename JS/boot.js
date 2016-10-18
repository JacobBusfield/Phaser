var Boot = {
	preload: function()
	{
		// Load image for start menu
		game.load.image('imgStart', 'Images/start.png');
    
    // and loading bar..
    game.load.image('preloaderBar', 'images/load2.png');
    game.load.image('preloaderBarGray', 'images/load1.png');
	}, 
	
	create: function () {
		 this.state.start('Menu');
    },
}