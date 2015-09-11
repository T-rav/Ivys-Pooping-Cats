var gameState = {
    petName : "Fluffy",
    poopCollection:"",
    goldenPoopCollection:"",
    sickPoopCollection:"",
    cleanedPoops:0,
    madePoops:0,
    goldenPoopsDropCounter:1,
    goldenPoopWaitCounter:0,
    highScore:0,
    thePet:""
};

var gameDefaults = {
    poopBufferSize:75,
    goldenPoopBufferSize:15,
    sickPoopBufferSize:25,
    statsYOffset:25,
    statsXOffset:115,
    gameWidth:940, 
    gameHeight:640,
    offscreenX:-100,
    offscreenY:-100,
    poopDropXOffset:100,
    poopDropYOffset:30,
    minBonus:15,
    maxBonus:30,
    goldenPoopDropMin:5,
    goldenPoopDropMax:20,
    decreaseSeconds:3.5
};
