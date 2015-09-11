// the game play
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.game.load.image('backyard', resources.backyard);    
    this.game.load.image('fish', resources.fish);    
    this.game.load.image('rainbow', resources.rainbow);    
    this.game.load.image('rotate', resources.rotate);    
    this.game.load.image('milk', resources.milk);    
    this.game.load.image('poop', resources.poop);  
    this.game.load.image('goldenPoop', resources.goldenPoop);    
    this.game.load.image('tinyPoop', resources.tinyPoop);  
    
    this.load.spritesheet('pet', resources.pet, 97, 83, 5, 1, 1);  
    
    gameState.goldenPoopsDropCounter = gameUtils.calaculateGoldenPoopInterval(5,10);
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
    this.pet.customParams = {name: gameState.petName, health: 100, fun: 100, poops:0};

    //draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();
    gameState.thePet = this.pet;
      
    // Collections
    gameState.poopCollection = game.add.group();
    gameState.goldenPoopCollection = game.add.group();
    gameUtils.buildPoopBuffer(gameState.poopCollection);
    gameUtils.buildGoldenPoopBuffer(gameState.goldenPoopCollection);
    
    //buttons
    this.poop = this.game.add.sprite(30, gameDefaults.statsYOffset+105, 'tinyPoop');
    this.poop.anchor.setTo(0.5);
      
    this.fish = this.game.add.sprite(350, 570, 'fish');
    this.fish.anchor.setTo(0.5);
    this.fish.customParams = {health: 10};
    this.fish.inputEnabled = true;
    this.fish.events.onInputDown.add(this.pickItem, this);

    this.rainbow = this.game.add.sprite(430, 570, 'rainbow');
    this.rainbow.anchor.setTo(0.5);
    this.rainbow.customParams = {health: -10, fun: 20};
    this.rainbow.inputEnabled = true;
    this.rainbow.events.onInputDown.add(this.pickItem, this);

    this.milk = this.game.add.sprite(510, 570, 'milk');
    this.milk.anchor.setTo(0.5);
    this.milk.customParams = {fun: 10, health: 5};
    this.milk.inputEnabled = true;
    this.milk.events.onInputDown.add(this.pickItem, this);

    this.rotate = this.game.add.sprite(590, 570, 'rotate');
    this.rotate.anchor.setTo(0.5);
    this.rotate.inputEnabled = true;
    this.rotate.events.onInputDown.add(this.rotatePet, this);

    this.buttons = [this.fish, this.rainbow, this.milk, this.rotate];

    //nothing selected
    this.selectedItem = null;
      
    //stats
    this.game.add.text(10, gameDefaults.statsYOffset-20, "Name:", resources.style);
    this.game.add.text(10, gameDefaults.statsYOffset+15, "Health:", resources.style);
    this.game.add.text(10, gameDefaults.statsYOffset+50, "Fun:", resources.style);

    this.nameText = this.game.add.text(gameDefaults.statsXOffset, gameDefaults.statsYOffset-20, "", resources.nameStyle);
    this.healthText = this.game.add.text(gameDefaults.statsXOffset, gameDefaults.statsYOffset+15, "", resources.style);
    this.funText = this.game.add.text(gameDefaults.statsXOffset, gameDefaults.statsYOffset+50, "", resources.style);
    this.poopText = this.game.add.text(gameDefaults.statsXOffset, gameDefaults.statsYOffset+85, "", resources.poopStyle);  

    //decrease health and fun every x seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * gameDefaults.decreaseSeconds, this.reduceProperties, this);
    this.statsDecreaser.timer.start();
      
    this.statsRefresh = this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.refreshStats, this);
    this.statsRefresh.timer.start();  
    
    this.uiBlocked = false;
    this.poopCount = 0;
  },

  //rotate the pet
  rotatePet: function(sprite, event) {

    if(!this.uiBlocked) {
      this.uiBlocked = true;

      this.clearSelection();
      sprite.alpha = 0.4;
      
      //vibrate device if present
      if(navigator.vibrate) {
        navigator.vibrate(1200);
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

        var spriteOffset = 40;
        var poopOffsetX = gameUtils.getRandomInt(40,90);
        var poopOffsetY = gameUtils.getRandomInt(10,30);
        var x = gameUtils.boundXCordinate(petX, poopOffsetX);
        var y = gameUtils.boundYCordinate(petY, poopOffsetY);
          
        for(var i = 0; i < shits; i++){
            gameState.madePoops += 1;
            gameState.goldenPoopWaitCounter += 1;  
            var pieceOfShit = gameState.poopCollection.getFirstExists(false);

            // time for a golden poop ;)
            if(gameState.goldenPoopWaitCounter >= gameState.goldenPoopsDropCounter){
                pieceOfShit = gameState.goldenPoopCollection.getFirstExists(false);
                gameState.goldenPoopsDropCounter = gameUtils.calaculateGoldenPoopInterval(gameDefaults.goldenPoopDropMin,gameDefaults.goldenPoopDropMax);
                gameState.goldenPoopWaitCounter = 0;
            }

            if (pieceOfShit)
            {   
                pieceOfShit.position = new PIXI.Point(x+(i*spriteOffset), y);
                pieceOfShit.alpha = 1;
                pieceOfShit.revive();
            }
        }
          
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

        // make cat poop
        gameState.madePoops += 1;
        gameState.goldenPoopWaitCounter += 1;  
        var pieceOfShit = gameState.poopCollection.getFirstExists(false);
          
        // time for a golden poop ;)
        if(gameState.goldenPoopWaitCounter >= gameState.goldenPoopsDropCounter){
            pieceOfShit = gameState.goldenPoopCollection.getFirstExists(false);
            gameState.goldenPoopsDropCounter = gameUtils.calaculateGoldenPoopInterval(gameDefaults.goldenPoopDropMin,gameDefaults.goldenPoopDropMax);
            gameState.goldenPoopWaitCounter = 0;
        }
        
        // do something with that piece of shit ;)  
        if (pieceOfShit)
        {
            pieceOfShit.alpha = 1;
            pieceOfShit.position = new PIXI.Point(x-gameDefaults.poopDropXOffset, y-gameDefaults.poopDropYOffset);
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
    //var livingPoops = game.poopCollection.countLiving();
    
    if(gameState.madePoops  == 0){
        healthFactor = -2;
        funFactor = -5;
    }else if(gameState.madePoops >= 1){
        healthFactor = -10;
        funFactor = -15;
    }else if(gameState.madePoops >= 3){
        healthFactor = -20;
        funFactor = -30;
    }else if(gameState.madePoops >= 5){
        healthFactor = -50;
        funFactor = -70;   
    }

    this.pet.customParams.health = Math.max(0, this.pet.customParams.health + healthFactor);
    this.pet.customParams.fun = Math.max(0, this.pet.customParams.fun + funFactor);
  },

  //game loop, executed many times per second
  update: function() {
    if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) {
      this.pet.customParams.health = 0;
      this.pet.customParams.fun = 0;
        
      // dead kitty ;(
      this.pet.frame = 4;
      this.uiBlocked = true;
        
      this.game.time.events.add(1500, this.gameOver, this);
    }
  },
  gameOver: function() {
    // todo : draw end game screen  
    //this.game.state.restart();
    this.game.state.start("EndState");
  },
};


//initiate the Phaser framework
var game = new Phaser.Game(gameDefaults.gameWidth, gameDefaults.gameHeight, Phaser.AUTO);
game.state.add('LoadState', LoadState);
game.state.add('GameState', GameState);
game.state.add('EndState', EndState);
game.state.start('LoadState'); 