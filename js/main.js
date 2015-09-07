
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
        this.settings.events.onInputDown.add(this.adjustSettings, this);
        
        this.playBtn = this.game.add.sprite(375, 450, 'playBtn');
        this.playBtn.anchor.setTo(0.5);
        this.playBtn.inputEnabled = true;
        this.playBtn.events.onInputDown.add(this.playGame, this);
        
        this.uiBlocked = false;
	},
    
    adjustSettings: function(sprite, event){
        if(!this.uiBlocked) {
            
          this.uiBlocked = true;
          //alpha to indicate selection
          sprite.alpha = 0.4;

          // TODO : read cats name
          alertify.prompt("Cat's Name", gameState.petName,
          function(evt, value ){
            gameState.petName = value;
          });

          sprite.alpha = 1;    
          this.uiBlocked = false;    
        }
    },
    
    playGame:function(sprint, event){
        this.game.state.start("GameState");
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
    this.game.load.image('tinyPoop', 'assets/images/tiny_poop.png');  
    
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
    this.pet.customParams = {name: gameState.petName, health: 100, fun: 100, poops:0, cleanedPoops:0 };

    //draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();
    
    // const
    var xPos = 15;
    var maxPoops = 25;
    
    // Collections
    function removePoop(item) {
        item.alpha = 0.3;
        setTimeout(function(){
            item.alpha = 0.2;
             setTimeout(function(){
                item.alpha = 0.1;
                    setTimeout(function(){
                        if(item.alive){
                            item.kill();
                            gameState.cleanedPoops += 1;
                        }
                    },150);
            },100);
        },50);
        
    }  
    
    gameState.poopCollection = game.add.group();  
    
    // Create some poops off screen.
    // http://phaser.io/examples/v2/groups/recycling
    for (var i = 0; i < maxPoops; i++)
    {
        gameState.poopCollection.create(-100,-100, 'poop');
        var baddie = gameState.poopCollection.getFirstAlive();
        baddie.kill();
    }
      
    gameState.poopCollection.setAll('inputEnabled', true);
    gameState.poopCollection.callAll('events.onInputUp.add', 'events.onInputUp', removePoop);  
    
    //buttons
    this.poop = this.game.add.sprite(390, xPos+5, 'tinyPoop');
    this.poop.anchor.setTo(0.5);
      
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
    var style = { font: "20px Arial", fill: "#000"};
    var nameStyle = { font: "20px Arial", fill: "#974DB1"};
    this.game.add.text(10, xPos, "Name:", style);
    this.game.add.text(180, xPos, "Health:", style);
    this.game.add.text(290, xPos, "Fun:", style);

    this.nameText = this.game.add.text(75, xPos, "", nameStyle);
    this.healthText = this.game.add.text(245, xPos, "", style);
    this.funText = this.game.add.text(332, xPos, "", style);
    this.poopText = this.game.add.text(406, xPos, "", style);  
      
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
      petRotation.onComplete.add(function(event){
        this.uiBlocked = false;
        sprite.alpha = 1;
        var shits = 3;
        this.pet.customParams.fun += 30;
        this.pet.customParams.health -= 40; 
        var petX = event.x;
        var petY = event.y;
          
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }  
          
        function boundXCordinate(petX, poopOffset){
            var max = 700;
            var min = 100;
            var x = petX+poopOffset;
            if(x >= max){
                x = petX - poopOffset;
            }
            return x;
        }
          
        function boundYCordinate(petY, poopOffset){
            var max = 450;
            var min = 100;
            var y = petY+poopOffset;
            
            if(y >= max){
                y = petY - poopOffset;
            }
            
            return y;
        }

        
        var spriteOffset = 40;
        var poopOffsetX = getRandomInt(40,90);
        var poopOffsetY = getRandomInt(10,30);
        var x = boundXCordinate(petX, poopOffsetX);
        var y = boundYCordinate(petY, poopOffsetY);
        for(var i = 0; i < shits; i++){
            this.pet.customParams.poops+=1;
            var pieceOfShit = gameState.poopCollection.getFirstExists(false);

            if (pieceOfShit)
            {   
                pieceOfShit.position = new PIXI.Point(x+(i*spriteOffset), y);
                pieceOfShit.alpha = 1;
                pieceOfShit.revive();
            }
        }
          
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
         var pieceOfShit = gameState.poopCollection.getFirstExists(false);

            if (pieceOfShit)
            {
                pieceOfShit.alpha = 1;
                pieceOfShit.position = new PIXI.Point(x-100, y-30);
                pieceOfShit.revive();
            }
          
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
    this.poopText.text = ": "+gameState.cleanedPoops;  
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

var gameState = {
    petName : "FluffyNutz",
    poopCollection:"",
    cleanedPoops:0
};

//initiate the Phaser framework
var game = new Phaser.Game(940, 640, Phaser.AUTO);
game.state.add('LoadState', LoadState);
game.state.add('GameState', GameState);
game.state.start('LoadState'); 