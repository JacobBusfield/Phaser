var game;

game = new Phaser.Game(1024, 600, Phaser.AUTO, 'phaserGame');

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.start('Menu');