// the load screen - http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/
var LoadState = function(game){};

LoadState.prototype = {
	preload: function(){
        this.game.load.image("loading", resources.loadScreen); 
        this.game.load.image('settings', resources.settings);
        this.game.load.image('rewards', resources.rewards);
        this.game.load.image('playBtn', resources.playBtn);
	},
  	create: function(){
		//scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //screen size will be set automatically
        this.scale.setScreenSize(true);
        
        this.background = this.game.add.sprite(0,0, 'loading');
        
        //buttons
        this.playBtn = this.game.add.sprite(365, 450, 'playBtn');
        this.playBtn.anchor.setTo(0.5);
        this.playBtn.inputEnabled = true;
        this.playBtn.events.onInputDown.add(this.playGame, this);
        
        this.rewards = this.game.add.sprite(455, 450, 'rewards');
        this.rewards.anchor.setTo(0.5);
        this.rewards.inputEnabled = true;
        this.rewards.events.onInputDown.add(this.adjustSettings, this);
        
        this.settings = this.game.add.sprite(545, 450, 'settings');
        this.settings.anchor.setTo(0.5);
        this.settings.inputEnabled = true;
        this.settings.events.onInputDown.add(this.adjustSettings, this);
        
	},
    
    adjustSettings: function(sprite, event){

      //alpha to indicate selection
      sprite.alpha = 0.4;

      // TODO : read cats name from localstorage
      alertify.prompt("Cat's Name", gameState.petName,
      function(evt, value ){
        gameState.petName = value;
      })
      .set('closable', false); 

      sprite.alpha = 1;    
    },
    
    playGame:function(sprint, event){
        this.game.state.start("GameState");
    }
} 
