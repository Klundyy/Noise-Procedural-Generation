class noiseProcGen extends Phaser.Scene {

    constructor() {
        super("noiseProcGen")
    }
    preload(){
        this.load.path = "./assets/"
        this.load.image("tiles", "mapPack_tilesheet.png")
        
        this.load.image("tiles2", "mapPack_spritesheet.png")

    }
    create() {
        // constants
        this.isInverse = false;
        this.mapWidth = 20;
        this.mapHeight = 20;
        this.noiseScale = 40;
        this.noiseScaler = 5;
        this.noiseDiv = 2.9;
        noise.seed(Math.random());
        this.regenerateKey = this.input.keyboard.addKey('R')
        this.inverseKey = this.input.keyboard.addKey('S')
        this.shrinkKey = this.input.keyboard.addKey('COMMA')
        this.growKey = this.input.keyboard.addKey('PERIOD') 
        this.madeMap = false;
        this.waterVals = [70,99]
        this.grassTransition = [[69,55,41],[54,26],[39,25,11]]
        this.sandTransition = [[42,28,14],[124,96],[109,95,81]]
        this.dirtTransition = [[9,190,176],[189,161],[174,160,146]]
        this.mountainTransition = [[194,180,166],[179,151],[164,150,136]]
    }
    
    update() {
        if(this.madeMap == false){
            this.generateMap();
            this.madeMap = true; 
        }
        if(Phaser.Input.Keyboard.JustDown(this.shrinkKey)){
            this.noiseScale += this.noiseScaler;
            this.generateMap(this.isInverse);
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.regenerateKey)){
            noise.seed(Math.random());
            this.generateMap(this.isInverse);
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.growKey)){
            this.noiseScale = Math.max(1, this.noiseScale - this.noiseScaler);
            this.generateMap(this.isInverse);
        }
        if(Phaser.Input.Keyboard.JustDown(this.inverseKey)){
            this.isInverse = !this.isInverse;
            this.generateMap(this.isInverse);
        }
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    generateMap(isInverse){
        let rndlvl = []
        let layerlvl = []

        for (let x = 0; x < this.mapWidth; x++) {
            rndlvl[x] = []
            layerlvl[x] = []
            for (let y = 0; y < this.mapHeight; y++) {
            // All noise functions return values in the range of -1 to 1.
                
            // noise.simplex2 and noise.perlin2 for 2d noise
                console.log(x+","+y)
                let value = noise.simplex2(x / this.noiseScale, y / this.noiseScale)
                rndlvl[x][y] = Math.abs(value) * 300;
                console.log(rndlvl[x][y]/5)
                // Inverse Generation
                if(isInverse){
                    if((rndlvl[x][y]/this.noiseDiv) < 20){
                        rndlvl[x][y] = 165; //Mountain
                    } else if(((rndlvl[x][y]/this.noiseDiv) > 20) && ((rndlvl[x][y]/this.noiseDiv) < 40)){
                        rndlvl[x][y] = 175; //Dirt
                    } else if(((rndlvl[x][y]/this.noiseDiv) > 40) && ((rndlvl[x][y]/this.noiseDiv) < 60)){
                        rndlvl[x][y] = 40; //Grass
                    } else if(((rndlvl[x][y]/this.noiseDiv) > 60) && ((rndlvl[x][y]/this.noiseDiv) < 90)){
                        rndlvl[x][y] = 110; //Sand
                    } else {
                        rndlvl[x][y] = 70; //Water
                    }
                } else{
                // Normal Generation
                    if((rndlvl[x][y]/this.noiseDiv) < 20){
                        rndlvl[x][y] = 70; //Water
                    } else if(((rndlvl[x][y]/this.noiseDiv) > 20) && ((rndlvl[x][y]/this.noiseDiv) < 40)){
                        rndlvl[x][y] = 110; //Sand
                    } else if(((rndlvl[x][y]/this.noiseDiv) > 40) && ((rndlvl[x][y]/this.noiseDiv) < 60)){
                        rndlvl[x][y] = 40; //Grass
                    } else if(((rndlvl[x][y]/this.noiseDiv) > 60) && ((rndlvl[x][y]/this.noiseDiv) < 90)){
                        rndlvl[x][y] = 175; //Dirt
                    } else {
                        rndlvl[x][y] = 165; //Mountain
                    }
                }
                console.log(rndlvl[x][y])
                if(rndlvl[x][y] != rndlvl[x][y-1] && rndlvl[x][y] != 70){
                    if(rndlvl[x][y] == 110){layerlvl[x][y-1] = 124;}
                    if(rndlvl[x][y] == 40){layerlvl[x][y-1] = 54;}
                    if(rndlvl[x][y] == 175){layerlvl[x][y-1] = 189;}
                    if(rndlvl[x][y] == 165){layerlvl[x][y-1] = 179;}
                }
            }
        }
        const map = this.make.tilemap({
            data: rndlvl,      // load direct from array
            tileWidth: 64,
            tileHeight: 64
        })
        const map2 = this.make.tilemap({
            data: layerlvl,      // load direct from array
            tileWidth: 64,
            tileHeight: 64
        })
        const tilesheet = map.addTilesetImage("tiles2")
        const tilesheet2 = map2.addTilesetImage("tiles2")
        const layer = map.createLayer(0, tilesheet, 0, 0)
        const transitionLayer = map2.createLayer(0, tilesheet2, 1, 0)
    }
    
}