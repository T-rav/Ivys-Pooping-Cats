var EndState = function(game){};

EndState.prototype = {
      preload: function(){
        // http://www.clker.com/search/cat/3
        this.game.load.image("gameOver", resources.endScreen);
        this.game.load.image('replayBtn', resources.replayBtn);
        this.game.load.image('tinyPoop',  resources.tinyPoop);  
	},
  	create: function(){
		//scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //screen size will be set automatically
        this.scale.setScreenSize(true);
        
        this.background = this.game.add.sprite(0,0, 'gameOver');
		//this.game.state.start("GameState");
        
        //buttons
        this.replayBtn = this.game.add.sprite(445, 480, 'replayBtn');
        this.replayBtn.anchor.setTo(0.5);
        this.replayBtn.inputEnabled = true;
        this.replayBtn.events.onInputDown.add(this.playGame, this);
        
        this.game.add.text(275, 550, "Replay Ivy's Pooping Cats", resources.style);
        
        this.game.add.text(450, 365, gameState.cleanedPoops+"", resources.style);
        this.endPoopCount = this.game.add.sprite(425, 380, 'tinyPoop');
        this.endPoopCount.anchor.setTo(0.5);
        
        this.uiBlocked = false;
	},
    playGame:function(sprint, event){  
        gameState.cleanedPoops = 0;
        gameState.madePoops = 0;
        this.game.state.start("GameState");
    }
};