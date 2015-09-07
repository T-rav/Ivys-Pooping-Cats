// the load screen - http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/
var LoadState = function(game){};

LoadState.prototype = {
	preload: function(){
        // http://www.clker.com/search/cat/3
        this.game.load.image("loading","assets/images/load_screen.png"); 
        this.game.load.image('settings', 'assets/images/settings.png');
        this.game.load.image('playBtn', 'assets/images/play.png');
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
		//this.game.state.start("GameState");
        
        //buttons
        this.settings = this.game.add.sprite(525, 450, 'settings');
        this.settings.anchor.setTo(0.5);
        this.settings.inputEnabled = true;
        this.settings.events.onInputDown.add(this.pickItem, this);
        
        this.playBtn = this.game.add.sprite(375, 450, 'playBtn');
        this.playBtn.anchor.setTo(0.5);
        this.playBtn.inputEnabled = true;
        this.playBtn.events.onInputDown.add(this.pickItem, this);
        
        this.uiBlocked = false;
	},
    
    pickItem: function(sprite, event){
        if(!this.uiBlocked) {
            
          this.uiBlocked = true;

          //alpha to indicate selection
          sprite.alpha = 0.4;

        
          //sprite.alpha = 1;    
          this.uiBlocked = false;    
        }
    }
}

// the game play
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.game.load.image('backyard', 'assets/images/backyard.png');    
    this.game.load.image('fish', 'assets/images/fish.png');    
    this.game.load.image('rainbow', 'assets/images/rainbow.png');    
    this.game.load.image('rotate', 'assets/images/rotate.png');    
    this.game.load.image('hand', 'assets/images/hand.png');    
    this.game.load.image('arrow', 'assets/images/arrow.png');
    this.game.load.image('poop', 'assets/images/poop.png');   
    this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1); 
  },
  //executed after everything is loaded
  create: function() {

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    this.scale.setScreenSize(true);
      
    this.background = this.game.add.sprite(0,0, 'backyard');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.placeItem, this);

    this.pet = this.game.add.sprite(100, 450, 'pet',0);
    this.pet.animations.add('funnyfaces', [0, 1, 2, 3, 2, 1, 0], 7, false);
    this.pet.animations.add('stroke', [5, 6, 7, 7, 6, 5], 6, false);
    this.pet.anchor.setTo(0.5);

    //custom properties of the pet
    this.pet.customParams = {name: "Fluffy", health: 100, fun: 100, poops:0};

    //draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();
    
    //buttons
    this.fish = this.game.add.sprite(350, 570, 'fish');
    this.fish.anchor.setTo(0.5);
    this.fish.customParams = {health: 20};
    this.fish.inputEnabled = true;
    this.fish.events.onInputDown.add(this.pickItem, this);

    this.rainbow = this.game.add.sprite(430, 570, 'rainbow');
    this.rainbow.anchor.setTo(0.5);
    this.rainbow.customParams = {health: -10, fun: 10};
    this.rainbow.inputEnabled = true;
    this.rainbow.events.onInputDown.add(this.pickItem, this);

    this.hand = this.game.add.sprite(510, 570, 'hand');
    this.hand.anchor.setTo(0.5);
    this.hand.customParams = {fun: 30};
    this.hand.inputEnabled = true;
    this.hand.events.onInputDown.add(this.pickItem, this);

    this.rotate = this.game.add.sprite(590, 570, 'rotate');
    this.rotate.anchor.setTo(0.5);
    this.rotate.inputEnabled = true;
    this.rotate.events.onInputDown.add(this.rotatePet, this);

    this.buttons = [this.fish, this.rainbow, this.hand, this.rotate];

    //nothing selected
    this.selectedItem = null;
    
    //stats
    var style = { font: "20px Arial", fill: "#fff"};
    var nameStyle = { font: "20px Arial", fill: "#E600E6"};
    this.game.add.text(10, 20, "Name:", style);
    this.game.add.text(160, 20, "Health:", style);
    this.game.add.text(270, 20, "Fun:", style);

    this.nameText = this.game.add.text(75, 20, "", nameStyle);
    this.healthText = this.game.add.text(225, 20, "", style);
    this.funText = this.game.add.text(312, 20, "", style);
      
    this.refreshStats();

    //decrease health and fun every 10 seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 3.5, this.reduceProperties, this);
    this.statsDecreaser.timer.start();
    
    this.uiBlocked = false;
    this.poopCount = 0;
  },

  //rotate the pet
  rotatePet: function(sprite, event) {

    if(!this.uiBlocked) {
      this.uiBlocked = true;

      //alpha to indicate selection
      this.clearSelection();
      sprite.alpha = 0.4;
      
      //vibrate device if present
      if(navigator.vibrate) {
        navigator.vibrate(1000);
      }
      
      var petRotation = game.add.tween(this.pet);
      petRotation.to({ angle: '+720' }, 1000);
      petRotation.onComplete.add(function(){
        this.uiBlocked = false;
        sprite.alpha = 1;
        this.pet.customParams.fun += 10;

        // scared the shit out of it
        this.pet.customParams.poops+=1;
        game.add.sprite(100, 400, 'poop');  
          
        //show updated stats
        this.refreshStats();
      }, this);
      petRotation.start();
    
    }
  },
    
  //pick an item so that you can place it on the background
  pickItem: function(sprite, event) {
    if(!this.uiBlocked) {
      //clear other buttons
      this.clearSelection();

      //alpha to indicate selection
      sprite.alpha = 0.4;

      //save selection so we can place an item
      this.selectedItem = sprite;
    }
  },

  //place selected item on the background
  placeItem: function(sprite, event) {
    if(this.selectedItem && !this.uiBlocked) {
      //position of the user input
      var x = event.position.x;
      var y = event.position.y;

      //create element in this place
      var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
      newItem.anchor.setTo(0.5);
      newItem.customParams = this.selectedItem.customParams;

      //the pet will move to grab the item
      this.uiBlocked = true;
      var petMovement = game.add.tween(this.pet);
      petMovement.to({x: x, y: y}, 900);
      petMovement.onComplete.add(function(){
        this.uiBlocked = false;

        //destroy item
        newItem.destroy();
 
        //animate pet
        this.pet.animations.play('funnyfaces');    
        
        //update pet stats
        var stat;
        for(stat in newItem.customParams) {
          //make sure the property belongs to the object and not the prototype
          if(newItem.customParams.hasOwnProperty(stat)) {
            this.pet.customParams[stat] += newItem.customParams[stat];
          }
        }
        
        //show updated stats
        this.refreshStats();
          
        // make cat pooop
        this.pet.customParams.poops+=1;

        var poo = game.add.sprite(x-100, y-30, 'poop');
        
        /*
        poo.anchor.setTo(0.5);
        poo.inputEncoding = true;
        poo.events.onInputDown.add(function(){
            if(pet.customParams.poops > 0){
                pet.customParams.poops-=1;
            }
            
        }, this);*/
          
        //clear selection
        this.clearSelection();
      }, this);
      petMovement.start();      
    }
  },
  //clear all buttons from selection
  clearSelection: function() {
    //set alpha to 1
    this.buttons.forEach(function(element){element.alpha = 1;});

    //clear selection
    this.selectedItem = null;
  },
    
  //show updated stats values
  refreshStats: function() {
    this.healthText.text = this.pet.customParams.health;
    this.funText.text = this.pet.customParams.fun;
    this.nameText.text = this.pet.customParams.name;
  },
  
  //the pet slowly becomes less health and bored
  reduceProperties: function() {
 
    var healthFactor = 0;
    var funFactor = 0;
    if(this.pet.customParams.poops > 1){
        healthFactor = -10;
        funFactor = -15;
    }else if(this.pet.customParams.poops > 5){
        healthFactor = -20;
        funFactor = -30;
    }else if(this.pet.customParams.poops > 10){
        healthFactor = -50;
        funFactor = -70;   
    }

    this.pet.customParams.health = Math.max(0, this.pet.customParams.health + healthFactor);
    this.pet.customParams.fun = Math.max(0, this.pet.customParams.fun + funFactor);

    this.refreshStats();
  },

  //game loop, executed many times per second
  update: function() {
    if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) {
      this.pet.customParams.health = 0;
      this.pet.customParams.fun = 0;
      this.pet.frame = 4;
      this.uiBlocked = true;
        
      this.game.time.events.add(2000, this.gameOver, this);
    }
  },
  gameOver: function() {    
    this.game.state.restart();
  },
};

//initiate the Phaser framework
var game = new Phaser.Game(940, 640, Phaser.AUTO);
game.state.add('LoadState', LoadState);
game.state.add('GameState', GameState);
game.state.start('LoadState'); 