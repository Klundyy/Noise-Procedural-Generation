"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true 
    },
    width: 1280,
    height: 1280,
    zoom:0.5,
    scene: [noiseProcGen]
}

const game = new Phaser.Game(config);