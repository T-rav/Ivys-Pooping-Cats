var gameState = {
    petName : "Fluffy",
    poopCollection:"",
    cleanedPoops:0,
    madePoops:0,
    poopBufferSize:50,
    statsXOffset:15
};

var gameUtils = {
    
     removePoop : function(item) {
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
            },150);
        },100);
        
    },
    
    buildPoopBuffer : function(poopCollection){
        // Create some poops off screen.
        // http://phaser.io/examples/v2/groups/recycling
        for (var i = 0; i < gameState.poopBufferSize; i++)
        {
            poopCollection.create(-100,-100, 'poop');
            var poop = poopCollection.getFirstAlive();
            poop.kill();
        }

        poopCollection.setAll('inputEnabled', true);
        poopCollection.callAll('events.onInputUp.add', 'events.onInputUp', gameUtils.removePoop);  
        
    },
    
    getRandomInt : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },   
    
    boundXCordinate : function(petX, poopOffset){
        var max = 700;
        var min = 100;
        var x = petX+poopOffset;
        if(x >= max){
            x = petX - poopOffset;
        }
        return x;
    },
    
    boundYCordinate: function(petY, poopOffset){
        var max = 450;
        var min = 100;
        var y = petY+poopOffset;

        if(y >= max){
            y = petY - poopOffset;
        }

        return y;
    },
    
    makePoop : function(){
        // make cat pooop
        //gameState.madePoops += 1;
        
        var pieceOfShit = gameState.poopCollection.getFirstExists(false);

        if (pieceOfShit)
        {
            pieceOfShit.alpha = 1;
            pieceOfShit.position = new PIXI.Point(x-100, y-30);
            pieceOfShit.revive();
        }
    }
};
    
    